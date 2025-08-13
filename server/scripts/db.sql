CREATE TABLE url_original (
    seq_id BIGSERIAL PRIMARY KEY,
    original_url TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE url_short (
    seq_id BIGINT PRIMARY KEY REFERENCES url_original(seq_id),
    short_code VARCHAR(50) NOT NULL UNIQUE
);

CREATE INDEX idx_url_original_url ON url_original(original_url);
CREATE INDEX idx_url_short_code ON url_short(short_code);