function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

/*

direction |  u  |  ul |  l  |  dl |  d  |  dr  |  r  |  ur |
------------------------------------------------------------
dr        | -1  | -1  |  0  |  1  |  1  |  1   |  0  |  -1 |
------------------------------------------------------------
dc        |  0  | -1  |  -1 | -1  |  0  |  1   |  1  |  1  |

*/
const manhattan_moves = {
    dr: [-1, 0, 1, 0],
    dc: [0, -1, 0, 1],
};

const diagonal_moves = {
    dr: [-1, -1, 0, 1, 1, 1, 0, -1],
    dc: [0, -1, -1, -1, 0, 1, 1, 1],
};

module.exports = {
    sleep,
    getRandom,
    manhattan_moves,
    diagonal_moves,
};
