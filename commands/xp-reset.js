const db = require('../db');

module.exports = {
  data: {
    name: 'xp-reset',
    description: 'Reset a user\'s XP',
    options: [
      {
        name: 'user',
        type: 6,
        description: 'The user to reset',
        required: true
      }
    ]
  },
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    
    db.run('UPDATE xp SET xp = 0, level = 0 WHERE userId = ?', [user.id], async () => {
      const config = require('../config.json');
      const rolesMap = config.rolesByLevel || {};
      
      const guild = interaction.guild;
      const member = await guild.members.fetch(user.id).catch(() => null);
      
      if (member) {
        for (const [level, roleId] of Object.entries(rolesMap)) {
          if (member.roles.cache.has(roleId)) {
            try {
              await member.roles.remove(roleId);
              console.log(`✅ Removed level ${level} role from ${user.tag}`);
            } catch (e) {
              console.error(`❌ Error removing role from ${user.tag}:`, e.message);
            }
          }
        }
      }
      
      interaction.reply({ content: `🔄 ${user.tag}'s XP has been reset.`, ephemeral: true });
    });
  }
};