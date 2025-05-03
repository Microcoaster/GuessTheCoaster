const { Client, GatewayIntentBits, Collection, REST, Routes, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const mysql = require('mysql2');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const successMessages = [
    "🎯 Spot on! Great job! 🚀",
    "🌟 Nailed it! Well done! 🎉",
    "🌀 You crushed it! Let’s go! 🎢",
    "💡 Bingo! You're on fire! 🔥",
    "🎯 Direct hit! Impressive guess! 🧠",
    "🚀 Sky high! That was fast! ✨",
    "🏁 You nailed that turn! GG! 🏎️",
    "🌈 Perfect match! Well played! 🧩",
    "💥 Bullseye! Right on track! 🎯",
    "🤩 Legendary guess! You're unstoppable! 🌟"
];

client.commands = new Collection();
client.activeGuesses = {};
client.currentCompetition = null;


// Lecture des commandes
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commandsData = [];

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    commandsData.push(command.data.toJSON());
}

// Connexion MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});
db.connect(err => {
    if (err) throw err;
    console.log('Connecté à MySQL');
});
client.db = db;

// Déploiement des commandes slash
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
(async () => {
    try {
        console.log('Déploiement global des commandes slash...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commandsData }
        );
        console.log('Commandes slash enregistrées globalement !');
    } catch (error) {
        console.error('Erreur lors du déploiement des commandes :', error);
    }
})();

// Gestion des interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Erreur lors de l’exécution de la commande.', ephemeral: true });
    }
});

// Bot prêt
client.once('ready', () => {
    console.log(`🤖 Bot connecté en tant que ${client.user.tag}`);

    
    const statuses = [
        "🎢 Guess the coaster",
        "🧠 Challenging your coaster knowledge",
        "⏱️ Name that ride before time runs out",
        "💯 Analyzing launch speed and track layout",
        "⏳ You're on the clock. Ready?",
        "✨ Decoding coaster clues",
        "🚀 From zero to 120km/h!",
        "🌀 Ride loading... hold tight!"
    ];
    

    let index = 0;

    // Update every 15 secondes
    setInterval(() => {
        client.user.setPresence({
            activities: [{
                name: statuses[index % statuses.length],
                type: 5
            }],
            status: 'online'
        });
        index++;
    }, 15000);
});


client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // 🎉 Mode Compétition (tout le monde peut participer)
    if (client.currentCompetition && Date.now() < client.currentCompetition.timeout) {
        const guess = message.content.toLowerCase().trim();
        const validAnswers = [
            client.currentCompetition.name.toLowerCase(),
            client.currentCompetition.alias?.toLowerCase()
        ].filter(Boolean);

        const isCorrect = validAnswers.some(answer => guess.includes(answer));

        if (isCorrect) {
            const username = message.author.username;
            const coasterName = client.currentCompetition.name;

            client.db.query(`
                INSERT IGNORE INTO users (username, credits, streak, best_streak, contributor, competition_winner, guild_id)
                VALUES (?, 0, 0, 0, 0, 0, ?)
            `, [username, message.guildId], err => {
                if (err) return console.error(err);

                client.db.query(`
                    UPDATE users
                    SET credits = credits + 5, competition_winner = 1
                    WHERE username = ?
                `, [username], err => {
                    if (err) return console.error(err);

                    const embed = new EmbedBuilder()
                        .setColor(0xf1c40f)
                        .setTitle("🏆 Competition Won!")
                        .setDescription(`**${username}** was the first to guess **${coasterName}**!`)
                        .addFields({
                            name: '<:trophe:1368024238371508315> Reward',
                            value: `+5 credits & unlocked the competition badge!`,
                            inline: true
                        });

                    message.channel.send({ embeds: [embed] }).then(() => {
                        // 🛠 Met à jour l'embed initial de la compétition
                        if (client.currentCompetition && client.currentCompetition.message) {
                            const originalEmbed = client.currentCompetition.message.embeds?.[0];
                            if (originalEmbed) {
                                const updatedEmbed = EmbedBuilder.from(originalEmbed)
                                    .setDescription(
                                        `✅ The coaster was guessed by **${username}**!\n\n` +
                                        '🎯 Be the **first** to guess the name of this coaster.\n' +
                                        '<:competition_winner:1368317089156169739> Winner gets **+5 credits** and the **Competition Badge**!'
                                    )
                                    .setFooter({ text: '🏁 Competition over!' });
                        
                                client.currentCompetition.message.edit({ embeds: [updatedEmbed] }).catch(console.error);
                            }
                        }                        
                    
                        client.currentCompetition = null;
                    });
                    
                    client.currentCompetition = null;
                });
            });

            return; // ✅ ne pas continuer avec le système normal
        }

        return; // mauvaise réponse en compétition : rien ne se passe
    }

    // 🎯 Système classique (guess personnel)
    const userGuess = client.activeGuesses[message.author.id];
    if (!userGuess || Date.now() > userGuess.timeout) {
        delete client.activeGuesses[message.author.id];
        return;
    }

    const guess = message.content.toLowerCase().trim();
    const validAnswers = [
        userGuess.name.toLowerCase(),
        userGuess.alias?.toLowerCase()
    ].filter(Boolean);

    const isCorrect = validAnswers.some(answer => guess.includes(answer));
    if (!isCorrect) return;

    const username = message.author.username;
    const coasterName = userGuess.name;
    const difficulty = userGuess.difficulty?.toLowerCase() || "easy";

    let creditGain = 1;
    if (difficulty === "medium") creditGain = 2;
    else if (difficulty === "hard") creditGain = 3;

    client.db.query(`
        INSERT IGNORE INTO user_coasters (username, coaster_id)
        SELECT ?, id FROM coasters WHERE LOWER(name) = ? OR LOWER(alias) = ?
    `, [username, coasterName.toLowerCase(), coasterName.toLowerCase()]);

    client.db.query(`
        INSERT IGNORE INTO users (username, credits, streak, best_streak, guild_id)
        VALUES (?, 0, 0, 0, ?)
    `, [username, message.guildId], err => {
        if (err) return console.error(err);

        client.db.query(`
            UPDATE users
            SET credits = credits + ?, streak = streak + 1, last_played = NOW()
            WHERE username = ?
        `, [creditGain, username], err => {
            if (err) return console.error(err);

            client.db.query(`SELECT credits, streak, best_streak FROM users WHERE username = ?`, [username], (err, rows) => {
                if (err || rows.length === 0) return;

                const { credits, streak, best_streak } = rows[0];
                if (streak > best_streak) {
                    client.db.query(`UPDATE users SET best_streak = ? WHERE username = ?`, [streak, username]);
                }

                const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];

                const embed = new EmbedBuilder()
                    .setColor(0x2ecc71)
                    .setTitle(randomMessage)
                    .setDescription(`**${username}** guessed "**${coasterName}**" correctly!`)
                    .addFields(
                        { name: '<a:Medaille:1367883558839914516> Crédit(s)', value: `+${creditGain}`, inline: true },
                        { name: '🔥 Streak', value: `${streak}`, inline: true }
                    );

                message.reply({ embeds: [embed] }).catch(console.error);
                delete client.activeGuesses[message.author.id]; // ✅ supprimer seulement après le succès
            });
        });
    });
});



client.login(process.env.DISCORD_TOKEN);
