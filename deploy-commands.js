/**
 * @fileoverview Command deployment script for Discord bot
 * This script loads and registers slash commands from the commands directory
 * @module deploy-commands
 */

import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

dotenv.config();
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {Array<Object>} Array to store command data */
const commands = [];
/**
 * Path to the commands directory
 * @type {string}
 */
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

/**
 * Recursively loads command files from the commands directory
 * @async
 */
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const commandModule = await import(`file://${filePath}`);
    const command = commandModule.command;
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

/**
 * REST instance for Discord API interaction
 * @type {REST}
 */
const rest = new REST().setToken(token);

/**
 * Deploys commands to Discord
 * @async
 * @function
 * @throws {Error} If deployment fails
 */
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
