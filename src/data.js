//function
const cleanData = (data) => {
  const filteredData = data.filter(
    (character) => character.Gender === "Female" || character.Gender === "Male"
  );
  const gamesPerCharacter = filteredData.map((character) => character.Game_Id);
  const gamesId = [...new Set(gamesPerCharacter)];

  let games = gamesId.map((gameId) => {
    const filteredCharacters = filteredData.filter(
      (character) => character.Game_Id === gameId
    );

    const gameData = filteredCharacters[0];
    const editedRelease =
      gameData.Release.slice(0, 4) + "20" + gameData.Release.slice(4);

    const game = {
      id: gameId,
      studio: gameData.Developer,
      release: new Date(editedRelease),
      country: gameData.Country,
      review: gameData.Avg_Reviews,
      genre: gameData["Genre"], //gameData["Sub.genre"],
      characters: filteredCharacters,
      Title: gameData.Title,
      femaleteam: gameData.female_team,
      team: gameData.Total_team,
      age: gameData.Age_range,
    };
    return game;
  });
  return games;
};

export { cleanData };
