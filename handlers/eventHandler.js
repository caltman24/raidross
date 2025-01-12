/**
 * @fileoverview Handles the loading and registration of event handlers
 * @module handlers/eventHandler
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Loads and registers all event handlers from the events directory
 * @async
 * @param {import('discord.js').Client} client - The Discord.js client instance
 * @throws {Error} If event loading fails
 * @returns {Promise<void>}
 */
export async function loadEvents(client) {
  const eventsPath = path.join(__dirname, "..", "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    try {
      const eventModule = await import(`file://${filePath}`);
      const event = eventModule.event;
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    } catch (error) {
      console.error(`Error loading event ${file}:`, error);
    }
  }
  console.log("Events loaded successfully.");
}
