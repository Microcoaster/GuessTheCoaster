const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

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

            client.db.query(`SELECT contributor FROM users WHERE username = ?`, [requester], (err, rows) => {
                if (err || rows.length === 0 || rows[0].contributor !== 1) {
                    return interaction.reply({
                        content: "You are not authorized to cancel another user's guess.",
                        ephemeral: true
                    });
                }

                endGuess(targetUser, interaction, client);
            });
        } else {
            endGuess(targetUser, interaction, client);
        }
    }
};

function endGuess(user, interaction, client) {
    if (!client.activeGuesses[user.id]) {
        return interaction.reply({
            content: "No active guess found for this user.",
            ephemeral: true
        });
    }

    delete client.activeGuesses[user.id];

    const embed = new EmbedBuilder()
        .setTitle('Guessing game ended')
        .setDescription(`The guessing round for **${user.username}** has been cancelled.`)
        .setColor(0xe74c3c);

    interaction.reply({ embeds: [embed], ephemeral: false });
}
