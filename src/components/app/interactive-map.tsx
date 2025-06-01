"use client";

import { useEffect, useState } from 'react';

interface InteractiveMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  markerLabel?: string;
  className?: string;
}

export function InteractiveMap({ lat, lng, zoom = 13, markerLabel = "الموقع", className }: InteractiveMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className={`w-full h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground ${className}`}>يتم تحميل الخريطة...</div>;
  }

  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01}%2C${lat-0.01}%2C${lng+0.01}%2C${lat+0.01}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div className={`w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-lg border ${className}`}>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={embedUrl}
        title={`خريطة الموقع: ${markerLabel}`}
        aria-label={`خريطة تفاعلية تظهر موقع ${markerLabel}`}
        loading="lazy"
      ></iframe>
      <div className="p-2 bg-background/80 backdrop-blur-sm text-xs text-center font-body">
        <a href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          عرض على OpenStreetMap
        </a>
        <p className="text-muted-foreground">الإحداثيات: {lat.toFixed(4)}, {lng.toFixed(4)}</p>
      </div>
    </div>
  );
}
