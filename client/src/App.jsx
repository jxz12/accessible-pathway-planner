import { useState } from "react";
import pinsvg from "./assets/react.svg";

import Map, { FullscreenControl, NavigationControl, ScaleControl, Marker } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';  // NOTE: this is needed for controls to render correctly


export default function App() {
  const [viewState, setViewState] = useState({
    // Toronto
    longitude: -79.3961,
    latitude: 43.6635,
    zoom: 14.5,
  });
  const backend_root = `https://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}`;

  const [pins, setPins] = useState([
    { longitude: -79.3961, latitude: 43.6635, id: 0},
  ]);
  const addPin = (mapEvent) => {
    // TODO: This will eventually just be an auto-increment SQL column
    const newId = pins.length>0 ? pins[pins.length-1].id+1 : 0;
    setPins([...pins, {
      longitude: mapEvent.lngLat.lng,
      latitude: mapEvent.lngLat.lat,
      id: newId,
    }]);
    fetch(`${backend_root}/accessibility`).then((rsp) => {
      return rsp.json();
    }).then((rsp) => {
      console.log(rsp);
    });
  };
  const viewPin = (id) => {
    setPins(pins.filter((pin) => pin.id !== id));
  };

  return (
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
      {pins.map((pin) => (
        <Marker longitude={pin.longitude} latitude={pin.latitude} key={pin.id} anchor="bottom">
          <img src={pinsvg} onClick={(e) => { viewPin(pin.id); e.stopPropagation(); }}/>
        </Marker>
      ))}
    </Map>
  );
}
