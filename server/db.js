require('babel-polyfill')
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('connected to the db');
});

const  createIncidentType = `DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'incident_type') THEN
        create type incident_type AS ENUM ('Red-flag', 'Intervention');
    END IF;
END
$$;`

const  createIncidentStatus = `DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'incident_status') THEN
        create type incident_status AS ENUM ('Draft', 'Under investigation', 'Rejected', 'Resolved');
    END IF;
END
$$;`


/**
 * Create Tables
 */
const incidentTable = `CREATE TABLE IF NOT EXISTS incidents(
  title VARCHAR(100) NOT NULL,
  createdBy INT NOT NULL,
  incidentId SERIAL  PRIMARY KEY NOT NULL,
  createdOn TIMESTAMP DEFAULT CURRENT_DATE NOT NULL,
  type incident_type NOT NULL,
  location TEXT NOT NULL,
  status incident_status,
  comment VARCHAR(200) NOT NULL,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE

);`;


  const usersTable = `CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  other_names TEXT,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  user_name TEXT UNIQUE,
  registered TIMESTAMP DEFAULT CURRENT_DATE NOT NULL,
  password VARCHAR(100),
  is_admin BOOLEAN DEFAULT false

);`;


(async function () {
  try {
    await pool.query(createIncidentType)
    await pool.query(createIncidentStatus)
    await pool.query(usersTable);
    await pool.query(incidentTable); 
  } catch (error) {
    console.log(error)
  }
})();
