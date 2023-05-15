import { cleanData } from "./data";
import * as d3 from "d3";
import { updateForceAnnee, updateContraintesAnnee } from "./annee";
import { openPopup } from "./popup";
import { updateForcePays } from "./pays";
import { updateForceGenre, updateContraintesGenre } from "./genre";

const center = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

//création des cercles liées aux données
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

  /** CREATION DES CERCLES **/
  svg
    .selectAll("circle")
    .data(dataCircles)
    .join(
      (enter) => enter.append("circle") //new circles
    )
    .attr("r", (d) => radiusScale(d.review))
    //contraintes de base
    .each((d) => {
      d.x = Math.max(
        radiusScale(d.review) + 20,
        Math.min(window.innerWidth - radiusScale(d.review) - 30, d.x)
      );
      d.y = Math.max(60, Math.min(window.innerHeight - 180, d.y));
    })
    //style des cercles
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
        return "#3C79F5"; //blue
      } else if (numFemale > numMale) {
        return "#FF78F0"; //pink
      } else {
        return "#A31ACB"; //purple
      }
    })
    .attr("stroke-width", 1.5)
    .on("click", function (event, d) {
      openPopup(d, svg);
    });

  /** CREATION DES CERCLES NOIRS **/

  // dans chaque cercle mettre un rond noir en fonction du nombre de femme dans l'équipe de devloppement du jeux si il y a un femme le rond est de taille 1 si 2 femme de taille 2 et ainsi de suite, si il y a pas de femme le rond est de taille 0
  const femaleTeamCircles = svg
    .selectAll("circle.game")
    .data(dataCircles)
    .enter()
    .append("circle")
    .attr("class", "game")
    .attr("r", (d) => (d.femaleteam > 0 ? (d.femaleteam / d.team) * 15 + 2 : 0))
    .attr("fill", "black")
    .attr("stroke", "black")
    .on("click", function (event, d) {
      openPopup(d, svg);
    });

  femaleTeamCircles
    .filter((d) => d.femaleteam > 0)
    .raise()
    .attr("stroke-width", 2);
};

//contraintes du bord
const updateContraintes = (dataCircles, radiusScale, svg) => {
  svg
    .selectAll("circle")
    .data(dataCircles)
    .each((d) => {
      d.x = Math.max(
        radiusScale(d.review) + 20,
        Math.min(window.innerWidth - radiusScale(d.review) - 30, d.x)
      );
      d.y = Math.max(60, Math.min(window.innerHeight - 160, d.y));
    });
};

//A chaque mvmt de bulle on appelle cette fonction
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

  //** ENLEVER TOUT LABEL OR AXIS **//
  svg.select(".yearAxis").style("display", "none");
  svg.selectAll(".labels").remove();

  if (category == "Année") {
    svg.select(".yearAxis").style("display", "block").style("z-index", "1000");
  }

  //** FORCE **/
  const simulation = d3.forceSimulation(dataCircles); //force de base

  //mouvement selon la catégorie -> import
  switch (category) {
    case "Année":
      updateForceAnnee(simulation, games);
      break;
    case "Pays":
      updateForcePays(simulation, games, svg);
      break;
    case "Genre":
      updateForceGenre(simulation, games, svg);
      break;

    case "transition": //mouvement des bulles quand on affiche les graphs
      simulation
        .force("x", d3.forceX(200).strength(0.1))
        .force("y", d3.forceY(center.y - 60).strength(0.2));
      break;

    default:
      break;
  }

  //Eviter que les cercles ne se chevauchent
  simulation.force(
    "collide",
    d3.forceCollide().radius((d) => {
      return radiusScale(d.review);
    })
  );

  //On arrête tout mouvement avant de recommencer un autre
  //simulation.stop();

  for (let i = 0; i < 120; i++) {
    simulation.on("tick", () => {
      //On met à jour les nouvelles positions des cercles
      updateCircles(dataCircles, data, svg);

      svg
        .selectAll("circle")
        .data(dataCircles)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);

      svg
        .selectAll("circle.game")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);

      //On met à jour les nouvelles contraintes de position qui aident à positionner correctement

      //updateContraintes(dataCircles, radiusScale, svg); //contraintes bords
      if (category == "Genre") {
        updateContraintesGenre(dataCircles, svg);
      } else if (category == "Année") {
        updateContraintesAnnee(dataCircles, radiusScale, svg);
      }
    });
    simulation.alpha(1).restart();
  }
};
export { updateCircles, updateForce, updateContraintes };
