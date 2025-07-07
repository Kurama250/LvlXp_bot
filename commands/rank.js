const db = require('../db');
const { getNeededXP } = require('../utils/xpSystem');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Shows your current level and XP'),
  
  async execute(interaction) {
    const userId = interaction.user.id;

    db.get(`SELECT * FROM xp WHERE userId = ?`, [userId], (err, row) => {
      if (!row) {
        return interaction.reply({
          content: "No XP data found for you.",
          ephemeral: true
        });
      }

      const needed = getNeededXP(row.level);
      const progressPercent = Math.floor((row.xp / needed) * 100);

      const embed = new EmbedBuilder()
        .setColor(0x1E90FF)
        .setTitle(`🏅 ${interaction.user.username}'s Statistics`)
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: "📈 Level", value: `${row.level}`, inline: true },
          { name: "🔋 Current XP", value: `${row.xp} / ${needed} XP`, inline: true },
          { name: "📊 Progress", value: `${progressPercent}%`, inline: true }
        )
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

      interaction.reply({ embeds: [embed] });
    });
  }
};
