// 카카오 SDK 전역 객체 타입.
// 이전에는 Location, useKakaoShare, InvitationBuilder 세 곳에서 각각
// `declare global { Kakao: any }` 를 반복 선언하고 있었다. 실제로 사용하는
// 표면만 여기에 모아 선언한다.

/** 카카오맵 SDK (dapi.kakao.com) */
interface KakaoLatLng {
  readonly _lat: number;
  readonly _lng: number;
}

interface KakaoMap {
  setCenter(position: KakaoLatLng): void;
}

interface KakaoMarker {
  setMap(map: KakaoMap | null): void;
}

interface KakaoGeocoderResult {
  /** 경도 */
  x: string;
  /** 위도 */
  y: string;
}

interface KakaoGeocoder {
  addressSearch(
    address: string,
    callback: (result: KakaoGeocoderResult[], status: string) => void
  ): void;
}

interface KakaoMaps {
  /** autoload=false 로 불러온 경우 지도 API 사용 전에 반드시 호출해야 한다. */
  load(callback: () => void): void;
  LatLng: new (latitude: number, longitude: number) => KakaoLatLng;
  Map: new (
    container: HTMLElement,
    options: { center: KakaoLatLng; level: number }
  ) => KakaoMap;
  Marker: new (options: { position: KakaoLatLng }) => KakaoMarker;
  services: {
    Geocoder: new () => KakaoGeocoder;
    Status: { OK: string; ZERO_RESULT: string; ERROR: string };
  };
}

/** 카카오 JavaScript SDK (kakao.min.js) — 공유 기능 */
interface KakaoShareLink {
  mobileWebUrl: string;
  webUrl: string;
}

interface KakaoShare {
  sendDefault(settings: {
    objectType: 'feed';
    content: {
      title: string;
      description: string;
      imageUrl: string;
      link: KakaoShareLink;
    };
    buttons?: Array<{ title: string; link: KakaoShareLink }>;
  }): void;
}

interface KakaoSdk {
  init(appKey: string): void;
  isInitialized(): boolean;
  Share: KakaoShare;
}

// 이 파일은 선언 파일이라 전역 스크립트로 취급되므로(`moduleDetection: force`는
// 선언 파일에 적용되지 않음) `declare global` 래퍼 없이 바로 Window를 병합한다.
interface Window {
  /** 카카오맵 SDK. 로드 전에는 undefined다. */
  kakao?: { maps: KakaoMaps };
  /** 카카오 JavaScript SDK. 로드 전에는 undefined다. */
  Kakao?: KakaoSdk;
}
