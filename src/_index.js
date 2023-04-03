import { csv } from "d3-fetch";

csv("/data/dataGenderRepresentation.csv")
  .then(function (data) {
    const filteredData = data.filter(
      (character) =>
        character.Gender === "Female" || character.Gender === "Male"
    );
    //console.log("données filtrées: " + filteredData);

    const gamesData = filteredData.map((character) => {
      const gameOfCharacter = {
        id: character.Game_Id,
        studio: character.Developer,
        release: character.Release,
        country: character.Country,
        review: character.Avg_Reviews,
        genre: character["Sub.genre"],
      };
      return gameOfCharacter;
    });
    console.log("Données du jeu de chaque personnage : ");
    console.log(gamesData);

    //const games = [...new Set(gamesData)];
    //console.log(games);

    //const gamesByYear = games.slice();
    /*console.log(gamesByYear[0].release);
    console.log(gamesByYear[10].release);
    console.log(gamesByYear[0].release < gamesByYear[10].release);*/
    //gamesByYear.sort((a, b) => a.release >= b.release);
    //console.log(gamesByYear);

    /*
    filteredData.forEach((character) => {
      console.log(character.Game_Id + " : " + character.Title);
    });*/
  })
  .catch(function (error) {
    // Gérer les erreurs ici
  });
