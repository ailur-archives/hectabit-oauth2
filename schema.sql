DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS userdata;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS logins;
DROP TABLE IF EXISTS oauth;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE userdata (
    creator INTEGER NOT NULL,
    appId TEXT NOT NULL,
    secret TEXT NOT NULL
);

CREATE TABLE sessions (
    sessionid INTEGER PRIMARY KEY AUTOINCREMENT,
    session TEXT NOT NULL,
    id INTEGER NOT NULL,
    device TEXT NOT NULL DEFAULT "?"
);

CREATE TABLE logins (
    appId TEXT NOT NULL,
    secret TEXT NOT NULL,
    code TEXT NOT NULL,
    nextcode TEXT NOT NULL,
    creator INTEGER NOT NULL,
    openid TEXT NOT NULL
);

CREATE TABLE oauth (
    appId TEXT NOT NULL,
    secret TEXT NOT NULL,
    creator INTEGER NOT NULL
)
