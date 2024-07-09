import { useRef, useState, useEffect } from "react";
import maplibregl from "maplibre-gl";


export default function App() {
  const mapContainer = useRef(null);
  const [view, setView] = useState({
    center: [-100.43, 35],
    zoom: 1,
    pitch: 0,
  });
  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      // style: "https://demotiles.maplibre.org/style.json",
      // style: "https://demotiles.maplibre.org/styles/osm-bright-gl-style/style.json",
      // style: "https://github.com/maplibre/demotiles/blob/gh-pages/styles/osm-bright-gl-style/style.json",
      style: "https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      ...view,
    });
    // map.addControl(new maplibregl.ScaleControl(), "bottom-right");
    map.addControl(new maplibregl.FullscreenControl());
    // map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    // map.addControl(new maplibregl.GeolocateControl(), "bottom-right");
    return () => {
      map.remove();
    };
  }, []);
  return (
    <>
      <div ref={mapContainer} style={{width: 600, height: 400}}></div>
    </>
  );
}
