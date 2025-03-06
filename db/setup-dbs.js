const fs = require('fs');
const { Pool } = require('pg');

// Load the SQL file (setup.sql)
const setupSql = fs.readFileSync('./db/setup.sql', 'utf-8');

// Set up PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // You should have this in your Render environment variables
  ssl: { rejectUnauthorized: false }, // This is often necessary for cloud databases
});

async function setupDatabase() {
  try {
    console.log("Setting up the database...");
    await pool.query(setupSql); // Execute the setup SQL
    console.log("Database setup complete!");
    pool.end(); // Close the connection
  } catch (err) {
    console.error("Error setting up database:", err);
    process.exit(1); // Exit with failure code if setup fails
  }
}

// Run the setup
setupDatabase();
