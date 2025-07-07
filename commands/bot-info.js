const { SlashCommandBuilder, EmbedBuilder, version: djsVersion, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const os = require('os');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bot-info')
    .setDescription('Shows bot information'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🤖 Bot Information')
      .setColor(0x5865F2)
      .addFields(
        { name: '👤 Creator', value: '<@734395762460459101>', inline: true },
        { name: '🖥️ System', value: `${os.type()} ${os.arch()}`, inline: true },
        { name: '📦 discord.js', value: `v${djsVersion}`, inline: true }
      )
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp();

    const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('GitHub')
          .setStyle(ButtonStyle.Link)
          .setURL('https://github.com/Kurama250')
          .setEmoji('📂')
      );

    await interaction.reply({ embeds: [embed], components: [button] });
  }
};
