import { useState } from "react";


export default function AddPinModal({lngLat, accessibilities, onPinAdded}) {
  [accessibilityId, setAccessibilityId] = useState(-1);
  [exists, setExists] = useState(false);
  [error, setError] = useState(null);

  const postLandmark = () => {
    const body = JSON.stringify({
      longitude: lngLat.lng,
      latitude: lngLat.lat,
      accessibilityId: accessibilityId,
      exists: exists,
    });
    fetch(`${backend_root}/landmark`, {method: "POST", body: body}).then((rsp) => {
      return rsp.json();
    }).then((rsp) => {
      console.log(rsp);
      setError(null);
      onPinAdded(rsp);
    }).catch((err) => {
      setError("Could not add new landmark, please try again later");
    });
  };
  return (
    <div>
      <select onChange={(event) => {setAccessibilityId(event.target.id)}}>
        {accessibilities.map((accesibility) => (
          <option id={accesibility.id} value={accessibility.name}>{accessibility.name}</option>
        ))}
      </select>
      <input type="checkbox" checked={exists} onChange={(event) => setExists((exists) => !exists)} />
      <button onClick={postLandmark}>Submit</button>
      {error && (
        <p>{error}</p>
      )}
      <p></p>
    </div>
  )
}