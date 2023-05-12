import * as d3 from "d3";

const updateForcePays = (simulation, games, svg) => {
  /** SCALE PAYS **/
  const pays = [...new Set(games.map((game) => game.country))].sort();

  const countryScale = d3
    .scaleLinear()
    .domain([0, 3])
    .range([100, window.innerHeight - 220]);

  //const countryX = [60,...center,window.innerWidth - 60]

  /** FORCE CENTER **/

  const center = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };

  //** FORCE PAYS **/

  simulation
    //.force("charge", d3.forceManyBody().strength(10))

    .force(
      "y",
      d3
        .forceY((d) => {
          if (pays.indexOf(d.country) <= 7) {
            return countryScale(0);
          } else if (pays.indexOf(d.country) <= 8) {
            return countryScale(2);
          } else if (pays.indexOf(d.country) == 12) {
            return countryScale(2);
          } else {
            return countryScale(3) - 50;
          }
          //return pays.indexOf(d.country) <= 6 ? 100 : window.innerHeight - 300;
        })
        .strength(0.1)
    )
    .force(
      "x",
      d3
        .forceX()
        .x((d) => {
          if (pays.indexOf(d.country) <= 7) {
            return d3
              .scaleLinear()
              .domain([0, 7])
              .range([0, window.innerWidth - 90])(pays.indexOf(d.country));
          } else if (pays.indexOf(d.country) == 8) {
            return 200;
          } else if (pays.indexOf(d.country) == 12) {
            return window.innerWidth - 200;
          } else {
            return d3
              .scaleLinear()
              .domain([9, 11])
              .range([550, window.innerWidth - 550])(pays.indexOf(d.country));
          }
        })
        .strength(0.05)
    );

  //** LABELS **/
  svg
    .selectAll(".labels")
    .data(pays)
    .enter()
    .append("g")
    .attr("class", "labels")
    .attr("transform", (d) => {
      var paysX = 0;
      var paysY = 0;

      if (pays.indexOf(d) == 0) {
        paysX = 60;
      } else if (pays.indexOf(d) <= 7) {
        paysX = d3
          .scaleLinear()
          .domain([0, 7])
          .range([0, window.innerWidth - 90])(pays.indexOf(d));
      } else if (pays.indexOf(d) == 8) {
        paysX = 500;
      } else if (pays.indexOf(d) == 12) {
        paysX = window.innerWidth - 500;
      } else {
        paysX = d3
          .scaleLinear()
          .domain([9, 11])
          .range([550, window.innerWidth - 550])(pays.indexOf(d));
      }

      if (pays.indexOf(d) <= 7) {
        paysY = countryScale(0) + 100;
      } else if (pays.indexOf(d) <= 8) {
        paysY = countryScale(2);
      } else if (pays.indexOf(d) == 12) {
        paysY = countryScale(2);
      } else {
        paysY = countryScale(3) + 15;
      }

      return "translate(" + paysX + "," + paysY + ")";
    })
    .append("text")
    .text((d) => d)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("color", "black");
};
export { updateForcePays };
