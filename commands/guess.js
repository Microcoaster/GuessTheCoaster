const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess')
        .setDescription('Play a round of GuessTheCoaster')
        .addStringOption(option =>
            option.setName('difficulty')
                .setDescription('Choose coaster difficulty')
                .setRequired(false)
                .addChoices(
                    { name: 'Random', value: 'random' },
                    { name: 'Easy', value: 'Easy' },
                    { name: 'Medium', value: 'Medium' },
                    { name: 'Hard', value: 'Hard' }
                )
        ),

    async execute(interaction, client) {
        const selected = interaction.options.getString('difficulty') || 'random';

        const sql = selected === 'random'
            ? `SELECT * FROM coasters ORDER BY RAND() LIMIT 1`
            : `SELECT * FROM coasters WHERE difficulty = ? ORDER BY RAND() LIMIT 1`;

        const params = selected === 'random' ? [] : [selected];

        client.db.query(sql, params, async (err, results) => {
            if (err || results.length === 0) {
                return interaction.reply({ content: 'No coaster found for that difficulty.', ephemeral: true });
            }

            const coaster = results[0];
            const userId = interaction.user.id;

            if (client.activeGuesses && client.activeGuesses[userId]) {
                return interaction.reply({
                    content: 'You already have a round active! Please answer it before starting a new one.',
                    ephemeral: true
                });
            }

            if (!client.activeGuesses) client.activeGuesses = {};

            let secondsLeft;
            let displayedDifficulty = coaster.difficulty; // Pour affichage correct si random

            if (selected === 'random') {
                switch (coaster.difficulty) {
                    case 'Hard': secondsLeft = 30; break;
                    case 'Medium': secondsLeft = 45; break;
                    case 'Easy': secondsLeft = 60; break;
                    default: secondsLeft = 45; // fallback
                }
            } else {
                switch (selected) {
                    case 'Hard': secondsLeft = 30; break;
                    case 'Medium': secondsLeft = 45; break;
                    case 'Easy': secondsLeft = 60; break;
                    default: secondsLeft = 45;
                }
            }

            const timeLimit = secondsLeft;

            client.activeGuesses[userId] = {
                name: coaster.name.toLowerCase(),
                alias: coaster.alias ? coaster.alias.toLowerCase() : null,
                difficulty: coaster.difficulty?.toLowerCase() || "easy",
                timeout: Date.now() + secondsLeft * 1000
            };
            

            const createEmbed = (timeDisplay) => {
                return new EmbedBuilder()
                    .setTitle('🎢 Guess the Roller Coaster!')
                    .setDescription(`Difficulty: **${coaster.difficulty}** (${timeLimit} second time limit)\n ${timeDisplay}`)
                    .setImage(coaster.image_url)
                    .setColor(0x3498db);
            };

            await interaction.reply({ embeds: [createEmbed(`Time left: **${secondsLeft}s**`)] });

            const interval = setInterval(() => {
                secondsLeft--;

                const active = client.activeGuesses[userId];
                if (!active || secondsLeft <= 0 || Date.now() > active.timeout) {
                    clearInterval(interval);
                    interaction.editReply({ embeds: [createEmbed(`Time's up!`)] });
                    return;
                }

                interaction.editReply({ embeds: [createEmbed(`Time left: **${secondsLeft}s**`)] });
            }, 1000);

            setTimeout(() => {
                const active = client.activeGuesses[userId];
                if (active && Date.now() > active.timeout) {
                    delete client.activeGuesses[userId];
            
                    const timeoutEmbed = new EmbedBuilder()
                        .setTitle("⏱️ Time's Up!")
                        .setDescription("Nobody Guessed the Correct Roller Coaster!")
                        .setColor(0xd9534f);
                        client.db.query(
                            `UPDATE users SET streak = 0 WHERE username = ?`,
                            [interaction.user.username],
                            err => {
                                if (err) console.error('Erreur lors du reset du streak :', err);
                            }
                        );
                        
                    interaction.followUp({ embeds: [timeoutEmbed] });
                }
            }, secondsLeft * 1000);            
        });
    }
};