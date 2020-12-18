FAST = 1;
MEDIUM = 10;

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

function getRandomFromRange(start, end, inc = 1) {
    const nums = [];
    for (let i = start; i <= end; i += inc) {
        nums.push(i);
    }

    return nums[Math.floor(Math.random() * nums.length)];
}

function calcMaximumGridDims() {
    const nodeStyle = window.getComputedStyle(document.getElementsByClassName('node')[0]);
    let nodeWidth = nodeStyle.getPropertyValue('width');
    let nodeHeight = nodeStyle.getPropertyValue('height');
    nodeWidth = parseInt(nodeWidth.substring(0, nodeWidth.length - 2));
    nodeHeight = parseInt(nodeHeight.substring(0, nodeHeight.length - 2));

    const containerStyle = window.getComputedStyle(document.getElementById('controlsContainer'));
    let containerHeight = containerStyle.getPropertyValue('height');
    containerHeight = parseInt(containerHeight.substring(0, containerHeight.length - 2));
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;

    return {
        maxRows: Math.floor((height - containerHeight) / nodeHeight) - 2,
        maxCols: Math.floor(width / nodeWidth) - 2,
    };
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
    getRandomFromRange,
    manhattan_moves,
    diagonal_moves,
    getRandOdd,
    getRandEven,
    calcMaximumGridDims,
    FAST,
    MEDIUM,
};
