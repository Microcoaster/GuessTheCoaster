const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('View your coaster profile or someone else\'s')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to view the profile of')
                .setRequired(false)
        ),

    async execute(interaction, client) {
        const targetUser = interaction.options.getUser('target') || interaction.user;
        const username = targetUser.username;
        const avatar = targetUser.displayAvatarURL();

        client.db.query(`SELECT credits, streak FROM users WHERE username = ?`, [username], (err, rows) => {
            if (err || rows.length === 0) {
                const notFoundEmbed = new EmbedBuilder()
                    .setTitle('❌ User Profile Not Found!')
                    .setDescription('This user has never played and therefore does not have a profile.')
                    .setColor(0xd9534f);
                return interaction.reply({ embeds: [notFoundEmbed], ephemeral: true });
            }

            const { credits, streak, best_streak } = rows[0];

            // Requête 1 : coasters collectés par difficulté
            client.db.query(`
                SELECT c.difficulty, COUNT(*) AS count
                FROM user_coasters uc
                JOIN coasters c ON uc.coaster_id = c.id
                WHERE uc.username = ?
                GROUP BY c.difficulty
            `, [username], (err, collectedResults) => {
                if (err) return console.error(err);

                // Requête 2 : coasters totaux par difficulté
                client.db.query(`
                    SELECT difficulty, COUNT(*) AS total
                    FROM coasters
                    GROUP BY difficulty
                `, (err, totalResults) => {
                    if (err) return console.error(err);

                    const difficulties = ['Easy', 'Medium', 'Hard'];
                    const collectedMap = Object.fromEntries(difficulties.map(d => [d, 0]));
                    const totalMap = Object.fromEntries(difficulties.map(d => [d, 0]));

                    for (const row of collectedResults) {
                        collectedMap[row.difficulty] = row.count;
                    }
                    for (const row of totalResults) {
                        totalMap[row.difficulty] = row.total;
                    }

                    const totalCoasters = totalMap.Easy + totalMap.Medium + totalMap.Hard;
                    const totalCollected = collectedMap.Easy + collectedMap.Medium + collectedMap.Hard;
                    const completion = ((totalCollected / totalCoasters) * 100).toFixed(2);

                    // Badges dynamiques
                    let badges = '';
                    if (completion >= 50) badges += '<:50Completion:1367798353559027824> ';
                    if (completion == 100) badges += '<:100Completion:1367798366116773979> ';
                    if (streak >= 10) badges += '<:10Streak:1367800181709471824> ';
                    if (streak >= 50) badges += '<:50Streak:1367800333144821801> ';
                    if (username.toLowerCase() === 'cybertrist') badges += '<:Owner:1367800341676167208> ';

                    const embed = new EmbedBuilder()
                        .setTitle(`${username}'s Profile`)
                        .setColor(0x1abc9c)
                        .setThumbnail(avatar)
                        .setDescription(
                            `Credits: **${credits}** 🎢\n` +
                            `Completion: **${completion}%**\n` +
                            `Collected: **${totalCollected}/${totalCoasters}**\n` +
                            `Best Streak: **${best_streak}** 🔥`
                        )
                        .addFields(
                            {
                                name: 'Easy', value: `${collectedMap.Easy}/${totalMap.Easy}`, inline: true
                            },
                            {
                                name: 'Medium', value: `${collectedMap.Medium}/${totalMap.Medium}`, inline: true
                            },
                            {
                                name: 'Hard', value: `${collectedMap.Hard}/${totalMap.Hard}`, inline: true
                            },
                            {
                                name: 'Badges',
                                value: badges || '*None! 😢*'
                            }
                        )
                        .setTimestamp();

                    interaction.reply({ embeds: [embed], ephemeral: false });
                });
            });
        });
    }
};
