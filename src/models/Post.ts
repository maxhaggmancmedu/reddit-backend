import { Document, Model, Schema, Types, model } from "mongoose";

interface IComment extends Document {
    body: String
    author: Types.ObjectId
    createdAt: Date,
    updatedAt: Date
}

const CommentSchema = new Schema<IComment>({
    body: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

interface IPost extends Document {
    title: string
    link?: string
    body?: string
    author: Types.ObjectId
    createdAt: Date
    updatedAt: Date
    comments: IComment[]
    upvotes: Types.Array<Types.ObjectId>
    downvotes: Types.Array<Types.ObjectId>
    score: number
}
interface IPostProps {
    comments: Types.DocumentArray<IComment>
    upvote: (uerId: string) => void
    downvote: (userId: string) => void
}

type IPostModel = Model<IPost, {}, IPostProps>

const PostSchema = new Schema<IPost, IPostModel>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    link: {
        type: String,
        trim: true
    },
    body: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [CommentSchema],
    upvotes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    ],
    downvotes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    ],
    score: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

PostSchema.pre<IPost>('save', function(next) {
    if (this.isModified('upvotes') || this.isModified('downvotes')) {
        this.score = this.upvotes.length - this.downvotes.length
    }

    next()
})

PostSchema.method('upvote', async function(this: IPost, userId: string) {
    const userIdObj = new Types.ObjectId(userId)
    
    if (this.upvotes.includes(userIdObj)) {
        return
    } else if (this.downvotes.includes(userIdObj)) {
        this.downvotes.pull(userIdObj)
    }

    this.upvotes.push(userIdObj)
})

PostSchema.method('downvote', async function(this: IPost, userId: string) {
    const userIdObj = new Types.ObjectId(userId)

    if (this.downvotes.includes(userIdObj)) {
        return
    } else if (this.upvotes.includes(userIdObj)) {
        this.upvotes.pull(userIdObj)
    }

    this.downvotes.push(userIdObj)
})

const Post = model<IPost, IPostModel>('Post', PostSchema)

export default Post