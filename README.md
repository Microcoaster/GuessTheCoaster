# 🎢 GuessTheCoaster - Discord Bot

**GuessTheCoaster** is a community-driven Discord bot where users guess the names of roller coasters based on images. Collect coasters, earn credits, build your streak, and climb the leaderboard. If you love theme parks and quizzes, you're in the right place!

<p align="center">
  <img src="https://media.discordapp.net/attachments/1367776168673280090/1392135506086858803/roller-coaster-526534_1280.jpg?ex=686e6eb9&is=686d1d39&hm=cdd155bdc8ca4bf1a76658d49f9890c26520a04f050d151c3cb6e355428dc1a8&=&format=webp" width="600" alt="Banner"/>
</p>

## 🚀 Features

- 🖼️ Image-based coaster guessing
- 🧠 Streak and best streak tracking
- 🪙 Credit system with difficulties: Easy / Medium / Hard
- 🏆 User profiles with collectible stats and dynamic badges
- 📈 Global and local leaderboards (`/leaderboard`)
- 🎖️ Contributor system (submit coasters!)
- 🛠️ Admin commands for managing contributors and coasters

## 📸 How It Works

1. Use `/guess` to start a round.
2. The bot sends you an image of a coaster.
3. Type the correct name (or accepted alias) in chat.
4. Get rewarded with credits & streaks if correct. Missed it? Your streak resets!
5. View your profile with `/profile`.

## 🛡️ Roles & Badges

- Contributor  
- 50% of coasters collected  
- All coasters collected  
- 10-win streak  
- 50-win streak  
- The mythical creator

> 🛠️ *More badges coming soon... once the dev stops riding coasters and working on microcoaster launch systems!*

## 🔧 Commands

| Command            | Description                                                    |
|--------------------|----------------------------------------------------------------|
| `/guess`           | Start a guessing round with a random coaster                   |
| `/profile`         | View your profile or another user's stats                      |
| `/leaderboard`     | Show leaderboard by credits, streaks, or completion            |
| `/addcoaster`      | Add a new coaster to the database (contributors only)          |
| `/addcontributor`  | Grant or remove contributor rights (owner only)                |
| `/badges`          | Display all obtainable badges and their meaning                |
| `/commands`        | List all available commands in the bot                         |
| `/about`           | Learn more about the GuessTheCoaster bot                       |
| `/ping`            | Check the bot’s latency and responsiveness                     |
| `/competition`    | Lance une devinette ouverte, le premier à trouver gagne +5 crédits & un rôle spécial |
| `/endgame`        | Termine la session de jeu en cours (si applicable)                                   |
| `/competition`    | Launch an open challenge; first correct answer earns +5 credits & a special role |
| `/endgame`        | End the current guessing session (if applicable)                                 |

## 🧑‍💻 Dev Setup

1. Clone the repository

2. Create a `.env` file with:

DISCORD_TOKEN=your_token  
CLIENT_ID=your_bot_id  
DB_HOST=localhost  
DB_USER=root  
DB_PASS=your_password  
DB_NAME=your_db

3. Install dependencies:

`npm install`

4. Start the bot:

`node index.js`

### 📄 `users`

| Column               | Type        | Description                                                   |
| -------------------- | ----------- | ------------------------------------------------------------- |
| `id`                 | INT         | Unique user ID (auto-incremented)                             |
| `username`           | VARCHAR(50) | Unique username                                               |
| `credits`            | INT         | Total credits earned                                          |
| `streak`             | INT         | Current correct answer streak                                 |
| `best_streak`        | INT         | Highest streak achieved                                       |
| `last_played`        | DATETIME    | Last time the user played                                     |
| `guild_id`           | VARCHAR(64) | Discord server (guild) ID                                     |
| `contributor`        | BOOLEAN     | Whether the user is a contributor (1 = yes, 0 = no)           |
| `competition_winner` | BOOLEAN     | Whether the user has won at least one `/competition` round    |
| `has_completed`      | BOOLEAN     | Whether the user has guessed all available coasters correctly |


---

### 🎢 `coasters`

| Column       | Type    | Description                                   |
| ------------ | ------- | --------------------------------------------- |
| `id`         | INT     | Unique coaster ID (auto-incremented)          |
| `name`       | VARCHAR | Primary name of the coaster                   |
| `alias`      | VARCHAR | Alternate name (can be `NULL`)                |
| `difficulty` | ENUM    | Difficulty level: `easy`, `medium`, or `hard` |
| `image_url`  | TEXT    | URL to the coaster image                      |

---

### ✨ `user_coasters`

| Column       | Type    | Description                                 |
| ------------ | ------- | ------------------------------------------- |
| `username`   | VARCHAR | Username of the player                      |
| `coaster_id` | INT     | ID of the coaster they successfully guessed |

## 🤝 Contribute

Want to help by submitting coaster pictures or ideas?  
Reach out via **Discord** and earn the 🎖️ **Contributor** badge!


