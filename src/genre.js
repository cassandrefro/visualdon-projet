import * as d3 from "d3";

const updateForceGenre = (simulation, games, svg) => {
  const genre = [...new Set(games.map((game) => game.genre))].sort();

  /** SCALE PAYS **/
  /*  const genreScale = d3
    .scaleLinear()
    .domain([0, genre.length - 1])
    .range([60, window.innerWidth - 60]);*/

  //const dist = (i * (window.innerWidth - 120)) / 5 + 60;
  const newPositionsX = [
    90,
    (window.innerWidth - 120) / 5 + 110,
    (2 * (window.innerWidth - 120)) / 5 + 170,
    (3 * (window.innerWidth - 120)) / 5 + 100,
    (4 * (window.innerWidth - 120)) / 5 + 70,
    (5 * (window.innerWidth - 120)) / 5 + 40,
  ];

  /** FORCE CENTER **/

  const center = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };

  //** FORCE PAYS **/

  simulation
    //.force("charge", d3.forceManyBody().strength(10))
    .force(
      "x",
      d3
        .forceX()
        .x((d) => {
          return newPositionsX[genre.indexOf(d.genre)];
        })
        .strength(0.25)
    )
    //.force("charge", d3.forceManyBody().strength(10));

    .force(
      "y",
      d3
        .forceY((d) => {
          return center.y - 60;
        })
        .strength(0.02)
    );

  //** LABELS **/
  svg
    .selectAll(".labels")
    .data(genre)
    .enter()
    .append("g")
    .attr("class", "labels")
    .attr(
      "transform",
      (d) =>
        "translate(" +
        newPositionsX[genre.indexOf(d)] +
        "," +
        (window.innerHeight - 210) +
        ")"
    )
    .append("text")
    .text((d) => d)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("color", "black");
};

//Contraintes Action-adventure pour pas toucher Action
const updateContraintesGenre = (dataCircles, svg) => {
  const genre = [...new Set(dataCircles.map((game) => game.genre))].sort();

  svg
    .selectAll("circle")
    .data(dataCircles)
    .each((d) => {
      if (genre.indexOf(d.genre) == 1) {
        d.x = Math.max(
          (window.innerWidth - 120) / 5 + 60,
          Math.min(window.innerWidth - 60, d.x)
        );
      }
      d.y = Math.max(60, Math.min(window.innerHeight - 280, d.y));
    });
};

export { updateForceGenre, updateContraintesGenre };
