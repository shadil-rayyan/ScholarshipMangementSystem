// src\db\queries\insert.ts
// import { ContactDetail_Table } from '../schema/contactus';
// import { db } from '../index';
// import { InsertContactDetail } from '../schema/contactus';

// // Use the actual table object
// export async function createUser(data: InsertContactDetail) {
//   await db.insert(ContactDetail_Table).values(data);
// }


import { db } from '../index';

import { Scholarship_Table,InsertScholarship } from '../schema/scholarship/scholarshipData';




export async function scholarship(data: InsertScholarship) {
  try {
    await db.insert(Scholarship_Table).values(data);
    console.log('Contact detail inserted successfully.');
  } catch (error) {
    console.error('Error inserting contact detail:', error);
    throw new Error('Failed to insert contact detail');
  }
}


