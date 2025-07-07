const db = require('../db');

module.exports = {
  data: {
    name: 'xp-remove',
    description: 'Remove XP from a user',
    options: [
      {
        name: 'user',
        type: 6,
        description: 'The user to modify',
        required: true
      },
      {
        name: 'amount',
        type: 4,
        description: 'Amount of XP to remove',
        required: true
      }
    ]
  },
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    
    db.get('SELECT * FROM xp WHERE userId = ?', [user.id], async (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return interaction.reply({ content: '❌ An error occurred while accessing the database.', ephemeral: true });
      }
      
      if (!row) return interaction.reply({ content: "This user doesn't have any XP data.", ephemeral: true });
      
      let newXP = Math.max(0, row.xp - amount);
      let newLevel = 0;
      
      const { getNeededXP } = require('../utils/xpSystem');
      while (newXP >= getNeededXP(newLevel)) {
        newXP -= getNeededXP(newLevel);
        newLevel++;
      }
      
      db.run('UPDATE xp SET xp = ?, level = ? WHERE userId = ?', [newXP, newLevel, user.id]);

      const config = require('../config.json');
      const rolesMap = config.rolesByLevel || {};
      const roleLevels = Object.keys(rolesMap).map(lvl => parseInt(lvl)).sort((a, b) => b - a);
      
      const guild = interaction.guild;
      const member = await guild.members.fetch(user.id).catch(() => null);
      
      if (member) {
        let roleId = null;
        for (const lvl of roleLevels) {
          if (newLevel >= lvl) {
            roleId = rolesMap[lvl.toString()];
            break;
          }
        }

        for (const [level, roleId] of Object.entries(rolesMap)) {
          if (newLevel < parseInt(level) && member.roles.cache.has(roleId)) {
            try {
              await member.roles.remove(roleId);
              console.log(`✅ Removed level ${level} role from ${user.tag}`);
            } catch (e) {
              console.error(`❌ Error removing role from ${user.tag}:`, e.message);
            }
          }
        }

        if (roleId && !member.roles.cache.has(roleId)) {
          try {
            await member.roles.add(roleId);
            console.log(`✅ ${user.tag} received level ${newLevel} role`);
          } catch (e) {
            console.error(`❌ Error giving role to ${user.tag}:`, e.message);
          }
        }
      }

      interaction.reply({ 
        content: `❌ ${amount} XP removed from ${user.tag}. New level: ${newLevel}`, 
        ephemeral: true 
      });
    });
  }
};