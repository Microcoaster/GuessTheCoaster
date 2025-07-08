const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const UserDao = require('../dao/userDao');
const CoasterDao = require('../dao/coasterDao');

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

        // Validate URL format
        try {
            const url = new URL(imageUrl);
            if (!["http:", "https:"].includes(url.protocol)) throw new Error();
        } catch {
            return interaction.reply({
                content: "Invalid image URL. Please provide a valid link starting with http:// or https://.",
                flags: MessageFlags.Ephemeral
            });
        }

        try {
            // Check contributor status
            const isContributor = await UserDao.isContributor({ username });
            if (!isContributor) {
                return interaction.reply({
                    content: "You are not authorized to use this command. Only contributors can add coasters.",
                    flags: MessageFlags.Ephemeral
                });
            }

            // Validate difficulty
            if (!["easy", "medium", "hard"].includes(difficulty)) {
                return interaction.reply({
                    content: "Invalid difficulty. Please choose from `easy`, `medium`, or `hard`.",
                    flags: MessageFlags.Ephemeral
                });
            }

            const aliasFinal = alias.toLowerCase() === "x" ? null : alias;

            // Check for duplicate coaster name
            const exists = await CoasterDao.existsByName(name);
            if (exists) {
                return interaction.reply({
                    content: `A coaster named **${name}** already exists in the database.`,
                    flags: MessageFlags.Ephemeral
                });
            }

            // Insert new coaster (simplified data for this example)
            await CoasterDao.insert({
                name,
                alias: aliasFinal,
                park: "Unknown", // You can add more fields as needed
                country: "Unknown",
                continent: "Unknown",
                type: "Unknown",
                manufacturer: "Unknown",
                year: null,
                height: null,
                speed: null,
                inversions: null,
                difficulty,
                image: imageUrl
            });

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
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: "An error occurred while processing your request.",
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
