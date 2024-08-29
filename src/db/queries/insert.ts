// src\db\queries\insert.ts
// import { ContactDetail_Table } from '../schema/contactus';
// import { db } from '../index';
// import { InsertContactDetail } from '../schema/contactus';

// // Use the actual table object
// export async function createUser(data: InsertContactDetail) {
//   await db.insert(ContactDetail_Table).values(data);
// }


import { db } from '../index';
import { ContactDetail_Table, InsertContactDetail } from '../schema/contactus';
import { UpcomingEvents_Table, InsertUpcomingEvents } from '../schema/home/upcomingevent';
import { products, InsertProduct } from '../schema/product/product';
import { Scholarship_Table,InsertScholarship } from '../schema/scholarship/scholarshipData';


// Function to insert a new contact detail into the database
export async function createContactDetail(data: InsertContactDetail) {
  try {
    await db.insert(ContactDetail_Table).values(data);
    console.log('Contact detail inserted successfully.');
  } catch (error) {
    console.error('Error inserting contact detail:', error);
    throw new Error('Failed to insert contact detail');
  }
}

// Function to insert a new upcoming event into the database
export async function createUpcomingEvent(data: InsertUpcomingEvents) {
  try {
    await db.insert(UpcomingEvents_Table).values(data);
    console.log('Upcoming event inserted successfully.');
  } catch (error) {
    console.error('Error inserting upcoming event:', error);
    throw new Error('Failed to insert upcoming event');
  }
}

export async function productDetail(data: InsertProduct) {
  try {
    await db.insert(products).values(data);
    console.log('Contact detail inserted successfully.');
  } catch (error) {
    console.error('Error inserting contact detail:', error);
    throw new Error('Failed to insert contact detail');
  }
}

export async function scholarship(data: InsertScholarship) {
  try {
    await db.insert(Scholarship_Table).values(data);
    console.log('Contact detail inserted successfully.');
  } catch (error) {
    console.error('Error inserting contact detail:', error);
    throw new Error('Failed to insert contact detail');
  }
}


