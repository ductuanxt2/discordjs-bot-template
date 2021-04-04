//Variables
const fs = require("fs");
const Discord = require("discord.js");
const config = require("./config.js")

//Bot
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.config = config;

//Command Handler
const folder = fs.readdirSync('./commands/');
for (const subfolders of folder) {
	const subfolder = fs
		.readdirSync(`./commands/${subfolders}/`)
		.filter(file => file.endsWith('.js'));
	for (const commands of subfolder) {
		const command = require(`./commands/${subfolders}/${commands}`);
		client.commands.set(command.name, command);
	}
}
//Event Handler
const eventFolder = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const events of eventFolder) {
	const event = require(`./events/${events}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

//Login to bot, make it go online
client.login(config.token)
