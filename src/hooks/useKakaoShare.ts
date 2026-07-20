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
    // Initialize Kakao SDK if it exists and hasn't been initialized yet
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
    }
  }, []);

  const shareInvitation = (data: InvitationData) => {
    if (!window.Kakao) {
      alert('카카오 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const shareUrl = `https://wedvitaion.vercel.app/${data.slug}`;
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
