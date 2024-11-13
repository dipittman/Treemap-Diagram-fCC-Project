let url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';
let req = new XMLHttpRequest();
let svg = d3.select("#chart");
let legend = d3.select("#legend");
let movieData

let drawTreeMap = () => {
//setting up the treemap data
    let hierarchy = d3.hierarchy(movieData, (node) => node.children)
                      .sum((node) => node.value)
                      .sort((node1, node2) => node2.value - node1.value)
    let movieTiles = hierarchy.leaves();
    console.log(movieTiles)

    let createTreeMap = d3.treemap()
                          .size([1000, 600])
    
    createTreeMap(hierarchy)
//tooltip
    let toolTip = d3.select("body")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0)
                    .style("width", "auto")
                    .style("height", "auto")
                    .style("position", "absolute")
                    .style("padding", "5px")
    //format value to have commas, later called in mouseover                
    let formatValue = (value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//drawing the rectangles
    let block = svg.selectAll('g')
                   .data(movieTiles)
                   .enter()
                   .append('g')
                   .attr('transform', (d) => `translate(${d.x0}, ${d.y0})`)

    block.append('rect')
         .attr('class', 'tile')
         .attr('data-name', (d) => d.data.name)
         .attr('data-category', (d) => d.data.category)
         .attr('data-value', (d) => d.data.value)
         .attr('stroke', 'white')
         .attr('stroke-width', '2px')
         .attr('fill', (d) => {
            switch(d.data.category) {
                case "Action":
                    return '#ffadad'
                    break;
                case "Adventure":
                    return '#ffd6a5'
                    break;
                case "Comedy":
                    return '#fdffb6'
                    break;
                case "Drama":
                    return '#caffbf'
                    break;
                case "Animation":
                    return '#9bf6ff'
                    break;
                case "Family":
                    return '#a0c4ff'
                    break;
                case "Biography":
                    return '#bdb2ff'
                    break;
                default:
                    return '#ede9e9'
            }
         })
         .attr('width', (d) => d.x1 - d.x0)
         .attr('height', (d) => d.y1 - d.y0)
         .on("mouseover", (e, d) => {
            toolTip.transition()
            .style("opacity", 1)
            .style("left", (event.pageX + 10)+ "px") 
            .style("top", (event.pageY) + "px")
          toolTip.html(`Movie: ${d.data.name}</br>Category: ${d.data.category}</br>Revenue: $${formatValue(d.data.value)}`)
          document.querySelector('#tooltip').setAttribute('data-value', d.data.value)
          })
          .on("mouseout", (d) => {
            toolTip.transition()
                .style("opacity", 0)
          })
   
    block.append('text')
         .text((d) => d.data.name)
         .attr('x', 5)
         .attr('y', 20)
         .attr('class', 'text')
         .style('font-size', '12px')

}

let drawLegend = () => {
    let categoryColors = [["Action", "#ffadad"], ["Adventure", "#ffd6a5"], ["Comedy", "#fdffb6"], ["Drama", "#caffbf"], ["Animation", "#9bf6ff"], ["Family", "#a0c4ff"], ["Biography", "#bdb2ff"]]

    legend.attr('width', 400)
          .attr('height', 160)

    let g = legend.selectAll('g')
                  .data(categoryColors)
                  .enter()
                  .append('g')

    g.append('rect')
    .attr('class', 'legend-item')
     .attr('fill', (d) => d[1])
     .attr('width', 20)
     .attr('height', 20)
     .attr('x', (d, i) => {
        if (i < 4) {
            return 20
        } else {
            return 220
        }
     })
     .attr('y', (d, i) => {
        if (i === 0 || i === 4 ) {
            return 10
        } else if (i === 1 || i === 5) {
            return 50
        } else if (i === 2 || i === 6) {
            return 90
        } else {return 130}
     })
    
    g.append('text')
     .text((d) => d[0])
     .attr('x', (d, i) => {
        if (i < 4) {
            return 50
        } else {
            return 250
        }
     })
     .attr('y', (d, i) => {
        if (i === 0 || i === 4 ) {
            return 25
        } else if (i === 1 || i === 5) {
            return 65
        } else if (i === 2 || i === 6) {
            return 105
        } else {return 145}
     })

}

req.open('GET', url, true)
req.onload = () => {
    let data = JSON.parse(req.responseText)
    movieData = data;
    console.log(movieData)
    drawTreeMap()
    drawLegend()
}
req.send()