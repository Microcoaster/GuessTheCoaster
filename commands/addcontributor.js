const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addcontributor')
        .setDescription('Add or remove contributor status from a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to update')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('value')
                .setDescription('true to add, false to remove')
                .setRequired(true)),

    async execute(interaction, client) {
        // Only Cybertrist can use this command
        if (interaction.user.id !== '634433284285268006') {
            return interaction.reply({
                content: "Only **Cybertrist** can use this command.",
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('user');
        const value = interaction.options.getBoolean('value');

        client.db.query(`
            INSERT INTO users (username, contributor)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE contributor = ?
        `, [user.username, value, value], (err) => {
            if (err) {
                console.error(err);
                return interaction.reply({ content: "An error occurred.", ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle('Contributor Status Updated')
                .setDescription(`**${user.username}** is now marked as ${value ? 'a contributor' : 'not a contributor'}.`)
                .setColor(value ? 0x2ecc71 : 0xe74c3c);

            interaction.reply({ embeds: [embed], ephemeral: true });
        });
    }
};
