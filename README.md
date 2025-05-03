# 🎢 GuessTheCoaster - Discord Bot

**GuessTheCoaster** is a community-driven Discord bot where users guess the names of roller coasters based on images. Collect coasters, earn credits, build your streak, and climb the leaderboard. If you love theme parks and quizzes, you're in the right place!

<p align="center">
  <img src="https://media.discordapp.net/attachments/1367776168673280090/1368255110999965887/fast-speed-park-ride-roller-coaster-black-silhouette_80590-14242.png?ex=68178e5f&is=68163cdf&hm=d3636066fffa888bbeff1512a7671ccee72ae54c7bc15e19d7a180788756f172&=&format=webp&quality=lossless" alt="Banner" width="600"/>
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


## 🗂️ Database Schema

### 📄 `users`
| Column       | Type     | Description                             |
|--------------|----------|-----------------------------------------|
| `username`   | VARCHAR  | Unique username of the user             |
| `credits`    | INT      | Number of credits earned                |
| `streak`     | INT      | Current correct guess streak            |
| `best_streak`| INT      | Highest streak achieved                 |
| `contributor`| BOOLEAN  | Whether the user is a contributor (1/0) |
| `guild_id`   | VARCHAR  | ID of the Discord server (guild)        |

---

### 🎢 `coasters`
| Column       | Type     | Description                             |
|--------------|----------|-----------------------------------------|
| `id`         | INT      | Auto-increment coaster ID               |
| `name`       | VARCHAR  | Main coaster name                       |
| `alias`      | VARCHAR  | Alternate name (can be `NULL`)          |
| `difficulty` | ENUM     | Coaster difficulty: `easy`, `medium`, `hard` |
| `image_url`  | TEXT     | URL of the coaster image                |

---

### ✨ `user_coasters`
| Column       | Type     | Description                             |
|--------------|----------|-----------------------------------------|
| `username`   | VARCHAR  | Username of the player                  |
| `coaster_id` | INT      | ID of the guessed coaster               |


## 🤝 Contribute

Want to help by submitting coaster pictures or ideas?  
Reach out via **Discord** and earn the 🎖️ **Contributor** badge!


