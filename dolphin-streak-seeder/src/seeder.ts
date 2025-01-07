import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
mongoose.set('strictQuery', true);

// Import all models
import UserModel, { Provider, Role } from './models/user.model';
import { Language } from './models/language.model';
import { Level } from './models/level.model';
import { Course, CourseType } from './models/course.model';
import { Forum, ForumReply } from './models/forum.model';
import { Feedback, FeedbackType } from './models/feedback.model';
import { Question, QuestionType } from './models/question.model';
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
                type: CourseType.Daily,
                thumbnail: 'https://example.com/course1.png'
            },
            {
                name: 'Course 2',
                levels: levels.map(l => l._id),
                language: languageId,
                type: CourseType.Weekly,
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
            "firstName": "Jonathan",
            "email": "joken.e22@mhs.istts.ac.id",
            "provider": Provider.LOCAL,
            "profilePicture": "https://res.cloudinary.com/dmzt7dywt/image/upload/v1732207866/profile-pictures/67243a4a7507ac0c0d0b56c2-zutomayo-1732207863.webp",
            "loginHistories": [],
            "role": Role.USER,
            "languages": [],
            "completedCourses": [],
            "createdAt": "2024-11-01T02:17:46.343Z",
            "updatedAt": "2024-11-21T16:51:06.066Z",
            "id": "67243a4a7507ac0c0d0b56c2",
            password: "password"
        },
        {
            "profilePicture": "https://res.cloudinary.com/dmzt7dywt/image/upload/v1732208251/ghozali-default_zgyths.jpg",
            "loginHistories": [],
            "languages": [],
            "completedCourses": [],
            "email": "admin1234@email.com",
            "firstName": "",
            "provider": Provider.LOCAL,
            "role": Role.ADMIN,
            "id": "672f0d291a890f507777cb0e",
            password: "admin1234"
        },
        {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john50@email.com",
            "birthDate": "1990-11-02T00:00:00.000Z",
            "provider": Provider.LOCAL,
            "profilePicture": "https://res.cloudinary.com/dmzt7dywt/image/upload/v1732208251/ghozali-default_zgyths.jpg",
            "loginHistories": [],
            "role": Role.USER,
            "languages": [],
            "completedCourses": [],
            "createdAt": "2024-11-21T17:00:14.343Z",
            "updatedAt": "2024-11-21T17:00:14.343Z",
            "id": "673f671efc580ae0dc650285",
            password: "admin1234"
        },
        {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john40@email.com",
            "birthDate": "1990-11-02T00:00:00.000Z",
            "provider": Provider.LOCAL,
            "profilePicture": "https://docs.nestjs.com/assets/logo-small-gradient.svg",
            "loginHistories": [],
            "role": Role.USER,
            "languages": [],
            "completedCourses": [],
            "createdAt": "2024-11-24T18:11:02.975Z",
            "updatedAt": "2024-11-24T18:11:02.975Z",
            "id": "67436c361488d1d48b3ee7a7",
            password: "admin1234"
        },
        {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john70@email.com",
            "birthDate": "1990-11-02T00:00:00.000Z",
            "provider": Provider.LOCAL,
            "profilePicture": "https://docs.nestjs.com/assets/logo-small-gradient.svg",
            "loginHistories": [],
            "role": Role.USER,
            "languages": [],
            "completedCourses": [],
            "createdAt": "2024-11-24T18:19:54.519Z",
            "updatedAt": "2024-11-24T18:19:54.519Z",
            "id": "67436e4a66125b2eecdeddec",
            password: "admin1234"
        },
        {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john90@email.com",
            "birthDate": "1990-11-02T00:00:00.000Z",
            "provider": Provider.LOCAL,
            "profilePicture": "https://docs.nestjs.com/assets/logo-small-gradient.svg",
            "loginHistories": [],
            "role": Role.USER,
            "languages": [],
            "completedCourses": [],
            "createdAt": "2024-11-24T18:26:56.938Z",
            "updatedAt": "2024-11-24T18:26:56.938Z",
            "id": "67436ff03081ffddd696a86d",
            password: "admin1234"
        },
        {
            "firstName": "Jonathan",
            "email": "joken.e23@mhs.istts.ac.id",
            "provider": Provider.LOCAL,
            "profilePicture": "https://placehold.jp/150x150.png",
            "loginHistories": [],
            "role": Role.USER,
            "languages": [],
            "completedCourses": [],
            "createdAt": "2024-11-25T07:24:29.785Z",
            "updatedAt": "2024-11-25T07:24:29.785Z",
            "id": "6744262d52a2392a69fa49c3",
            password: "joken"
        },
        {
            "firstName": "new",
            "lastName": "user",
            "email": "newuser@gmail.com",
            "birthDate": "2018-01-02T00:00:00.000Z",
            "provider": Provider.LOCAL,
            "profilePicture": "https://res.cloudinary.com/dmzt7dywt/image/upload/v1732208251/ghozali-default_zgyths.jpg",
            "loginHistories": [],
            "role": Role.USER,
            "languages": [],
            "completedCourses": [],
            "createdAt": "2024-11-27T09:39:12.203Z",
            "updatedAt": "2024-11-27T09:39:12.203Z",
            "id": "6746e8c08302e1473125dab7",
            password: 'password'
        },
        {
            "firstName": "me",
            "lastName": "Doe",
            "email": "me@email.com",
            "birthDate": "1990-11-02T00:00:00.000Z",
            "provider": Provider.LOCAL,
            "profilePicture": "https://docs.nestjs.com/assets/logo-small-gradient.svg",
            "loginHistories": [],
            "role": Role.USER,
            "languages": [],
            "completedCourses": [],
            "createdAt": "2024-11-28T14:11:16.438Z",
            "updatedAt": "2024-12-03T07:38:35.114Z",
            "subscriptionId": "f34cff56-05ea-4f44-9704-f0dee357f08f",
            "id": "67487a042df054704dde8714",
            password: 'password'
        },
        {
            "firstName": "me",
            "email": "me2@email.com",
            "birthDate": "1990-11-02T00:00:00.000Z",
            "provider": Provider.LOCAL,
            "profilePicture": "https://docs.nestjs.com/assets/logo-small-gradient.svg",
            "loginHistories": [],
            "role": Role.USER,
            "languages": [],
            "completedCourses": [],
            "createdAt": "2024-11-28T14:11:36.637Z",
            "updatedAt": "2024-11-28T14:11:36.637Z",
            "id": "67487a182df054704dde8716",
            password: 'password'
        },
        {
            "firstName": "user1",
            "lastName": "user1",
            "email": "user@gmail.com",
            "provider": Provider.LOCAL,
            "profilePicture": "https://res.cloudinary.com/dmzt7dywt/image/upload/v1732208251/ghozali-default_zgyths.jpg",
            "loginHistories": [],
            "role": Role.USER,
            "languages": [],
            "completedCourses": [],
            "createdAt": "2024-12-09T09:45:20.308Z",
            "updatedAt": "2024-12-09T09:45:20.308Z",
            "id": "6756bc300f5dd9735079d846",
            password: 'password'
        },
        {
            "firstName": "asd",
            "lastName": "asd",
            "email": "asd@asd.asd",
            "provider": Provider.LOCAL,
            "profilePicture": "https://res.cloudinary.com/dmzt7dywt/image/upload/v1732208251/ghozali-default_zgyths.jpg",
            "loginHistories": [],
            "role": Role.USER,
            "languages": [],
            "completedCourses": [],
            "createdAt": "2024-12-13T10:04:31.057Z",
            "updatedAt": "2024-12-13T10:04:31.057Z",
            "id": "675c06afc805383135c8ca8a",
            password: 'password'
        },
        {
            "email": "admin@example.com",
            "completedCourses": [],
            "createdAt": "2024-12-30T00:35:59.843Z",
            "firstName": "Admin",
            "languages": [],
            "loginHistories": [],
            "profilePicture": "https://example.com/admin.png",
            "provider": Provider.LOCAL,
            "role": Role.ADMIN,
            "updatedAt": "2024-12-31T09:52:07.631Z",
            "id": "6771eaf5358f1717ed5fd6f4",
            password: 'admin1234'
        },
        {
            "email": "john@example.com",
            "completedCourses": [],
            "createdAt": "2024-12-30T00:35:59.885Z",
            "firstName": "John",
            "languages": [],
            "lastName": "Doe",
            "loginHistories": [],
            "profilePicture": "https://example.com/john.png",
            "provider": Provider.LOCAL,
            "role": Role.USER,
            "updatedAt": "2024-12-31T09:52:07.683Z",
            "id": "6771eaf5358f1717ed5fd6f5",
            password: 'password'
        }
    ];

    for (const user of users) {
        await UserModel.create({
            email: user.email,
            firstName: user.firstName || "a",
            lastName: user.lastName,
            profilePicture: user.profilePicture,
            role: user.role,
            provider: user.provider,
            languages: user.languages,
            completedCourses: user.completedCourses,
            loginHistories: user.loginHistories,
            password: user.password,
        });
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

function getRandomCourseId(courseIds: string[]): string {
    const randomIndex = Math.floor(Math.random() * courseIds.length);
    return courseIds[randomIndex];
}

async function seedQuestions(courseIds: string[], languageIds: string[]): Promise<void> {
    console.log('Seeding questions...');

    for (const languageId of languageIds) {
        const levels = await Level.find({ language: languageId });
        const courses = await Course.find({ language: languageId });
        const language = await Language.findById(languageId);

        if (!language) {
            console.error(`Language not found for ID: ${languageId}`);
            continue;
        }

        const multipleChoiceLevel = levels.find(level => level.name === 'Beginner');
        const essayLevel = levels.find(level => level.name === 'Intermediate');
        const fillInLevel = levels.find(level => level.name === 'Advanced');
        const voiceLevel = levels.find(level => level.name === 'Beginner');
        const writingLevel = levels.find(level => level.name === 'Intermediate');

        if (!multipleChoiceLevel || !essayLevel || !fillInLevel || !voiceLevel || !writingLevel) {
            console.error(`Could not find all levels for language: ${language.name}`);
            continue;
        }

        // Questions based on language
        const questions = [];

        if (language.name === 'Chinese') {
            questions.push(
                // Writing Questions
                {
                    question: { type: 'text', text: '写一个关于你最喜欢的季节的短文' },
                    type: QuestionType.WRITING,
                    answerOptions: null,
                    correctAnswer: null,
                    useAi: true,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: writingLevel._id,
                },
                {
                    question: { type: 'text', text: '描述你的家人' },
                    type: QuestionType.WRITING,
                    answerOptions: null,
                    correctAnswer: null,
                    useAi: true,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: writingLevel._id,
                },
                {
                    question: { type: 'text', text: '写一篇关于你的梦想的文章' },
                    type: QuestionType.WRITING,
                    answerOptions: null,
                    correctAnswer: null,
                    useAi: true,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: writingLevel._id,
                },
                // Multiple Choice Questions
                 {
                    question: { type: 'text', text: '中国的首都是哪里？' },
                    type: QuestionType.MULTIPLE_CHOICE,
                    answerOptions: ['北京', '上海', '广州', '深圳'],
                    correctAnswer: '0',
                    useAi: false,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: multipleChoiceLevel._id,
                },
                {
                    question: { type: 'text', text: '你好 用中文怎么说？' },
                    type: QuestionType.MULTIPLE_CHOICE,
                    answerOptions: ['你好', '再见', '谢谢', '不客气'],
                    correctAnswer: '0',
                    useAi: false,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: multipleChoiceLevel._id,
                },
                // Fill In Questions
                {
                    question: { type: 'text', text: '我 __ 喜欢吃饺子' },
                    type: QuestionType.FILL_IN,
                    answerOptions: null,
                    correctAnswer: ['很'],
                    useAi: false,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: fillInLevel._id,
                },
                 {
                    question: { type: 'text', text: '他 __ 去了商店' },
                    type: QuestionType.FILL_IN,
                    answerOptions: null,
                    correctAnswer: ['已经'],
                    useAi: false,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: fillInLevel._id,
                },
                // Voice Questions
                {
                    question: { type: 'voice', text: '你好', voice: 'link_to_chinese_voice_1' },
                    type: QuestionType.VOICE,
                    answerOptions: null,
                    correctAnswer: '你好',
                    useAi: true,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: voiceLevel._id,
                },
                {
                    question: { type: 'voice', text: '谢谢', voice: 'link_to_chinese_voice_2' },
                    type: QuestionType.VOICE,
                    answerOptions: null,
                    correctAnswer: '谢谢',
                    useAi: true,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: voiceLevel._id,
                },
            );
        } else if (language.name === 'Indonesian') {
             questions.push(
                // Writing Questions
                {
                    question: { type: 'text', text: 'Tulis esai pendek tentang hari ibu' },
                    type: QuestionType.WRITING,
                    answerOptions: null,
                    correctAnswer: null,
                    useAi: true,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: writingLevel._id,
                },
                {
                    question: { type: 'text', text: 'Jelaskan tentang keluarga kamu' },
                    type: QuestionType.WRITING,
                    answerOptions: null,
                    correctAnswer: null,
                    useAi: true,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: writingLevel._id,
                },
                {
                    question: { type: 'text', text: 'Tulis tentang impian kamu' },
                    type: QuestionType.WRITING,
                    answerOptions: null,
                    correctAnswer: null,
                    useAi: true,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: writingLevel._id,
                },
                // Multiple Choice Questions
                {
                    question: { type: 'text', text: 'Apa ibukota Indonesia?' },
                    type: QuestionType.MULTIPLE_CHOICE,
                    answerOptions: ['Jakarta', 'Surabaya', 'Medan', 'Bandung'],
                    correctAnswer: '0',
                    useAi: false,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: multipleChoiceLevel._id,
                },
                {
                    question: { type: 'text', text: 'Bahasa Inggrisnya "terima kasih" adalah?' },
                    type: QuestionType.MULTIPLE_CHOICE,
                    answerOptions: ['Thank you', 'Sorry', 'Hello', 'Goodbye'],
                    correctAnswer: '0',
                    useAi: false,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: multipleChoiceLevel._id,
                },
                // Fill In Questions
                {
                    question: { type: 'text', text: 'Saya __ pergi ke pasar' },
                    type: QuestionType.FILL_IN,
                    answerOptions: null,
                    correctAnswer: ['akan'],
                    useAi: false,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: fillInLevel._id,
                },
                {
                    question: { type: 'text', text: 'Dia __ seorang guru' },
                    type: QuestionType.FILL_IN,
                    answerOptions: null,
                    correctAnswer: ['adalah'],
                    useAi: false,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: fillInLevel._id,
                },
                // Voice Questions
                {
                    question: { type: 'voice', text: 'Selamat pagi', voice: 'link_to_indonesian_voice_1' },
                    type: QuestionType.VOICE,
                    answerOptions: null,
                    correctAnswer: 'selamat pagi',
                    useAi: true,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: voiceLevel._id,
                },
                {
                    question: { type: 'voice', text: 'Apa kabar?', voice: 'link_to_indonesian_voice_2' },
                    type: QuestionType.VOICE,
                    answerOptions: null,
                    correctAnswer: 'apa kabar?',
                    useAi: true,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: voiceLevel._id,
                },
            );
        } else if (language.name === 'English') {
            questions.push(
                // Multiple Choice
                {
                    question: { type: 'text', text: 'What is the capital of Spain?' },
                    type: QuestionType.MULTIPLE_CHOICE,
                    answerOptions: ['Madrid', 'Barcelona', 'Seville', 'Valencia'],
                    correctAnswer: '0',
                    useAi: false,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: multipleChoiceLevel._id,
                },
                {
                    question: { type: 'text', text: 'Which planet is known as the Red Planet?' },
                    type: QuestionType.MULTIPLE_CHOICE,
                    answerOptions: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
                    correctAnswer: '0',
                    useAi: false,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: multipleChoiceLevel._id,
                },
                 // ESSAY
                {
                    question: { type: 'text', text: 'make an essay about mother\'s day' },
                    type: QuestionType.ESSAY,
                    answerOptions: null,
                    correctAnswer: null,
                    useAi: true,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: essayLevel._id,
                },
                {
                    question: { type: 'text', text: 'Describe the benefits of learning a new language.' },
                    type: QuestionType.ESSAY,
                    answerOptions: null,
                    correctAnswer: null,
                    useAi: true,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: essayLevel._id,
                },
                // FILL_IN
                {
                    question: { type: 'text', text: '__ you like this apple?' },
                    type: QuestionType.FILL_IN,
                    answerOptions: null,
                    correctAnswer: ['do'],
                    useAi: false,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: fillInLevel._id,
                },
                {
                    question: { type: 'text', text: 'I __ going to the store' },
                    type: QuestionType.FILL_IN,
                    answerOptions: null,
                    correctAnswer: ['am'],
                    useAi: false,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: fillInLevel._id,
                },
                // VOICE
                 {
                    question: { type: 'voice', text: 'How are you?', voice: 'link_to_voice_1' },
                    type: QuestionType.VOICE,
                    answerOptions: null,
                    correctAnswer: ['how are you?'],
                    useAi: true,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: voiceLevel._id,
                },
                {
                    question: { type: 'voice', text: 'Good morning', voice: 'link_to_voice_2' },
                    type: QuestionType.VOICE,
                    answerOptions: null,
                    correctAnswer: 'good morning',
                    useAi: true,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: voiceLevel._id,
                },
                // WRITING
                {
                    question: { type: 'text', text: 'Write a short story about a cat' },
                    type: QuestionType.WRITING,
                    answerOptions: null,
                    correctAnswer: null,
                    useAi: true,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: writingLevel._id,
                },
                {
                    question: { type: 'text', text: 'Write a letter to your future self' },
                    type: QuestionType.WRITING,
                    answerOptions: null,
                    correctAnswer: null,
                    useAi: true,
                    courses: [getRandomCourseId(courses.map(c => c._id.toString()))],
                    level: writingLevel._id,
                },
            );
        }

        for (const question of questions) {
            await Question.updateOne(
                { 'question.text': question.question.text, level: question.level, type: question.type },
                question,
                { upsert: true }
            );
        }
    }
    console.log('Questions seeded successfully.');
}

async function clearDatabase(): Promise<void> {
    console.log('Clearing the database...');
    try {
        await Promise.all([
            UserModel.deleteMany({}),
            Language.deleteMany({}),
            Level.deleteMany({}),
            Course.deleteMany({}),
            Forum.deleteMany({}),
            ForumReply.deleteMany({}),
            Feedback.deleteMany({}),
            Question.deleteMany({}),
            Session.deleteMany({}),
            Subscription.deleteMany({}),
            ResetPassword.deleteMany({}),
        ]);
        console.log('Database cleared successfully.');
    } catch (error) {
        console.error('Error clearing database:', error);
        throw error;
    }
}

async function seedFeedback(userIds: string[]): Promise<void> {
    console.log('Seeding feedback...');
    const feedbacks = [
        {
            user: userIds[0],
            type: FeedbackType.FEEDBACK,
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
        await clearDatabase();

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
        await seedQuestions(courseIds, languageIds);
        await seedFeedback(userIds);
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await disconnectFromDatabase();
    }
}

seed().catch(console.error);