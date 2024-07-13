import { useState, useEffect } from "react";
import { Modal, Box, Select, MenuItem, Switch, Button } from "@mui/material";
import { BACKEND_ROOT } from "./App";


export default function AddPin({ open, lngLat, accessibilities, newPinCallback }) {
  const [accessibilityId, setAccessibilityId] = useState(accessibilities[0].id);
  const [exists, setExists] = useState(false);
  const [error, setError] = useState(null);

  const postLandmark = () => {
    const body = JSON.stringify({
      longitude: lngLat.lng,
      latitude: lngLat.lat,
      accessibilityId: accessibilityId,
      exists: exists,
    });
    fetch(`${BACKEND_ROOT}/landmark`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: body,
    }).then((rsp) => {
      return rsp.json();
    }).then((rsp) => {
      setError(null);
      newPinCallback(rsp);
    }).catch((err) => {
      setError("Could not add new landmark, please try again later");
    });
  };
  return (
    <Modal open={open}>
      <Box>
        <Select value={accessibilityId} onChange={(event) => setAccessibilityId(event.target.value)}>
          {accessibilities.map((acc) => (
            <MenuItem key={acc.id} value={acc.id}>{acc.name}</MenuItem>
          ))}
        </Select>
        <Switch label="Exists?" onChange={(event) => setExists(event.target.checked)} size="large" />
        <Button variant="contained" onClick={postLandmark}>Submit</Button>
        {error && (<p>{error}</p>)}
      </Box>
    </Modal>
  )
}