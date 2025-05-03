const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addcoaster')
        .setDescription('Ajoute un coaster à la base de données (réservé aux contributeurs)')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Nom exact du coaster')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('alias')
                .setDescription('Alias ou second nom (ou "x" si aucun)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('difficulty')
                .setDescription('Difficulté : easy / medium / hard')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('image')
                .setDescription('URL de l’image du coaster')
                .setRequired(true)),

    async execute(interaction, client) {
        const username = interaction.user.username;
        const name = interaction.options.getString('name');
        const alias = interaction.options.getString('alias');
        const difficulty = interaction.options.getString('difficulty').toLowerCase();
        const imageUrl = interaction.options.getString('image');

        // 1. Vérifier si l'utilisateur est contributeur
        client.db.query(`SELECT contributor FROM users WHERE username = ?`, [username], (err, results) => {
            if (err) {
                console.error(err);
                return interaction.reply({ content: "❌ Erreur SQL lors de la vérification du statut contributeur.", ephemeral: true });
            }

            if (results.length === 0 || results[0].contributor !== 1) {
                return interaction.reply({
                    content: "🚫 Tu n'es pas autorisé à utiliser cette commande. Seuls les contributeurs peuvent ajouter des coasters.",
                    ephemeral: true
                });
            }

            // 2. Vérifier que la difficulté est valide
            if (!["easy", "medium", "hard"].includes(difficulty)) {
                return interaction.reply({
                    content: "❌ Difficulté invalide. Choisis parmi `easy`, `medium`, ou `hard`.",
                    ephemeral: true
                });
            }

            // 3. Insertion du coaster dans la base
            const aliasFinal = alias.toLowerCase() === "x" ? null : alias;

            client.db.query(`
                INSERT INTO coasters (name, alias, difficulty, image_url)
                VALUES (?, ?, ?, ?)
            `, [name, aliasFinal, difficulty, imageUrl], (err) => {
                if (err) {
                    console.error(err);
                    return interaction.reply({
                        content: "❌ Une erreur est survenue lors de l'ajout du coaster.",
                        ephemeral: true
                    });
                }

                const embed = new EmbedBuilder()
                    .setTitle("🎢 Nouveau coaster ajouté !")
                    .setDescription(`✅ Le coaster **${name}** a bien été ajouté à la base.`)
                    .addFields(
                        { name: "Alias", value: aliasFinal || "*Aucun*", inline: true },
                        { name: "Difficulté", value: difficulty, inline: true }
                    )
                    .setImage(imageUrl)
                    .setColor(0x00b894)
                    .setTimestamp();

                interaction.reply({ embeds: [embed] });
            });
        });
    }
};
