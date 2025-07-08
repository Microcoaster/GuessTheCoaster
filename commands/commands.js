const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

const bannerImages = [
    "https://media.discordapp.net/attachments/1367776168673280090/1368187454779297813/ngwoe1e42ag61.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368187837417259058/image2F06703462F202201212Fob_84c7b1_12.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368188197858705448/X1gJWTQMPYqU9LWFC9L5DF.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368188406898884688/nBCxQIfeReWYyJmU6nVU.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368188851557765120/dsc_0306.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368189082139627550/The-Ride-to-Happiness-2-scaled.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368189477737992325/taiga-linnanmaki-64bd76649ec63.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368189850154438666/maxresdefault.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368190031373799455/42_AF1_RIDE.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368190177172000830/Fury-325_54_990x660.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368190424312971305/Walibi_Holland_Untamed_first_drop.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368190653695004712/maverick-1920x1273.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368190879113937017/wildcats-revenge-hersheypark-649f665261aee.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368191016326397972/batman-gotham-city-escape-parque-warner-madrid-661aed0db3aba.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368191434246586469/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368191523526676530/Toutatis-3-min.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368191680502698034/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368191792092151860/voltron-europa-park-6636b5e366f0f.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368192014096531619/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368192068140273704/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368193600034439238/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368193664521732096/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368193731584458893/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368193954935345152/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368194009125752832/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368194227699191859/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368194464501207060/screen_shot_2015-05-29_at_10.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368194849123209288/twisted-colossus-1_2.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368195040786120714/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368195425454264380/POST-3_SHAMBALA_1200x600.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368195607574872274/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368195743118004224/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368195856288710726/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368196015467003914/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368196240596140082/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368196380866379807/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368196546243465306/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368196687738437753/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368196797779935232/image.png",
    "https://media.discordapp.net/attachments/1367776168673280090/1368196968894955641/image.png"
    
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
                `**/profile** – *view the profile of a player.*\n\n`+
                `**/competition** – *start a public guessing round — fastest guess wins!*\n\n` +
                `**/endgame** – *cancel the current guessing round if needed.*\n\n`
            );

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }
};
