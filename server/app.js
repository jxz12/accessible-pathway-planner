const express = require('express')
const { Pool } = require("pg");

require("dotenv").config;
console.log(process.env);

const pool = new Pool({
    connectionString: process.env.SUPABASE_CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
});

const app = express();

app.get('/accessibility', async (req, res) => {
    const result = await pool.query("SELECT * FROM accessibility");
    res.send(result.rows);
});

app.get('/landmark', async (req, res) => {
    const result = await pool.query(`
        SELECT *
        FROM landmark l JOIN accessibility a ON l.accessibility_id=a.id
    `);
    res.send(result.rows);
});

app.get('/landmark/:id', async (req, res) => {
    // TODO: get comments and images in one big object
});

app.post('/landmark', async (req, res) => {
    // TODO: add new landmark
});

app.put('/landmark/:id/vote', async (req, res) => {
    // TODO: update vote
});

app.post('/landmark/:id/comment', async (req, res) => {
    // TODO: new comment attached to landmark
});
app.post('/landmark/:id/photo', async (req, res) => {
    // TODO: new photo attached to landmark
});

// fake BS to pander to GCL judges
app.get('/landmark_id/:id/advice', async (req, res) => {
    // TODO: delay for a bit to make it look like it's thinking
    // query params for landmark id
    // if exists return how to use the service
    // else return how it could be fixed and who to contact
});
app.get('/route/:source_landmark_id/:target_landmark_id', async (req, res) => {
    // TODO: use query params to get landmark a to b
});

const port = process.env.EXPRESS_PORT;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});