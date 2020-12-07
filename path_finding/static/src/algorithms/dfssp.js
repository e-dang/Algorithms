const BaseAlgorithm = require('./base_algorithm');

class DFSShortestPath extends BaseAlgorithm {
    async run(callback) {
        const startNode = this.grid.getStartNode();
        await this.runHelper(startNode.row, startNode.col, 0, null);
        callback(this.grid.getEndNode().totalCost);
    }

    async runHelper(row, col, cost, prevNode) {
        if (this.grid.isInvalidSpace(row, col)) {
            return;
        }

        const node = this.grid.getNode(row, col);
        if (node.totalCost > cost) {
            await this.visiting(node, cost, prevNode);

            for (let i = 0; i < this.dr.length; i++) {
                await this.runHelper(row + this.dr[i], col + this.dc[i], cost + 1, node);
            }

            await this.visit(node);
        }

        return;
    }

    async visiting(node, cost, prevNode) {
        node.totalCost = cost;
        node.prev = prevNode;
        await super.visiting(node);
    }
}

module.exports = DFSShortestPath;
