import { csv } from "d3-fetch";
import { select } from "d3-selection";
//import { csv } from "./index.js";
import * as d3 from "d3";
import * as d3Collection from "d3-collection";
import path from "path";

csv("/data/dataGenderRepresentation.csv").then(function (data) {
  //** DATA INITIALIZED **/

  const filteredData = data.filter(
    (character) => character.Gender === "Female" || character.Gender === "Male"
  );
  const gamesPerCharacter = filteredData.map((character) => character.Game_Id);
  const gamesId = [...new Set(gamesPerCharacter)];

  const games = gamesId.map((gameId) => {
    const filteredCharacters = filteredData.filter(
      (character) => character.Game_Id === gameId
    );

    const gameData = filteredCharacters[0];
    const editedRelease =
      gameData.Release.slice(0, 4) + "20" + gameData.Release.slice(4);
    // console.log(editedRelease);

    const game = {
      id: gameId,
      studio: gameData.Developer,
      release: new Date(editedRelease),
      country: gameData.Country,
      review: gameData.Avg_Reviews,
      genre: gameData["Genre"],
      characters: filteredCharacters,
      Title: gameData.Title,
      femaleteam: gameData.female_team,
      team: gameData.Total_team,
      age: gameData.Age_range,
    };
    return game;
  });
  console.log(games);
  // afficher tout sous genre de jeux
  const allSubGenre = games.map((game) => game.genre);
  const allSubGenreSet = [...new Set(allSubGenre)];
  console.log(allSubGenreSet);

  // creer des objets pour chaque sous genre avec le jeux qui lui correspond de gameId
  const subGenreObj = allSubGenreSet.map((subGenre) => {
    const subGenreObj = {
      subGenre: subGenre,
      games: [],
    };
    return subGenreObj;
  });

  // remplir les objets avec les jeux qui lui correspondent
  subGenreObj.forEach((subGenreObj) => {
    games.forEach((game) => {
      if (subGenreObj.subGenre === game.genre) {
        subGenreObj.games.push(game);
      }
    });
  });

  // creer une position x et y pour chaque sous genre d'objet dans le svg
  subGenreObj.forEach((subGenreObj, i) => {
    subGenreObj.x = 100 + i * 200;
    subGenreObj.y = 100;
  });
  // afficher les objets
  console.log(subGenreObj);
  const header = d3
    .select("body")
    .append("div")
    .attr("class", "header")
    .style("display", "flex");

  const maxReview = d3.max(games, (d) => d.review);
  const minReview = d3.min(games, (d) => d.review);
  const maxRadius = 60;
  const minRadius = 20;

  const radiusScale = d3
    .scalePow()
    .exponent(10)
    .domain([minReview, maxReview])
    .range([minRadius, maxRadius]);

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", 2000)
    .attr("height", 850);

  const center = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };

  const simulation = d3
    .forceSimulation(games)
    .force("charge", d3.forceManyBody().strength(0.01))
    .force("center", d3.forceCenter(center.x, center.y))
    .force(
      "collide",
      d3.forceCollide().radius((d) => {
        return radiusScale(d.review);
        // return Math.sqrt(d.characters.length) * 5 + margin; // ajout de la marge
      })
    )
    .stop();

  for (let i = 0; i < 120; i++) {
    simulation.tick();
  }

  //const radius = maxRadius - margin;

  svg
    .selectAll("circle")
    .data(games)
    .enter()
    .append("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", (d) => radiusScale(d.review))
    .attr("fill", "white")
    .attr("stroke", (d) => {
      const characters = d.characters;
      const numMale = characters.filter(
        (char) => char.Gender === "Male"
      ).length;
      const numFemale = characters.filter(
        (char) => char.Gender === "Female"
      ).length;
      if (numMale > numFemale) {
        return "blue";
      } else if (numFemale > numMale) {
        return "pink";
      } else {
        return "purple";
      }
    });

  // dans chque cercle mettre un rond noir en fonction du nombre de femme dans l'équipe de devloppement du jeux si il y a un femme le rond est de taille 1 si 2 femme de taille 2 et ainsi de suite, si il y a pas de femme le rond est de taille 0
  const femaleTeamCircles = svg
    .selectAll("circle.female-team")
    .data(games.filter((d) => d.femaleteam > 0))
    .enter()
    .append("circle")
    .attr("class", "female-team")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", (d) => d.femaleteam * 3)
    .attr("fill", "black")
    .attr("stroke", "black");

  const gameCircles = svg
    .selectAll("circle.game")
    .data(games)
    .enter()
    .append("circle")
    .attr("class", "game")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", (d) => (d.femaleteam > 0 ? d.femaleteam : 0))
    .attr("fill", "black")
    .attr("stroke", "black");

  gameCircles
    .filter((d) => d.femaleteam > 0)
    .raise()
    .attr("stroke-width", 2);

  header
    .append("button")
    .text("Année")
    .on("click", function () {
      // Fonction à exécuter lors du clic sur le bouton Année
    });

  header
    .append("button")
    .text("Pays")
    .on("click", function () {
      // Fonction à exécuter lors du clic sur le bouton Pays
    });

  header
    .append("button")
    .text("Genre")
    .on("click", function () {
      // Fonction à exécuter lors du clic sur le bouton Genre

      // si on clique sur le bouton genre alors tout les jeux sont affichés
      svg.selectAll("circle").attr("display", "block");
      svg.selectAll("text").attr("display", "block");
    });

  // des boutons pour chaque sous genre de jeux
  const subGenreButtons = d3
    .select("body")
    .append("div")
    .attr("class", "subGenreButtons")
    .style("display", "flex");

  subGenreObj.forEach((subGenreObj) => {
    subGenreButtons
      .append("button")
      .text(subGenreObj.subGenre)
      .on("click", function () {
        // Fonction à exécuter lors du clic sur le bouton Genre
      });
  });

  // si on clique sur un bouton de sous genre de jeux alors on affiche les jeux qui lui correspodend et on cache les autres tout cela en mouvement

  subGenreButtons.selectAll("button").on("click", function () {
    const subGenre = d3.select(this).text();
    console.log(subGenre);
    svg.selectAll("circle").attr("display", "none");
    svg.selectAll("text").attr("display", "none");
    svg
      .selectAll("circle")
      .filter((d) => d.genre === subGenre)
      .attr("display", "block");
    svg
      .selectAll("text")
      .filter((d) => d.genre === subGenre)
      .attr("display", "block");

    const simulation = d3
      .forceSimulation(games)
      .force("charge", d3.forceManyBody().strength(0.01))
      .force("center", d3.forceCenter(center.x, center.y))
      .force(
        "collide",
        d3.forceCollide().radius((d) => {
          return radiusScale(d.review);
          // return Math.sqrt(d.characters.length) * 5 + margin; // ajout de la marge
        })
      )
      .stop();

    for (let i = 0; i < 120; i++) {
      simulation.tick();
    }
    svg
      .selectAll("circle")
      .transition()
      .duration(1000)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);

    svg
      .selectAll("text")
      .transition()
      .duration(1000)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y);
  });

  // lors d'un hover sur un cercle ou dans le cercle on affiche le nom du jeu et le nombre de personnage dans un label en fond noir et le texte en blanc
  let tooltip = null;

  svg
    .selectAll("circle")
    .on("mouseover", function (event, d) {
      const x = event.pageX;
      const y = event.pageY;

      // Supprime l'info-bulle précédente s'il y en a une
      if (tooltip) {
        tooltip.remove();
      }

      // Crée une nouvelle info-bulle
      tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("top", y + "px")
        .style("left", x + "px")
        .html(d.Title);
    })
    .on("mouseout", function () {
      // Supprime l'info-bulle
      if (tooltip) {
        tooltip.remove();
        tooltip = null;
      }
    });

  // lors d'un hover sur un sous genre de jeux les cercles qui lui correspodend sont plus epais et les autres a leur epaisseur d'origine
  subGenreButtons.selectAll("button").on("mouseover", function () {
    const subGenre = d3.select(this).text();
    svg
      .selectAll("circle")
      .filter((d) => d.genre === subGenre)
      .attr("stroke-width", 3);
    svg
      .selectAll("circle")
      .filter((d) => d.genre !== subGenre)
      .attr("stroke-width", 1);
    // quand la souris sort du bouton on remet tout a l'epaisseur d'origine

    subGenreButtons.selectAll("button").on("mouseout", function () {
      svg.selectAll("circle").attr("stroke-width", 1);
    });
  });

  // un bouton permettant de revenir a l'affichage de tous les jeux
  const allGamesButton = d3
    .select("body")
    .append("div")
    .attr("class", "allGamesButton")
    .style("display", "flex");

  allGamesButton
    .append("button")
    .text("Retour")
    .on("click", function () {
      // Fonction à exécuter lors du clic sur le retour
      svg.selectAll("circle").attr("display", "block");
      svg.selectAll("text").attr("display", "block");

      const simulation = d3
        .forceSimulation(games)
        .force("x", d3.forceX(center.x).strength(0.2))
        .force("y", d3.forceY(center.y).strength(0.2))
        .force(
          "collide",
          d3.forceCollide().radius((d) => {
            return Math.sqrt(d.characters.length) * 5 + margin; // ajout de la marge
          })
        )
        .stop();

      for (let i = 0; i < 120; i++) {
        simulation.tick();
      }

      svg
        .selectAll("circle")
        .transition()
        .duration(1000)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);

      svg
        .selectAll("text")
        .transition()
        .duration(1000)
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y);
    });
  const popup = d3
    .select(".popup")
    .style("display", "none")
    .style("background-color", "white")
    .style("width", "400px")
    .style("height", "600px")
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("border", "1px #929292 ")
    .style("box-shadow", "0 0 10px rgba(0, 0, 0, 0.25)") // Ajoute un drop shadow
    .style("border-radius", "20px"); // Ajoute des coins arrondis

  d3.select(".close").on("click", function () {
    d3.select(".popup").style("display", "none");
    svg.style("opacity", 1);
    svg.style("pointer-events", "auto");
    d3.select(".circle").remove();
    d3.select(".personnages").selectAll("circle").remove();
  });

  svg.selectAll("circle").on("click", function (event, d) {
    d3.select(".popup").style("display", "block").style("z-index", 1000);
    svg.style("opacity", 0.5);
    d3.select(".popup h1").text(d.Title);

    // Sélectionne l'élément img dans la popup
    const popupImg = document.querySelector(".popup img");

    // Définit la source de l'image
    popupImg.src = "img/" + d.id + ".jpg";

    // Ajoute le style CSS pour centrer l'image
    popupImg.style.margin = "0 auto";
    popupImg.style.display = "block";

    // ne pas afficher le h2
    d3.select(".popup h2").style("display", "none");

    d3.select(".studio").text("Studio de développement : " + d.studio);
    const formatYear = d3.timeFormat("%Y");
    d3.select(".date").text(
      "Date de sortie : " + formatYear(new Date(d.release))
    );
    d3.select(".genre").text("Genre : " + d.genre);
    d3.select(".pays").text("Pays : " + d.country);
    d3.select(".femme").text(
      "Nombre de femme dans l'équipe développement  : " +
        d.femaleteam +
        " sur " +
        d.team
    );
    d3.select(".pers").text(
      "Nombre de personnages dans le jeux : " + d.characters.length
    );
    d3.select(".notation")
      .append("svg")
      .attr("class", "circle")
      .attr("width", 100)
      .attr("height", 100)
      .append("circle")
      .attr("cx", 40)
      .attr("cy", 40)
      .attr("r", 30)
      .style("fill", "transparent")
      .style("stroke", "#EBEBEB")
      .style("stroke-width", "2px");

    d3.select(".notation svg")
      .append("text")
      .attr("x", 40)
      .attr("y", 40)
      .style("text-anchor", "middle")
      .html("Note:")
      .append("tspan")
      .attr("x", 40)
      .attr("dy", "1.9ex")
      .text(d.review + "/10");

    console.log(d.review);

    d3.select(".personnages").html(""); // Supprime tous les éléments enfants de la classe "personnages"

    const characters = d.characters.slice(0, 10);
    const svg4 = d3
      .select(".personnages")
      .append("svg")
      .attr("width", 400)
      .attr("height", 50);

    const maleCharacters = characters.filter((d) => d.Gender === "Male");
    const femaleCharacters = characters.filter((d) => d.Gender === "Female");
    const sortedCharacters = d3
      .merge([femaleCharacters, maleCharacters])
      .sort((b, a) => a.Gender.localeCompare(b.Gender));

    const personnage = svg4
      .selectAll("g")
      .data(sortedCharacters)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(${i * 30 + 20 + 35}, 30)`);

    personnage
      .append("circle")
      .attr("r", 9)
      .attr("fill", (d) => (d.Gender === "Male" ? "blue" : "pink"));

    personnage
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d) => (d.Gender === "Male" ? "blue" : "pink"))
      .attr("cy", -14);

    console.log(sortedCharacters);

    // Empêche le clic sur les autres cercles
    svg.style("pointer-events", "none");
  });
});
