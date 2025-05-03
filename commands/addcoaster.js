const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addcoaster')
        .setDescription('Adds a coaster to the database (contributors only)')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Exact name of the coaster')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('alias')
                .setDescription('Alias or alternate name (type "x" if none)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('difficulty')
                .setDescription('Difficulty: easy, medium, hard')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('image')
                .setDescription('Image URL of the coaster')
                .setRequired(true)),

    async execute(interaction, client) {
        const username = interaction.user.username;
        const name = interaction.options.getString('name');
        const alias = interaction.options.getString('alias');
        const difficulty = interaction.options.getString('difficulty').toLowerCase();
        const imageUrl = interaction.options.getString('image');

        //Check URL validity
        try {
            const url = new URL(imageUrl);
            if (!["http:", "https:"].includes(url.protocol)) {
                throw new Error();
            }
        } catch {
            return interaction.reply({
                content: "Invalid image URL. Please provide a valid link starting with http:// or https://.",
                ephemeral: true
            });
        }

        // 1. Check contributor status
        client.db.query(`SELECT contributor FROM users WHERE username = ?`, [username], (err, results) => {
            if (err) {
                console.error(err);
                return interaction.reply({ content: "SQL error while checking contributor status.", ephemeral: true });
            }

            if (results.length === 0 || results[0].contributor !== 1) {
                return interaction.reply({
                    content: "You are not authorized to use this command. Only contributors can add coasters.",
                    ephemeral: true
                });
            }

            // 2. Check difficulty validity
            if (!["easy", "medium", "hard"].includes(difficulty)) {
                return interaction.reply({
                    content: "Invalid difficulty. Please choose from `easy`, `medium`, or `hard`.",
                    ephemeral: true
                });
            }

            // 3. Insert into the database
            const aliasFinal = alias.toLowerCase() === "x" ? null : alias;

            client.db.query(`
                INSERT INTO coasters (name, alias, difficulty, image_url)
                VALUES (?, ?, ?, ?)
            `, [name, aliasFinal, difficulty, imageUrl], (err) => {
                if (err) {
                    console.error(err);
                    return interaction.reply({
                        content: "An error occurred while adding the coaster.",
                        ephemeral: true
                    });
                }

                const embed = new EmbedBuilder()
                    .setTitle("New Coaster Added!")
                    .setDescription(`The coaster **${name}** was successfully added to the database.`)
                    .addFields(
                        { name: "Alias", value: aliasFinal || "*None*", inline: true },
                        { name: "Difficulty", value: difficulty, inline: true }
                    )
                    .setImage(imageUrl)
                    .setColor(0x00b894)
                    .setTimestamp();

                interaction.reply({ embeds: [embed] });
            });
        });
    }
};
