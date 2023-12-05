import express  from "express";

const app = express()
const PORT = 5500

app.use('/', (req, res) => {
    res.send('Hello')
})

app.listen(PORT, () => {
    console.log('listening on port ' + PORT)
})