import * as d3 from "d3";

const openPopup = (d, svg) => {
  d3.select(".popup").style("display", "block").style("z-index", 900);
  svg.style("opacity", 0.5);
  //document.querySelector(".graph").style("opacity", 0.5);
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

  //const characters = d.characters.slice(0, 10);
  const svg4 = d3
    .select(".personnages")
    .append("svg")
    .attr("width", 400)
    .attr("height", 50);

  const maleCharacters = d.characters.filter((d) => d.Gender === "Male");
  const femaleCharacters = d.characters.filter((d) => d.Gender === "Female");
  const totalCharacters = maleCharacters.length + femaleCharacters.length;
  const numMaleCircles = Math.round(
    (maleCharacters.length / totalCharacters) * 10
  );
  const numFemaleCircles = Math.round(
    (femaleCharacters.length / totalCharacters) * 10
  );
  const sortedCharacters = [];
  for (let i = 0; i < numFemaleCircles; i++) {
    sortedCharacters.push({ Gender: "Female" });
  }
  for (let i = 0; i < numMaleCircles; i++) {
    sortedCharacters.push({ Gender: "Male" });
  }

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

  console.log(sortedCharacters);

  // Empêche le clic sur les autres cercles
  svg.style("pointer-events", "none");
};

export { openPopup };
