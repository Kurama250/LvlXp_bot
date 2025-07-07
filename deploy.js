const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if ('data' in command) {
    commands.push(command.data);
  } else {
    console.warn(`[WARNING] Command ${file} doesn't contain a valid "data" property.`);
  }
}

const rest = new REST().setToken(config.token);

(async () => {
  try {
    console.log('🔁 Removing old commands...');

    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: [] }
    );

    console.log('✅ Old commands removed.');

    console.log('🚀 Deploying new commands...');

    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands }
    );

    console.log('✅ Commands deployed successfully!');
  } catch (error) {
    console.error('❌ Error during deployment:', error);
  }
})();
