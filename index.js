const fs = require('fs');
const { 
    Client, 
    GatewayIntentBits, 
    ChannelType, 
    PermissionFlagsBits, 
    Collection 
} = require('discord.js');
const config = require('./config.json');
const db = require('./db');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

const CHANNELS_FILE = './channels.json';
let savedChannels = {};
if (fs.existsSync(CHANNELS_FILE)) {
    savedChannels = JSON.parse(fs.readFileSync(CHANNELS_FILE, 'utf8'));
}

const channelsToUpdate = [
    { name: '🌐 Members', key: 'members', id: savedChannels.members || null },
    { name: '🔊 In voice', key: 'voiceMembers', id: savedChannels.voiceMembers || null },
    { name: '🌴 Bots', key: 'bots', id: savedChannels.bots || null },
];

async function createOrUpdateChannels() {
    const guild = client.guilds.cache.first();
    if (!guild) return;

    const members = await guild.members.fetch();
    const voiceMembers = members.filter(m => m.voice.channel);
    const bots = members.filter(m => m.user.bot);

    let updated = false;

    for (const channelData of channelsToUpdate) {
        const statKey = channelData.key;
        const newStat = statKey === 'members' ? members.size :
                        statKey === 'voiceMembers' ? voiceMembers.size :
                        bots.size;

        if (channelData.id === null || !guild.channels.cache.has(channelData.id)) {
            const newChannel = await guild.channels.create({
                name: channelData.name,
                type: ChannelType.GuildVoice,
                permissionOverwrites: [{
                    id: guild.roles.everyone,
                    deny: [PermissionFlagsBits.Connect],
                    allow: [PermissionFlagsBits.ViewChannel]
                }]
            });
            channelData.id = newChannel.id;
            savedChannels[statKey] = newChannel.id;
            updated = true;
        } else {
            const existingChannel = guild.channels.cache.get(channelData.id);
            const newName = newStat === 0 ? channelData.name : `${channelData.name} - ${newStat}`;
            if (existingChannel && existingChannel.name !== newName) {
                await existingChannel.setName(newName).catch(console.error);
            }
        }
    }

    if (updated) {
        fs.writeFileSync(CHANNELS_FILE, JSON.stringify(savedChannels, null, 4));
    }
}

async function assignLevelRoles(client) {
    console.log('🔍 Checking level roles...');

    const guild = client.guilds.cache.first();
    if (!guild) return;

    const rolesMap = config.rolesByLevel || {};
    const members = await guild.members.fetch();

    const roleLevels = Object.keys(rolesMap).map(lvl => parseInt(lvl)).sort((a, b) => b - a);

    db.all('SELECT userId, level FROM xp', async (err, rows) => {
        if (err) return console.error('❌ DB Error (auto roles):', err);

        for (const row of rows) {
            const member = members.get(row.userId);
            if (!member) continue;

            let roleId = null;
            for (const lvl of roleLevels) {
                if (row.level >= lvl) {
                    roleId = rolesMap[lvl.toString()];
                    break;
                }
            }

            console.log(`[DEBUG] ${row.userId} (level ${row.level}) -> role ID ${roleId}`);

            if (!roleId) continue;

            if (!member.roles.cache.has(roleId)) {
                try {
                    await member.roles.add(roleId);
                    console.log(`✅ ${member.user.tag} received level ${row.level} role`);
                } catch (e) {
                    console.error(`❌ Error giving role to ${member.user.tag}:`, e.message);
                }
            }
        }
    });
}

client.on('ready', () => {
    console.log(`Bot started as ${client.user.tag}!`);

    client.user.setPresence({
        activities: [{ name: '.gg/Suzuya', type: 5 }],
        status: 'dnd'
    });

    createOrUpdateChannels();
    setInterval(createOrUpdateChannels, config.updateInterval || 60000);

    assignLevelRoles(client);
    setInterval(() => assignLevelRoles(client), 86400000);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: '❌ An error occurred.', ephemeral: true });
        } else {
            await interaction.reply({ content: '❌ An error occurred.', ephemeral: true });
        }
    }
});

client.login(config.token);