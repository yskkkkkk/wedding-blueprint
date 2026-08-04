import { useState } from 'react';
import { loadKakaoShare } from '@/services/kakaoSdk';
import type { InvitationData } from '@/types';

export function useKakaoShare() {
  const [sharing, setSharing] = useState(false);

  // 공유 SDK는 버튼을 누른 시점에 내려받는다. 첫 화면 로딩을 막지 않기 위함이다.
  const shareInvitation = async (data: InvitationData) => {
    setSharing(true);
    try {
      const kakao = await loadKakaoShare();

      const shareUrl = `${window.location.origin}/${data.slug}`;
      kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `${data.groom.name} ♥ ${data.bride.name} 결혼합니다`,
          description: data.greeting?.title || '저희 두 사람의 특별한 날에 초대합니다.',
          imageUrl: data.coverImage,
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
        buttons: [
          {
            title: '청첩장 보기',
            link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
          },
        ],
      });
    } catch (error) {
      console.error('카카오 공유 기능을 사용할 수 없습니다.', error);
      alert('카카오 공유 기능을 불러올 수 없습니다. 광고 차단 앱을 끄거나 잠시 후 다시 시도해주세요.');
    } finally {
      setSharing(false);
    }
  };

  return { shareInvitation, sharing };
}
