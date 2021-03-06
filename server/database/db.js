const { Pool } = require('pg');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');


dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('connected to the db');
});

const createSchema = `CREATE SCHEMA IF NOT EXISTS myireportdb`;


const createIncidentType = `DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'incident_type') THEN
        create type incident_type AS ENUM ('Red-flag', 'Intervention');
    END IF;
END
$$;`

const createIncidentStatus = `DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'incident_status') THEN
        create type incident_status AS ENUM ('Draft', 'Under investigation', 'Rejected', 'Resolved');
    END IF;
END
$$;`


/**
 * Create Tables
 */
const incidentTable = `CREATE TABLE IF NOT EXISTS myireportdb.incidents(
  title VARCHAR(100) NOT NULL,
  createdBy INT NOT NULL,
  incidentId SERIAL  PRIMARY KEY NOT NULL,
  createdOn TIMESTAMP DEFAULT CURRENT_DATE NOT NULL,
  type myireportdb.incident_type NOT NULL,
  location TEXT NOT NULL,
  status myireportdb.incident_status DEFAULT 'Draft',
  comment VARCHAR(200) NOT NULL,
  videos TEXT[] DEFAULT ARRAY[]::TEXT[],
  videos_id TEXT[] DEFAULT ARRAY[]::TEXT[],
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  images_id TEXT[] DEFAULT ARRAY[]::TEXT[],
  FOREIGN KEY (createdBy) REFERENCES myireportdb.users(id) ON DELETE CASCADE

);`;


const usersTable = `CREATE TABLE IF NOT EXISTS myireportdb.users(
  id SERIAL PRIMARY KEY NOT NULL,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  registered TIMESTAMP DEFAULT CURRENT_DATE NOT NULL,
  password TEXT NOT NULL,
  old_password TEXT DEFAULT NULL,
  reset_code TEXT DEFAULT NULL,
  reset_expires TIMESTAMP DEFAULT NULL,
  verify_code TEXT DEFAULT NULL,
  verify_expires TIMESTAMP DEFAULT NULL,
  image TEXT DEFAULT NULL,
  image_id TEXT DEFAULT NULL,
  is_admin BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false

);`;

const check = `SELECT * FROM myireportdb.users`;
//should add password reset date

(async function () {
  try {
    await pool.query(createSchema);
    await pool.query(createIncidentType);
    await pool.query(createIncidentStatus);    
    await pool.query(usersTable);
    await pool.query(incidentTable);
  } catch (error) {
    console.log(error);
  }
})();
