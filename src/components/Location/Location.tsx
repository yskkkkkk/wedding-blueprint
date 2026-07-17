import { useEffect, useRef, useState } from 'react';
import FadeIn from '@/components/shared/FadeIn';
import type { InvitationData } from '@/types';
import classes from './Location.module.css';

declare global {
  interface Window {
    kakao: any;
  }
}

interface LocationProps {
  data: InvitationData;
}

export default function Location({ data }: LocationProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);
  const { name, address, latitude, longitude } = data.location;

  useEffect(() => {
    // Check if the Kakao object is available
    if (!window.kakao || !window.kakao.maps) {
      console.error('Kakao map API not loaded. Check VITE_KAKAO_MAP_KEY in .env');
      setMapError(true);
      return;
    }

    // API is loaded, we can reset error state
    setMapError(false);

    // Initialize map after API is fully loaded
    window.kakao.maps.load(() => {
      if (!mapRef.current) return;

      const position = new window.kakao.maps.LatLng(latitude, longitude);
      
      const mapOptions = {
        center: position,
        level: 3, // Zoom level
      };

      const map = new window.kakao.maps.Map(mapRef.current, mapOptions);

      // Create a marker
      const marker = new window.kakao.maps.Marker({
        position,
      });

      // Set marker on the map
      marker.setMap(map);
    });
  }, [latitude, longitude]);

  // Deep link URLs
  const kakaoUrl = `kakaomap://route?ep=${latitude},${longitude}&by=CAR`;
  const tmapUrl = `tmap://route?goalname=${encodeURIComponent(name)}&goalx=${longitude}&goaly=${latitude}`;
  const naverUrl = `nmap://route/car?dlat=${latitude}&dlng=${longitude}&dname=${encodeURIComponent(name)}&appname=wedding-blueprint`;

  return (
    <section className={classes.section}>
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
