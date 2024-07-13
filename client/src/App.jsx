import { useState, useEffect } from "react";
import Map, { FullscreenControl, NavigationControl, ScaleControl, Marker } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';  // NOTE: this is needed for controls to render correctly

import LandmarkAddModal from './LandmarkAddModal';
import LandmarkViewModal from "./LandmarkViewModal";


export const BACKEND_ROOT = `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`;

function getIcon(accessibility_name) {
  const icons = {
    "ramp": "♿️",
    "elevator": "🛗",
    "disabled toilet": "🚽",
    "large enough door": "🚪",
    "braille": "⠵",
    "hearing loop": "🦻",
  };
  return icons[accessibility_name] || "📍";
}

export default function App() {
  const [accessibilities, setAccessibilities] = useState([]);
  const [landmarks, setLandmarks] = useState([]);
  useEffect(() => {
    fetch(`${BACKEND_ROOT}/accessibility`).then((rsp) => {
      return rsp.json();
    }).then((json) => {
      setAccessibilities(json);
    }).catch((err) => {
      console.error(err);
    });
    fetch(`${BACKEND_ROOT}/landmark`).then((rsp) => {
      return rsp.json();
    }).then((json) => {
      setLandmarks(json);
    }).catch((err) => {
      console.error(err);
    });
  }, []);

  const [addingLngLat, setAddingLngLat] = useState(null);
  const addLandmark = (mapEvent) => {
    setAddingLngLat(mapEvent.lngLat);
  };

  const [viewingLandmark, setViewingLandmark] = useState(null);
  const viewLandmark = (landmark) => {
    setViewingLandmark(landmark);
  };

  const [viewState, setViewState] = useState({
    // Toronto
    longitude: -79.3961,
    latitude: 43.6635,
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
        onClick={addLandmark}
      >
        <FullscreenControl />
        <NavigationControl />
        <ScaleControl />
        {landmarks.map((landmark) => (
          <Marker longitude={landmark.longitude} latitude={landmark.latitude} key={landmark.id} anchor="bottom">
            <h1
              style={{"font-size": "3em"}}
              onClick={(e) => { viewLandmark(landmark); e.stopPropagation(); }}
            >
              {getIcon(landmark.accessibility_name)}
            </h1>
          </Marker>
        ))}
      </Map>
      {accessibilities.length > 0 && (
        <LandmarkAddModal
          open={addingLngLat !== null}
          close={() => setAddingLngLat(null)}
          lngLat={addingLngLat}
          accessibilities={accessibilities}
          newLandmarkCallback={(newLandmark) => {
            setLandmarks((prev) => [...prev, newLandmark]);
            setAddingLngLat(null);
          }}
        />
      )}
      {viewingLandmark !== null && (
        <LandmarkViewModal
          open={viewingLandmark !== null}
          close={() => setViewingLandmark(null)}
          landmark={viewingLandmark}
        />
      )}
    </>
  );
}
