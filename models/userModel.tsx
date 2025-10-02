import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true
    },
    
    fullName: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    avatar: {
        url: {
            type: String,
            trim: true,
        },
        public_id: {
            type: String,
            trim: true,
        }
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    phone: {
        type: String,
        trim: true,
    },

    address: {
        type: String,
        trim: true,
    },

    deletedAt: {
        type: Date,
        default: null,
        index: true
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods = {
    comparePassword: async function (candidatePassword: string): Promise<boolean> {
        return await bcrypt.compare(candidatePassword, this.password);
    }
}

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export default UserModel;