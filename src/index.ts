import express  from "express";
import mongoose from "mongoose";
import "dotenv/config"
import * as authController from './controllers/auth'
import validateToken from "./middleware/validateToken";

const app = express()

app.use(express.json())

app.post('/register', authController.registerUser)
app.post('/login', authController.loginUser)
app.get('/profile', validateToken, authController.profile)

const mongoURL = process.env.DB_URL

if (!mongoURL) throw new Error('Missing DB URL') 

mongoose.connect(mongoURL)
.then(() => {
        const PORT = parseInt(process.env.PORT || '3000')
        app.listen(PORT, () => {
            console.log('listening on port ' + PORT)
        })
    })



