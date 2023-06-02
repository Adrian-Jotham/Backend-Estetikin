import mysql from 'mysql2/promise';
import {Connector} from '@google-cloud/cloud-sql-connector';

const connector = new Connector();
const clientOpts = await connector.getOptions({
    instanceConnectionName: 'estetikin:asia-southeast2:estetikin-db-protect',
    ipType: 'PUBLIC',
});
const pool = await mysql.createPool({
    ...clientOpts,
    user: 'estetikin-admin',
    password: '',
    database: 'nodejs-database',
});
const conn = await pool.getConnection();
const [result] = await conn.query( `SELECT * FROM USER;`);
console.table(result); // prints returned time value from server

await pool.end();
connector.close();