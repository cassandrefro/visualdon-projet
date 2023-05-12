import * as d3 from "d3";
import { select } from "d3-selection";

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
  const arc = d3.arc().innerRadius(80).outerRadius(100);

  // sélectionner le conteneur SVG pour les graphiques
  const svg = select(".graph")
    .append("svg")
    .attr("width", 900) // Augmenter la largeur pour accueillir les deux graphiques
    .attr("height", 400)
    //centrer le svg dans la page web
    .append("g")
    .attr("transform", "translate(50, 80)");

  // Ajouter le groupe pour le graphique donut
  const genderChart = svg.append("g").attr("transform", "translate(410, 110)");

  // ajouter les tranches du graphique donut
  const g = genderChart
    .selectAll(".arc")
    .data(pie(pieData))
    .enter()
    .append("g")
    .attr("class", "arc");
  g.append("path")
    .attr("d", arc)
    .attr("fill", (d) => (d.data.gender === "Female" ? "#FF78F0" : "#3C79F5"));

  // ajouter des étiquettes pour le nombre de femmes et d'hommes
  g.append("text")
    .text((d) => {
      if (d.data.count) {
        return d.data.count + "%";
      }
    })
    //.attr("transform", (d) => "translate(" + arc.centroid(d) + ")")
    .attr("transform", (d) => {
      if (d.data.gender === "Female") {
        console.log(arc.centroid(d));
        return (
          "translate(" +
          (arc.centroid(d)[0] - 40) +
          "," +
          arc.centroid(d)[1] +
          ")"
        );
      } else {
        return (
          "translate(" +
          (arc.centroid(d)[0] + 40) +
          "," +
          arc.centroid(d)[1] +
          ")"
        );
      }
    })
    .attr("text-anchor", "middle")
    .style("font-size", "16px");

  // ajouter au centre du graphique donut le nombre total de personnages

  genderChart
    .append("text")
    .html("personnages")
    .attr("transform", "translate(0, 10)")
    .attr("text-anchor", "middle");
  genderChart
    .append("text")
    .html(total)
    .attr("transform", "translate(0, -10)")
    .attr("text-anchor", "middle")
    .style("font-size", "20px");

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
        return i * 70 + 300;
      } else {
        return i * 70 - 10;
      }
    })
    .attr("y", (d) => yScale(d.count))
    .attr("width", 20)
    .attr("height", (d) => 200 - yScale(d.count))
    .attr("fill", "black") //#FFEEEE
    .attr("rx", 10);
  //.attr("stroke", "#A31ACB");
  // ajouter des labels en dessous des barres avec le nom de l'age au milieu de la barre
  svg
    .selectAll(".bar-label")
    .data(barData)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", (d, i) => {
      if (i >= 4) {
        return i * 70 + 310;
      } else if (i == 3) {
        return i * 70 + 10;
      } else {
        return i * 70;
      }
    })
    .attr("y", 220)
    .attr("text-anchor", "middle")
    .text((d) => d.age)
    .style("fill", (d) => {
      if (d.count == 0) {
        return "lightgrey";
      }
    });

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
        return i * 70;
      }
    })
    .attr("y", (d) => yScale(d.count) - 5)
    .attr("text-anchor", "middle")
    .text((d) => {
      if (d.count > 0) {
        return d.count;
      }
    })
    .style("font-size", "14px");
  svg
    .style("opacity", 0)
    .transition()
    //.delay(400)
    .duration(800)
    .style("display", "block")
    .style("opacity", 1);
}

export { createGenderAgeCharts };
