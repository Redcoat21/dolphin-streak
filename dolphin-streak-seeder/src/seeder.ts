import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
mongoose.set('strictQuery', true);

// Import all models
import UserModel from './models/user.model';
import { Language } from './models/language.model';
import { Level } from './models/level.model';
import { Course } from './models/course.model';
import { Forum, ForumReply } from './models/forum.model';
import { Feedback } from './models/feedback.model';
import { Question } from './models/question.model';
import { Session } from './models/session.model';
import { Subscription } from './models/subscription.model';
import { ResetPassword } from './models/resetPassword.model';

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

async function seedLanguages(): Promise<void> {
    console.log('Seeding languages...');
    const languages = [
        {
            name: 'English',
            image: 'https://static.vecteezy.com/system/resources/previews/000/388/356/original/illustration-of-uk-flag-vector.jpg'
        },
        {
            name: 'Chinese',
            image: 'https://tse4.mm.bing.net/th/id/OIP.wjN7jAdy5evtymlw1-AZogHaE7?rs=1&pid=ImgDetMain'
        },
        {
            name: 'Indonesian',
            image: 'https://www.worldatlas.com/r/w1200-h701-c1200x701/upload/9f/69/0a/id-flag.jpg'
        }
    ];

    for (const language of languages) {
        await Language.updateOne({ name: language.name }, language, { upsert: true });
    }
    console.log('Languages seeded successfully.');
}

async function seedLevels(languageIds: string[]): Promise<void> {
    console.log('Seeding levels...');
    const levels = languageIds.flatMap(languageId => [
        { name: 'Beginner', language: languageId },
        { name: 'Intermediate', language: languageId },
        { name: 'Advanced', language: languageId }
    ]);

    for (const level of levels) {
        await Level.updateOne(
            { name: level.name, language: level.language },
            level,
            { upsert: true }
        );
    }
    console.log('Levels seeded successfully.');
}

async function seedCourses(languageIds: string[]): Promise<void> {
    console.log('Seeding courses...');
    for (const languageId of languageIds) {
        const levels = await Level.find({ language: languageId });

        const courses = [
            {
                name: 'Course 1',
                levels: levels.map(l => l._id),
                language: languageId,
                type: 0,
                thumbnail: 'https://example.com/course1.png'
            },
            {
                name: 'Course 2',
                levels: levels.map(l => l._id),
                language: languageId,
                type: 1,
                thumbnail: 'https://example.com/course2.png'
            }
        ];

        for (const course of courses) {
            await Course.updateOne(
                { name: course.name, language: languageId },
                course,
                { upsert: true }
            );
        }
    }
    console.log('Courses seeded successfully.');
}

async function seedUsers(): Promise<void> {
    console.log('Seeding users...');
    const users = [
        {
            firstName: 'Admin',
            email: 'admin@example.com',
            password: 'admin123',
            provider: 'LOCAL',
            role: 'ADMIN',
            profilePicture: 'https://example.com/admin.png'
        },
        {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'password123',
            provider: 'LOCAL',
            role: 'USER',
            profilePicture: 'https://example.com/john.png'
        }
    ];

    for (const user of users) {
        await UserModel.updateOne({ email: user.email }, user, { upsert: true });
    }
    console.log('Users seeded successfully.');
}

async function seedForums(userIds: string[]): Promise<void> {
    console.log('Seeding forums...');
    const forums = [
        {
            title: 'Welcome to the Forum',
            user: userIds[0],
            content: 'This is the first forum post',
            replies: []
        }
    ];

    for (const forum of forums) {
        await Forum.updateOne(
            { title: forum.title, user: forum.user },
            forum,
            { upsert: true }
        );
    }
    console.log('Forums seeded successfully.');
}

async function seedQuestions(courseIds: string[]): Promise<void> {
    console.log('Seeding questions...');
    const questions = [
        {
            question: {
                type: 'text',
                text: 'Sample Question 1?'
            },
            type: 'MULTIPLE_CHOICE',
            answerOptions: ['A', 'B', 'C', 'D'],
            correctAnswer: '1',
            useAi: false,
            courses: [courseIds[0]]
        }
    ];

    for (const question of questions) {
        await Question.updateOne(
            { 'question.text': question.question.text },
            question,
            { upsert: true }
        );
    }
    console.log('Questions seeded successfully.');
}

async function seedFeedback(userIds: string[]): Promise<void> {
    console.log('Seeding feedback...');
    const feedbacks = [
        {
            user: userIds[0],
            type: 'FEEDBACK',
            content: 'Sample feedback'
        }
    ];

    for (const feedback of feedbacks) {
        await Feedback.updateOne(
            { user: feedback.user, content: feedback.content },
            feedback,
            { upsert: true }
        );
    }
    console.log('Feedback seeded successfully.');
}

async function seed(): Promise<void> {
    try {
        await connectToDatabase();

        // Initial seeding
        await seedLanguages();
        const languageIds = (await Language.find()).map(l => l._id.toString());
        await seedLevels(languageIds);
        await seedUsers();

        // Get IDs for relations
        const userIds = (await UserModel.find()).map(u => u._id.toString());
        await seedCourses(languageIds);
        const courseIds = (await Course.find()).map(c => c._id.toString());

        // Seed related content
        await seedForums(userIds);
        await seedQuestions(courseIds);
        await seedFeedback(userIds);
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await disconnectFromDatabase();
    }
}

seed().catch(console.error);