const { EmbedBuilder } = require('discord.js');

function getNeededXP(level) {
  return 5 * (level ** 2) + 50 * level + 100;
}

function addXP(db, userId, amount, client = null, guildId = null, message = null) {
  db.get(`SELECT * FROM xp WHERE userId = ?`, [userId], async (err, row) => {
    if (err) return console.error(err);

    if (!row) {
      db.run(`INSERT INTO xp(userId, xp, level) VALUES (?, ?, ?)`, [userId, amount, 0]);
      return;
    }

    let currentXP = row.xp + amount;
    let level = row.level;
    let leveledUp = false;
    let oldLevel = level;

    while (currentXP >= getNeededXP(level)) {
      currentXP -= getNeededXP(level);
      level++;
      leveledUp = true;
    }

    db.run(`UPDATE xp SET xp = ?, level = ? WHERE userId = ?`, [currentXP, level, userId]);

    if (client && guildId && level > oldLevel) {
      const config = require('../config.json');
      const rolesMap = config.rolesByLevel || {};
      const roleLevels = Object.keys(rolesMap).map(lvl => parseInt(lvl)).sort((a, b) => b - a);
      
      const guild = client.guilds.cache.get(guildId);
      const member = await guild?.members?.fetch(userId).catch(() => null);

      if (guild && member) {
        let roleId = null;
        for (const lvl of roleLevels) {
          if (level >= lvl) {
            roleId = rolesMap[lvl.toString()];
            break;
          }
        }

        if (roleId && !member.roles.cache.has(roleId)) {
          try {
            await member.roles.add(roleId);
            console.log(`✅ ${member.user.tag} received level ${level} role`);
            
            if (message && message.channel) {
              const embed = new EmbedBuilder()
                .setTitle('🎉 Level Up!')
                .setDescription(`Congratulations <@${userId}>! You reached level **${level}**!`)
                .setColor(0x00ff00)
                .setTimestamp();
              
              message.channel.send({ embeds: [embed] }).catch(console.error);
            }
          } catch (e) {
            console.error(`❌ Error giving role to ${member.user.tag}:`, e.message);
          }
        }
      }
    }
  });
}

module.exports = { addXP, getNeededXP };