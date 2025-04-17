import bcrypt from 'bcryptjs';
import { User } from './models';
import sequelize from './core/db';

export async function seedDatabase() {
    try {
        console.log('Starting database seeding...');

        const adminExists = await User.findOne({
            where: { email: 'admin@example.com' }
        });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('adminpassword', 10);

            // Create admin user
            await User.create({
                username: 'Admin User',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin'
            });

            console.log('Admin user created');
        } else {
            console.log('Admin user already exists, skipping creation');
        }

        const testUserEmails = ['user1@example.com', 'user2@example.com'];

        for (const email of testUserEmails) {
            const userExists = await User.findOne({ where: { email } });

            if (!userExists) {
                const hashedPassword = await bcrypt.hash('password123', 10);

                await User.create({
                    username: `Test ${email.split('@')[0]}`,
                    email,
                    password: hashedPassword,
                    role: 'user'
                });

                console.log(`Test user ${email} created`);
            }
        }

        console.log('Database seeding completed successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
}

export async function runSeeder() {
    try {
        await sequelize.authenticate();

        await seedDatabase();

        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Seeding failed:', error);
        throw error;
    }
}