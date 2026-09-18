import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import classes from './Admin.module.css';

interface RsvpEntry {
  id: string;
  name: string;
  contact: string;
  attending: boolean;
  companion_count: number;
  meal_preference: boolean;
  message: string;
  created_at: string;
}

interface GuestbookEntry {
  id: string;
  name: string;
  content: string;
  created_at: string;
}

// 쉼표·따옴표·줄바꿈이 들어간 메시지가 열을 깨뜨리지 않도록 항상 따옴표로 감싼다.
function toCsvField(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function downloadRsvpCsv(slug: string, rsvps: RsvpEntry[]) {
  const header = ['이름', '연락처', '참석여부', '동반인원', '본인포함 인원', '식사여부', '메시지', '접수일시'];
  const rows = rsvps.map(r => {
    const companions = r.companion_count ?? 0;
    return [
      r.name,
      r.contact,
      r.attending ? '참석' : '불참',
      r.attending ? companions : 0,
      r.attending ? companions + 1 : 0,
      r.attending ? (r.meal_preference ? '식사 함' : '안 함') : '-',
      r.message ?? '',
      new Date(r.created_at).toLocaleString('ko-KR'),
    ];
  });

  const csv = [header, ...rows].map(row => row.map(toCsvField).join(',')).join('\r\n');

  // BOM이 없으면 엑셀이 UTF-8로 인식하지 못해 한글이 전부 깨진다.
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `rsvp_${slug}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  // 조회에 실패했는데 빈 배열을 그대로 렌더링하면 "참석 0명"이 되어 실제 0명과
  // 구분되지 않는다. 이 화면의 숫자는 식장에 통보하는 인원수라 조용히 틀리면 안 된다.
  const [loadFailed, setLoadFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'rsvp' | 'guestbook'>('rsvp');

  const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);
  const [guestbooks, setGuestbooks] = useState<GuestbookEntry[]>([]);

  useEffect(() => {
    async function checkAuthAndFetchData() {
      // 1. Check Auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin');
        return;
      }
      setAuthChecked(true);

      if (!slug) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadFailed(false);

      // 2. Fetch Data
      const [rsvpRes, guestbookRes] = await Promise.all([
        supabase.from('rsvp').select('*').eq('invitation_slug', slug).order('created_at', { ascending: false }),
        supabase.from('guestbook').select('*').eq('invitation_slug', slug).order('created_at', { ascending: false })
      ]);

      if (rsvpRes.error || guestbookRes.error) {
        console.error('명단 조회 실패:', rsvpRes.error ?? guestbookRes.error);
        setLoadFailed(true);
        setLoading(false);
        return;
      }

      setRsvps(rsvpRes.data ?? []);
      setGuestbooks(guestbookRes.data ?? []);

      setLoading(false);
    }

    checkAuthAndFetchData();
  }, [navigate, slug, reloadKey]);

  if (!authChecked || loading) {
    return <div className={classes.adminContainer}>Loading...</div>;
  }

  if (loadFailed) {
    return (
      <div className={classes.adminContainer}>
        <p>명단을 불러오지 못했습니다.</p>
        <p>이 화면의 인원수는 식장에 전달하는 값이므로, 조회에 실패했을 때는 숫자를 표시하지 않습니다.</p>
        <button type="button" onClick={() => setReloadKey(key => key + 1)}>
          다시 불러오기
        </button>
        <Link to="/admin/dashboard">← 목록으로</Link>
      </div>
    );
  }

  // Calculate stats
  const attendingRsvps = rsvps.filter(r => r.attending);
  const totalTeams = attendingRsvps.length;
  const totalGuests = attendingRsvps.reduce((acc, curr) => acc + 1 + (curr.companion_count || 0), 0);
  const totalMeals = attendingRsvps.filter(r => r.meal_preference).reduce((acc, curr) => acc + 1 + (curr.companion_count || 0), 0);

  return (
    <div className={classes.dashboardContainer}>
      <header className={classes.dashboardHeader}>
        <div className={classes.headerTitleGroup}>
          <Link to="/admin/dashboard" className={classes.backBtn}>← 목록으로</Link>
          <h2>명단 관리 ({slug})</h2>
        </div>
        <button
          type="button"
          className={classes.createBtn}
          onClick={() => downloadRsvpCsv(slug ?? 'invitation', rsvps)}
          disabled={rsvps.length === 0}
        >
          참석자 명단 내려받기 (CSV)
        </button>
      </header>
      
      <main className={classes.dashboardMain}>
        <section className={classes.statsSection}>
          <div className={classes.statCard}>
            <div className={classes.statLabel}>총 참석 팀 (RSVP)</div>
            <div className={classes.statValue}>{totalTeams}팀</div>
          </div>
          <div className={classes.statCard}>
            <div className={classes.statLabel}>총 참석 인원 (동반자 포함)</div>
            <div className={classes.statValue}>{totalGuests}명</div>
          </div>
          <div className={classes.statCard}>
            <div className={classes.statLabel}>식사 예정 인원</div>
            <div className={classes.statValue}>{totalMeals}명</div>
          </div>
        </section>

        <div className={classes.tabs}>
          <button 
            className={`${classes.tabBtn} ${activeTab === 'rsvp' ? classes.activeTab : ''}`}
            onClick={() => setActiveTab('rsvp')}
          >
            참석자 명단 ({rsvps.length})
          </button>
          <button 
            className={`${classes.tabBtn} ${activeTab === 'guestbook' ? classes.activeTab : ''}`}
            onClick={() => setActiveTab('guestbook')}
          >
            방명록 관리 ({guestbooks.length})
          </button>
        </div>

        <div className={classes.tableContainer}>
          {activeTab === 'rsvp' && (
            <table className={classes.dataTable}>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>연락처</th>
                  <th>참석여부</th>
                  <th>동반인원</th>
                  <th>식사여부</th>
                  <th>메시지</th>
                  <th>접수일시</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.length === 0 ? (
                  <tr><td colSpan={7} className={classes.emptyCell}>접수된 내역이 없습니다.</td></tr>
                ) : (
                  rsvps.map(r => (
                    <tr key={r.id}>
                      <td>{r.name}</td>
                      <td>{r.contact}</td>
                      <td>
                        <span className={r.attending ? classes.badgeSuccess : classes.badgeError}>
                          {r.attending ? '참석' : '불참'}
                        </span>
                      </td>
                      <td>{r.attending ? `${r.companion_count ?? 0}명` : '-'}</td>
                      <td>{r.attending ? (r.meal_preference ? '식사 함' : '안 함') : '-'}</td>
                      <td className={classes.messageCell} title={r.message}>
                        {r.message}
                      </td>
                      <td>{new Date(r.created_at).toLocaleString('ko-KR')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'guestbook' && (
            <table className={classes.dataTable}>
              <thead>
                <tr>
                  <th>작성자</th>
                  <th>내용</th>
                  <th>작성일시</th>
                </tr>
              </thead>
              <tbody>
                {guestbooks.length === 0 ? (
                  <tr><td colSpan={3} className={classes.emptyCell}>등록된 방명록이 없습니다.</td></tr>
                ) : (
                  guestbooks.map(g => (
                    <tr key={g.id}>
                      <td className={classes.nameCell}>{g.name}</td>
                      <td>{g.content}</td>
                      <td>{new Date(g.created_at).toLocaleString('ko-KR')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
