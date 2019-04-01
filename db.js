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
        create type incident_status AS ENUM ('Pending', 'Under investigation', 'Rejected', 'Resolved');
    END IF;
END
$$;`


/**
 * Create Tables
 */
const incidentTable = `CREATE TABLE IF NOT EXISTS incidents(
  id SERIAL  PRIMARY KEY NOT NULL,
  createdBy INT NOT NULL,
  createdOn TIMESTAMPTZ DEFAULT CURRENT_DATE NOT NULL,
  type incident_type NOT NULL,
  location TEXT NOT NULL,
  status incident_status,
  comment VARCHAR(200) NOT NULL
);`;




(async function () {
  try {
    await pool.query(createIncidentType)
    await pool.query(createIncidentStatus)
    await pool.query(incidentTable);
  } catch (error) {
    console.log(error)
  }
})();


