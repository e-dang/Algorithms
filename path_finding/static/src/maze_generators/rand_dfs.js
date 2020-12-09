const utils = require('../utils/utils');

class RandomizedDFS {
    constructor(grid) {
        this.grid = grid;
        this.dr = [2, 0, -2, 0];
        this.dc = [0, 2, 0, -2];
    }

    async generate() {
        this.grid.nodes.forEach((node) => node.setAsWallNode());
        await this.generateHelper(this.grid.getStartNode());
    }

    async generateHelper(node) {
        node.visited = true;
        while (true) {
            const neighbors = this.getUnvisitedNeighbors(node);

            if (neighbors.length === 0) {
                break;
            }

            const neighbor = utils.getRandom(neighbors);
            await this.connect(node, neighbor);
            await this.generateHelper(neighbor);
        }
    }

    getUnvisitedNeighbors(node) {
        const neighbors = [];
        for (let i = 0; i < this.dr.length; i++) {
            const row = node.row + this.dr[i];
            const col = node.col + this.dc[i];

            if (row < 0 || row >= this.grid.nRows || col < 0 || col >= this.grid.nCols) {
                continue;
            }

            const neighbor = this.grid.getNode(row, col);
            if (!neighbor.visited) {
                neighbors.push(neighbor);
            }
        }

        return neighbors;
    }

    async connect(node1, node2) {
        await utils.sleep(10);

        node1.setAsEmptyNode();
        node2.setAsEmptyNode();
        if (node1.row === node2.row) {
            if (node1.col - node2.col < 0) {
                this.grid.getNode(node1.row, node1.col + 1).setAsEmptyNode();
            } else {
                this.grid.getNode(node1.row, node1.col - 1).setAsEmptyNode();
            }
        } else {
            if (node1.row - node2.row < 0) {
                this.grid.getNode(node1.row + 1, node1.col).setAsEmptyNode();
            } else {
                this.grid.getNode(node1.row - 1, node1.col).setAsEmptyNode();
            }
        }
    }
}

module.exports = RandomizedDFS;
