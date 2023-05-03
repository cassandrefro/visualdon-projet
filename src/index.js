import { csv } from "d3-fetch";
import * as d3 from "d3";
import { cleanData } from "./data";
import { updateCircles, updateForce } from "./circles";
//import { updateForceAnnee } from "./annee";

csv("/data/dataGenderRepresentation.csv").then(function (data) {
  //** GAMES DATA CLEANED **/
  const games = cleanData(data);
  console.log(games);

  /** AJOUT SECTIONS DANS LE DOM **/

  //Ajout header
  const header = d3
    .select("body")
    .append("div")
    .attr("class", "header")
    .style("display", "flex");

  //Ajout svg
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", 2000)
    .attr("height", 650);

  //Ajout footer
  const footer = d3
    .select("body")
    .append("div")
    .attr("class", "footer")
    .style("display", "flex");

  /** AFFICHAGE GAMES CIRCLES DANS SVG**/

  //affichage par défaut
  let dataCircles = games; //unfiltered
  updateCircles(dataCircles, data, svg);
  //updateForceAnnee(dataCircles);
  //force année

  updateForce("Année", dataCircles, data, svg);

  /** AFFICHAGE BUTTONS DANS FOOTER **/

  const anneeTab = [
    ...new Set(games.map((game) => game.release.getFullYear())),
  ].sort();
  const paysTab = [...new Set(games.map((game) => game.country))].sort();
  const genreTab = [...new Set(games.map((game) => game.genre))].sort();
  const categories = {
    Année: anneeTab,
    Pays: paysTab,
    Genre: genreTab,
  };

  //function pour afficher footer
  const updateFooter = (categoryKey) => {
    footer.selectChildren().remove();
    categories[categoryKey].forEach((subCategory) => {
      footer
        .append("button")
        .text(subCategory)
        .on("click", function () {
          //On update les data suivant une "Année", un "Pays", ou un "Genre" spécifique
          switch (categoryKey) {
            case "Année":
              dataCircles = games.filter(
                (game) => game.release.getFullYear() === subCategory
              );
              break;

            case "Pays":
              dataCircles = games.filter(
                (game) => game.country === subCategory
              );
              break;

            case "Genre":
              dataCircles = games.filter((game) => game.genre === subCategory);
              break;

            default:
              break;
          }
          //On update les circles (force) suivant une "Année", un "Pays", ou un "Genre" spécifique
          //updateCircles(dataCircles, data, svg);
          updateForce("transition", dataCircles, data, svg);
          //+graphiques
        });
    });
  };

  //affichage par défaut: année
  updateFooter("Année");

  /** AFFICHAGE BUTTONS DANS HEADER AVEC FOOTER CORRESPONDANT**/

  Object.keys(categories).forEach((categoryKey) => {
    header
      .append("button")
      .text(categoryKey) //categories[categoryKey]
      .on("click", function () {
        //On affiche toutes les données games
        dataCircles = games;
        updateCircles(dataCircles, data, svg);
        updateForce(categoryKey, dataCircles, data, svg);
        //On update les boutons dans le footer
        updateFooter(categoryKey);
      });
  });

  //** HOVER **/

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

  // lors d'un hover sur une subcategory, les cercles qui lui correspondent sont plus epais et les autres ont leur epaisseur d'origine
  footer.selectAll("button").on("mouseover", function (event, d) {
    const subCat = d3.select(this).text();
    svg
      .selectAll("circle")
      .filter((d) => d.genre === subCat)
      .attr("stroke-width", 3);

    svg
      .selectAll("circle")
      .filter((d) => d.genre !== subCat)
      .attr("stroke-width", 1);
    // quand la souris sort du bouton on remet tout a l'epaisseur d'origine

    footer.selectAll("button").on("mouseout", function () {
      svg.selectAll("circle").attr("stroke-width", 1);
    });
  });

  /*

  // dans chque cercle mettre un rond noir en fonction du nombre de femme dans l'équipe de devloppement du jeux si il y a un femme le rond est de taille 1 si 2 femme de taille 2 et ainsi de suite, si il y a pas de femme le rond est de taille 0
  svg
    .selectAll("circle.female-team")
    .data(games.filter((d) => d.femaleteam > 0))
    .join("circle")
    .attr("class", "female-team")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", (d) => d.femaleteam * 3)
    .attr("fill", "black")
    .attr("stroke", "black");

  const femaleGameCircles = svg
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

  femaleGameCircles
    .filter((d) => d.femaleteam > 0)
    .raise()
    .attr("stroke-width", 2);

    */
});
