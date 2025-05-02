const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Voir le top 10 mondial'),
    async execute(interaction, client) {
        client.db.query(
            'SELECT username, credits FROM users ORDER BY credits DESC LIMIT 10',
            (err, results) => {
                if (err) {
                    console.error(err);
                    return interaction.reply({ content: '❌ Erreur avec la base de données.', ephemeral: true });
                }

                let msg = `🏆 **Classement mondial**\n\n`;
                results.forEach((row, i) => {
                    msg += `**#${i + 1}** — ${row.username} : ${row.credits} crédits\n`;
                });

                interaction.reply({ content: msg });
            }
        );
    }
};
