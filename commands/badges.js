const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('badges')
        .setDescription('Return a list of obtainable badges'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('<a:Medaille:1367883558839914516> Obtainable badges <a:Trophee:1367883441533751458>\n\n')
            .setDescription(
                `<:contributor:1367796340725383221> - ***Contributor**: For those who have provided pictures.*\n\n` +
                `<:50Completion:1367798353559027824> - ***50% Completion**: Collect more than half the coasters.*\n\n` +
                `<:100Completion:1367798366116773979> - ***100% Completion**: Collect all coasters at any point in time.*\n\n` +
                `<:10Streak:1367800181709471824> - ***Streak of 10**: Obtain a streak of 10.*\n\n` +
                `<:50Streak:1367800333144821801> - ***Streak of 50**: Obtain a streak of 50.*\n\n` +
                `<:Owner:1367800341676167208> - ***Owner**: Own the bot. (*You can’t have this haha*)*\n\n`+
                `<:trophe:1368024238371508315> - ***Competition Winner**: Win a public guessing round by being the first to answer correctly!*\n\n` +
                `<:MicroCoaster:1368326557432680559> - ***Micro Coaster**: A secret badge... nobody knows how to get it. Or do they?*\n\n` +
                `***More badges coming soon... once the dev stops riding coasters and working on microcoaster launch systems!***\n\n` 
            )
            .setColor(0xf1c40f)
            .setImage('https://media.discordapp.net/attachments/1367776168673280090/1368256804756389961/0815gaspa.png?ex=68178ff3&is=68163e73&hm=61c0a3ebdd950cac325e84007616a4a84edd8b6b7189a7e449b11ff9467fbfde&=&format=webp&quality=lossless')
            .setFooter({
                text: `${interaction.client.user.username}`,
                iconURL: interaction.client.user.displayAvatarURL()
            });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
