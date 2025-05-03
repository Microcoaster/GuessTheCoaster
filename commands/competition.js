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
                    '<:competition_winner:1368317089156169739> Winner gets **+5 credits** and the **Competition Badge**!\n\n' +
                    timeDisplay
                )
                .setImage(coaster.image_url)
                .setColor(0xe67e22)
                .setFooter({ text: 'Type your guess now!' });


            client.currentCompetition = {
                name: coaster.name,
                alias: coaster.alias,
                difficulty: coaster.difficulty,
                timeout: Date.now() + seconds * 1000,
                interval: null,
                message: null // valeur temporaire
              };
              
              const sent = await interaction.reply({ embeds: [createEmbed(`⏱️ Time left: **${timeLeft}s**`)] });
              client.currentCompetition.message = await interaction.fetchReply();
              

            // Timer dynamique
            const interval = setInterval(() => {
                if (!client.currentCompetition) return clearInterval(interval);

                timeLeft--;
                if (timeLeft <= 0 || Date.now() > client.currentCompetition.timeout) {
                    clearInterval(interval);
                    return;
                }

                interaction.editReply({ embeds: [createEmbed(`⏱️ Time left: **${timeLeft}s**`)] }).catch(console.error);
            }, 1000);

            // Fin du round après 60s
            setTimeout(() => {
                if (client.currentCompetition && Date.now() > client.currentCompetition.timeout) {
                    const timeoutEmbed = new EmbedBuilder()
                        .setTitle("⏱️ Time's Up!")
                        .setDescription("No one guessed the coaster in time.")
                        .setColor(0xd9534f);

                    interaction.followUp({ embeds: [timeoutEmbed] }).catch(console.error);
                    client.currentCompetition = null;
                    clearInterval(interval);
                }
            }, seconds * 1000);
        });
    }
};
