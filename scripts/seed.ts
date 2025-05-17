import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import * as schema from '../db/schema';

// Load environment variables
dotenv.config();

// Create a PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

// Helper function to generate random dates within a range
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate random numbers within a range
const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Helper function to pick a random item from an array
const randomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Seed data
const seedDatabase = async () => {
  try {
    console.log('Starting database seed...');

    // Hash a password for the demo user
    const passwordHash = await bcrypt.hash('password123', 10);

    // Create a user
    const userId = uuidv4();
    await db.insert(schema.users).values({
      id: userId,
      email: 'demo@example.com',
      passwordHash,
      name: 'Demo User',
      businessName: 'Freelance Solutions',
      businessAddress: '123 Business St, London, UK',
      taxId: 'GB123456789',
      phoneNumber: '+44 20 1234 5678',
      website: 'www.freelancesolutions.com',
      defaultCurrency: 'GBP',
      defaultTaxRate: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Created demo user');

    // Create clients
    const clients = [
      {
        id: uuidv4(),
        userId,
        name: 'TechStart Ltd',
        contactPerson: 'John Smith',
        email: 'john@techstart.com',
        phoneNumber: '+44 20 8765 4321',
        address: '456 Tech Avenue',
        city: 'London',
        postcode: 'EC1A 1BB',
        country: 'United Kingdom',
        notes: 'Startup in the fintech space',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId,
        name: 'Design Masters',
        contactPerson: 'Emma Johnson',
        email: 'emma@designmasters.com',
        phoneNumber: '+44 20 3456 7890',
        address: '789 Creative Lane',
        city: 'Manchester',
        postcode: 'M1 1AE',
        country: 'United Kingdom',
        notes: 'Design agency, usually pays within 14 days',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        userId,
        name: 'Global Solutions Inc',
        contactPerson: 'Robert Chen',
        email: 'robert@globalsolutions.com',
        phoneNumber: '+44 20 9876 5432',
        address: '101 Corporate Plaza',
        city: 'Birmingham',
        postcode: 'B1 1TF',
        country: 'United Kingdom',
        notes: 'Large corporate client, requires detailed invoices',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.insert(schema.clients).values(clients);
    console.log(`✅ Created ${clients.length} clients`);

    // Create projects
    const projects = [];
    const projectStatuses = ['IN_PROGRESS', 'COMPLETED', 'IN_PROGRESS', 'ON_HOLD'] as const;
    const rateTypes = ['HOURLY', 'FIXED'] as const;
    
    for (const client of clients) {
      // Create 1-3 projects per client
      const numProjects = randomNumber(1, 3);
      
      for (let i = 0; i < numProjects; i++) {
        const startDate = randomDate(new Date(2023, 0, 1), new Date());
        const endDate = randomDate(startDate, new Date(2025, 11, 31));
        const status = randomItem(projectStatuses);
        const rateType = randomItem(rateTypes);
        
        projects.push({
          id: uuidv4(),
          userId,
          clientId: client.id,
          name: `${client.name} Project ${i + 1}`,
          description: `Development work for ${client.name}`,
          startDate,
          endDate: Math.random() > 0.3 ? endDate : null, // Some projects don't have end dates
          status,
          rateType,
          rateAmount: rateType === 'HOURLY' ? randomNumber(50, 150) : randomNumber(1000, 10000),
          currency: 'GBP',
          notes: 'Project notes go here',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    await db.insert(schema.projects).values(projects);
    console.log(`✅ Created ${projects.length} projects`);

    // Create invoices
    const invoices = [];
    const invoiceStatuses = ['DRAFT', 'SENT', 'PAID', 'PARTIALLY_PAID', 'OVERDUE'] as const;
    
    for (const project of projects) {
      // Create 1-5 invoices per project
      const numInvoices = randomNumber(1, 5);
      
      for (let i = 0; i < numInvoices; i++) {
        const issueDate = randomDate(project.startDate || new Date(2023, 0, 1), new Date());
        const dueDate = new Date(issueDate);
        dueDate.setDate(dueDate.getDate() + 30); // 30 days payment terms
        
        const invoiceId = uuidv4();
        const subtotal = randomNumber(500, 5000);
        const taxRate = 20;
        const taxAmount = subtotal * (taxRate / 100);
        const total = subtotal + taxAmount;
        
        invoices.push({
          id: invoiceId,
          userId,
          projectId: project.id,
          invoiceNumber: `INV-${2023 + i}-${randomNumber(100, 999)}`,
          issueDate,
          dueDate,
          status: randomItem(invoiceStatuses),
          subtotal,
          taxRate,
          taxAmount,
          total,
          notes: 'Thank you for your business',
          paymentTerms: 'Net 30',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    await db.insert(schema.invoices).values(invoices);
    console.log(`✅ Created ${invoices.length} invoices`);

    // Create invoice items
    const invoiceItems = [];
    
    for (const invoice of invoices) {
      // Create 1-5 items per invoice
      const numItems = randomNumber(1, 5);
      
      for (let i = 0; i < numItems; i++) {
        const quantity = randomNumber(1, 10);
        const unitPrice = randomNumber(50, 500);
        const amount = quantity * unitPrice;
        
        invoiceItems.push({
          id: uuidv4(),
          invoiceId: invoice.id,
          description: `Service item ${i + 1}`,
          quantity,
          unitPrice,
          amount,
          taxable: true,
        });
      }
    }

    await db.insert(schema.invoiceItems).values(invoiceItems);
    console.log(`✅ Created ${invoiceItems.length} invoice items`);

    // Create payments for some of the invoices
    const payments = [];
    const paymentMethods = ['Bank Transfer', 'Credit Card', 'PayPal', 'Cheque'];
    
    for (const invoice of invoices) {
      // Only create payments for PAID or PARTIALLY_PAID invoices
      if (invoice.status === 'PAID' || invoice.status === 'PARTIALLY_PAID') {
        const paymentAmount = invoice.status === 'PAID' 
          ? invoice.total 
          : invoice.total * randomNumber(10, 90) / 100; // Pay 10-90% for partially paid
        
        payments.push({
          id: uuidv4(),
          invoiceId: invoice.id,
          amount: paymentAmount,
          paymentDate: randomDate(invoice.issueDate, new Date()),
          paymentMethod: randomItem(paymentMethods),
          reference: `REF-${randomNumber(10000, 99999)}`,
          notes: 'Payment received with thanks',
          createdAt: new Date(),
        });
      }
    }

    await db.insert(schema.payments).values(payments);
    console.log(`✅ Created ${payments.length} payments`);

    // Create expenses
    const expenses = [];
    const expenseCategories = ['Software', 'Hardware', 'Office Supplies', 'Travel', 'Meals', 'Subscription', 'Advertising'];
    
    for (const project of projects) {
      // Create 0-5 expenses per project
      const numExpenses = randomNumber(0, 5);
      
      for (let i = 0; i < numExpenses; i++) {
        expenses.push({
          id: uuidv4(),
          userId,
          projectId: project.id,
          date: randomDate(project.startDate || new Date(2023, 0, 1), new Date()),
          category: randomItem(expenseCategories),
          amount: randomNumber(10, 500),
          currency: 'GBP',
          description: `Expense for ${project.name}`,
          receiptUrl: null, // In a real app, this would be a file URL
          billable: Math.random() > 0.3, // 70% chance of being billable
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // Also create some general expenses not tied to projects
    for (let i = 0; i < 10; i++) {
      expenses.push({
        id: uuidv4(),
        userId,
        projectId: null,
        date: randomDate(new Date(2023, 0, 1), new Date()),
        category: randomItem(expenseCategories),
        amount: randomNumber(10, 500),
        currency: 'GBP',
        description: 'General business expense',
        receiptUrl: null,
        billable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await db.insert(schema.expenses).values(expenses);
    console.log(`✅ Created ${expenses.length} expenses`);

    // Create time entries for hourly projects
    const timeEntries = [];
    
    for (const project of projects) {
      // Only create time entries for hourly projects
      if (project.rateType === 'HOURLY') {
        // Create 5-20 time entries per project
        const numEntries = randomNumber(5, 20);
        
        for (let i = 0; i < numEntries; i++) {
          const startTime = randomDate(project.startDate || new Date(2023, 0, 1), new Date());
          const durationMinutes = randomNumber(30, 480); // 30 mins to 8 hours
          const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
          
          timeEntries.push({
            id: uuidv4(),
            projectId: project.id,
            description: `Work on ${project.name}`,
            startTime,
            endTime,
            duration: durationMinutes,
            billable: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }

    await db.insert(schema.timeEntries).values(timeEntries);
    console.log(`✅ Created ${timeEntries.length} time entries`);

    console.log('✅ Database seeding completed successfully!');
    
    // Close the database connection
    await pool.end();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.error(error);
    await pool.end();
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
