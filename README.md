<h1 align="center">LvlXp_bot</h1>
<em><h5 align="center">(Programming Language - Node.js | Shell)</h5></em>

<p align="center">
  <img src="https://img.shields.io/github/stars/Kurama250/LvlXp_bot">
  <img src="https://img.shields.io/github/license/Kurama250/LvlXp_bot">
  <img src="https://img.shields.io/github/repo-size/Kurama250/LvlXp_bot">
  <img src="https://img.shields.io/badge/stability-stable-green">
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/module-name">
  <img src="https://img.shields.io/npm/v/discord.js?label=discord.js">
  <img src="https://img.shields.io/npm/v/@discordjs/rest?label=@discordjs/rest">
  <img src="https://img.shields.io/npm/v/discord-api-types?label=discord-api-types">
  <img src="https://img.shields.io/npm/v/sqlite3?label=sqlite3">
  <img src="https://img.shields.io/npm/v/os?label=os">
</p>

# Tutorial to install the bot ! For LINUX (VPS or Dedicated Server)

## 1 - on Terminal

<h5>A) Auto installer</h5>

- Run command :

```shell script
bash <(curl -s https://raw.githubusercontent.com/LvlXp_bot/main/setup.sh)
```
<h5>B) Manual installer</h5>

```shell script
apt update && apt upgrade -y
apt install npm nodejs git -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - &&\
apt-get install -y nodejs
```

```shell script
git clone https://github.com/Kurama250/LvlXp_bot.git
cd LvlXp_bot/
npm i && npm i pm2 -g
```
## 2 - on Terminal

```shell script
nano config.json
```

- And you also change this line :

```json
{
  "token": "YOUR_TOKEN",
  "clientId": "CLIENT_ID",
  "guildId": "GUILD_ID",
  "rolesByLevel": {
    "25": "ROLE_ID_01",
    "50": "ROLE_ID_02",
    "YOUR_CHOICE_LEVEL01": "ROLE_ID_03",
    "YOUR_CHOICE_LEVEL02": "ROLE_ID_04",
    "YOUR_CHOICE_LEVEL03": "ROLE_ID_05",
    "YOUR_CHOICE_LEVEL04": "ROLE_ID_06",
    "YOUR_CHOICE_LEVEL05": "ROLE_ID_07",
    "YOUR_CHOICE_LEVEL06": "ROLE_ID_08",
    "YOUR_CHOICE_LEVEL07": "ROLE_ID_09"
  },
  "updateInterval": 60000
}
```

- After doing this, press CTRL + X and you press Y and ENTER then you do the following commands !

## 3 - on Terminal

```shell script
pm2 start index.js -n LvlXp_bot --time
```

<h3 align="center"><strong>Support on Discord :</strong> <a href="https://discord.gg/6aebQGdDxB">Discord Link</a> - Create a Ticket with bot for help</3>
<h3 align="center">If you like this repository don't hesitate to give it a star ⭐ !</h3>
<h1 align="center">Then it's the end you have started the bot have fun !</h1>
