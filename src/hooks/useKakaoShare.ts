import { useEffect } from 'react';
import type { InvitationData } from '@/types';

// Declare global Kakao object for TypeScript
declare global {
  interface Window {
    Kakao: any;
  }
}

export function useKakaoShare() {
  useEffect(() => {
    try {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        const key = import.meta.env.VITE_KAKAO_MAP_KEY;
        if (key) {
          window.Kakao.init(key);
        } else {
          console.warn('VITE_KAKAO_MAP_KEY is missing. Kakao Share will not work.');
        }
      }
    } catch (e) {
      console.error('Failed to initialize Kakao SDK', e);
    }
  }, []);

  const shareInvitation = (data: InvitationData) => {
    if (!window.Kakao) {
      alert('카카오 공유 기능을 불러올 수 없습니다. 광고 차단 앱을 끄거나 잠시 후 시도해주세요.');
      return;
    }
    
    if (!window.Kakao.isInitialized()) {
      alert('카카오 API 키가 설정되지 않아 공유 기능을 사용할 수 없습니다. (.env 설정 확인)');
      return;
    }

    const shareUrl = `${window.location.origin}/${data.slug}`;
    const title = `${data.groom.name} ♥ ${data.bride.name} 결혼합니다`;
    const description = data.greeting?.title || '저희 두 사람의 특별한 날에 초대합니다.';
    
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: title,
        description: description,
        imageUrl: data.coverImage,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '청첩장 보기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });
  };

  return { shareInvitation };
}
