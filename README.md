<div align="center">

<img src="docs/banniere.png" alt="Guess The Coaster, jeu Discord communautaire" width="100%">

</div>

Jeu Discord pour passionnés de parcs. Un joueur lance une manche, le bot affiche la photo d'une montagne russe, et il faut la reconnaître avant la fin du compte à rebours.

Deux façons d'y jouer. Seul, à la difficulté de son choix, pour faire grandir sa collection et sa série. Ou en compétition ouverte, où tout le serveur cherche en même temps et où seul le premier à répondre l'emporte.

<img src="docs/sections/s01.png" alt="01 Le jeu" width="100%">

<img src="docs/schemas/modes.png" alt="Manche solo, commande /guess : le joueur ouvre sa manche et choisit la difficulté ou la laisse au hasard, le bot poste la photo et décompte le temps restant, le joueur écrit sa réponse dans le salon. Trouvé : crédits selon la difficulté, série prolongée, coaster ajouté à la collection. Temps écoulé : la réponse est révélée et la série repart de zéro. Compétition, commande /competition : un round public s'ouvre pour soixante secondes, tout le serveur peut répondre en même temps, le premier à tomber juste ferme le round. Gagné : cinq crédits et le badge Compétition. Manqué : une mauvaise réponse ne coûte rien." width="100%">

En solo, la difficulté fixe à la fois le temps disponible et ce que vaut la bonne réponse.

<img src="docs/schemas/difficultes.png" alt="Easy : soixante secondes pour répondre, un crédit à la clé. Medium : quarante-cinq secondes, deux crédits. Hard : trente secondes et trois crédits, le barème récompense le risque." width="100%">

Sans argument, `/guess` tire un coaster au hasard et applique le barème de sa difficulté réelle. Un joueur ne peut avoir qu'une manche ouverte à la fois.

Les réponses ne sont pas comparées au caractère près : le nom officiel comme le surnom sont acceptés, et une faute de frappe passe tant que la ressemblance reste au-dessus de 80 %, seuil abaissé à 70 % en compétition pour récompenser la vitesse.

La collection est ce qui donne envie de revenir. Un coaster déjà trouvé reste acquis, y compris quand il a été gagné en compétition, et le profil montre ce qui manque.

<img src="docs/sections/s02.png" alt="02 Commandes" width="100%">

<img src="docs/schemas/commandes.png" alt="Jouer : /guess ouvre une manche solo au hasard ou à la difficulté choisie, /competition ouvre un round public de soixante secondes, /endgame clôt le round en cours. Profil : /profile donne collection, crédits, série en cours et record, /badges les badges obtenus, /leaderboard le classement général du serveur. Administration : /addcoaster ajoute un coaster à la base, /addcontributor marque un joueur comme contributeur. Utilitaires : /commands liste les commandes disponibles, /about donne les informations du bot, /ping vérifie qu'il répond." width="100%">

<img src="docs/sections/s03.png" alt="03 Données" width="100%">

Trois tables, une par question.

<img src="docs/schemas/donnees.png" alt="users : qui joue, avec quels crédits, quelle série en cours, quel record et quels badges. coasters : quels coasters existent, avec leur photo, leur parc, leur difficulté et le surnom accepté. user_coasters : qui a trouvé quoi, une ligne par joueur et par coaster, ce qui constitue la collection." width="100%">

La troisième est ce qui fait la collection : une ligne par joueur et par coaster trouvé, insérée seulement si elle n'existe pas déjà.

Dans `users`, `streak` est la série en cours et `best_streak` le record, conservé même quand la série retombe. Les deux badges sont des marqueurs sur la ligne du joueur : `competition_winner` pour une victoire en compétition, `contributor` pour ceux qui ont enrichi la base.

Côté `coasters`, `alias` porte le surnom d'un coaster, accepté au même titre que son nom officiel. C'est ce qui évite de recaler un joueur qui a reconnu la bonne machine mais l'appelle autrement.

<img src="docs/sections/s04.png" alt="04 Installation" width="100%">

<img src="docs/blocs/01.png" alt="Terminal bash : installation" width="100%">

```bash
git clone https://github.com/Microcoaster/GuessTheCoaster.git
cd GuessTheCoaster
npm install
cp .env.example .env
```

Renseigner `.env` avec le token du bot, récupéré sur le [portail développeur Discord](https://discord.com/developers/applications), et les accès à la base.

<img src="docs/blocs/02.png" alt="Terminal bash : lancer le bot" width="100%">

```bash
npm start
```

Les commandes slash s'enregistrent au démarrage. Comptez jusqu'à une heure avant qu'elles apparaissent partout si elles sont publiées globalement.

<img src="docs/sections/s05.png" alt="05 Contribuer" width="100%">

Le jeu vit de sa base de coasters. Ajouter des entrées avec de bonnes photos est la contribution la plus utile, et `/addcontributor` sert à créditer ceux qui le font.

Pour le code, le cycle est celui de l'organisation : une issue décrit le travail, une branche part de `develop`, une pull request revient dessus et passe en review.

---

<sub>MicroCoaster · Auteur : Cybertrist</sub>
