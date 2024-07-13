import { useState } from "react";
import { 
  Modal,
  Box, 
  Select, 
  MenuItem, 
  Typography, 
  Button,
  CircularProgress,
} from "@mui/material";

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
    }).then((json) => {
      setError(null);
      newLandmarkCallback(json);
      close();
    }).catch((err) => {
      console.error(err);
      setError("Could not add new landmark, please try again later");
    });
  };
  return (
    <Modal open={open} onClick={close}>
      <Box sx={style} onClick={(e) => e.stopPropagation()}>
      {error ? (
        <Box textAlign="center">
          <CircularProgress />
          <Typography variant="caption">{error}</Typography>
        </Box>
      ) : (
        <Box>
          <Box textAlign="center">
            <Typography variant="h4">
              Mark a new <Select value={accessibilityId} onChange={(e) => setAccessibilityId(e.target.value)}>
                {accessibilities.map((acc) => (
                  <MenuItem key={acc.id} value={acc.id}>{acc.name}</MenuItem>
                ))}
              </Select>
            </Typography>
            <Typography variant="h4" sx={{mt: ".3em"}}>
              as <Select value={exists} onChange={(e) => setExists(e.target.value)}>
                <MenuItem key="missing" value={false}>missing</MenuItem>
                <MenuItem key="existing" value={true}>working</MenuItem>
              </Select>?
            </Typography>
          </Box>
          <Box textAlign="center" sx={{mt: "1em"}}>
            <Button variant="contained" size="large" onClick={postLandmark}>Submit</Button>
          </Box>
        </Box>
      )}
      </Box>
    </Modal>
  );
}