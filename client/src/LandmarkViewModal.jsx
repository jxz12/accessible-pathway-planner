import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Button,
  ImageList,
  ImageListItem,
  TextField,
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

export default function LandmarkViewModal({ open, close, landmark }) {
  const [photos, setPhotos] = useState(null);
  const [comments, setComments] = useState(null);
  const [votes, setVotes] = useState(null);
  const [newPhoto, setNewPhoto] = useState("");
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    // trigger wireframes while loading
    setPhotos(null);
    setComments(null);
    setError(null);
    fetch(`${BACKEND_ROOT}/landmark/${landmark.id}`).then((rsp) => {
      return rsp.json();
    }).then((rsp) => {
      setPhotos(rsp.photos);
      setComments(rsp.comments);
      setVotes([rsp.upvotes, rsp.downvotes]);
    }).catch((err) => {
      console.error(err);
      setError("Could not fetch landmark, please try again later");
    });
  }, [landmark.id, retries]);

  const addPhoto = (url) => {
    fetch(`${BACKEND_ROOT}/landmark/${landmark.id}/photo`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ url: url }),
    }).then((rsp) => {
      return rsp.json();
    }).then((rsp) => {
      setPhotos((prev) => [...prev, rsp])
    })
  };
  const addComment = (text) => {
    fetch(`${BACKEND_ROOT}/landmark/${landmark.id}/comment`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ text: text }),
    }).then((rsp) => {
      return rsp.json();
    }).then((rsp) => {
      setComments((prev) => [...prev, rsp])
    })
  };

  return (
    <Modal open={open} onClick={close}>
      <Box sx={style} onClick={(event) => event.stopPropagation()}>
        {photos === null ? (
          <CircularProgress />
        ) : (
          <Box>
            <Box>
              {photos.length ? (
                <Box>
                  <ImageList variant="woven" cols={2} gap={5}>
                    {photos.map((photo) => (
                      <ImageListItem key={photo.id}>
                        <img src={photo.url} loading="lazy" />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              ) : (
                <Box>No photos added yet, please add one!</Box>
              )}
              <Box>
                <TextField id="new URL" variant="standard" label="New photo URL" onChange={(event) => setNewPhoto(event.target.value)} />
              </Box>
              <Box>
                <Button onClick={() => addPhoto(newPhoto)}>Submit</Button>
              </Box>
            </Box>
            <Box>
              {comments.length ? (
                <Paper style={{ maxHeight: "30vh", overflow: "auto" }}>
                  {comments.map((comment) => (
                    <Card key={comment.id}>
                      {comment.text}
                    </Card>
                  ))}
                </Paper>
              ) : (
                <Box>No comments yet, please add one!</Box>
              )}
              <Box>
                <TextField id="new URL" variant="standard" label="New comment" onChange={(event) => setNewComment(event.target.value)} />
              </Box>
              <Box>
                <Button onClick={() => addComment(newComment)}>Submit</Button>
              </Box>
            </Box>
            {error && (
              <Box>
                <Box>{error}</Box>
                <Button onClick={() => setRetries((curr) => curr + 1)}>Retry</Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Modal>
  );
}