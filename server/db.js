require('babel-polyfill')
const { Pool } = require('pg');
const dotenv = require('dotenv');
const query = require('./queries/dbqueries');
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
        create type incident_status AS ENUM ('Pending', 'Under investigation', 'Rejected', 'Resolved');
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
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  user_name TEXT UNIQUE,
  registered TIMESTAMP DEFAULT CURRENT_DATE NOT NULL,
  password VARCHAR(100),
  image TEXT DEFAULT NULL,
  image_id TEXT DEFAULT NULL,
  is_admin BOOLEAN DEFAULT false

);`;

const check = `SELECT * FROM myireportdb.users`;


(async function () {
  try {
    await pool.query(createSchema);
    await pool.query(createIncidentType);
    await pool.query(createIncidentStatus);    
    await pool.query(usersTable);
    const { rowCount } = await pool.query(check);
    if(rowCount < 1){
      const pass = 'qwerty'
      const result = await bcrypt.hash(pass, 10);
      await pool.query(query.regUser('Abuchi', 'Kingsley', 'abuchikings@ireporter.com', '0806215xxxx', 
      'abuchikings', result, true));
    }
    await pool.query(incidentTable);
  } catch (error) {
    console.log(error);
  }
})();
