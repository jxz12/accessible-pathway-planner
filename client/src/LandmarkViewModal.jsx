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
  Typography,
} from "@mui/material";

import { BACKEND_ROOT } from "./App";
import AIModal from "./AIModal";


export const MODAL_STYLE = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "80%",
  maxHeight: "80vh",
  overflow: "auto",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

export default function LandmarkViewModal({ open, close, landmark }) {
  const [photos, setPhotos] = useState(null);
  const [comments, setComments] = useState(null);
  const [upvotes, setUpvotes] = useState(null);
  const [downvotes, setDownvotes] = useState(null);
  const [newPhoto, setNewPhoto] = useState("");
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [retries, setRetries] = useState(0);
  const [usingAI, setUsingAI] = useState(false);

  useEffect(() => {
    // trigger wireframes while loading
    setPhotos(null);
    setComments(null);
    setError(null);
    fetch(`${BACKEND_ROOT}/landmark/${landmark.id}`).then((rsp) => {
      return rsp.json();
    }).then((json) => {
      setPhotos(json.photos);
      setComments(json.comments);
      setUpvotes(json.upvotes);
      setDownvotes(json.downvotes);
    }).catch((err) => {
      console.error(err);
      setError("Could not fetch landmark, please try again later");
    });
  }, [landmark.id, retries]);

  const vote = (isUp) => {
    fetch(`${BACKEND_ROOT}/landmark/${landmark.id}/vote`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isUp: isUp }),
    }).then((rsp) => {
      return rsp.json();
    }).then((json) => {
      setUpvotes(json.upvotes);
      setDownvotes(json.downvotes);
    }).catch((err) => {
      console.error(err);
    });
  };
  const addPhoto = (url) => {
    fetch(`${BACKEND_ROOT}/landmark/${landmark.id}/photo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url }),
    }).then((rsp) => {
      return rsp.json();
    }).then((json) => {
      setPhotos((prev) => [...prev, json])
      setNewPhoto("");
    }).catch((err) => {
      console.error(err);
    });
  };
  const addComment = (text) => {
    fetch(`${BACKEND_ROOT}/landmark/${landmark.id}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text }),
    }).then((rsp) => {
      return rsp.json();
    }).then((json) => {
      setComments((prev) => [...prev, json])
      setNewComment("");
    }).catch((err) => {
      console.error(err);
    });
  };

  return (
    <Modal open={open} onClick={close}>
      <Box sx={MODAL_STYLE} onClick={(e) => e.stopPropagation()}>
        {photos === null ? (
          <CircularProgress />
        ) : (
          <Box>
            <Box>
              <Typography variant="h3">
                {landmark.exists ? "Does" : "Is"} this <u>{landmark.accessibility_name}</u> {landmark.exists ? "exist" : "missing"}?
              </Typography>
            </Box>
            <Box sx={{ m: "1em" }}>
              <Button variant="outlined" onClick={() => vote(true)}>
                <Typography variant="h4">👍</Typography>
              </Button>
              <Typography display="inline" variant="h4" sx={{ verticalAlign: "middle" }}>
                &nbsp;{upvotes} - {downvotes}&nbsp;
              </Typography>
              <Button variant="outlined" onClick={() => vote(false)}>
                <Typography variant="h4">👎</Typography>
              </Button>
            </Box>
            {!photos.length ? (
              <Typography>No photos added yet, please add one!</Typography>
            ) : (
              <Box>
                <Typography variant="h6">Photos</Typography>
                <Paper sx={{ maxHeight: "25vh", overflow: "auto" }}>
                  <ImageList variant="masonry" cols={2} gap={5}>
                    {photos.sort((a, b) => b.id - a.id).map((photo) => (
                      <ImageListItem key={photo.id}>
                        <img src={photo.url} loading="lazy" />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Paper>
              </Box>
            )}
            <Box>
              <Box>
                <TextField
                  id="newPhoto"
                  variant="standard"
                  label="New Photo URL"
                  value={newPhoto}
                  onChange={(e) => setNewPhoto(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addPhoto(newPhoto); }}
                />
              </Box>
              <Box>
                <Button onClick={() => addPhoto(newPhoto)}>Submit</Button>
              </Box>
            </Box>
            {!comments.length ? (
              <Typography>No comments yet, please add one!</Typography>
            ) : (
              <Box>
                <Typography variant="h6">Comments</Typography>
                <Paper sx={{ maxHeight: "25vh", overflow: "auto", padding: "0.5em", verticalAlign: "middle" }}>
                  {comments.sort((a, b) => b.id - a.id).map((comment) => (
                    <Card key={comment.id}>
                      <CardContent>
                        <Typography variant="body2">
                          🗣️ {comment.text}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Paper>
              </Box>
            )}
            <Box>
              <TextField
                id="newComment"
                variant="standard"
                label="New Comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addComment(newComment); }}
              />
            </Box>
            <Box>
              <Button onClick={() => addComment(newComment)}>Submit</Button>
            </Box>
            {error && (
              <Box>
                <Box>{error}</Box>
                <Button onClick={() => setRetries((curr) => curr + 1)}>Retry</Button>
              </Box>
            )}
            <Box sx={{ pt: "1em" }}>
              <Button variant="contained" onClick={() => setUsingAI(true)}>🤖 Ask AI for help?</Button>
            </Box>
          </Box>
        )}
        <AIModal
          open={usingAI}
          close={() => setUsingAI(false)}
          landmarkId={landmark.id}
        />
        <Box sx={{ pt: "1em", pb: "-2em" }}>
          <Button onClick={close}>Back to map</Button>
        </Box>
      </Box>
    </Modal>
  );
}