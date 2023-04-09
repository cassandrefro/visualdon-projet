import { csv } from "d3-fetch";
import { select } from "d3-selection";

csv("/data/dataGenderRepresentation.csv")
  .then(function (data) {
    //** DATA INITIALIZED **/

    const filteredData = data.filter(
      (character) =>
        character.Gender === "Female" || character.Gender === "Male"
    );
    const gamesPerCharacter = filteredData.map(
      (character) => character.Game_Id
    );
    const gamesId = [...new Set(gamesPerCharacter)];

    const games = gamesId.map((gameId) => {
      const filteredCharacters = filteredData.filter(
        (character) => character.Game_Id === gameId
      );

      const gameData = filteredCharacters[0];
      const editedRelease =
        gameData.Release.slice(0, 4) + "20" + gameData.Release.slice(4);
      console.log(editedRelease);

      const game = {
        id: gameId,
        studio: gameData.Developer,
        release: new Date(editedRelease),
        country: gameData.Country,
        review: gameData.Avg_Reviews,
        genre: gameData["Sub.genre"],
        characters: filteredCharacters,
      };
      return game;
    });
    console.log(games);

    /** DATA BY CHART **/

    /** BY YEAR */

    const gamesByYear = games.slice();
    gamesByYear.sort((a, b) => a.release.getTime() - b.release.getTime());
    console.log(gamesByYear);

    /** CREATION DES SVG **/

    // Append svg
    select("body").append("div").attr("class", "monSVG");

    // Set width and height
    const width = 1000;
    const height = 500;

    // Création SVG
    const monSVG = select(".monSVG")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Définition des groupes
    const groupe1 = monSVG.append("g");
    const groupe2 = monSVG.append("g");
    const groupe3 = monSVG.append("g");

    const step = (width - 40) / games.length;
    console.log("longueur du jeux: " + step);

    // entre 0 et 500 -> 0-nb, nb-2nb, ... xnb-460
    //const indice = 0;
    //const xPosition = step * indice;
    //console.log(gamesByYear);
    gamesByYear.forEach((game, i) => {
      console.log(game);
      //xPosition = step * indice;

      groupe1
        .append("circle")
        .attr("cx", 50 * i)
        .attr("cy", "50")
        .attr("r", "40")
        .attr("id", game.id);
      indice++;
      //select("body").append("div").attr("id", game.id);
    });
  })
  .catch(function (error) {
    // Gérer les erreurs ici
  });
