const db = require('../db');

module.exports = {
  data: {
    name: 'xp-reset-all',
    description: 'Reset all users\' XP'
  },
  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: "Permission denied.", ephemeral: true });
    }
    
    db.run('DELETE FROM xp', async () => {
      const config = require('../config.json');
      const rolesMap = config.rolesByLevel || {};
      
      const guild = interaction.guild;
      const members = await guild.members.fetch();
      
      for (const [memberId, member] of members) {
        for (const [level, roleId] of Object.entries(rolesMap)) {
          if (member.roles.cache.has(roleId)) {
            try {
              await member.roles.remove(roleId);
              console.log(`✅ Removed level ${level} role from ${member.user.tag}`);
            } catch (e) {
              console.error(`❌ Error removing role from ${member.user.tag}:`, e.message);
            }
          }
        }
      }
      
      interaction.reply({ content: "🚨 All XP has been reset.", ephemeral: true });
    });
  }
};