const utils = require('../utils/utils');

const TIMEOUT = 10;

class BaseAlgorithm {
    constructor(grid, moves) {
        this.grid = grid;
        Object.assign(this, moves);
        // this.dr = [-1, 0, 1, 0];
        // this.dc = [0, -1, 0, 1];
    }

    async run(callback) {
        document.getElementById('algorithmSelectErrorMessage').hidden = false;
        $('#algorithmSelect').selectpicker('setStyle', 'btn-outline-danger', 'add');
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
