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

export default function LandmarkViewModal({ open, setOpen, landmarkId }) {
  return (
    <Modal open={open} onClick={(event) => setOpen(false)}>
      <Box sx={style} onClick={(event) => event.stopPropagation()}>
        {landmarkId}
      </Box>
    </Modal>
  );
}