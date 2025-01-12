/**
 * @fileoverview Handles the loading and registration of bot commands
 * @module handlers/commandHandler
 */

import fs from "node:fs";
import path from "node:path";
import { Collection } from "discord.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Loads and registers all command modules from the commands directory
 * @async
 * @param {import('discord.js').Client} client - The Discord.js client instance
 * @throws {Error} If command loading fails
 * @returns {Promise<void>}
 */
export async function loadCommands(client) {
  client.commands = new Collection();
  const foldersPath = path.join(__dirname, "..", "commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(commandPath, file);
      try {
        const commandModule = await import(`file://${filePath}`);
        const command = commandModule.command;

        if ("data" in command && "execute" in command) {
          client.commands.set(command.data.name, command);
        } else {
          console.warn(
            `[WARNING] The command at ${filePath} is missing required properties.`
          );
        }
      } catch (error) {
        console.error(`Error loading command ${file}:`, error);
      }
    }
    console.log("Commands loaded successfully.");
  }
}
