import mongoose from 'mongoose';
import UserModel from './models/user.model';
import CourseModel from './models/course.model';
import LevelModel from './models/level.model';
import LanguageModel from './models/language.model';

async function connectToDatabase(): Promise<void> {
    try {
        await mongoose.connect('mongodb://localhost:27017/dolphin-streak');
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
    const languages = [
        { name: 'English', image: 'https://static.vecteezy.com/system/resources/previews/000/388/356/original/illustration-of-uk-flag-vector.jpg' },
        { name: 'Chinese', image: 'https://tse4.mm.bing.net/th/id/OIP.wjN7jAdy5evtymlw1-AZogHaE7?rs=1&pid=ImgDetMain' },
        { name: 'Indonesian', image: 'https://www.worldatlas.com/r/w1200-h701-c1200x701/upload/9f/69/0a/id-flag.jpg' },
    ];

    for (const language of languages) {
        await LanguageModel.updateOne({ name: language.name }, language, { upsert: true });
    }
}

async function seedLevels(languageIds: any[]): Promise<void> {
    const levels = [
        { name: 'Beginner', languageId: languageIds[0] },
        { name: 'Intermediate', languageId: languageIds[0] },
        { name: 'Advanced', languageId: languageIds[0] },
        { name: 'Beginner', languageId: languageIds[1] },
        { name: 'Intermediate', languageId: languageIds[1] },
        { name: 'Advanced', languageId: languageIds[1] },
        { name: 'Beginner', languageId: languageIds[2] },
        { name: 'Intermediate', languageId: languageIds[2] },
        { name: 'Advanced', languageId: languageIds[2] },
    ];

    for (const level of levels) {
        await LevelModel.updateOne({ name: level.name, languageId: level.languageId }, level, { upsert: true });
    }
}

async function seedCourses(languageIds: any[]): Promise<void> {
    const courses = [
{ name: 'Course 1', languageId: languageIds[0], levelId: (await LevelModel.findOne({ name: 'Beginner', languageId: languageIds[0] }))?._id },
{ name: 'Course 2', languageId: languageIds[0], levelId: (await LevelModel.findOne({ name: 'Intermediate', languageId: languageIds[0] }))?._id },
{ name: 'Course 3', languageId: languageIds[0], levelId: (await LevelModel.findOne({ name: 'Advanced', languageId: languageIds[0] }))?._id },
{ name: 'Course 1', languageId: languageIds[1], levelId: (await LevelModel.findOne({ name: 'Beginner', languageId: languageIds[1] }))?._id },
{ name: 'Course 2', languageId: languageIds[1], levelId: (await LevelModel.findOne({ name: 'Intermediate', languageId: languageIds[1] }))?._id },
{ name: 'Course 3', languageId: languageIds[1], levelId: (await LevelModel.findOne({ name: 'Advanced', languageId: languageIds[1] }))?._id },
{ name: 'Course 1', languageId: languageIds[2], levelId: (await LevelModel.findOne({ name: 'Beginner', languageId: languageIds[2] }))?._id },
{ name: 'Course 2', languageId: languageIds[2], levelId: (await LevelModel.findOne({ name: 'Intermediate', languageId: languageIds[2] }))?._id },
{ name: 'Course 3', languageId: languageIds[2], levelId: (await LevelModel.findOne({ name: 'Advanced', languageId: languageIds[2] }))?._id },
    ];

    for (const course of courses) {
const level = await LevelModel.findOne({ name: course.name.replace('Course ', ''), languageId: course.languageId });
if (level && level._id) {
    await CourseModel.updateOne({ name: course.name, languageId: course.languageId, levelId: level?._id }, course, { upsert: true });
} else {
    console.error(`Level not found for course ${course.name}`);
}
    }
}

async function seedUsers(languageIds: any[]): Promise<void> {
    const users = [
        { firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password123', languageId: languageIds[0] },
        { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', password: 'password123', languageId: languageIds[1] },
        { firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com', password: 'password123', languageId: languageIds[2] },
    ];

    for (const user of users) {
        await UserModel.updateOne({ email: user.email }, user, { upsert: true });
    }
}

async function seed(): Promise<void> {
    try {
        await seedLanguages();
        const languageIds = (await LanguageModel.find()).map((language) => language._id);
        await seedLevels(languageIds);
        await seedCourses(languageIds);
        await seedUsers(languageIds);
        console.log('Data seeding completed successfully!');
    } catch (error) {
        console.error('Seeding error:', error);
    }
}

async function main() {
    await connectToDatabase();
    await seed();
    await disconnectFromDatabase();
}

main();
