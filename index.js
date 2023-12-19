const pg = require('pg')
const client = new pg.Client('postgres://localhost/ice_cream_db')
const express = require('express')
const app = express()
const cors = require('cors')


app.use(cors())


app.get('/', (req,res,next) =>{
    res.send('hello world')
})

app.get('/api/flavors', async (req,res,next) =>{
    try {
        const SQL = `
        SELECT *
        FROM flavors;
        `
        const response = await client.query(SQL)
        console.log(response.rows)
        res.send(response.rows)

    } catch (error) {
        next(error)
    }
})

app.get('/api/flavors/:id', async (req,res,next) =>{
   try { console.log(req.params.id)
    const SQL = `
    SELECT * FROM flavors WHERE id=$1`
    const response = await client.query(SQL, [req.params.id])
    console.log(response.rows)
    if(!response.rows.length){
        next({
            name: 'id error',
            message: `flavor with the id of ${req.params.id}does not exist`
        })
    }else{
        res.send(rseponse.rows[0])
    }} catch (error) {
        next(error)
    }
})

app.delete('/api/flavors/:id', async (req,res,next) =>{
    try {
        const SQL = `
        DELETE FROM flavors WHERE id=$1
        `
        const response = await client.query(SQL, [req.params.id])
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

app.use((error,req,res,next) =>{
    res.status(500)
    res.send(error)
})


app.use('*', (req,res,next) =>{
    res.send('no such route exists')
})





const init = async () =>{
    await client.connect()
    console.log('connected to db!')
    const SQL = `
    DROP TABLE IF EXISTS flavors;
    CREATE TABLE flavors(
        id SERIAL PRIMARY KEY,
        name VARCHAR(30)
        );
        INSERT INTO flavors (name) values ('Double Fudge');
        INSERT INTO flavors (name) values ('Bourbon Vanilla');
        INSERT INTO flavors (name) values ('Honey Lavender');
        INSERT INTO flavors (name) values ('Peanut Butter Cookie Dough');
        INSERT INTO flavors (name) values ('Habanero Mango');
        INSERT INTO flavors (name) values ('Pistachio');
        INSERT INTO flavors (name) values ('Creme Brulee');
        INSERT INTO flavors (name) values ('Espresso');
        INSERT INTO flavors (name) values ('Black Sesame Crunch');
        INSERT INTO flavors (name) values ('King Cake');
        `
       await client.query(SQL)
       console.log('table created and seeded')

       const port = process.env.PORT || 5050

       app.listen(port, () =>{
        console.log(`listening on port ${port}`)
       })
}

init()
