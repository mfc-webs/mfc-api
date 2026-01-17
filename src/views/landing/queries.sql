CREATE TABLE user(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(40),
    lastname VARCHAR(40),
    phone VARCHAR(40),
    email VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
