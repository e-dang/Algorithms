const utils = require('../utils/utils');

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
        callback(null);
    }

    async visit(node) {
        await utils.sleep(TIMEOUT);
        node.setAsVisitedNode();
    }

    async visiting(node) {
        await utils.sleep(TIMEOUT);
        node.setAsVisitingNode();
    }
}

module.exports = BaseAlgorithm;
