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

export default function LandmarkAddModal({ open, close, lngLat, accessibilities, newLandmarkCallback }) {
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
      close();
    }).catch((err) => {
      console.error(err);
      setError("Could not add new landmark, please try again later");
    });
  };
  return (
    <Modal open={open} onClick={close}>
      <Box sx={style} onClick={(event) => event.stopPropagation()}>
        <Box>
          <Select value={accessibilityId} onChange={(event) => setAccessibilityId(event.target.value)}>
            {accessibilities.map((acc) => (
              <MenuItem key={acc.id} value={acc.id}>{acc.name}</MenuItem>
            ))}
          </Select>
        </Box>
        <Box>
          <Switch label="Exists?" onChange={(event) => setExists(event.target.checked)} size="large" />
        </Box>
        <Box>
          <Button variant="contained" onClick={postLandmark}>Submit</Button>
        </Box>
        <Box>
          {error && (<p>{error}</p>)}
        </Box>
      </Box>
    </Modal>
  );
}