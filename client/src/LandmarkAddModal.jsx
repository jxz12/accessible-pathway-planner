import { useState } from "react";
import { Modal, Box, Select, MenuItem, Switch, Button } from "@mui/material";
import { BACKEND_ROOT } from "./App";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function LandmarkAddModal({ open, setOpen, lngLat, accessibilities, newLandmarkCallback }) {
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
    setError("Adding new Landmark");
    fetch(`${BACKEND_ROOT}/landmark`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: body,
    }).then((rsp) => {
      return rsp.json();
    }).then((rsp) => {
      setError(null);
      newLandmarkCallback(rsp);
      setOpen(false);
    }).catch((err) => {
      console.error(err);
      setError("Could not add new landmark, please try again later");
    });
  };
  return (
    <Modal open={open} onClick={(event) => setOpen(false)}>
      <Box sx={style} onClick={(event) => event.stopPropagation()}>
        <div>
          <Select value={accessibilityId} onChange={(event) => setAccessibilityId(event.target.value)}>
            {accessibilities.map((acc) => (
              <MenuItem key={acc.id} value={acc.id}>{acc.name}</MenuItem>
            ))}
          </Select>
        </div>
        <div>
          <Switch label="Exists?" onChange={(event) => setExists(event.target.checked)} size="large" />
        </div>
        <div>
          <Button variant="contained" onClick={postLandmark}>Submit</Button>
        </div>
        <div>
          {error && (<p>{error}</p>)}
        </div>
      </Box>
    </Modal>
  );
}