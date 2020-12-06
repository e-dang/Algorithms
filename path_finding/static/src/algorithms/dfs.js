const BaseAlgorithm = require('./base_algorithm');

class DFS extends BaseAlgorithm {
    async run(callback) {
        const startNode = this.grid.getStartNode();
        await this.runHelper(startNode.row, startNode.col, null);
        callback();
    }

    async runHelper(row, col, prevNode) {
        if (this.grid.isInvalidSpace(row, col)) {
            return false;
        }

        const node = this.grid.getNode(row, col);
        if (node.visited) {
            return false;
        }

        await this.visit(node, prevNode);
        if (node.isEndNode()) {
            return true;
        }

        for (let i = 0; i < this.dr.length; i++) {
            if (await this.runHelper(row + this.dr[i], col + this.dc[i], node)) {
                return true;
            }
        }

        return false;
    }

    async visit(node, prevNode) {
        node.prev = prevNode;
        await super.visit(node);
    }
}

module.exports = DFS;
