import fs from 'fs';
import path from 'path';
import mongoose, { Model } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Existing imports
import { Language } from './models/language.model';
import { Level } from './models/level.model';
import { Course } from './models/course.model';
import UserModel from './models/user.model';

// Add these imports
import { Feedback } from './models/feedback.model';
import { Forum, ForumReply } from './models/forum.model';
import { Session } from './models/session.model';
import { Subscription } from './models/subscription.model';
import { ResetPassword } from './models/resetPassword.model';
import { Question } from './models/question.model';


async function extractData(model: Model<any>, model_name: string): Promise<void> {
    try {
        const data = await model.find({});
        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
        fs.writeFileSync(path.join(outputDir, `${model_name}.json`), JSON.stringify(data, null, 2));
        console.log(`Data successfully extracted to ${model_name}.json`);
    } catch (error) {
        console.error('Error extracting data:', error);
    }
}

async function connectToDatabase(): Promise<void> {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in the environment variables');
        }
        await mongoose.connect(mongoUri);
        console.log('Successfully connected to MongoDB!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

async function disconnectFromDatabase(): Promise<void> {
    try {
        await mongoose.disconnect();
        console.log('Successfully disconnected from MongoDB.');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
    }
}

async function extractAll(): Promise<void> {
    await connectToDatabase();
  
    await extractData(Language, 'Language');
    await extractData(Level, 'Level');
    await extractData(Course, 'Course');
    await extractData(UserModel, 'User');
    await extractData(Feedback, 'Feedback');
    await extractData(Forum, 'Forum');
    await extractData(ForumReply, 'ForumReply');
    await extractData(Session, 'Session');
    await extractData(Subscription, 'Subscription');
    await extractData(ResetPassword, 'ResetPassword');
    await extractData(Question, 'Question');
  
    await disconnectFromDatabase();
  }
  
  extractAll().catch(console.error);