const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('competition')
        .setDescription('Start a public guessing round — first to guess wins +5 credits and a badge!'),

    async execute(interaction, client) {
        // Vérifie si une compétition est déjà en cours
        if (client.currentCompetition && Date.now() < client.currentCompetition.timeout) {
            return interaction.reply({
                content: '🚨 A competition is already in progress!',
                ephemeral: true
            });
        }

        // Sélectionne un coaster au hasard
        client.db.query(`SELECT * FROM coasters ORDER BY RAND() LIMIT 1`, (err, results) => {
            if (err || results.length === 0) {
                console.error(err);
                return interaction.reply({
                    content: '❌ Failed to fetch a coaster from the database.',
                    ephemeral: true
                });
            }

            const coaster = results[0];

            // Définit la compétition active pour 60 secondes
            client.currentCompetition = {
                name: coaster.name,
                alias: coaster.alias,
                difficulty: coaster.difficulty,
                timeout: Date.now() + 60000 // 1 min
            };

            // Envoie l'embed d'annonce
            const embed = new EmbedBuilder()
                .setTitle('🏁 Competition Time!')
                .setDescription(
                    'A public guessing round has started!\n\n' +
                    '🎯 Be the **first** to guess the name of this coaster.\n' +
                    '<:trophe:1368024238371508315> Winner gets **+5 credits** and the **Competition Badge**!'
                )
                .setImage(coaster.image_url)
                .setColor(0xe67e22)
                .setFooter({ text: 'You have 60 seconds. Type your guess now!' });

            interaction.reply({ embeds: [embed] });
        });
    }
};
