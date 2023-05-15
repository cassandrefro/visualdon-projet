# visualdon-projet

**Contexte :** D'où viennent les données, qui les a créées et dans quel contexte ?

Le jeu de données provient de Kaggle et l'auteur.e est un.e data analyst nommé.e Brisa P.
Les données ont été extraites de la recherche de différentes sources dont Wikipedia, Metacritic, IGN, Destructoid, et les sites web des éditeurs et développeurs des jeux.
Chaque jeu vidéo et ses personnages ont été recherchés individuellement pour tirer des conclusions. Ce jeu de données contient des données sur 64 jeux vidéos sortis entre 2012 et 2022. Les jeux ont été choisis comme étant des best-selling ou des top-rating de l'année. Il y a au moins 5 jeux par année et des informations sur les personnages les plus pertinents de la narration. Le but de ce jeu de données est de ranssembler les informations des jeux et de leurs personnages pour annalyser comment les genres sont représentés.

**Description :** Comment sont structurées les données ? Parler du format, des attributs et du type de données.

Le jeu de données est au format csv et les données sont de type quantitatif, temporel et qualitatif.

Title (str) - the title of the game

Release (Date) - The date when the game was first released.

Series (str) - Series where the game belongs, if any.

Genre (str) - The main genre of the game

Subgenre (str) - Main subgenre of the game

Developer (str) - Game developer

Publisher (str) - Game publisher

Country (str) - Country of the game developer

Customization (str) - If the game offers the option of customizing or not the character. It contains three values: ‘Yes’, ‘No’, and ‘Non-Binary’.

Protagonist (int) - number of protagonists for that game.

Protagonist_non_male (int) - number of non-male protagonists. This is, females, non-binaries, and customizable characters.

Relevant_males (int) - male characters in the game.

Relevant_no_males (int) - non-male characters in the game

Percentage_non_male (float) - the percentage of non-male characters

Criteria (str) - criteria for selecting the game. Contains three values:

    - ‘TR’ - top rated
    - ‘MS’ - most sold
    - ‘SR’ - sales and rating.

Director (str) - game director gender. Can contain 4 values:

    - ‘M’ - male
    - ‘F’ - female
    - ‘NB’ - non-binary
    - ‘B’ - both in case there is more than one director of different genders.

Total_team (int) - number of main people involved in the game creation. Includes main programmers, developers, directors, producers, artists, and designers.

Female_team (int) - number of team integrants that are female.

Team_percentage (float) - the percentage of women in the team.

Metacritic (float) - punctuation out of ten given to the game by Metacritic.

Destructoid (float) - punctuation out of ten given to the game by Destructoid.

IGN (float) - punctuation out of ten given to the game by IGN.

GameSpot (float) - punctuation out of ten given to the game by GameSpot.

Avg_reviews (float) - the average of the four previous columns.

Name (str) - the name of the character.

Gender (str) - the gender of the character. It contains 4 different values:

    - ‘Female’ - characters identified as females in the game. They are addressed with the
    pronouns she/her.
    - ‘Male’ - characters identified as males in the game. They are addressed with the pronouns
    he/him.
    - ‘Non-binary’ - characters whose gender is purposely left ambiguous, those that due to their
    nature don’t have a gender and no gender has been assigned to them (animated object,
    plants, animals…), and those who self-identify as non-binaries. They are addressed using the
    pronouns they/them.
    - ‘Custom’ - those characters that the game offers the option to customize their gender. They
    are addressed according to the gender chosen by the player.

Game (str) - foreign key - the Game_Id from the ‘Games’ data frame according to the character’s game.

Age (str) - the age of the character during the game events.

Age_range (str) - a ranking categorization of the ages. The values are as follows:

    - Infant - 0 to 5 years old
    - Child - 6 to 14 years old
    - Teenager - 15 to 17 years old
    - Young-Adult - 18 to 24 years old
    - Adult - 25 to 39 years old
    - Middle-Aged - 40 to 64 years old
    - Elderly - older than 65 years old
    - Unknown - characters whose age is unknown

Playable (boolean) - if the character is playable. It can be either:

    - 0 - No
    - 1 - Yes

Side (str) - the side in which a character is.

    - P - on the protagonist's side. This includes characters that are supportive or neutral towards the protagonist.
    - A - antagonists
    - B - characters that are or can be on both of the above sides.

Relevance (str) - the relevance of a character in a game and in relation to the protagonist

    - PA - protagonist - the most important person(s) in the game. In case of is more than one both of them must have the same importance in the plot.
    - DA - deuteragonist. The second most important character(s) in the plot. In case of being more than one, both must have the same relevance.
    - SK - sidekick. Those characters accompany the protagonist during all, or most of, the story. They offer constant support to the protagonist by giving advice, battle support, exploration aid, etc. They differ from the deuteragonist as they usually have little to no relevance in the storyline.
    - MC - the main character. A character that is rele vant throughout all, or most part of, the story. This category can include antagonists.
    - SC - secondary character. A character that is important in the storyline but whose relevance is occasional, be it because their plot just lasts a short amount of time or because they are mentioned throughout the game but barely appear in-game. This category can include antagonists.
    - MA - main antagonist. The main antagonist(s) of the game. It is relevant throughout the game.

**But :** Qu'est-ce que vous voulez découvrir ? Des tendances ? Vous voulez explorer ou expliquer?

Nous voulons explorer la diversité de genre dans les jeux vidéos, la manière dont les personnages sont représentés. Nous souhaitons voir si la représentation des femmes s'est améliorée au fil du temps et si cela change en fonction du contexte ou des caractéristiques du jeu.
Wireframe : https://github.com/cassandrefro/visualdon-projet/blob/main/Wireframe.pdf

**Références :** Qui d'autre dans le web ou dans la recherche a utilisé ces données ? Dans quel but ?

Les journalistes de jeux vidéos analysent ces données dans le but de sensibiliser et promouvoir les femmes dans les jeux vidéos.

**Déploiement du site sur netlify :** https://diversity-in-video-games.netlify.app/
