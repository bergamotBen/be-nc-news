const fs = require('fs');
const { Pool } = require('pg');

// Load the SQL file (setup.sql)
const setupSql = fs.readFileSync('./db/setup.sql', 'utf-8');

// Set up PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure this is set in Render environment variables
  ssl: { rejectUnauthorized: false }, // This is necessary for cloud-hosted PostgreSQL databases
});

async function setupDatabase() {
  try {
    console.log("Setting up the database...");

    // Run the DROP DATABASE command without a transaction
    //await pool.query('DROP DATABASE IF EXISTS nc_news_test;');

    // Create the database (you may need to connect to a default database like postgres to execute this)
    await pool.query('CREATE DATABASE nc_news;');

    // After creating the database, reconnect to the new database and run the setup SQL
    /*
    const newPool = new Pool({
      connectionString: process.env.DATABASE_URL.replace('nc_news', 'nc_news_test'), // Change the DB name to the new one
      ssl: { rejectUnauthorized: false },
    });
    */
    // Run the setup.sql content (this assumes it has table creation, etc.)
    await newPool.query(setupSql);

    console.log("Database setup complete!");
    newPool.end(); // Close the connection to the new database
    pool.end(); // Close the original pool connection

  } catch (err) {
    console.error("Error setting up database:", err);
    process.exit(1); // Exit with failure code if setup fails
  }
}

// Run the setup
setupDatabase();
