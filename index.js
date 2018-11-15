const fs = require('fs');
const Discord = require('discord.js');
const { prefix, nicknameprefix, token} = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {

  if ((!message.content.startsWith(prefix) && !message.content.startsWith(nicknameprefix))  || message.author.bot) return;

  const args = message.content.slice(message.content.startsWith(prefix) ? prefix.length+1 : nicknameprefix.length+1).split(/ +/);
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  try {
      client.commands.get(command).execute(message, args);
  }
  catch (error) {
      console.error(error);
      message.reply('shut up');
  }

});

client.login(token);
