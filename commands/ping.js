const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Returns the bot and API latency.'),
    
    async execute(interaction, client) {
        const sent = await interaction.deferReply({ fetchReply: true });

        const apiLatency = client.ws.ping;
        const botLatency = sent.createdTimestamp - interaction.createdTimestamp;

        const embed = new EmbedBuilder()
            .setTitle('Pong!')
            .setColor(0x5865f2)
            .addFields(
                { name: '✨ API Latency', value: `\`${apiLatency}ms\``, inline: true },
                { name: '💯 Client Ping', value: `\`${botLatency}ms\``, inline: true }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};
