import { useState } from "react";
import Map, { FullscreenControl, NavigationControl, ScaleControl, Marker } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';  // NOTE: this is needed for controls to render correctly

import pinsvg from "./assets/react.svg";
import AddPinModal from './AddPinModal'


export default function App() {
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

  const [pins, setPins] = useState([]);

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
        {pins.map((pin) => (
          <Marker longitude={pin.longitude} latitude={pin.latitude} key={pin.id} anchor="bottom">
            <img src={pinsvg} onClick={(e) => { viewPin(pin.id); e.stopPropagation(); }}/>
          </Marker>
        ))}
      </Map>
      <AddPinModal
        open={addingPin}
        lngLat={pinLngLat}
        accessibilities={[{id:1,name:"ramp"}, {id:2,name:"elevator"}]}
        onPinAdded={(newPin) => setPins([...pins, newPin])}
      />
    </>
  );
}
