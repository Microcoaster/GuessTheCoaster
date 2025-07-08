const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const UserDao = require('../dao/userDao');

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
                flags: MessageFlags.Ephemeral
            });
        }

        const user = interaction.options.getUser('user');
        const value = interaction.options.getBoolean('value');

        try {
            // Check current contributor status
            const isContributor = await UserDao.isContributor({ username: user.username });

            // If already set as requested, inform and return
            if ((value && isContributor) || (!value && !isContributor)) {
                return interaction.reply({
                    content: `**${user.username}** is already ${value ? 'a' : 'not a'} contributor.`,
                    flags: MessageFlags.Ephemeral
                });
            }

            // Update contributor status
            if (value) {
                await UserDao.setContributor({ username: user.username, guildId: interaction.guildId });
            } else {
                // For removal, we'd need a new DAO method but for now just use pool directly
                await client.db.query(
                    `UPDATE users SET contributor = 0 WHERE username = ?`,
                    [user.username]
                );
            }

            const embed = new EmbedBuilder()
                .setTitle('Contributor Status Updated')
                .setDescription(`**${user.username}** is now ${value ? 'marked as a contributor' : 'removed from contributors'}.`)
                .setColor(value ? 0x2ecc71 : 0xe74c3c);

            interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "An error occurred during update.", flags: MessageFlags.Ephemeral });
        }
    }
};
