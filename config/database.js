/**
 * @fileoverview Database configuration and initialization
 * @module config/database
 */

import { Sequelize } from "sequelize";

/**
 * Sequelize instance for database operations
 * @type {import('sequelize').Sequelize}
 */
export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
  logging: false, // Disable logging by default
});

/**
 * Initializes and tests the database connection
 * @async
 * @throws {Error} If database connection fails
 * @returns {Promise<void>}
 */
export async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
