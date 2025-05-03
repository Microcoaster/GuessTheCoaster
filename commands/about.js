const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Returns the About Page with Bot Information'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('         ✨   About GuessTheCoaster   ✨')
            .setDescription(
                `**GuessTheCoaster** is a Discord Bot where Users have to Guess the Name of a Roller Coaster from a large selection of coaster images. ` +
                `Correct answers reward Credits and Completion which can be viewed on a User Profile or on Local/Global Leaderboards.\n\n` +
                `The bot is coded entirely in **JavaScript**, powered by **Node.js**, using **Discord.js** for Discord interaction, and **MySQL** to store user stats and scores.\n\n` +
                `Created by **Cybertrist**. All images are taken either by me or by users of the bot!\n\n`
            )

            .setColor(0x5865f2)
            .setImage('https://cdn.discordapp.com/attachments/1367776168673280090/1367776189124710421/Toutatis-3-min-1024x682.png?ex=6815d057&is=68147ed7&hm=7f1c319fbcb8d508bccb44028d71d668fd147fe405f7431b8ad3a1f4a7d068c1&')
            .setFooter({
                text: 'Coaster pool last updated: 02/05/2025 🗓️'
            });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
