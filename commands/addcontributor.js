const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addcontributor')
        .setDescription('Ajoute ou retire le statut de contributeur à un utilisateur')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L’utilisateur à modifier')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('valeur')
                .setDescription('true pour ajouter, false pour retirer')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, client) {
        const user = interaction.options.getUser('utilisateur');
        const value = interaction.options.getBoolean('valeur');

        client.db.query(`
            INSERT INTO users (username, contributor)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE contributor = ?
        `, [user.username, value, value], (err) => {
            if (err) {
                console.error(err);
                return interaction.reply({ content: "❌ Une erreur est survenue.", ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle('✅ Statut mis à jour')
                .setDescription(`**${user.username}** est maintenant ${value ? '✅ contributeur' : '❌ non contributeur'}.`)
                .setColor(value ? 0x2ecc71 : 0xe74c3c);

            interaction.reply({ embeds: [embed], ephemeral: true });
        });
    }
};
