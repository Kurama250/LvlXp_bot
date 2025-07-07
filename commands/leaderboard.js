const db = require('../db');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'leaderboard',
    description: 'Top users ranking'
  },
  async execute(interaction) {
    db.all(`SELECT * FROM xp ORDER BY level DESC, xp DESC LIMIT 10`, [], (err, rows) => {
      if (!rows || rows.length === 0)
        return interaction.reply({ content: "No leaderboard yet.", ephemeral: true });

      const leaderboard = rows.map((row, i) => {
        return `**${i + 1}.** <@${row.userId}> — Level ${row.level} (${row.xp} XP)`;
      }).join("\n");

      const embed = new EmbedBuilder()
        .setTitle("🏆 Leaderboard")
        .setDescription(leaderboard)
        .setColor(0xFFD700);

      interaction.reply({ embeds: [embed] });
    });
  }
};