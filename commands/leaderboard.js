const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageFlags } = require('discord.js');
const CoasterDao = require('../dao/coasterDao');
const UserDao = require('../dao/userDao');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Returns the browsable Leaderboards for GuessTheCoaster'),

    async execute(interaction, client) {
        const guildId = interaction.guildId;

        try {
            const totalCoasters = await CoasterDao.getTotal();

            const globalCredits = await UserDao.getLeaderboard({ type: 'credits', limit: 10 });
            const globalStreak = await UserDao.getLeaderboard({ type: 'streak', limit: 10 });
            
            // Pour les données de completion globale et locale, on garde les requêtes spécifiques
            const [globalCompletion] = await client.db.query(`
                SELECT u.username, COUNT(DISTINCT uc.coaster_id) AS collected
                FROM user_coasters uc
                JOIN users u ON u.username = uc.username
                GROUP BY uc.username
                ORDER BY collected DESC
                LIMIT 10
            `);
            
            const [localCredits] = await client.db.query(`
                SELECT username, credits FROM users 
                WHERE guild_id = ? ORDER BY credits DESC LIMIT 10`, [guildId]);
                
            const [localCompletion] = await client.db.query(`
                SELECT u.username, COUNT(DISTINCT uc.coaster_id) AS collected
                FROM user_coasters uc
                JOIN users u ON u.username = uc.username
                WHERE u.guild_id = ?
                GROUP BY uc.username
                ORDER BY collected DESC
                LIMIT 10`, [guildId]);
                
            const [localStreak] = await client.db.query(`
                SELECT username, best_streak FROM users 
                WHERE guild_id = ? ORDER BY best_streak DESC LIMIT 10`, [guildId]);

            const formatList = (list, label) => {
                return list.map((row, i) => {
                    let value;
                    if (label === 'streak') value = row.best_streak;
                    else if (label === 'completion') value = row.collected;
                    else value = row.credits;
                    if (label === 'completion') {
                        const percent = ((value / totalCoasters) * 100).toFixed(2);
                        return `**${i + 1})** ${row.username} | **${percent}%** Completion`;
                    }
                    return `**${i + 1})** ${row.username} | **${value}** ${label === 'streak' ? 'Streak' : 'Credits'}`;
                }).join('\n') || "*Not enough data yet!*";
            };

            const createEmbeds = (scope, color) => {
                const credits = scope === 'Global' ? globalCredits : localCredits;
                const completion = scope === 'Global' ? globalCompletion : localCompletion;
                const streaks = scope === 'Global' ? globalStreak : localStreak;

                return [
                    new EmbedBuilder()
                        .setTitle(`${scope === 'Global' ? '📕' : '📘'} ${scope} Leaderboard`)
                        .addFields(
                            { name: `Top ${credits.length} Credits ✨`, value: formatList(credits, 'credits') },
                            { name: `Top ${completion.length} Completion <:trophe:1368024238371508315>`, value: formatList(completion, 'completion') }
                        )
                        .setFooter({ text: 'Page 1/2  •  Buttons expire after 30 seconds' })
                        .setColor(color)
                        .setTimestamp(),
                    new EmbedBuilder()
                        .setTitle(`${scope === 'Global' ? '📕' : '📘'} ${scope} Leaderboard`)
                        .addFields(
                            { name: `Top ${streaks.length} Streaks 🔥`, value: formatList(streaks, 'streak') }
                        )
                        .setFooter({ text: 'Page 2/2  •  Buttons expire after 30 seconds' })
                        .setColor(color)
                        .setTimestamp()
                ];
            };

            const makeButtons = (scope = 'Global', page = 1) => {
                const backId = scope === 'Global' ? 'global1' : 'local1';
                const forwardId = scope === 'Global' ? 'global2' : 'local2';
                const switchId = scope === 'Global' ? 'local' : 'global';
                const color = scope === 'Global' ? 0xdd2e44 : 0x55acee;

                const buttons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(backId).setLabel('←').setStyle(1).setDisabled(page === 1),
                    new ButtonBuilder().setCustomId(switchId).setLabel(scope === 'Global' ? 'Show Local' : 'Show Global').setStyle(3),
                    new ButtonBuilder().setCustomId(forwardId).setLabel('→').setStyle(1).setDisabled(page === 2)
                );

                return { buttons, color };
            };

            let currentScope = 'Global';
            let currentPage = 1;

            const { buttons, color } = makeButtons(currentScope, currentPage);
            const embeds = createEmbeds(currentScope, color);

            const reply = await interaction.reply({
                embeds: [embeds[0]],
                components: [buttons]
            });

            const collector = reply.createMessageComponentCollector({ time: 30000 });

            collector.on('collect', async btn => {
                await btn.deferUpdate();

                switch (btn.customId) {
                    case 'global2':
                        currentScope = 'Global';
                        currentPage = 2;
                        break;
                    case 'global1':
                        currentScope = 'Global';
                        currentPage = 1;
                        break;
                    case 'local':
                        currentScope = 'Local';
                        currentPage = 1;
                        break;
                    case 'local2':
                        currentScope = 'Local';
                        currentPage = 2;
                        break;
                    case 'local1':
                        currentScope = 'Local';
                        currentPage = 1;
                        break;
                    case 'global':
                        currentScope = 'Global';
                        currentPage = 1;
                        break;
                }

                const { buttons, color } = makeButtons(currentScope, currentPage);
                const embeds = createEmbeds(currentScope, color);

                await reply.edit({
                    embeds: [embeds[currentPage - 1]],
                    components: [buttons]
                });
            });

            collector.on('end', () => {
                reply.edit({ components: [] });
            });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Error while fetching leaderboard data.', flags: MessageFlags.Ephemeral });
        }
    }
};