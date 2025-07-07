const db = require('../db');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription("View a member's statistics")
    .addUserOption(option =>
      option.setName('user')
        .setDescription("Target user")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;

    db.get('SELECT * FROM xp WHERE userId = ?', [user.id], (err, row) => {
      if (!row) {
        return interaction.reply({ content: "No data found.", ephemeral: true });
      }

      const hours = Math.floor((row.voiceTime || 0) / 3600);
      const minutes = Math.floor(((row.voiceTime || 0) % 3600) / 60);

      const embed = new EmbedBuilder()
        .setTitle(`📊 ${user.username}'s Statistics`)
        .setThumbnail(user.displayAvatarURL())
        .setColor(0xf59e42)
        .addFields(
          { name: "🎮 Level", value: `${row.level}`, inline: true },
          { name: "⚡ XP", value: `${row.xp}`, inline: true },
          { name: "💬 Messages", value: `${row.messages || 0}`, inline: true },
          { name: "🔊 Voice Time", value: `${hours}h ${minutes}m`, inline: true }
        )
        .setFooter({ text: `Requested by ${interaction.user.tag}` })
        .setTimestamp();

      interaction.reply({ embeds: [embed] });
    });
  }
};
