const BaseAlgorithm = require('./base_algorithm');

class DFS extends BaseAlgorithm {
    async run(callback) {
        const startNode = this.grid.getStartNode();
        const cost = await this.runHelper(startNode.row, startNode.col, 0, null);
        callback(cost);
    }

    async runHelper(row, col, cost, prevNode) {
        if (this.grid.isInvalidSpace(row, col)) {
            return null;
        }

        const node = this.grid.getNode(row, col);
        if (node.visited) {
            return null;
        }

        await this.visit(node, prevNode);
        if (node.isEndNode()) {
            return cost;
        }

        for (let i = 0; i < this.dr.length; i++) {
            const pathCost = await this.runHelper(row + this.dr[i], col + this.dc[i], cost + 1, node);
            if (pathCost != null) {
                return pathCost;
            }
        }

        return null;
    }

    async visit(node, prevNode) {
        node.prev = prevNode;
        await super.visit(node);
    }
}

module.exports = DFS;
