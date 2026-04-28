
CREATE TABLE t_p40952377_social_app_developme.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    bio TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    posts_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p40952377_social_app_developme.sessions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES t_p40952377_social_app_developme.users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days'
);

CREATE INDEX idx_sessions_token ON t_p40952377_social_app_developme.sessions(token);
CREATE INDEX idx_users_email ON t_p40952377_social_app_developme.users(email);
CREATE INDEX idx_users_username ON t_p40952377_social_app_developme.users(username);
