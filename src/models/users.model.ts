import mongoose from 'mongoose';
import validatorObj from 'validator';
import { NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const userSchema:any = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 18
    },
    email: {
        type: String,
        validate: {
            validator: function(value: any) {
                return validatorObj.isEmail(value);
            }
        },
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    tokens: [{
        token: String
    }]
});

userSchema.pre("save", async function(this: typeof userSchema, next: NextFunction) {
    const user: any = this;
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

userSchema.statics.findByCredentials = async (email: string, password: string) => {
    try {
        const user: typeof userSchema = User.findOne({email});
        if(!user) {
            throw new Error('unable to login');
        }

        const isPasswordMatch = bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            throw new Error('unable to login');
        }

        return user;

    } catch (err) {
        return err;
    }
}

userSchema.methods.getAuthToken = async function () {
    const user: typeof userSchema = this;
    const secretKey: any = process.env.JWT_SECRET;
    const token = await jwt.sign({_id: user._id.toString()}, secretKey);
    user.tokens.push({token});
    user.save();
    return token;
}

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.tokens;
    return user;
}

const User: any = mongoose.model("User", userSchema);

export default User;