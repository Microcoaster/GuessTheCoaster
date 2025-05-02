const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const bannerImages = [
    "https://watkin81.github.io/images/header/Banshee_KingsIsland.jpg",
    "https://watkin81.github.io/images/header/Colossus_Lagoon.jpg",
    "https://watkin81.github.io/images/header/Corkscrew_MA.jpg",
    "https://watkin81.github.io/images/header/ElectricEel_SWSD.jpg",
    "https://watkin81.github.io/images/header/Emperor_SWSD.jpg",
    "https://watkin81.github.io/images/header/Outlaw_Adventureland.jpg",
    "https://watkin81.github.io/images/header/Thunderhawk_MA.jpg",
    "https://watkin81.github.io/images/header/Voyage_HolidayWorld.jpg"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commands')
        .setDescription(`Return a list of the Bot's Commands.`),

    async execute(interaction, client) {
        const banner = bannerImages[Math.floor(Math.random() * bannerImages.length)];

        const embed = new EmbedBuilder()
            .setTitle('Commands')
            .setColor(0x5865f2)
            .setImage(banner)
            .setTimestamp()
            .setAuthor({
                name: `${client.user.username}#${client.user.discriminator}`,
                iconURL: client.user.displayAvatarURL()
            })
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setDescription(
                `**/about** – *brings up an about page.*\n\n` +
                `**/badges** – *shows a list of badges you can acquire.*\n\n` +
                `**/commands** – *displays this help message.*\n\n` +
                `**/guess** – *start a guessing round based on coaster images.*\n\n` +
                `**/leaderboard** – *view the global leaderboard.*\n\n` +
                `**/profile** – *view the profile of a player.*`
            );

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
