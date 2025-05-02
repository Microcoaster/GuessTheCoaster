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

        client.db.query(
            `SELECT credits, streak FROM users WHERE username = ?`,
            [username],
            (err, rows) => {
                if (err || rows.length === 0) {
                    const notFoundEmbed = new EmbedBuilder()
                        .setTitle('❌ User Profile Not Found!')
                        .setDescription('This user has never played and therefore does not have a profile.')
                        .setColor(0xd9534f);

                    return interaction.reply({ embeds: [notFoundEmbed], ephemeral: true });
                }

                const { credits, streak } = rows[0];
                const totalCoasters = 89;
                const collected = Math.min(credits, totalCoasters);
                const completion = ((collected / totalCoasters) * 100).toFixed(2);

                // Badges dynamiques
                let badges = '';
                if (completion >= 50) badges += '<:50Completion:1367798353559027824> ';
                if (completion == 100) badges += '<:100Completion:1367798366116773979> ';
                if (streak >= 10) badges += '<:10Streak:1367800181709471824> ';
                if (streak >= 50) badges += '<:50Streak:1367800333144821801> ';
                if (username.toLowerCase() === 'cybertrist') badges += '<:Owner:1367800341676167208> ';


                const embed = new EmbedBuilder()
                    .setTitle(`${username}'s Profile ✨`)
                    .setThumbnail(avatar)
                    .addFields(
                        { name: '**Credits**', value: `${credits}`, inline: true },
                        { name: '**Completion**', value: `${completion}% (${collected}/${totalCoasters})`, inline: true },
                        { name: '**Badges**', value: badges || '*_No badges yet_*', inline: false }
                    )
                    .setColor(0x1abc9c)
                    .setTimestamp();

                interaction.reply({ embeds: [embed], ephemeral: false });
            }
        );
    }
};
