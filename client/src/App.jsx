import { useState, useEffect } from "react";
import Map, { FullscreenControl, NavigationControl, ScaleControl, Marker } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';  // NOTE: this is needed for controls to render correctly

import pinsvg from "./assets/react.svg";
import AddPinModal from './AddPinModal'

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
      console.error("could not fetch accessibilities")
    });
    fetch(`${BACKEND_ROOT}/landmark`).then((rsp) => {
      return rsp.json();
    }).then((rsp) => {
      setLandmarks(rsp);
    }).catch((err) => {
      console.error("could not fetch landmarks")
    });
  }, []);

  const [viewState, setViewState] = useState({
    // Toronto
    longitude: -79.3961,
    latitude: 43.6635,
    zoom: 14.5,
  });
  const [pinLngLat, setPinLngLat] = useState({lng:0, lat:0});
  const [addingPin, setAddingPin] = useState(false);
  const addPin = (mapEvent) => {
    setPinLngLat(mapEvent.lngLat);
    setAddingPin(true);
  };

  const [pinId, setPinId] = useState(-1);
  const [viewingPin, setViewingPin] = useState(false);
  const viewPin = (id) => {
    setPinId(id);
    setViewingPin(true);
  };

  return (
    <>
      <Map
        mapLib={import("maplibre-gl")}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: "100%", height: "95vh" }}
        mapStyle="https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        onClick={addPin}
      >
        <FullscreenControl />
        <NavigationControl />
        <ScaleControl />
        {landmarks.map((landmark) => (
          <Marker longitude={landmark.longitude} latitude={landmark.latitude} key={landmark.id} anchor="bottom">
            <img src={pinsvg} onClick={(e) => { viewPin(landmark.id); e.stopPropagation(); }} />
          </Marker>
        ))}
      </Map>
      {accessibilities.length > 0 && (
        <AddPinModal
          open={addingPin}
          lngLat={pinLngLat}
          accessibilities={accessibilities}
          onPinAdded={(newPin) => {
            setPins([...pins, newPin]);
            setAddingPin(false);
          }}
        />
      )}
    </>
  );
}
