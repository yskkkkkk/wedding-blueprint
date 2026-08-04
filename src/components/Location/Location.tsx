import { useEffect, useRef, useState } from 'react';
import FadeIn from '@/components/shared/FadeIn';
import { loadKakaoMaps } from '@/services/kakaoSdk';
import type { InvitationData } from '@/types';
import classes from './Location.module.css';

interface LocationProps {
  data: InvitationData;
}

export default function Location({ data }: LocationProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);
  const [mapInView, setMapInView] = useState(false);
  const { name, address, latitude, longitude } = data.location;

  // 오시는 길은 스크롤을 내려야 보이는 영역이므로, 화면에 가까워질 때까지
  // 지도 SDK를 내려받지 않는다.
  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    if (typeof IntersectionObserver === 'undefined') {
      setMapInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setMapInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mapInView) return;

    let cancelled = false;
    loadKakaoMaps()
      .then(maps => {
        if (cancelled || !mapRef.current) return;

        const position = new maps.LatLng(latitude, longitude);
        const map = new maps.Map(mapRef.current, { center: position, level: 3 });
        new maps.Marker({ position }).setMap(map);
        setMapError(false);
      })
      .catch(error => {
        console.error('지도를 불러오지 못했습니다.', error);
        if (!cancelled) setMapError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [mapInView, latitude, longitude]);

  // Deep link URLs
  const kakaoUrl = `kakaomap://route?ep=${latitude},${longitude}&by=CAR`;
  const tmapUrl = `tmap://route?goalname=${encodeURIComponent(name)}&goalx=${longitude}&goaly=${latitude}`;
  const naverUrl = `nmap://route/car?dlat=${latitude}&dlng=${longitude}&dname=${encodeURIComponent(name)}&appname=wedding-blueprint`;

  return (
    <section className={classes.section} ref={sectionRef}>
      <FadeIn yOffset={20} duration={0.8}>
        <div className={classes.header}>
          <h2 className={classes.title}>LOCATION</h2>
          <p className={classes.subtitle}>오시는 길</p>
        </div>
      </FadeIn>

      <FadeIn yOffset={20} duration={0.8} delay={0.2}>
        <div className={classes.infoContainer}>
          <h3 className={classes.venueName}>{name}</h3>
          <p className={classes.address}>{address}</p>
        </div>

        <div className={classes.mapWrapper}>
          {mapError ? (
            <div className={classes.fallbackContainer}>
              <p className={classes.fallbackText}>지도를 불러올 수 없습니다.</p>
              <p className={classes.fallbackSubtext}>아래 내비게이션 버튼을 이용해 주세요.</p>
            </div>
          ) : (
            <div ref={mapRef} className={classes.map}></div>
          )}
        </div>

        <div className={classes.navButtons}>
          <a href={kakaoUrl} className={classes.navBtn}>
            카카오내비
          </a>
          <a href={tmapUrl} className={classes.navBtn}>
            티맵
          </a>
          <a href={naverUrl} className={classes.navBtn}>
            네이버지도
          </a>
        </div>
      </FadeIn>
    </section>
  );
}
