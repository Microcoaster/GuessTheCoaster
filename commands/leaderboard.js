const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('View the leaderboard for GuessTheCoaster'),

    async execute(interaction, client) {
        client.db.query(`SELECT COUNT(*) as total FROM coasters`, async (err, results) => {
            if (err) return console.error(err);
            const totalCoasters = results[0].total;

            // Global leaderboards
            const queries = {
                credits: `SELECT username, credits FROM users ORDER BY credits DESC LIMIT 10`,
                completion: `
                    SELECT u.username, COUNT(DISTINCT uc.coaster_id) AS collected
                    FROM user_coasters uc
                    JOIN users u ON u.username = uc.username
                    GROUP BY uc.username
                    ORDER BY collected DESC
                    LIMIT 10
                `,
                streak: `SELECT username, best_streak FROM users ORDER BY best_streak DESC LIMIT 10`
            };

            client.db.query(queries.credits, (err, creditRows) => {
                if (err) return console.error(err);

                let creditsString = creditRows.map((row, i) =>
                    `**${i + 1})** ${row.username} | **${row.credits}** Credits`).join('\n');

                client.db.query(queries.completion, (err, completionRows) => {
                    if (err) return console.error(err);

                    let completionString = completionRows.map((row, i) => {
                        const percent = ((row.collected / totalCoasters) * 100).toFixed(2);
                        return `**${i + 1})** ${row.username} | **${percent}%** Completion`;
                    }).join('\n');

                    client.db.query(queries.streak, async (err, streakRows) => {
                        if (err) return console.error(err);

                        let streakString = streakRows.map((row, i) =>
                            `**${i + 1})** ${row.username} | **${row.best_streak}** Streak`).join('\n');

                        // Embeds
                        const embed1 = new EmbedBuilder()
                            .setTitle('🌐 Global Leaderboard - Page 1')
                            .addFields(
                                { name: '🏆 Top Credits', value: creditsString },
                                { name: '✅ Top Completion', value: completionString }
                            )
                            .setColor(0x3498db)
                            .setTimestamp();

                        const embed2 = new EmbedBuilder()
                            .setTitle('🌐 Global Leaderboard - Page 2')
                            .addFields(
                                { name: '🔥 Top Streaks', value: streakString },
                                { name: '🕐 Coming soon!', value: '*Work in progress...*' }
                            )
                            .setColor(0x3498db)
                            .setTimestamp();

                        // Buttons
                        const row1 = new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId('page2').setLabel('Next →').setStyle(1)
                        );

                        const row2 = new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId('page1').setLabel('← Back').setStyle(1)
                        );

                        const reply = await interaction.reply({ embeds: [embed1], components: [row1] });

                        const collector = reply.createMessageComponentCollector({ time: 30000 });

                        collector.on('collect', async btn => {
                            await btn.deferUpdate();
                            if (btn.customId === 'page2') {
                                await reply.edit({ embeds: [embed2], components: [row2] });
                            } else if (btn.customId === 'page1') {
                                await reply.edit({ embeds: [embed1], components: [row1] });
                            }
                        });

                        collector.on('end', () => {
                            reply.edit({ components: [] });
                        });
                    });
                });
            });
        });
    }
};
