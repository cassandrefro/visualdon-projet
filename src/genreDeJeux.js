import { csv } from "d3-fetch";
import { select } from "d3-selection";
//import { csv } from "./index.js";
import * as d3 from "d3";
import * as d3Collection from "d3-collection";

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
      genre: gameData["Sub.genre"],
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

  const margin = 30; // ajout de la marge

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
    /*.attr("r", (d) => radiusScale(d.characters.length))*/
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

    // additionner tout les personnages de chaque jeux et faire un pourcentage par rapport au nombre total de personnages femme et homme de tous les jeux de ce sous genre de jeux

    const marginB = { top: 20, right: 20, bottom: 30, left: 40 };
    const widthB = 960 - marginB.left - marginB.right;
    const heightB = 500 - marginB.top - marginB.bottom;

    //subGenre = d3.select(this).text();
    const data = games.filter((d) => d.genre === subGenre);
    const totalCharacters = data.reduce((acc, d) => {
      return acc + d.characters.length;
    }, 0);
    const totalFemaleCharacters = data.reduce((acc, d) => {
      return (
        acc + d.characters.filter((char) => char.gender === "female").length
      );
    }, 0);
    const totalMaleCharacters = data.reduce((acc, d) => {
      return acc + d.characters.filter((char) => char.gender === "male").length;
    }, 0);
    const dataBar = [
      {
        genre: "female",
        value: (totalFemaleCharacters / totalCharacters) * 100,
      },
      { genre: "male", value: (totalMaleCharacters / totalCharacters) * 100 },
    ];

    const svgBar = d3
      .select("body")
      .append("svg")
      .attr("width", widthB + marginB.left + marginB.right)
      .attr("height", heightB + marginB.top + marginB.bottom)
      .append("g")
      .attr("transform", "translate(" + marginB.left + "," + marginB.top + ")");

    const x = d3.scaleBand().rangeRound([0, widthB]).padding(0.1);
    const y = d3.scaleLinear().rangeRound([heightB, 0]);

    x.domain(
      dataBar.map(function (d) {
        return d.genre;
      })
    );
    y.domain([
      0,
      d3.max(dataBar, function (d) {
        return d.value;
      }),
    ]);

    console.log(data);

    // Dessin des barres du graphique en utilisant les données de dataBar
    svgBar
      .selectAll("rect")
      .data(dataBar)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.genre);
      })
      .attr("y", function (d) {
        return y(d.value);
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        return heightB - y(d.value);
      })
      .attr("fill", function (d) {
        if (d.genre === "female") {
          return "pink";
        } else if (d.genre === "male") {
          return "blue";
        }
      });

    // Ajout des axes x et y au graphique
    svgBar
      .append("g")
      .attr("transform", "translate(0," + heightB + ")")
      .call(d3.axisBottom(x));

    svgBar.append("g").call(d3.axisLeft(y));
  });

  // lors d'un hover sur un cercle ou dans le cercle on affiche le nom du jeu et le nombre de personnage dans un label en fond noir et le texte en blanc
  svg
    .selectAll("circle")
    .on("mouseover", function (event, d) {
      const x = event.pageX;
      const y = event.pageY;
      d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("top", y + "px")
        .style("left", x + "px")
        .html(d.Title + "<br>Nombre de personnages: " + d.characters.length);
    })
    .on("mouseout", function () {
      d3.select(".tooltip").remove();
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

  // on affiche le graphique en barre
});
