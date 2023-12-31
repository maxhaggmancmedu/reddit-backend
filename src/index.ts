import express  from "express";
import mongoose from "mongoose";
import "dotenv/config"
import * as authController from './controllers/auth'
import * as postsController from './controllers/posts'
import * as commentsController from './controllers/comments'
import * as votesController from './controllers/votes'
import validateToken from "./middleware/validateToken";
import cors from "cors";

const app = express()

app.use(cors())
app.use(express.json())

app.post('/register', authController.registerUser)
app.post('/login', authController.loginUser)
app.post('/token/refresh', authController.refreshJWT);
app.get('/profile', validateToken, authController.profile)

app.post('/posts', validateToken, postsController.createPost)
app.get('/posts', postsController.getAllPosts)
app.get('/posts/:id', postsController.getPost)
app.delete('/posts/:id/delete', validateToken, postsController.deletePost)
app.put('/posts/:id/edit', validateToken, postsController.editPost)

app.post('/posts/:postId/upvote', validateToken, votesController.upvote)
app.post('/posts/:postId/downvote', validateToken, votesController.downvote)

app.post('/posts/:postId/comments', validateToken, commentsController.createComment)
app.delete('/posts/:postId/comments/:commentId', validateToken, commentsController.deleteComment)
app.put('/posts/:postId/comments/:commentId/edit', validateToken, commentsController.editComment)

const mongoURL = process.env.DB_URL

if (!mongoURL) throw new Error('Missing DB URL') 

mongoose.connect(mongoURL)
.then(() => {
        const PORT = parseInt(process.env.PORT || '3000')
        app.listen(PORT, () => {
            console.log('listening on port ' + PORT)
        })
    })



