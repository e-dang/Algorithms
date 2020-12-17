function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function getRandOdd(range) {
    return Math.floor(Math.random() * Math.floor(range / 2)) * 2 + 1;
}

function getRandEven(range) {
    return Math.floor(Math.random() * Math.floor(range / 2)) * 2;
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
    getRandOdd,
    getRandEven,
};
