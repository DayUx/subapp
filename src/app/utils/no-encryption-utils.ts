export const createSchema: string = `
CREATE TABLE IF NOT EXISTS session (
  id INTEGER PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  date INTEGER DEFAULT (strftime('%s', 'now')),
);

CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
);

CREATE TABLE IF NOT EXISTS target (
    id INTEGER PRIMARY KEY NOT NULL,
   image BLOB NOT NULL,


    FOREIGN KEY (sessionid) REFERENCES session(id) ON DELETE CASCADE
    FOREIGN KEY (userid) REFERENCES user(id) ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS impact (
  id INTEGER PRIMARY KEY NOT NULL,
  distance REAL NOT NULL,
  angle REAL NOT NULL,
  score INTEGER NOT NULL,
  targetid INTEGER NOT NULL,
  FOREIGN KEY (targetid) REFERENCES target(id) ON DELETE CASCADE
);

`;