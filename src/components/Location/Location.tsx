import { useEffect, useRef } from 'react';
import FadeIn from '@/components/shared/FadeIn';
import { InvitationData } from '@/types';
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
  const { name, address, latitude, longitude } = data.location;

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.error('Kakao map API not loaded. Check VITE_KAKAO_MAP_KEY in .env');
      return;
    }

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
          <div ref={mapRef} className={classes.map}></div>
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
