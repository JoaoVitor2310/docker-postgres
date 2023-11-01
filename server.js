const express = require('express');
const pool = require('./db');
const port = 3000;

const app = express();
app.use(express.json());


app.get('/setup', async (req,res) => { // Creates tables and its columns
    try {
        // const existTable = await pool.query("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'schools')");
        // if(existTable.rows[0].exists){ // If table already exists
        //     res.status(405).send({message: "Table already exists"});
        //     return;
        // }

        await pool.query('CREATE TABLE IF NOT EXISTS schools(id SERIAL PRIMARY KEY, name VARCHAR(100), address VARCHAR(100))');
        await pool.query('CREATE TABLE students(id SERIAL PRIMARY KEY, name VARCHAR(100), age INTEGER, parents_names VARCHAR(200), address VARCHAR(100), school_id INTEGER REFERENCES schools(id))');
        res.status(200).send({message: "Successfully created table"})
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.get('/all', async (req, res) => { // Returns the entire table back
    try {
        const data = await pool.query('SELECT * FROM schools');
        res.status(200).send(data.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.get('/:id', async (req, res) => { // Returns a school
    try {
        const {id} = req.params;
        const data = await pool.query(`SELECT * FROM schools WHERE id = ${id} `);
        if(data.rowCount == 0){
            res.status(404).send({message: "School not found"});
            return;
        }
        res.status(200).send(data.rows);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.post('/', async (req, res) => { // Inserts values into the table
    const {name, address} = req.body;
    try {
        await pool.query('INSERT INTO schools(name, address) VALUES ($1, $2)', [name, address]);
        res.status(201).send({message: "Successfully added school"})
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.patch('/:id', async (req, res) => { // Edits values from table
    const {id} = req.params;
    const {name, address} = req.body;

    let query = `UPDATE schools SET`;

    if(name){
        query += ` name = '${name}'`;
    }
    if(address){
        if(name){
            query += `,`;
        }
        query += ` address = '${address}'`;
    }

    query += ` WHERE id = ${id}`;

    try {
        await pool.query(query);
        res.status(200).send({message: "Successfully updated school"})
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.delete('/:id', async (req, res) => { // Removes values from table
    const {id} = req.params;
    try {
        const existSchool = await pool.query(`DELETE FROM schools WHERE id = ${id}`);
        if(existSchool.rowCount == 0){
            res.status(404).send({message: "School not found"})
            return;
        }
        res.status(200).send({message: "Successfully deleted school"})
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.listen(port ,() => {
    console.log(`Listening to port: ${port}`);
});