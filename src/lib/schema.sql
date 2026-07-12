CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL DEFAULT '',
  password_hash VARCHAR(255) NOT NULL,
  security_question VARCHAR(255) NOT NULL DEFAULT '',
  security_answer_hash VARCHAR(255) NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_user_id ON password_reset_tokens(user_id);

CREATE TABLE IF NOT EXISTS expenses (
  id VARCHAR(255) PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item VARCHAR(255),
  description TEXT,
  amount NUMERIC,
  date DATE,
  category VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id_date ON expenses(user_id, date DESC);
