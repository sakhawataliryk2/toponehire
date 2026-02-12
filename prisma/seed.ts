import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@toponehire.com',
      password: hashedPassword,
    },
  });

  console.log('Admin user created:', admin);

  // Default Job Seeker product (free, assigned on registration)
  let freeResume = await prisma.product.findFirst({
    where: { type: 'JOB_SEEKER', name: 'Free Resume Posting' },
  });
  if (!freeResume) {
    freeResume = await prisma.product.create({
      data: {
        type: 'JOB_SEEKER',
        name: 'Free Resume Posting',
        description: 'Assigned to job seeker upon registration.',
        price: 0,
        billingInterval: 'MONTHLY',
        firstMonthFree: false,
        postResumes: true,
        jobAccess: true,
        assignedOnRegistration: true,
        active: true,
      },
    });
    console.log('Job Seeker product created:', freeResume.name);
  }

  // Default payment methods
  const defaultPaymentMethods = ['Stripe', 'PayPal', 'Invoice'];
  for (const name of defaultPaymentMethods) {
    const existing = await prisma.paymentMethod.findFirst({ where: { name } });
    if (!existing) {
      await prisma.paymentMethod.create({
        data: { name, isActive: name === 'Stripe' },
      });
      console.log('Payment method created:', name);
    }
  }

  // Default categories
  const defaultCategories = [
    'Accounting', 'Admin-Clerical', 'Automotive', 'Banking', 'Biotech',
    'Business Development', 'Caregiving', 'Construction', 'Consultant',
    'Customer Service', 'Design', 'Education', 'Electronics', 'Engineering',
    'Executive', 'Finance', 'Healthcare', 'Hospitality', 'Human Resources',
    'Information Technology', 'Insurance', 'Legal', 'Management', 'Marketing',
    'Nurse', 'Operations', 'Sales', 'Science', 'Transportation',
  ];

  for (const catName of defaultCategories) {
    const existing = await prisma.category.findFirst({ where: { name: catName } });
    if (!existing) {
      await prisma.category.create({
        data: {
          name: catName,
          slug: catName.toLowerCase().replace(/\s+/g, '-'),
          caption: 'Categories',
          required: true,
          displayAs: 'MultiList',
          maxChoices: 0,
        },
      });
    }
  }
  console.log('Categories seeded');

  // Default job types
  const defaultJobTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Freelance'];
  for (const jtName of defaultJobTypes) {
    const existing = await prisma.jobType.findFirst({ where: { name: jtName } });
    if (!existing) {
      await prisma.jobType.create({
        data: {
          name: jtName,
          slug: jtName.toLowerCase().replace(/\s+/g, '-'),
          caption: 'Job Type',
          required: true,
          displayAs: 'Dropdown',
          maxChoices: 1,
        },
      });
    }
  }
  console.log('Job types seeded');

  // Default custom fields for Job Seeker registration
  const jobSeekerFields = [
    { caption: 'Email', type: 'EMAIL', required: true, order: 1, placeholder: 'your@email.com' },
    { caption: 'Password', type: 'PASSWORD', required: true, order: 2, placeholder: '••••••••' },
    { caption: 'First Name', type: 'TEXT_FIELD', required: true, order: 3, placeholder: 'Your first name' },
    { caption: 'Last Name', type: 'TEXT_FIELD', required: true, order: 4, placeholder: 'Your last name' },
    { caption: 'Phone', type: 'TEXT_FIELD', required: true, order: 5, placeholder: '(123) 456-7890' },
    { caption: 'Location', type: 'LOCATION', required: true, order: 6, placeholder: 'City, State' },
  ];

  for (const field of jobSeekerFields) {
    const existing = await prisma.customField.findFirst({
      where: {
        context: 'JOB_SEEKER',
        caption: field.caption,
      },
    });
    if (!existing) {
      await prisma.customField.create({
        data: {
          ...field,
          context: 'JOB_SEEKER',
          hidden: false,
        },
      });
    }
  }
  console.log('Job Seeker custom fields seeded');

  // Default custom fields for Employer registration
  const employerFields = [
    { caption: 'Email', type: 'EMAIL', required: true, order: 1, placeholder: 'your@email.com' },
    { caption: 'Full Name', type: 'TEXT_FIELD', required: true, order: 2, placeholder: 'Your full name' },
    { caption: 'Phone', type: 'TEXT_FIELD', required: true, order: 3, placeholder: '(123) 456-7890' },
    { caption: 'Location', type: 'LOCATION', required: true, order: 4, placeholder: 'City, State' },
    { caption: 'Password', type: 'PASSWORD', required: true, order: 5, placeholder: '••••••••' },
    { caption: 'Company Name', type: 'TEXT_FIELD', required: true, order: 6, placeholder: 'Your company name' },
    { caption: 'Website', type: 'TEXT_FIELD', required: true, order: 7, placeholder: 'https://www.example.com' },
    { caption: 'Logo', type: 'PICTURE', required: true, order: 8 },
    { caption: 'Company Description', type: 'TEXT_AREA', required: true, order: 9 },
  ];

  for (const field of employerFields) {
    const existing = await prisma.customField.findFirst({
      where: {
        context: 'EMPLOYER',
        caption: field.caption,
      },
    });
    if (!existing) {
      await prisma.customField.create({
        data: {
          ...field,
          context: 'EMPLOYER',
          hidden: false,
        },
      });
    }
  }
  console.log('Employer custom fields seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
