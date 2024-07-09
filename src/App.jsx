import { useState } from "react";
import Map from 'react-map-gl';
// import 'maplibre-gl/dist/maplibre-gl.css'


export default function App() {
  const [viewState, setViewState] = useState({
    latitude: 43.6635,
    longitude: -79.3961,
    zoom: 14.5,
  });
  return (
    <>
      <Map
        mapLib={import("maplibre-gl")}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: "100%", height: "95vh" }}
        mapStyle="https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      />
    </>
  );
}
