/**
 * @fileoverview Main bot initialization file that sets up the Discord client,
 * database connection, and loads commands and events.
 * @module index
 */

import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { initializeDatabase } from "./config/database.js";
import { loadCommands } from "./handlers/commandHandler.js";
import { loadEvents } from "./handlers/eventHandler.js";

dotenv.config();

const client = new Client({
  intents: GatewayIntentBits.Guilds,
  allowedMentions: { parse: ["users", "roles"] },
});

/**
 * Initializes the bot by setting up the database connection,
 * loading commands and events, and logging in to Discord.
 * @async
 * @throws {Error} If initialization fails
 * @returns {Promise<void>}
 */
async function initialize() {
  try {
    await initializeDatabase();
    await loadCommands(client);
    await loadEvents(client);
    await client.login(process.env.TOKEN);
  } catch (error) {
    console.error("Failed to initialize the bot:", error);
    process.exit(1);
  }
}

initialize();

// Handle process errors
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});
