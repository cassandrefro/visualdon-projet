import { cleanData } from "./data";
import * as d3 from "d3";
import { updateCirclesAnnee, updateForceAnnee } from "./annee";

const center = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

//function pour afficher
const updateCircles = (dataCircles, data, svg) => {
  const games = cleanData(data);

  /** SCALE GAMES CIRCLES **/

  const maxReview = d3.max(games, (d) => d.review);
  const minReview = d3.min(games, (d) => d.review);
  const maxRadius = 60;
  const minRadius = 20;

  const radiusScale = d3
    .scalePow()
    .exponent(10)
    .domain([minReview, maxReview])
    .range([minRadius, maxRadius]);

  svg
    .selectAll("circle")
    .data(dataCircles)
    .join(
      (enter) => enter.append("circle") //new circles

      //.transition()
      //.duration(1000),
      //(update) => update.attr("fill", "white") //not new
      //(exit) => exit.transition().duration(80).style("opacity", 0).remove()
    )
    .attr("r", (d) => radiusScale(d.review))
    //.transition()
    //.duration(80)
    .each((d) => {
      d.x = Math.max(60, Math.min(window.innerWidth - 60, d.x));
      d.y = Math.max(60, Math.min(window.innerHeight - 160, d.y));
    })
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
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
    })
    .on("click", function (event, d) {
      d3.select(".popup").style("display", "block").style("z-index", 1000);
      svg.style("opacity", 0.5);
      d3.select(".popup h1").text(d.Title);
      document.querySelector(".popup img").src = "img/" + d.id + ".jpg";
      d3.select(".studio").text("Studio de développement : " + d.studio);
    });

  return svg.selectAll("circle").data(dataCircles);
};

const updateForce = (category, dataCircles, data, svg) => {
  const games = cleanData(data);

  /** SCALE GAMES CIRCLES **/

  const maxReview = d3.max(games, (d) => d.review);
  const minReview = d3.min(games, (d) => d.review);
  const maxRadius = 60;
  const minRadius = 20;

  const radiusScale = d3
    .scalePow()
    .exponent(10)
    .domain([minReview, maxReview])
    .range([minRadius, maxRadius]);

  //** pays **/
  const pays = [...new Set(games.map((game) => game.country))].sort();

  const countryScale = d3
    .scaleLinear()
    .domain([0, pays.length - 1])
    .range([60, window.innerWidth - 60]);

  //** YEAR AXIS **//

  if (category != "Année") {
    svg.select(".yearAxis").style("display", "none");
  } else {
    svg.select(".yearAxis").style("display", "block").style("z-index", "1000");
    //updateCirclesAnnee(games, svg);
  }

  //** FORCE **/

  const simulation = d3
    //force de base
    .forceSimulation(dataCircles);
  //position selon la catégorie -> import
  switch (category) {
    case "Année":
      updateForceAnnee(simulation, games);
      break;
    case "Pays":
      console.log(dataCircles);
      simulation
        .force(
          "x",
          d3
            .forceX()
            .x((d) => {
              //console.log(countryScale(pays.indexOf(d.country)));
              /*console.log(
              d.country,
              ((pays.indexOf(d.country) + 1) % 2) * 300 + 100
            );*/
              return countryScale(pays.indexOf(d.country));
            })
            .strength(0.2)
        )
        .force(
          "y",
          d3
            .forceY()
            .y(() => center.y) //((pays.indexOf(d.country) + 1) % 2) * window.innerHeight)
            .strength(0.05)
        );
      break;
    case "Genre":
      simulation
        .force("x", d3.forceX(center.x).strength(0.1))
        .force("y", d3.forceY(center.y).strength(0.1));

      break;

    case "transition":
      simulation
        .force("x", d3.forceX(200).strength(0.1))
        .force("y", d3.forceY(center.y).strength(0.1));
      break;

    default:
      simulation
        //.force("charge", d3.forceManyBody().strength(10))
        .force("center", d3.forceCenter(center.x, center.y));
      break;
  }
  simulation /*.force("charge", d3.forceManyBody().strength(10))*/
    .force(
      "collide",
      d3.forceCollide().radius((d) => {
        return radiusScale(d.review);
      })
    );

  //simulation.stop();
  for (let i = 0; i < 120; i++) {
    simulation.on("tick", () => {
      updateCircles(dataCircles, data, svg);
      /*node.each((d) => {
        if (d.country === "USA") {
          d.x = Math.max(
            window.innerWidth - 100,
            Math.min(window.innerWidth - 60, d.x)
          );
          //d.y = Math.max(minY, Math.min(maxY, d.y));
        }
      });*/
    });
    simulation.alpha(1).restart();
  }
};
export { updateCircles, updateForce };
