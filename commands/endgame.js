const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const UserDao = require('../dao/userDao');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('endgame')
        .setDescription('Manually ends a current guessing game')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User whose guess to cancel (defaults to yourself)')
                .setRequired(false)),

    async execute(interaction, client) {
        const targetUser = interaction.options.getUser('user') || interaction.user;

        // Optional: only allow ending others' games if the user is a contributor
        if (targetUser.id !== interaction.user.id) {
            const requester = interaction.user.username;

            try {
                const isContributor = await UserDao.isContributor({ username: requester });
                if (!isContributor) {
                    return interaction.reply({
                        content: "You are not authorized to cancel another user's guess.",
                        flags: MessageFlags.Ephemeral
                    });
                }

                endGuess(targetUser, interaction, client);
            } catch (error) {
                console.error(error);
                return interaction.reply({
                    content: "Error checking permissions.",
                    flags: MessageFlags.Ephemeral
                });
            }
        } else {
            endGuess(targetUser, interaction, client);
        }
    }
};

function endGuess(user, interaction, client) {
    if (!client.activeGuesses[user.id]) {
        return interaction.reply({
            content: "No active guess found for this user.",
            flags: MessageFlags.Ephemeral
        });
    }

    delete client.activeGuesses[user.id];

    const embed = new EmbedBuilder()
        .setTitle('Guessing game ended')
        .setDescription(`The guessing round for **${user.username}** has been cancelled.`)
        .setColor(0xe74c3c);

    interaction.reply({ embeds: [embed], ephemeral: false });
}
