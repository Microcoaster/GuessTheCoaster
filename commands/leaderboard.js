const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('View the leaderboard for GuessTheCoaster'),

    async execute(interaction, client) {
        const guildId = interaction.guildId;

        // 🔄 Récupération du nombre total de coasters
        const totalCoasters = await new Promise((resolve) => {
            client.db.query(`SELECT COUNT(*) as total FROM coasters`, (err, res) => {
                if (err) return resolve(0);
                resolve(res[0].total);
            });
        });

        // 🔍 Fonctions SQL pour récupérer les données
        const fetchData = (query, params = []) => {
            return new Promise((resolve) => {
                client.db.query(query, params, (err, rows) => {
                    if (err) {
                        console.error(err);
                        return resolve([]);
                    }
                    resolve(rows);
                });
            });
        };

        // Global Queries
        const globalCredits = await fetchData(`SELECT username, credits FROM users ORDER BY credits DESC LIMIT 10`);
        const globalCompletion = await fetchData(`
            SELECT u.username, COUNT(DISTINCT uc.coaster_id) AS collected
            FROM user_coasters uc
            JOIN users u ON u.username = uc.username
            GROUP BY uc.username
            ORDER BY collected DESC
            LIMIT 10
        `);
        const globalStreak = await fetchData(`SELECT username, best_streak FROM users ORDER BY best_streak DESC LIMIT 10`);

        // Local Queries
        const localCredits = await fetchData(`
            SELECT username, credits FROM users 
            WHERE guild_id = ? ORDER BY credits DESC LIMIT 10`, [guildId]);
        const localCompletion = await fetchData(`
            SELECT u.username, COUNT(DISTINCT uc.coaster_id) AS collected
            FROM user_coasters uc
            JOIN users u ON u.username = uc.username
            WHERE u.guild_id = ?
            GROUP BY uc.username
            ORDER BY collected DESC
            LIMIT 10
        `);
        const localStreak = await fetchData(`
            SELECT username, best_streak FROM users 
            WHERE guild_id = ? ORDER BY best_streak DESC LIMIT 10`, [guildId]);

        // ⬇️ Formatage des textes
        const formatList = (list, label) => {
            return list.map((row, i) => {
                let value = row.credits || row.best_streak || row.collected || 0;
                if (label === 'completion') {
                    const percent = ((value / totalCoasters) * 100).toFixed(2);
                    return `**${i + 1})** ${row.username} | **${percent}%** Completion`;
                }
                return `**${i + 1})** ${row.username} | **${value}** ${label === 'streak' ? 'Streak' : 'Credits'}`;
            }).join('\n') || "*Not enough data yet!*";
        };

        const globalEmbeds = [
            new EmbedBuilder()
                .setTitle(`🌐 Global Leaderboard`)
                .addFields(
                    { name: `Top ${globalCredits.length} Credits 🎢`, value: formatList(globalCredits, 'credits') },
                    { name: `Top ${globalCompletion.length} Completion ✅`, value: formatList(globalCompletion, 'completion') }
                )
                .setFooter({ text: 'Page 1/2  •  Buttons expire after 30 seconds' })
                .setColor(0xffffff)
                .setTimestamp(),
            new EmbedBuilder()
                .setTitle(`🌐 Global Leaderboard`)
                .addFields(
                    { name: `Top ${globalStreak.length} Streaks 🔥`, value: formatList(globalStreak, 'streak') },
                    { name: `Top Coming Soon! 🕐`, value: '*gaming*' }
                )
                .setFooter({ text: 'Page 2/2  •  Buttons expire after 30 seconds' })
                .setColor(0xffffff)
                .setTimestamp()
        ];

        const localEmbeds = [
            new EmbedBuilder()
                .setTitle(`🏠 Local Leaderboard`)
                .addFields(
                    { name: `Top ${localCredits.length} Credits 🎢`, value: formatList(localCredits, 'credits') },
                    { name: `Top ${localCompletion.length} Completion ✅`, value: formatList(localCompletion, 'completion') }
                )
                .setFooter({ text: 'Page 1/2  •  Buttons expire after 30 seconds' })
                .setColor(0xffffff)
                .setTimestamp(),
            new EmbedBuilder()
                .setTitle(`🏠 Local Leaderboard`)
                .addFields(
                    { name: `Top ${localStreak.length} Streaks 🔥`, value: formatList(localStreak, 'streak') },
                    { name: `Top Coming Soon! 🕐`, value: '*gaming*' }
                )
                .setFooter({ text: 'Page 2/2  •  Buttons expire after 30 seconds' })
                .setColor(0xffffff)
                .setTimestamp()
        ];

        // ⬇️ Boutons
        const makeButtons = (scope = 'Global', page = 1) => {
            const backId = scope === 'Global' ? 'global1' : 'local1';
            const forwardId = scope === 'Global' ? 'global2' : 'local2';
            const switchId = scope === 'Global' ? 'local' : 'global';
            return new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId(backId).setLabel('←').setStyle(1).setDisabled(page === 1),
                new ButtonBuilder().setCustomId(switchId).setLabel(scope === 'Global' ? 'Show Local' : 'Show Global').setStyle(3),
                new ButtonBuilder().setCustomId(forwardId).setLabel('→').setStyle(1).setDisabled(page === 2)
            );
        };

        // ⬇️ Réponse initiale
        const reply = await interaction.reply({
            embeds: [globalEmbeds[0]],
            components: [makeButtons('Global', 1)]
        });

        const collector = reply.createMessageComponentCollector({ time: 30000 });

        collector.on('collect', async btn => {
            await btn.deferUpdate();
            let embed, buttons;
            switch (btn.customId) {
                case 'global2':
                    embed = globalEmbeds[1];
                    buttons = makeButtons('Global', 2);
                    break;
                case 'global1':
                    embed = globalEmbeds[0];
                    buttons = makeButtons('Global', 1);
                    break;
                case 'local':
                    embed = localEmbeds[0];
                    buttons = makeButtons('Local', 1);
                    break;
                case 'local2':
                    embed = localEmbeds[1];
                    buttons = makeButtons('Local', 2);
                    break;
                case 'local1':
                    embed = localEmbeds[0];
                    buttons = makeButtons('Local', 1);
                    break;
                case 'global':
                    embed = globalEmbeds[0];
                    buttons = makeButtons('Global', 1);
                    break;
            }

            await reply.edit({ embeds: [embed], components: [buttons] });
        });

        collector.on('end', () => {
            reply.edit({ components: [] });
        });
    }
};
