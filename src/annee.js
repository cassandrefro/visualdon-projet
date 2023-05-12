import * as d3 from "d3";

const center = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

const updateForceAnnee = (simulation, games) => {
  //** SCALE YEAR **/
  const maxYear = d3.max(games, (d) => d.release.getFullYear());
  const minYear = d3.min(games, (d) => d.release.getFullYear());
  const maxX = innerWidth - 60;
  const minX = 60;

  const yearScale = d3
    .scaleLinear()
    .domain([minYear, maxYear])
    .range([minX, maxX]);

  //** FORCE ANNEE **/
  simulation
    //.force("charge", d3.forceManyBody().strength(10))
    .force(
      "x",
      d3
        .forceX()
        .x((d) => yearScale(d.release.getFullYear()))
        .strength(0.1)
    )
    .force("y", d3.forceY(center.y).strength(0.05));
};

/** Ajout de l'axe **/
const updateCirclesAnnee = (games, svg) => {
  //** SCALE YEAR **/

  const maxYear = d3.max(games, (d) => d.release.getFullYear());
  const minYear = d3.min(games, (d) => d.release.getFullYear());
  const maxX = innerWidth - 60;
  const minX = 60;

  const yearScale = d3
    .scaleLinear()
    .domain([minYear, maxYear])
    .range([minX, maxX]);

  const yearAxis = d3
    .axisBottom(yearScale)
    .tickFormat(d3.format(""))

    .tickValues(
      yearScale.domain().filter((d, i) => {
        return d === 2012 || d === 2022;
      })
    );
  //.tickFormat((d) => d * 1000); // customAxisFormat(d));
  svg
    .append("g")
    .attr("class", "yearAxis")
    .attr("transform", "translate(0," + center.y + ")")
    .style("display", "none")
    .style("z-index", 1000)
    .call(yearAxis);
};
const updateContraintesAnnee = (dataCircles, radiusScale, svg) => {
  svg
    .selectAll("circle")
    .data(dataCircles)
    .each((d) => {
      const characters = d.characters;
      const numMale = characters.filter(
        (char) => char.Gender === "Male"
      ).length;
      const numFemale = characters.filter(
        (char) => char.Gender === "Female"
      ).length;
      if (numMale > numFemale) {
        d.y = Math.max(60, Math.min(center.y - radiusScale(d.review), d.y));
      } else {
        d.y = Math.max(
          center.y + radiusScale(d.review),
          Math.min(window.innerHeight - 160, d.y)
        );
      }

      d.x = Math.max(
        60 + radiusScale(d.review),
        Math.min(window.innerWidth - 60 - radiusScale(d.review), d.x)
      );
    });
};

export { updateForceAnnee, updateCirclesAnnee, updateContraintesAnnee };
