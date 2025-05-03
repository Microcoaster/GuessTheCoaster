const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addcontributor')
        .setDescription('Add or remove contributor status from a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to modify')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('value')
                .setDescription('true to add, false to remove')
                .setRequired(true)),

    async execute(interaction, client) {
        // Only Cybertrist (creator) can run this
        if (interaction.user.id !== '634433284285268006') {
            return interaction.reply({
                content: "Only **Cybertrist** is allowed to use this command.",
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('user');
        const value = interaction.options.getBoolean('value');

        // Check current contributor status
        client.db.query(`SELECT contributor FROM users WHERE username = ?`, [user.username], (err, results) => {
            if (err) {
                console.error(err);
                return interaction.reply({ content: "SQL error occurred.", ephemeral: true });
            }

            const already = results[0]?.contributor === 1;

            // If already set as requested, inform and return
            if ((value && already) || (!value && !already)) {
                return interaction.reply({
                    content: `**${user.username}** is already ${value ? 'a' : 'not a'} contributor.`,
                    ephemeral: true
                });
            }

            // Update contributor status
            client.db.query(`
                INSERT INTO users (username, contributor)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE contributor = ?
            `, [user.username, value, value], (err) => {
                if (err) {
                    console.error(err);
                    return interaction.reply({ content: "An error occurred during update.", ephemeral: true });
                }

                const embed = new EmbedBuilder()
                    .setTitle('Contributor Status Updated')
                    .setDescription(`**${user.username}** is now ${value ? 'marked as a contributor' : 'removed from contributors'}.`)
                    .setColor(value ? 0x2ecc71 : 0xe74c3c);

                interaction.reply({ embeds: [embed], ephemeral: true });
            });
        });
    }
};
