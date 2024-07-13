CREATE TABLE IF NOT EXISTS accessibility (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
INSERT INTO accessibility (name)
VALUES (
    ('ramp'),
    ('elevator'),
    ('disabled toilet'),
    ('braille'),
    ('hearing loop')
);

CREATE TABLE IF NOT EXISTS landmark (
    id SERIAL PRIMARY KEY,
    -- unix_time INT NOT NULL,
    longitude REAL NOT NULL,
    latitude REAL NOT NULL,
    accessibility_id INT REFERENCES accessibility(id) NOT NULL,
    exists BOOLEAN,  -- shows as green if there, red if not

    -- ideally we would store upvotes in a separate table to prevent users from doing it more than once
    upvotes INT NOT NULL,
    downvotes INT NOT NULL
);

CREATE TABLE IF NOT EXISTS comment (
    id SERIAL PRIMARY KEY,
    landmark_id INT REFERENCES landmark(id) NOT NULL,
    text VARCHAR(255) NOT NULL
);
-- CREATE TABLE IF NOT EXISTS reply

CREATE TABLE IF NOT EXISTS photo (
    id SERIAL PRIMARY KEY,
    landmark_id INT REFERENCES landmark(id) NOT NULL,
    url VARCHAR(255) NOT NULL
)