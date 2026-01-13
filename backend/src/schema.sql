-- Extension UUID (normalement déjà OK sur Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ======================
-- USERS : comptes admin UI
-- ======================
CREATE TABLE users (
  user_id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role          text NOT NULL DEFAULT 'admin',
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ======================
-- CLIENTS
-- ======================
CREATE TABLE clients (
  client_id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  -- optionnel : si tu veux rattacher 1 user "référent"
  user_id     uuid REFERENCES users(user_id)
);

-- ======================
-- API_KEYS : 1 clé max par client
-- ======================
CREATE TABLE api_keys (
  api_key    varchar(64) PRIMARY KEY,
  client_id  uuid NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ======================
-- INSTALLATION_TOKENS
-- ======================
CREATE TABLE installation_tokens (
  token_id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id  uuid NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  token      varchar(128) NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  used_at    timestamptz
);

-- ======================
-- AGENTS : 1 agent max par client
-- ======================
CREATE TABLE agents (
  agent_id     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    uuid NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  hostname     text NOT NULL,
  os           text,
  last_seen_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_agent_per_client UNIQUE (client_id)
);

-- ======================
-- ACTIONS + statut ENUM
-- ======================
CREATE TYPE action_status AS ENUM ('pending','running','done','failed');

CREATE TABLE actions (
  action_id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id     uuid NOT NULL REFERENCES agents(agent_id) ON DELETE CASCADE,
  type         text NOT NULL,
  payload      jsonb,
  status       action_status NOT NULL DEFAULT 'pending',
  created_at   timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

-- ======================
-- ACTION_RESULTS : 0 ou 1 résultat par action
-- ======================
CREATE TABLE action_results (
  action_result_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id        uuid NOT NULL UNIQUE REFERENCES actions(action_id) ON DELETE CASCADE,
  output           text,
  error            text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ======================
-- Index utiles
-- ======================
CREATE INDEX idx_installation_tokens_client_id ON installation_tokens(client_id);
CREATE INDEX idx_agents_client_id ON agents(client_id);
CREATE INDEX idx_actions_agent_id ON actions(agent_id);
CREATE INDEX idx_actions_status ON actions(status);
