const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'myapp',
  password: process.env.DB_PASSWORD || 'yourpassword',
  port: process.env.DB_PORT || 5432,
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.query('SELECT NOW()')
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err.stack));

// Export both pool and query for flexibility
module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
};