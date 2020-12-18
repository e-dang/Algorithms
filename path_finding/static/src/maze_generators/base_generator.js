const utils = require('../utils/utils');
class BaseGenerator {
    constructor(grid) {
        this.grid = grid;
        this.dr = [2, 0, -2, 0];
        this.dc = [0, 2, 0, -2];
    }

    async connect(node1, node2) {
        await utils.sleep(utils.MEDIUM);

        node1.setAsEmptyNode();
        node2.setAsEmptyNode();

        const betweenRow = Math.floor((node1.row + node2.row) / 2);
        const betweenCol = Math.floor((node1.col + node2.col) / 2);
        this.grid.getNode(betweenRow, betweenCol).setAsEmptyNode();
    }

    getNeighbors(node, isOfType) {
        const neighbors = [];
        for (let i = 0; i < this.dr.length; i++) {
            const row = node.row + this.dr[i];
            const col = node.col + this.dc[i];

            if (row < 0 || row >= this.grid.nRows || col < 0 || col >= this.grid.nCols) {
                continue;
            }

            const neighbor = this.grid.getNode(row, col);
            if (isOfType(neighbor)) {
                neighbors.push(neighbor);
            }
        }

        return neighbors;
    }
}

module.exports = BaseGenerator;
