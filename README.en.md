<div align="center">

<p>
  <a href="README.md"><img src="docs/langues/fr-off.png" alt="Lire cette page en français" width="150" /></a>
  <img src="docs/langues/en-on.png" alt="English, page shown" width="150" />
</p>

<img src="docs/en/banniere.png" alt="Guess The Coaster, a community Discord game" width="100%">

</div>

A Discord game for theme park enthusiasts. A player opens a round, the bot posts a photo of a roller coaster, and you have to name it before the countdown runs out.

Two ways to play. Solo, at the difficulty of your choice, to grow your collection and your streak. Or in an open competition, where the whole server searches at once and only the first to answer takes it.

<img src="docs/en/sections/s01.png" alt="01 The game" width="100%">

<img src="docs/en/schemas/modes.png" alt="Solo round, /guess command: the player opens a round and picks the difficulty or leaves it to chance, the bot posts the photo and counts the time down, the player types the answer in the channel. Found: credits by difficulty, streak extended, coaster added to the collection. Time up: the answer is revealed and the streak resets to zero. Competition, /competition command: a public round opens for sixty seconds, the whole server can answer at once, the first to get it right closes the round. Won: five credits and the Competition badge. Missed: a wrong answer costs nothing." width="100%">

In solo play, the difficulty sets both the time available and what a correct answer is worth.

<img src="docs/en/schemas/difficultes.png" alt="Easy: sixty seconds to answer, one credit at stake. Medium: forty-five seconds, two credits. Hard: thirty seconds and three credits, the scale rewards the risk." width="100%">

With no argument, `/guess` draws a coaster at random and applies the scale of its actual difficulty. A player can only have one round open at a time.

Answers are not matched character by character: the official name and the nickname are both accepted, and a typo gets through as long as the similarity stays above 80%, a threshold lowered to 70% in competition to reward speed.

The collection is what brings people back. A coaster once found stays found, including when it was won in competition, and the profile shows what is still missing.

<img src="docs/en/sections/s02.png" alt="02 Commands" width="100%">

<img src="docs/en/schemas/commandes.png" alt="Play: /guess opens a solo round at random or at the chosen difficulty, /competition opens a public sixty-second round, /endgame closes the round in progress. Profile: /profile gives collection, credits, current streak and personal best, /badges the badges earned, /leaderboard the overall server leaderboard. Administration: /addcoaster adds a coaster to the database, /addcontributor marks a player as a contributor. Utilities: /commands lists the available commands, /about gives the bot information, /ping checks that it answers." width="100%">

<img src="docs/en/sections/s03.png" alt="03 Data" width="100%">

Three tables, one per question.

<img src="docs/en/schemas/donnees.png" alt="users: who plays, with what credits, what current streak, what personal best and what badges. coasters: which coasters exist, with their photo, their park, their difficulty and the accepted nickname. user_coasters: who found what, one row per player per coaster, which is what makes up the collection." width="100%">

The third one is what makes the collection: one row per player per coaster found, inserted only if it is not already there.

In `users`, `streak` is the current run and `best_streak` the record, kept even when the run collapses. The two badges are markers on the player's row: `competition_winner` for a competition win, `contributor` for those who have added to the database.

On the `coasters` side, `alias` carries a coaster's nickname, accepted just as readily as its official name. That is what keeps a player from being turned down for recognising the right machine and calling it something else.

<img src="docs/en/sections/s04.png" alt="04 Installation" width="100%">

```bash
git clone https://github.com/Microcoaster/GuessTheCoaster.git
cd GuessTheCoaster
npm install
cp .env.example .env
```

Fill in `.env` with the bot token, taken from the [Discord developer portal](https://discord.com/developers/applications), and the database credentials.

```bash
npm start
```

The slash commands register at startup. Allow up to an hour before they show up everywhere if they are published globally.

<img src="docs/en/sections/s05.png" alt="05 Contributing" width="100%">

The game lives on its coaster database. Adding entries with good photos is the most useful contribution there is, and `/addcontributor` exists to credit the people who do it.

For code, the cycle is the organisation's: an issue describes the work, a branch starts from `develop`, a pull request comes back onto it and goes through review.

---

<sub>MicroCoaster · Author: Cybertrist</sub>
