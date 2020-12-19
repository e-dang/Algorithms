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

function getDimensions(element) {
    const nodeStyle = window.getComputedStyle(element);
    let width = nodeStyle.getPropertyValue('width');
    let height = nodeStyle.getPropertyValue('height');

    return {
        width: parseInt(width.substring(0, width.length - 2)),
        height: parseInt(height.substring(0, height.length - 2)),
    };
}

function calcMaximumGridDims() {
    const nodeDims = getDimensions(document.getElementsByClassName('node')[0]);
    const controlDims = getDimensions(document.getElementById('controlsContainer'));
    const infoDims = getDimensions(document.getElementById('algInfoContainer'));
    const buttonDims = getDimensions(document.getElementById('buttonContainer'));
    const totalStaticHeight = controlDims.height + infoDims.height + buttonDims.height;
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;

    // minus integer for margins
    return {
        maxRows: Math.floor((height - totalStaticHeight) / nodeDims.height) - 3,
        maxCols: Math.floor(width / nodeDims.width) - 2,
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
