module.exports = {
  name: 'message',
  execute(message, client) {
    const prefix = client.config.prefix;
    const owner = client.config.owner;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(' ');
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    //Owner only commands checker
    if (command.ownerOnly && !owner.includes(message.author.id)) return;
    //Guild only commands check
    if (command.guildOnly && message.channel.type === 'dm') return;
    //Permissions checker
    //Check bot perms
    if (message.channel.type !== 'dm' && command.botPermissions) {
        const botPerms = message.channel.permissionsFor(client.user);
        if (!botPerms || !botPerms.has(command.botPermissions)) {
            return message.channel.send('I need `' + command.botPermissions + '` permission to run this command');
        }
    }
    //Check author perms
    if (message.channel.type !== 'dm' && command.permissions) {
        const authorPerms = message.channel.permissionsFor(message.author);
	if (!authorPerms || !authorPerms.has(command.permissions)) {
	    return message.channel.send('You need `' + command.permissions + '` permission to run this command');
        }
    }
    //Cooldowns
    const { cooldowns } = client;
	if (!cooldowns.has(command.name)) {
	    cooldowns.set(command.name, new Discord.Collection());
	}
        const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 1) * 1000;
	if (timestamps.has(message.author.id)) {
	    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
	    if (now < expirationTime) {
	        const timeLeft = (expirationTime - now) / 1000;
		return message.channel.send('**Cooldown!** Try again in ' + Math.floor(timeLeft) + ' second(s)');
	    }
        }
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    //Executing Commands
    try {
	command.execute(client, message, args);
    } catch (err) {
        console.log(err);
    }
  }
}
