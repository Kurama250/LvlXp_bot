const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'help',
    description: 'Shows the list of available commands'
  },
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("📖 Available Commands")
      .setDescription(`
/rank - Shows your level
/leaderboard - Top users ranking
/xp-add - Add XP to a user
/xp-remove - Remove XP from a user
/xp-reset - Reset a user
/xp-reset-all - Reset everything
/stats - Shows member stats
/help - This help
/bot-info - Bot information
      `)
      .setColor("Blue");

    interaction.reply({ embeds: [embed], ephemeral: true });
  }
};