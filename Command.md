Command Reference

This document provides an overview of the key commands used in the Scholarship Management System project. These commands help manage the application during development, building, database management, and deployment.

NPM Commands

1. Running the Development Server

npm run dev

This command starts the development server on http://localhost:3000. It enables live reloading as you make changes, making it ideal for development purposes.

2. Building the Application

npm run build

This command builds the project for production by compiling and optimizing the Next.js application. It generates an optimized version of your project that can be deployed to production environments.

3. Running the Production Server

npm start

After running the npm run build command, this command can be used to start the production server, which serves the built version of your application.

---

Drizzle ORM Commands

Drizzle ORM helps manage PostgreSQL database interactions and migrations. The following commands are useful for managing the database schema.

1. Generating Migrations

npm run drizzle:generate

This command generates a new migration file based on changes made to your Drizzle ORM schema. It helps you track database schema changes in a version-controlled manner.

2. Running Migrations

npm run drizzle:migrate

After generating a migration file, this command applies the pending migrations to your PostgreSQL database. It updates the database schema to match the latest application structure.

3. Reverting Migrations (Dropping)

npm run drizzle:drop

This command drops the database schema. Use this with caution, as it removes all tables and data from the current database. It is usually used for resetting the database during development.

---

Summary of Commands

npm run dev: Start the development server.

npm run build: Build the project for production.

npm start: Run the production server.

npx run drizzle-generate: Generate database migrations based on schema changes.

npx run drizzle-kit migrate: Apply database migrations to the PostgreSQL database.

npx run drizzle-kit drop: Drop the database schema.

These are the most commonly used commands in this project. Make sure to use them according to the task you're performing, whether it's for development, building, or managing the database schema.
