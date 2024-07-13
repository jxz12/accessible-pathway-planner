import { useState, useEffect } from "react";
import Map, { FullscreenControl, NavigationControl, ScaleControl, Marker } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';  // NOTE: this is needed for controls to render correctly

import pinsvg from "./assets/react.svg";
import LandmarkAddModal from './LandmarkAddModal'

export const BACKEND_ROOT = `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`;


export default function App() {
  const [accessibilities, setAccessibilities] = useState([]);
  const [landmarks, setLandmarks] = useState([]);
  useEffect(() => {
    fetch(`${BACKEND_ROOT}/accessibility`).then((rsp) => {
      return rsp.json();
    }).then((rsp) => {
      setAccessibilities(rsp);
    }).catch((err) => {
      console.error(err);
    });
    fetch(`${BACKEND_ROOT}/landmark`).then((rsp) => {
      return rsp.json();
    }).then((rsp) => {
      setLandmarks(rsp);
    }).catch((err) => {
      console.error(err);
    });
  }, []);

  const [viewState, setViewState] = useState({
    // Toronto
    longitude: -79.3961,
    latitude: 43.6635,
    zoom: 14.5,
  });
  const [landmarkLngLat, setLandmarkLngLat] = useState({lng:0, lat:0});
  const [addingLandmark, setAddingLandmark] = useState(false);
  const addLandmark = (mapEvent) => {
    setLandmarkLngLat(mapEvent.lngLat);
    setAddingLandmark(true);
  };

  const [landmarkId, setLandmarkId] = useState(-1);
  const [viewingLandmark, setViewingLandmark] = useState(false);
  const viewLandmark = (id) => {
    setLandmarkId(id);
    setViewingLandmark(true);
  };

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
            <img src={pinsvg} onClick={(e) => { viewLandmark(landmark.id); e.stopPropagation(); }} />
          </Marker>
        ))}
      </Map>
      {accessibilities.length > 0 && (
        <LandmarkAddModal
          open={addingLandmark}
          lngLat={landmarkLngLat}
          accessibilities={accessibilities}
          newLandmarkCallback={(newLandmark) => {
            setLandmarks([...landmarks, newLandmark]);
            setAddingLandmark(false);
          }}
        />
      )}
    </>
  );
}
