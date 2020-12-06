const BaseAlgorithm = require('./base_algorithm');

class DFSShortestPath extends BaseAlgorithm {
    async run(callback) {
        const startNode = this.grid.getStartNode();
        await this.runHelper(startNode.row, startNode.col, 0, null);
        callback();
    }

    async runHelper(row, col, cost, prevNode) {
        if (this.grid.isInvalidSpace(row, col)) {
            return;
        }

        const node = this.grid.getNode(row, col);
        if (node.distance > cost) {
            await this.visiting(node, cost, prevNode);

            const dr = [-1, 0, 1, 0, 1, 1, -1, -1];
            const dc = [0, -1, 0, 1, 1, -1, 1, -1];
            for (let i = 0; i < dr.length; i++) {
                await this.runHelper(row + dr[i], col + dc[i], cost + 1, node);
            }

            await this.visit(node);
        }

        return;
    }

    async visiting(node, cost, prevNode) {
        node.distance = cost;
        node.prev = prevNode;
        await super.visiting(node);
    }
}

module.exports = DFSShortestPath;
