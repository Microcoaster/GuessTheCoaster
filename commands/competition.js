const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('competition')
    .setDescription('Démarre une manche publique — le premier à deviner gagne +5 crédits et un badge !'),

  async execute(interaction, client) {
    if (client.currentCompetition && Date.now() < client.currentCompetition.timeout) {
      return interaction.reply({
        content: '🚨 Une compétition est déjà en cours !',
        ephemeral: true
      });
    }

    client.db.query(`SELECT * FROM coasters ORDER BY RAND() LIMIT 1`, async (err, results) => {
      if (err || results.length === 0) {
        console.error(err);
        return interaction.reply({
          content: '❌ Échec lors de la récupération d\'un coaster depuis la base de données.',
          ephemeral: true
        });
      }

      const coaster = results[0];
      const seconds = 60;
      let timeLeft = seconds;

      const createEmbed = (timeDisplay) => new EmbedBuilder()
        .setTitle('🏁 Compétition en cours !')
        .setDescription(
          'Une manche publique a commencé !\n\n' +
          '🎯 Soyez le **premier** à deviner le nom de ce coaster.\n' +
          '<:competition_winner:1368317089156169739> Le gagnant obtient **+5 crédits** et le **Badge Compétition** !\n\n' +
          timeDisplay
        )
        .setImage(coaster.image_url)
        .setColor(0xe67e22)
        .setFooter({ text: 'Tapez votre réponse maintenant !' });

      const sent = await interaction.reply({ embeds: [createEmbed(`⏱️ Temps restant : **${timeLeft}s**`)] });
      const replyMessage = await interaction.fetchReply();

      client.currentCompetition = {
        name: coaster.name,
        alias: coaster.alias,
        difficulty: coaster.difficulty,
        timeout: Date.now() + seconds * 1000,
        message: replyMessage,
        hasWinner: false
      };

      const interval = setInterval(() => {
        if (!client.currentCompetition) return clearInterval(interval);

        timeLeft--;
        if (timeLeft <= 0 || Date.now() > client.currentCompetition.timeout) {
          clearInterval(interval);
          return;
        }

        interaction.editReply({ embeds: [createEmbed(`⏱️ Temps restant : **${timeLeft}s**`)] }).catch(console.error);
      }, 1000);

      setTimeout(() => {
        if (client.currentCompetition && !client.currentCompetition.hasWinner) {
          const timeoutEmbed = new EmbedBuilder()
            .setTitle("⏱️ Temps écoulé !")
            .setDescription("Personne n'a deviné le coaster à temps.")
            .setColor(0xd9534f);

          interaction.followUp({ embeds: [timeoutEmbed] }).catch(console.error);
          client.currentCompetition = null;
          clearInterval(interval);
        }
      }, seconds * 1000);
    });
  }
};
