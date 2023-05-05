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
  console.log(subGenreObj);

  const header = d3
    .select("body")
    .append("div")
    .attr("class", "header")
    .style("display", "flex");

  // Créer une fonction pour filtrer les données en fonction du genre sélectionné par l'utilisateur
  function filterDataBySubGenre(subGenre) {
    return games.filter((game) => game.genre === subGenre);
  }

  // creer un bouton pour chaque sous genre
  // lors du click sur le bouton, filtrer les données et créer le graphique donut
  header
    .selectAll("button")
    .data(subGenreObj)
    .enter()
    .append("button")
    .text((d) => d.subGenre)
    .on("click", function (event) {
      select("svg").remove();
      //select("svg").remove();
      console.log(event.target.textContent);
      //createGenderDonutChart(filterDataBySubGenre(event.target.textContent));
      //createAgeStickDiagram(filterDataBySubGenre(event.target.textContent));
      createGenderAgeCharts(filterDataBySubGenre(event.target.textContent));
    });

  // function createGenderDonutChart(filterGenre) {
  //   // compter le nombre de femmes et d'hommes pour les données filtrées
  //   const charFemaleTab = [];
  //   const charMaleTab = [];
  //   filterGenre.forEach((game) => {
  //     charFemaleTab.push(
  //       game.characters.filter((char) => char.Gender == "Female")
  //     );
  //     charMaleTab.push(game.characters.filter((char) => char.Gender == "Male"));
  //   });

  //   const numFemale = charFemaleTab.flat().length;
  //   const numMale = charMaleTab.flat().length;
  //   console.log(numFemale, numMale);

  //   // calculer le pourcentage de femmes et d'hommes
  //   const total = numFemale + numMale;
  //   const percentFemale = d3.format(".1%")(numFemale / total);
  //   const percentMale = d3.format(".1%")(numMale / total);

  //   // créer un ensemble de données pour le graphique donut
  //   const pieData = [
  //     { gender: "Female", count: percentFemale },
  //     { gender: "Male", count: percentMale },
  //   ].map((d) => ({ gender: d.gender, count: parseFloat(d.count) }));

  //   // créer un arc pour chaque tranche du graphique donut
  //   const pie = d3.pie().value((d) => d.count);
  //   const arc = d3.arc().innerRadius(60).outerRadius(100);

  //   // sélectionner le conteneur SVG pour le graphique donut
  //   const svg = select("body")
  //     .append("svg")
  //     .attr("width", 400)
  //     .attr("height", 400)
  //     .append("g")
  //     .attr("transform", "translate(200, 200)");

  //   // ajouter les tranches du graphique donut
  //   const g = svg
  //     .selectAll(".arc")
  //     .data(pie(pieData))
  //     .enter()
  //     .append("g")
  //     .attr("class", "arc");
  //   g.append("path")
  //     .attr("d", arc)
  //     .attr("fill", (d) => (d.data.gender === "Female" ? "pink" : "blue"))
  //     .attr("stroke", "white");

  //   // ajouter des étiquettes pour le nombre de femmes et d'hommes
  //   g.append("text")
  //     .text((d) => d.data.gender + " " + d.data.count + "%")
  //     .attr("transform", (d) => "translate(" + arc.centroid(d) + ")")
  //     .attr("text-anchor", "middle");

  //   // ajouter au centre du graphique donut le nombre total de personnages

  //   svg
  //     .append("text")
  //     .html(total + "\npersonnages")
  //     .attr("transform", "translate(0, 0)")
  //     .attr("text-anchor", "middle");
  // }

  // function createAgeStickDiagram(filterGenre) {
  //   const charUnknowwTab = [];
  //   const charAdultTab = [];
  //   const charTeenagerTab = [];
  //   const charMiddleAgeTab = [];
  //   const charChildTab = [];
  //   const charYoungAdultTab = [];
  //   const charElderlyTab = [];
  //   const charInfantTab = [];

  //   filterGenre.forEach((game) => {
  //     charUnknowwTab.push(
  //       game.characters.filter((char) => char.Age_range == "Unknown")
  //     );
  //     charAdultTab.push(
  //       game.characters.filter((char) => char.Age_range == "Adult")
  //     );
  //     charTeenagerTab.push(
  //       game.characters.filter((char) => char.Age_range == "Teenager")
  //     );
  //     charMiddleAgeTab.push(
  //       game.characters.filter((char) => char.Age_range == "Middle-aged")
  //     );
  //     charChildTab.push(
  //       game.characters.filter((char) => char.Age_range == "Child")
  //     );
  //     charYoungAdultTab.push(
  //       game.characters.filter((char) => char.Age_range == "Young adult")
  //     );
  //     charElderlyTab.push(
  //       game.characters.filter((char) => char.Age_range == "Elderly")
  //     );
  //     charInfantTab.push(
  //       game.characters.filter((char) => char.Age_range == "Infant")
  //     );
  //   });

  //   const numUnknow = charUnknowwTab.flat().length;
  //   const numAdult = charAdultTab.flat().length;
  //   const numTeenager = charTeenagerTab.flat().length;
  //   const numMiddleAge = charMiddleAgeTab.flat().length;
  //   const numChild = charChildTab.flat().length;
  //   const numYoungAdult = charYoungAdultTab.flat().length;
  //   const numElderly = charElderlyTab.flat().length;
  //   const numInfant = charInfantTab.flat().length;

  //   const barData = [
  //     { age: "Unknown", count: numUnknow },
  //     { age: "Adult", count: numAdult },
  //     { age: "Teenager", count: numTeenager },
  //     { age: "Middle-aged", count: numMiddleAge },
  //     { age: "Child", count: numChild },
  //     { age: "Young adult", count: numYoungAdult },
  //     { age: "Elderly", count: numElderly },
  //     { age: "Infant", count: numInfant },
  //   ];

  //   // définir l'échelle linéaire pour l'axe y
  //   const yScale = d3
  //     .scaleLinear()
  //     .domain([0, d3.max(barData, (d) => d.count)])
  //     .range([200, 50]);

  //   const svg3 = select("body")
  //     .append("svg")
  //     .attr("width", 900)
  //     .attr("height", 400)
  //     .append("g")
  //     .attr("transform", "translate(50, 170)");

  //   svg3
  //     .selectAll(".bar")
  //     .data(barData)
  //     .enter()
  //     .append("rect")
  //     .attr("class", "bar")
  //     .attr("x", (d, i) => {
  //       if (i >= 4) {
  //         return i * 70 + 300;
  //       } else {
  //         return i * 70;
  //       }
  //     })
  //     .attr("y", (d) => yScale(d.count))
  //     .attr("width", 20)
  //     .attr("height", (d) => 200 - yScale(d.count))
  //     .attr("fill", "#FFEEEE");

  //   // ajouter des labels en dessous des barres avec le nom de l'age
  //   svg3
  //     .selectAll(".bar-label")
  //     .data(barData)
  //     .enter()
  //     .append("text")
  //     .attr("class", "bar-label")
  //     .attr("x", (d, i) => {
  //       if (i >= 4) {
  //         return i * 70 + 310;
  //       } else {
  //         return i * 70 + 10;
  //       }
  //     })
  //     .attr("y", 220)
  //     .attr("text-anchor", "middle")
  //     .text((d) => d.age);

  //   // ajouter des labels au dessus des barres avec le nombre de personnages de cet age et que si le nombre est = a 0 ne pas afficher
  //   svg3
  //     .selectAll(".bar-value")
  //     .data(barData)
  //     .enter()
  //     .append("text")
  //     .attr("class", "bar-value")
  //     .attr("x", (d, i) => {
  //       if (i >= 4) {
  //         return i * 70 + 310;
  //       } else {
  //         return i * 70 + 10;
  //       }
  //     })
  //     .attr("y", (d) => yScale(d.count) - 5)
  //     .attr("text-anchor", "middle")
  //     .text((d) => {
  //       if (d.count > 0) {
  //         return d.count;
  //       }
  //     });
  // }

  function createGenderAgeCharts(filterGenre) {
    // compter le nombre de femmes et d'hommes pour les données filtrées
    const charFemaleTab = [];
    const charMaleTab = [];
    console.log(filterGenre);
    filterGenre.forEach((game) => {
      charFemaleTab.push(
        game.characters.filter((char) => char.Gender == "Female")
      );
      charMaleTab.push(game.characters.filter((char) => char.Gender == "Male"));
    });

    const numFemale = charFemaleTab.flat().length;
    const numMale = charMaleTab.flat().length;
    console.log(numFemale, numMale);

    // calculer le pourcentage de femmes et d'hommes
    const total = numFemale + numMale;
    const percentFemale = d3.format(".1%")(numFemale / total);
    const percentMale = d3.format(".1%")(numMale / total);

    // créer un ensemble de données pour le graphique donut
    const pieData = [
      { gender: "Female", count: percentFemale },
      { gender: "Male", count: percentMale },
    ].map((d) => ({ gender: d.gender, count: parseFloat(d.count) }));

    // créer un arc pour chaque tranche du graphique donut
    const pie = d3.pie().value((d) => d.count);
    const arc = d3.arc().innerRadius(60).outerRadius(100);

    // sélectionner le conteneur SVG pour les graphiques
    const svg = select("body")
      .append("svg")
      .attr("width", 1000) // Augmenter la largeur pour accueillir les deux graphiques
      .attr("height", 400)
      //centrer le svg dans la page web
      .append("g")
      .attr("transform", "translate(100, 100)");

    // Ajouter le groupe pour le graphique donut
    const genderChart = svg
      .append("g")
      .attr("transform", "translate(410, 110)");

    // ajouter les tranches du graphique donut
    const g = genderChart
      .selectAll(".arc")
      .data(pie(pieData))
      .enter()
      .append("g")
      .attr("class", "arc");
    g.append("path")
      .attr("d", arc)
      .attr("fill", (d) => (d.data.gender === "Female" ? "pink" : "blue"))
      .attr("stroke", "white");

    // ajouter des étiquettes pour le nombre de femmes et d'hommes
    g.append("text")
      .text((d) => d.data.gender + " " + d.data.count + "%")
      .attr("transform", (d) => "translate(" + arc.centroid(d) + ")")
      .attr("text-anchor", "middle");

    // ajouter au centre du graphique donut le nombre total de personnages
    genderChart
      .append("text")
      .html(total + "\npersonnages")
      .attr("transform", "translate(0, 0)")
      .attr("text-anchor", "middle");

    const charUnknowwTab = [];
    const charAdultTab = [];
    const charTeenagerTab = [];
    const charMiddleAgeTab = [];
    const charChildTab = [];
    const charYoungAdultTab = [];
    const charElderlyTab = [];
    const charInfantTab = [];

    filterGenre.forEach((game) => {
      charUnknowwTab.push(
        game.characters.filter((char) => char.Age_range == "Unknown")
      );
      charAdultTab.push(
        game.characters.filter((char) => char.Age_range == "Adult")
      );
      charTeenagerTab.push(
        game.characters.filter((char) => char.Age_range == "Teenager")
      );
      charMiddleAgeTab.push(
        game.characters.filter((char) => char.Age_range == "Middle-aged")
      );
      charChildTab.push(
        game.characters.filter((char) => char.Age_range == "Child")
      );
      charYoungAdultTab.push(
        game.characters.filter((char) => char.Age_range == "Young adult")
      );
      charElderlyTab.push(
        game.characters.filter((char) => char.Age_range == "Elderly")
      );
      charInfantTab.push(
        game.characters.filter((char) => char.Age_range == "Infant")
      );
    });

    const numUnknow = charUnknowwTab.flat().length;
    const numAdult = charAdultTab.flat().length;
    const numTeenager = charTeenagerTab.flat().length;
    const numMiddleAge = charMiddleAgeTab.flat().length;
    const numChild = charChildTab.flat().length;
    const numYoungAdult = charYoungAdultTab.flat().length;
    const numElderly = charElderlyTab.flat().length;
    const numInfant = charInfantTab.flat().length;

    // créer le graphique en bâtons pour les âges
    const barData = [
      { age: "Unknown", count: numUnknow },
      { age: "Adult", count: numAdult },
      { age: "Teenager", count: numTeenager },
      { age: "Middle-aged", count: numMiddleAge },
      { age: "Child", count: numChild },
      { age: "Young adult", count: numYoungAdult },
      { age: "Elderly", count: numElderly },
      { age: "Infant", count: numInfant },
    ];

    // créer l'échelle pour l'axe y
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(barData, (d) => d.count)])
      .range([200, 0]);

    // ajouter les barres
    svg
      .selectAll(".bar")
      .data(barData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => {
        if (i >= 4) {
          return i * 70 + 310;
        } else {
          return i * 70;
        }
      })
      .attr("y", (d) => yScale(d.count))
      .attr("width", 20)
      .attr("height", (d) => 200 - yScale(d.count))
      .attr("fill", "#FFEEEE");

    svg
      .selectAll(".bar-label")
      .data(barData)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d, i) => {
        if (i >= 4) {
          return i * 70 + 310;
        } else {
          return i * 70 + 10;
        }
      })
      .attr("y", 210)
      .attr("text-anchor", "middle")
      .text((d) => d.age);

    // ajouter des labels au dessus des barres avec le nombre de personnages de cet age et que si le nombre est = a 0 ne pas afficher
    svg
      .selectAll(".bar-value")
      .data(barData)
      .enter()
      .append("text")
      .attr("class", "bar-value")
      .attr("x", (d, i) => {
        if (i >= 4) {
          return i * 70 + 310;
        } else {
          return i * 70 + 10;
        }
      })
      .attr("y", (d) => yScale(d.count) - 5)
      .attr("text-anchor", "middle")
      .text((d) => {
        if (d.count > 0) {
          return d.count;
        }
      });
  }
});
