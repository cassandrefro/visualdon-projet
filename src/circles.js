import { cleanData } from "./data";
import * as d3 from "d3";
import { updateForceAnnee } from "./annee";

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
      simulation.force("center", d3.forceCenter(center.x, center.y));
      break;
    case "Genre":
      simulation.force("center", d3.forceCenter(center.x, center.y));
      break;

    case "transition":
      simulation
        .force(
          "x",
          d3.forceX().x(() => 210)
        )
        .force(
          "y",
          d3.forceY().y(() => center.y)
        );
      break;

    default:
      simulation
        //.force("charge", d3.forceManyBody().strength(10))
        .force("center", d3.forceCenter(center.x, center.y));
      break;
  }
  simulation.force("charge", d3.forceManyBody().strength(30)).force(
    "collide",
    d3.forceCollide().radius((d) => {
      return radiusScale(d.review);
    })
  );

  //simulation.stop();
  for (let i = 0; i < 120; i++) {
    simulation.on("tick", () => updateCircles(dataCircles, data, svg));
    simulation.alpha(1).restart();
  }
};
export { updateCircles, updateForce };
