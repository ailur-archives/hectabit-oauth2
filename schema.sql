DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS userdata;
DROP TABLE IF EXISTS sessions;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE userdata (
    creator TEXT NOT NULL,
    appId TEXT NOT NULL,
    secret TEXT NOT NULL
);

CREATE TABLE sessions (
    sessionid INTEGER PRIMARY KEY AUTOINCREMENT,
    session TEXT NOT NULL,
    id INTEGER NOT NULL,
    device TEXT NOT NULL DEFAULT "?"
);
