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
                `<:Owner:1367800341676167208> - ***Owner**: Own the bot. (*You can’t have this haha*)*`+
                ` **More badges coming soon... once the dev stops riding coasters and working on microcoaster launch systems!***` 
            )
            .setColor(0xf1c40f)
            .setImage('https://cdn.discordapp.com/attachments/1367776168673280090/1367784784939585576/0815gaspa.png?ex=6815d858&is=681486d8&hm=f014d09e9d827577ae44f0fe6c80534a939353cc41f02b7fc48a3da1e1cd0d13&') // ou ton image
            .setFooter({
                text: `${interaction.client.user.username}`,
                iconURL: interaction.client.user.displayAvatarURL()
            });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
