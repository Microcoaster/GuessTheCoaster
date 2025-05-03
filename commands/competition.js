const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('competition')
        .setDescription('Start a public guessing round — first to guess wins +5 credits and a badge!'),

    async execute(interaction, client) {
        if (client.currentCompetition && Date.now() < client.currentCompetition.timeout) {
            return interaction.reply({
                content: '🚨 A competition is already in progress!',
                ephemeral: true
            });
        }

        client.db.query(`SELECT * FROM coasters ORDER BY RAND() LIMIT 1`, async (err, results) => {
            if (err || results.length === 0) {
                console.error(err);
                return interaction.reply({
                    content: '❌ Failed to fetch a coaster from the database.',
                    ephemeral: true
                });
            }

            const coaster = results[0];
            const seconds = 60;
            let timeLeft = seconds;

            const createEmbed = (timeDisplay) => new EmbedBuilder()
                .setTitle('🏁 Competition Time!')
                .setDescription(
                    'A public guessing round has started!\n\n' +
                    '🎯 Be the **first** to guess the name of this coaster.\n' +
                    '<:trophe:1368024238371508315> Winner gets **+5 credits** and the **Competition Badge**!\n\n' +
                    timeDisplay
                )
                .setImage(coaster.image_url)
                .setColor(0xe67e22)
                .setFooter({ text: 'Type your guess now!' });

            const reply = await interaction.reply({ embeds: [createEmbed(`⏱️ Time left: **${timeLeft}s**`)] });

            // Initialise l'objet après avoir le message
            client.currentCompetition = {
                name: coaster.name,
                alias: coaster.alias,
                difficulty: coaster.difficulty,
                timeout: Date.now() + seconds * 1000,
                message: reply,
                interval: null
            };

            // ⏱️ Met à jour l’embed toutes les secondes
            const interval = setInterval(() => {
                timeLeft--;

                if (!client.currentCompetition || Date.now() > client.currentCompetition.timeout) {
                    clearInterval(interval);
                    return;
                }

                reply.edit({ embeds: [createEmbed(`⏱️ Time left: **${timeLeft}s**`)] }).catch(() => {});
            }, 1000);

            client.currentCompetition.interval = interval;

            // ⌛ Timeout final
            setTimeout(() => {
                if (client.currentCompetition && Date.now() > client.currentCompetition.timeout) {
                    clearInterval(client.currentCompetition.interval);
                    client.currentCompetition = null;

                    const timeoutEmbed = new EmbedBuilder()
                        .setTitle("⏱️ Time's Up!")
                        .setDescription("Nobody guessed the coaster in time.")
                        .setColor(0xd9534f);

                    interaction.followUp({ embeds: [timeoutEmbed] }).catch(() => {});
                }
            }, seconds * 1000);
        });
    }
};
