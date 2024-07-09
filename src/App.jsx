import { useState } from "react";
import pinsvg from "./assets/react.svg";

import Map, { FullscreenControl, NavigationControl, ScaleControl, Marker } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';  // NOTE: this is needed for controls to render correctly


export default function App() {
  const [viewState, setViewState] = useState({
    longitude: -79.3961,
    latitude: 43.6635,
    zoom: 14.5,
  });
  const [pins, setPins] = useState([
    { longitude: -79.3961, latitude: 43.6635},
  ]);
  const addPin = (mapEvent) => {
    console.log(mapEvent);
    setPins([...pins, { longitude: mapEvent.lngLat.lng, latitude: mapEvent.lngLat.lat }]);
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
        <Marker longitude={pin.longitude} latitude={pin.latitude} anchor="bottom">
          <img src={pinsvg} />
        </Marker>
      ))}
    </Map>
  );
}
