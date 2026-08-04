// 카카오 SDK 두 개는 이전에 index.html에서 동기 로드하고 있었다. 둘 다 첫 화면에
// 필요하지 않은데도(지도는 스크롤 아래, 공유는 버튼을 눌렀을 때) HTML 파싱을
// 멈춰 세워 첫 렌더를 지연시켰다. 실제로 필요한 시점에 주입한다.
//
// 각 로더는 Promise를 캐시하므로 여러 번 호출해도 스크립트는 한 번만 삽입된다.

/** 카카오 JS SDK 버전. 올릴 때는 integrity 값도 실제 파일에서 재산출해야 한다. */
const JS_SDK_SRC = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
const JS_SDK_INTEGRITY =
  'sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4';

const appKey = import.meta.env.VITE_KAKAO_MAP_KEY;

function loadScript(src: string, integrity?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    if (integrity) {
      // 동적으로 주입한 스크립트에도 무결성 검증은 그대로 적용된다.
      script.integrity = integrity;
      script.crossOrigin = 'anonymous';
    }
    script.onload = () => resolve();
    script.onerror = () => {
      // 실패한 태그를 남겨두면 위의 중복 검사에 걸려 재시도해도 다시 내려받지
      // 못하므로 제거한다. (무결성 검증 실패, 네트워크 오류 등)
      script.remove();
      reject(new Error(`스크립트를 불러오지 못했습니다: ${src}`));
    };
    document.head.appendChild(script);
  });
}

let mapsPromise: Promise<KakaoMaps> | null = null;

/**
 * 카카오맵 SDK를 불러오고 사용 준비가 끝난 maps 객체를 돌려준다.
 * 앱 키가 없으면 reject 하므로 호출부에서 대체 UI를 보여줄 수 있다.
 */
export function loadKakaoMaps(): Promise<KakaoMaps> {
  if (!mapsPromise) {
    mapsPromise = (async () => {
      if (!appKey) {
        throw new Error('VITE_KAKAO_MAP_KEY가 설정되지 않았습니다.');
      }
      // autoload=false 로 불러오고 load()를 직접 호출해 준비 시점을 명확히 한다.
      await loadScript(
        `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`
      );
      const maps = window.kakao?.maps;
      if (!maps) {
        throw new Error('카카오맵 SDK를 초기화하지 못했습니다.');
      }
      await new Promise<void>(resolve => maps.load(resolve));
      return maps;
    })().catch(error => {
      // 실패한 Promise를 캐시해두면 재시도가 불가능해지므로 비운다.
      mapsPromise = null;
      throw error;
    });
  }
  return mapsPromise;
}

let sharePromise: Promise<KakaoSdk> | null = null;

/** 카카오 공유 SDK를 불러오고 초기화까지 끝낸 객체를 돌려준다. */
export function loadKakaoShare(): Promise<KakaoSdk> {
  if (!sharePromise) {
    sharePromise = (async () => {
      if (!appKey) {
        throw new Error('VITE_KAKAO_MAP_KEY가 설정되지 않았습니다.');
      }
      await loadScript(JS_SDK_SRC, JS_SDK_INTEGRITY);
      const sdk = window.Kakao;
      if (!sdk) {
        throw new Error('카카오 SDK를 초기화하지 못했습니다.');
      }
      if (!sdk.isInitialized()) {
        sdk.init(appKey);
      }
      return sdk;
    })().catch(error => {
      sharePromise = null;
      throw error;
    });
  }
  return sharePromise;
}
