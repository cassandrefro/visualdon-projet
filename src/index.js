import { csv } from "d3-fetch";
import * as d3 from "d3";
import { cleanData } from "./data";
import { updateCircles, updateForce } from "./circles";
import { updateCirclesAnnee } from "./annee";
import { createGenderAgeCharts } from "./graph";
import { select } from "d3-selection";

csv("/data/dataGenderRepresentation.csv").then(function (data) {
  //** GAMES DATA CLEANED **/
  const games = cleanData(data);
  console.log(games);

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

  /** AJOUT SECTIONS DANS LE DOM **/

  //Ajout boutton home
  d3.select("body")
    .append("button")
    .style("position", "absolute")
    .style("top", "5%")
    .style("left", "5%")
    .text("Accueil")
    .on("click", () => {
      d3.select(this).classed("active", true);
      location.href = "index.html";
    });

  /** TAILLE DU TITRE + HEADER BUTTONS = 60 **/

  //Ajout titre page principale
  d3.select("body")
    .append("h3")
    .text("Diversité des personnages")
    //.style("position", "absolute")
    //.style("left", "50%")
    //.style("transform", "translate(-50%, 0)")
    .style("text-align", "center")
    .style("font-size", "24px")
    .style("font-weight", "400");

  //Ajout header
  const header = d3
    .select("body")
    .append("div")
    .attr("class", "header")
    .style("display", "flex")
    .style("justify-content", "center");

  //Ajout svg circles
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", window.innerWidth - 8)
    .attr("height", window.innerHeight - 180)
    .style("background-color", "white");

  //Ajout svg graph
  d3.select("body")
    .append("div")
    .attr("class", "graph")
    .style("display", "none")
    .style("background-color", "white")
    .style("opacity", 0)
    .attr("width", "900px")
    .attr("height", "400px")
    .style("position", "absolute")
    .style("top", "55%")
    .style("left", "35%")
    .style("transform", "translate(0, -50%)")
    .style("border", "1px #929292 ")
    .style("box-shadow", "0 0 10px rgba(0, 0, 0, 0.25)") // Ajoute un drop shadow
    .style("border-radius", "20px"); // Ajoute des coins arrondis

  d3.select(".graph")
    .append("h1")
    .text("Répartition par genre et par âge")
    .style("text-align", "center")
    .style("font-size", "24px")
    .style("font-weight", "400");

  //Ajout popup
  d3.select(".popup")
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

  //Ajout footer
  const footer = d3
    .select("body")
    .append("div")
    .attr("class", "footer")
    .style("display", "flex")
    .style("justify-content", "center");

  //Ajout axe
  updateCirclesAnnee(games, svg);

  /** AFFICHAGE GAMES CIRCLES DANS SVG**/

  //affichage par défaut
  let dataCircles = games; //unfiltered
  updateCircles(dataCircles, data, svg);
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
          footer.selectAll("button").classed("active", false);
          d3.select(this).classed("active", true);

          //on cache les labels
          svg.selectAll(".labels").remove();

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
          updateForce("transition", dataCircles, data, svg);
          //On update les graphiques
          d3.select(".graph svg").remove();
          createGenderAgeCharts(dataCircles);
          //d3.select(".graph").append("h2").attr
          d3.select(".graph")
            .style("display", "block")
            .transition()
            .duration(400)
            .style("opacity", 1);
        });
    });

    /** AFFICHAGE DANS FOOTER du bouton permettant de revenir a l'affichage de tous les jeux **/
    footer.append("div").style("margin-left", "30px");
    footer
      .append("button")
      .text("Tout")
      .on("click", function () {
        footer.selectAll("button").classed("active", false);
        d3.select(this).classed("active", true);
        //alert(d3.select(this).text());
        //recupere classe active dans header -> updateForce(classeActive,...)
      });
  };

  //affichage par défaut: année
  updateFooter("Année");

  //AFFICHAGE BUTTONS DANS HEADER AVEC FOOTER CORRESPONDANT
  Object.keys(categories).forEach((categoryKey) => {
    header
      .append("button")
      .attr("class", categoryKey)
      .text(categoryKey)
      .on("click", function () {
        header.selectAll("button").classed("active", false);
        d3.select(this).classed("active", true);

        //On update les boutons dans le footer
        updateFooter(categoryKey);

        //On rend le bloc des graphiques transparent
        d3.select(".graph").transition().duration(400).style("opacity", 0);

        //Si le bloc existe encore, on le désactive
        if (
          window
            .getComputedStyle(document.querySelector(".graph"))
            .getPropertyValue("display") != "none"
        ) {
          setTimeout(() => {
            d3.select(".graph").style("display", "none");

            //On affiche toutes les données games après que les graphs disparaissent
            dataCircles = games;
            updateCircles(dataCircles, data, svg);
            updateForce(categoryKey, dataCircles, data, svg);
          }, 400);
        } else {
          //S'il n'y a pas de graph, on affiche toutes les données games sans attendre
          dataCircles = games;
          updateCircles(dataCircles, data, svg);
          updateForce(categoryKey, dataCircles, data, svg);
        }
      });
  });
  header.select(".Année").classed("active", true);

  //** AFFICHAGE BOUTON LEGENDE **/
  const blackCircle = document.getElementById("black-circle");
  const popupLegend = document.getElementById("popup-legendes");
  const closeButton = document.getElementById("close-button");

  d3.select("#black-circle")
    .style("position", "absolute")
    .style("top", "5%")
    .style("right", "5%")
    //.style("transform", "translate(-50%, -50%)")
    .on("click", () => {
      /*
    popupLegend.style.top = blackCircle.offsetTop + "px";
    popupLegend.style.left = blackCircle.offsetLeft + "px";
    popupLegend.style.display = "block";*/

      d3.select("#popup-legendes")
        .style("display", "block")
        .style("z-index", 1000)
        .style("position", "absolute")
        .style("top", "50%")
        .style("right", "50%")
        .style("transform", "translate(-50%, -50%)");

      //mettre le titre du popup
      d3.select("#popup-legendes h2")
        .text("Légendes")
        .style("text-align", "center");
      //centrer le titre du popup

      d3.select(".cercle-jeux")
        .text("1 cercle = 1 jeu")
        .insert("img", "p")
        .attr("src", "img/cercle.png");
      d3.select(".cercle-jeux").style("text-align", "center");
      //d3.select(".cercle-jeux").style("display", "flex");
      // placer l'image au dessus du texte
      d3.select(".cercle-jeux img")
        .style("display", "block")
        .style("margin", "0 auto");

      d3.select(".taille-cercle")
        .text("Taille cercle : note / popularité du jeu")
        .insert("img", "p")
        .attr("src", "img/taille.png");
      d3.select(".taille-cercle").style("text-align", "center");
      //d3.select(".cercle-jeux").style("display", "flex");
      // placer l'image au dessus du texte
      d3.select(".taille-cercle img")
        .style("display", "block")
        .style("margin", "0 auto");

      d3.select(".couleur")
        // .text(
        //   "Les couleurs représentent les personnages masculins et féminins dans le jeu : bleu pour les hommes, rose pour les femmes et violet pour les jeux mixtes."
        // )
        .html(
          "Genre des personnages dans le jeu :<br>Bleu : Majorité de personnages masculins <br>Rose : Majorité de personnages féminins <br>Violet : Parité des genres"
        )
        .insert("img", "p")
        .attr("src", "img/couleur.png");
      d3.select(".couleur").style("text-align", "center");
      //d3.select(".cercle-jeux").style("display", "flex");
      // placer l'image au dessus du texte
      d3.select(".couleur img")
        .style("display", "block")
        .style("margin", "0 auto");

      d3.select(".rond-noir")
        .text(
          "Taille point noir: # de femmes dans l'équipe de développement du jeu."
        )
        .insert("img", "p")
        .attr("src", "img/rondNoir.png");
      d3.select(".rond-noir").style("text-align", "center");
      // placer l'image au dessus du texte
      d3.select(".rond-noir img")
        .style("display", "block")
        .style("margin", "0 auto");

      d3.select(".personnage")
        .text(
          "Les personnages présents sont les personnages importants dans l'histoire du jeu."
        )
        .insert("img", "p")
        .attr("src", "img/personnage.png");
      d3.select(".personnage").style("text-align", "center");
      // placer l'image au dessus du texte
      d3.select(".personnage img")
        .style("display", "block")
        .style("margin", "0 auto");
    });

  closeButton.addEventListener("click", () => {
    popupLegend.style.display = "none";
    // faire disparaitre le texte
    // faire disparaitre le cercle
    d3.select("#popup-legendes svg").remove();

    //faire disparaître le rond noir
    d3.select(".rond-noir p").remove();
    d3.select(".rond-noir svg").remove();
  });

  //** HOVER **/

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
        .html(
          d.Title +
            "<br><span style='font-size:10px; color:lightgrey;'>" +
            d.release.getFullYear() +
            "  |  " +
            d.country +
            "  |  " +
            d.genre +
            "</span>"
        );

      d3.select(this).attr("stroke-width", 5);
    })
    .on("mouseout", function () {
      // Supprime l'info-bulle
      if (tooltip) {
        tooltip.remove();
        tooltip = null;
      }
      d3.select(this).attr("stroke-width", 1.5);
    });

  /*svg
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
    });*/

  // lors d'un hover sur un sous genre de jeux les cercles qui lui correspodend sont plus epais et les autres a leur epaisseur d'origine
  select(".footer button").on("mouseover", (e, d) => {
    //const subGenre = d3.select(this).text();
    alert(e.target.html());
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
      svg.selectAll("circle").attr("stroke-width", 1.5);
    });
  });

  /*

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
  */
});
