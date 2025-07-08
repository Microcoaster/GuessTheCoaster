const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const CoasterDao = require('../dao/coasterDao');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('competition')
        .setDescription('Start a public guessing round — first to guess wins +5 credits and a badge!'),

    async execute(interaction, client) {
        if (client.currentCompetition && Date.now() < client.currentCompetition.timeout) {
            return interaction.reply({
                content: 'A competition is already in progress!',
                flags: MessageFlags.Ephemeral
            });
        }

        try {
            const coaster = await CoasterDao.getRandomOne();
            if (!coaster) {
                return interaction.reply({
                    content: 'Failed to fetch a coaster from the database.',
                    flags: MessageFlags.Ephemeral
                });
            }

            let secondsLeft = 60;

            const createEmbed = (timeDisplay) => {
                return new EmbedBuilder()
                    .setTitle('🏁 Competition Time!')
                    .setDescription(
                        'A public guessing round has started!\n\n' +
                        '🎯 Be the **first** to guess the name of this coaster.\n' +
                        '<:competition_winner:1368317089156169739> Winner gets **+5 credits** and the **Competition Badge**!\n\n' +
                        timeDisplay
                    )
                    .setImage(coaster.image_url)
                    .setColor(0xe67e22)
                    .setFooter({ text: 'Type your guess now!' });
            };

            // Initial reply
            await interaction.reply({ embeds: [createEmbed(`Time left: **${secondsLeft}s**`)] });
            const replyMessage = await interaction.fetchReply();

            client.currentCompetition = {
                name: coaster.name,
                alias: coaster.alias,
                difficulty: coaster.difficulty,
                timeout: Date.now() + secondsLeft * 1000,
                hasWinner: false,
                message: replyMessage
            };

            const timeoutDuration = secondsLeft * 1000;

            const interval = setInterval(() => {
                secondsLeft--;

                const active = client.currentCompetition;
                if (!active || active.hasWinner || secondsLeft <= 0 || Date.now() > active.timeout) {
                    clearInterval(interval);
                    if (active && !active.hasWinner) {
                        interaction.editReply({ embeds: [createEmbed(`⏱️ Time's up!`)] }).catch(console.error);
                    }
                    return;
                }

                interaction.editReply({ embeds: [createEmbed(`Time left: **${secondsLeft}s**`)] }).catch(console.error);
            }, 1000);

            setTimeout(async () => {
                const active = client.currentCompetition;
                console.log('Competition timeout triggered:', {
                    hasActive: !!active,
                    hasWinner: active?.hasWinner,
                    timeExpired: active ? Date.now() > active.timeout : 'N/A'
                });
                
                if (active && !active.hasWinner) {
                    client.currentCompetition = null;

                    const timeoutEmbed = new EmbedBuilder()
                        .setTitle("⏱️ Time's Up!")
                        .setDescription(`Nobody guessed the coaster in time.\n\n**Answer:** ${coaster.name}`)
                        .setColor(0xd9534f);

                    try {
                        await interaction.followUp({ embeds: [timeoutEmbed] });
                        console.log('Competition timeout message sent successfully');
                    } catch (error) {
                        console.error('Error sending competition timeout message:', error);
                    }
                } else {
                    console.log('Competition timeout skipped:', active ? 'Winner found' : 'No active competition');
                }
            }, timeoutDuration);
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: 'An error occurred while starting the competition.',
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
