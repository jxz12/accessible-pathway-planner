import { useRef, useState, useEffect } from "react";
import Map from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css'


export default function App() {
  return (
    <>
      {/* <link href='https://unpkg.com/maplibre-gl@4.5.0/dist/maplibre-gl.css' rel='stylesheet'/> */}
      <Map
        mapLib={import("maplibre-gl")}
        initialViewState={{ longitude: -100, latitude: 40, zoom: 3.5 }}
        style={{ width: 500, height: 500 }}
        mapStyle="https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      />
    </>
  );
}
