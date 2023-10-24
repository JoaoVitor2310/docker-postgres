const express = require('express');
const pool = require('./db');
const port = 3000;

const app = express();
app.use(express.json());

app.get('/', async (req, res) => { // Returns the entire table back
    try {
        const data = await pool.query('SELECT * FROM schools ');
        res.status(200).send(data.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.post('/', async (req, res) => { // Inserts values into the table
    const {name, location} = req.body;
    try {
        await pool.query('INSERT INTO schools(name, address) VALUES ($1, $2)', [name, location]);
        res.status(200).send({message: "Successfully added child"})
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.get('/setup', async (req,res) => { // Creates the table and its collumns
    try {
        await pool.query('CREATE TABLE schools(id SERIAL PRIMARY KEY, name VARCHAR(100), address VARCHAR(100) )')
        res.status(200).send({message: "Successfully created table"})
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.listen(port ,() => {
    console.log(`Listening to port: ${port}`);
});