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
import { MODAL_STYLE } from "./LandmarkViewModal";


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
      <Box sx={MODAL_STYLE} onClick={(e) => e.stopPropagation()}>
      {error ? (
        <Box>
          <CircularProgress />
          <Typography variant="caption">{error}</Typography>
        </Box>
      ) : (
        <Box>
          <Box>
            <Typography variant="h4">
              Mark a new <Select value={accessibilityId} onChange={(e) => setAccessibilityId(e.target.value)}>
                {accessibilities.map((acc) => (
                  <MenuItem key={acc.id} value={acc.id}>
                    <Typography variant="h4">{acc.name}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </Typography>
            <Typography variant="h4" sx={{mt: ".3em"}}>
              as <Select value={exists} onChange={(e) => setExists(e.target.value)}>
                <MenuItem key="missing" value={false}>
                  <Typography variant="h4">missing</Typography>
                </MenuItem>
                <MenuItem key="existing" value={true}>
                  <Typography variant="h4">working</Typography>
                </MenuItem>
              </Select>?
            </Typography>
          </Box>
          <Box sx={{mt: "1.5em"}}>
            <Button sx={{ width: "13em", height: "5em"}} variant="contained" onClick={postLandmark}>
              <Typography variant="h4">Submit</Typography>
            </Button>
          </Box>
        </Box>
      )}
      <Box sx={{pt: "1em"}}>
        <Button onClick={close}>Back to map</Button>
      </Box>
      </Box>
    </Modal>
  );
}