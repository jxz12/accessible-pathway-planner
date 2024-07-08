"use client"

import { useRef, useState, useEffect } from "react";
import maplibregl from "maplibre-gl";


export default function Home() {
  const mapContainer = useRef(null);
  const [view, setView] = useState({
    center: [-100.43, 35],
    zoom: 1,
    pitch: 0,
  });
  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      ...view,
    });
    return () => {
      map.remove();
    };
  }, []);
  return (
    <>
      <div ref={mapContainer} class="w-full h-full absolute"></div>
    </>
  );
}
