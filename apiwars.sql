
DROP TABLE IF EXISTS public.users;
CREATE TABLE users (
    id SERIAL,
    username VARCHAR(150),
    password VARCHAR(300)
);

DROP TABLE IF EXISTS public.planet_votes;
CREATE TABLE planet_votes (
    id SERIAL,
    planet_id INTEGER,
    planet_name VARCHAR(300),
    user_id INTEGER,
    submission_time TIMESTAMP
);

ALTER TABLE ONLY users
    ADD CONSTRAINT pk_user_id PRIMARY KEY(id);

ALTER TABLE ONLY planet_votes
    ADD CONSTRAINT pk_votes_id PRIMARY KEY(id);

ALTER TABLE ONLY planet_votes 
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id);

-- \i apiwars.sql