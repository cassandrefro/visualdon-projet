import * as d3 from "d3";

const updateForceAnnee = (simulation, games) => {
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

  //** SCALE YEAR **/

  const maxYear = d3.max(games, (d) => d.release.getFullYear());
  const minYear = d3.min(games, (d) => d.release.getFullYear());
  const maxX = innerWidth - 150;
  const minX = 150;

  const yearScale = d3
    .scaleLinear()
    .domain([minYear, maxYear])
    .range([minX, maxX]);

  /** FORCE CENTER **/

  const center = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };

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
  /* .force(
      "collide",
      d3.forceCollide().radius((d) => {
        return radiusScale(d.review);
      }) 
    );*/
  /*
  for (let i = 0; i < 120; i++) {
    simulation.tick();
  }*/
};

const updateCirclesAnnee = (games, svg) => {
  //** SCALE YEAR **/

  const maxYear = d3.max(games, (d) => d.release.getFullYear());
  const minYear = d3.min(games, (d) => d.release.getFullYear());
  const maxX = innerWidth - 150;
  const minX = 150;

  const yearScale = d3
    .scaleLinear()
    .domain([minYear, maxYear])
    .range([minX, maxX]);

  const yearAxis = d3.axisBottom(yearScale).tickFormat(d3.format(""));
  /*
    .tickValues(
      yearScale.domain().filter((d, i) => {
        return i % 2 === 0;
      })
    )
    .tickFormat((d) => d * 1000); // customAxisFormat(d));*/
  svg
    .append("g")
    .attr("class", "yearAxis")
    .attr("transform", "translate(0," + window.innerHeight / 2 + ")")
    .style("z-index", 1000)
    .call(yearAxis);
};

export { updateForceAnnee, updateCirclesAnnee };
