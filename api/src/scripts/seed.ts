import 'reflect-metadata';
import 'dotenv/config';
import { AppDataSource } from '../database/db';
import { Student } from '../database/entities/Student';
import { SchoolClass } from '../database/entities/SchoolClass';

const studentNames = [
  'Alice Anderson',
  'Bob Barker',
  'Charlie Chapman',
  'Diana Prince',
  'Ethan Hunt',
  'Fiona Gallagher',
  'George Miller',
  'Hannah Abbott',
  'Ian Malcolm',
  'Julia Child',
];

async function seed() {
  try {
    // Initialize the DB connection
    await AppDataSource.initialize();
    console.log('📦 Database connected successfully.');

    const classRepo = AppDataSource.getRepository(SchoolClass);
    const studentRepo = AppDataSource.getRepository(Student);

    // 1. Insert Classes
    console.log('Inserting classes...');
    const class1 = classRepo.create({ name: 'Physics' });
    const class2 = classRepo.create({ name: 'Mathematics' });
    
    await classRepo.save([class1, class2]);
    console.log('✅ Classes "Physics" and "Mathematics" inserted.');

    // 2. Insert Students
    console.log('Inserting students...');
    const students: Student[] = [];
    
    const baseEmail = process.env.TEST_EMAIL_ADDRESS || 'test@gmail.com';
    const emailParts = baseEmail.split('@');
    const emailPrefix = emailParts[0] || 'test';
    const emailDomain = emailParts[1] || 'gmail.com';

    for (let i = 1; i <= 10; i++) {
      const student = studentRepo.create({
        name: studentNames[i - 1],
        email: `${emailPrefix}+student${i}@${emailDomain}`,
        parent_email: `${emailPrefix}+parent${i}@${emailDomain}`,
        roll_number: i,
      });
      students.push(student);
    }
    
    await studentRepo.save(students);
    console.log('✅ 10 Students inserted.');

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Execute the seed function
seed();
