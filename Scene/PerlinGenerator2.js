//Credit goes to https://joeiddon.github.io/projects/javascript/perlin.html

let grid = [];
const nodes = 4;

function random_unit_vector(){
    let theta = Math.random() * 2 * Math.PI;
    return {x: Math.cos(theta), y: Math.sin(theta)};
}


for (let i = 0; i < nodes; i++) {
    let row = [];
    for (let j = 0; j < nodes; j++) {
        row.push(random_unit_vector());
    }
    grid.push(row);
}
