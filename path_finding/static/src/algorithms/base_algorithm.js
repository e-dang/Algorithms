const TIMEOUT = 10;

class BaseAlgorithm {
    constructor(grid) {
        this.grid = grid;
        this.dr = [-1, 0, 1, 0];
        this.dc = [0, -1, 0, 1];
    }

    async run(callback) {
        document.getElementById('algorithmSelectErrorMessage').hidden = false;
        document.getElementById('algorithmSelect').classList.add('error-select');
    }

    async visit(node) {
        await sleep(TIMEOUT);
        node.setAsVisitedNode();
    }

    async visiting(node) {
        await sleep(TIMEOUT);
        node.setAsVisitingNode();
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = BaseAlgorithm;
