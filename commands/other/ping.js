const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    aliases: [],
    description: 'Show the bot speed',
    usage: '<prefix>ping',
    category: 'other',
    permissions: [],
    botPermissions: ['EMBED_LINKS'],
    guildOnly: true,
    ownerOnly: false,
    cooldown: 3,
    execute(client, message, args) {
        message.channel.send("🏓 Pong! `"+client.ws.ping+"`");
    }
}
