"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const seedUsers = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/creditsea');
        console.log('Connected to MongoDB');
        const existingAdmin = await User_1.default.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }
        const admin = new User_1.default({
            username: 'admin',
            email: 'admin@creditsea.com',
            password: 'admin123',
            role: 'admin'
        });
        await admin.save();
        console.log('Admin user created successfully');
        const verifier = new User_1.default({
            username: 'verifier1',
            email: 'verifier@creditsea.com',
            password: 'verifier123',
            role: 'verifier'
        });
        await verifier.save();
        console.log('Verifier user created successfully');
    }
    catch (error) {
        console.error('Error seeding users:', error);
    }
    finally {
        await mongoose_1.default.connection.close();
        console.log('Database connection closed');
    }
};
seedUsers();
