const BaseAlgorithm = require('./base_algorithm');
const NodeMinHeap = require('../utils/node_min_heap');

class Dijkstra extends BaseAlgorithm {
    async run(callback) {
        const visiting = new NodeMinHeap();
        const startNode = this.grid.getStartNode();
        startNode.totalCost = 0;
        visiting.insert(startNode);

        while (!visiting.isEmpty()) {
            const node = visiting.pop();
            await this.visit(node);

            if (node.isEndNode()) {
                break;
            }

            for (let i = 0; i < this.dr.length; i++) {
                const row = node.row + this.dr[i];
                const col = node.col + this.dc[i];

                if (this.grid.isInvalidSpace(row, col)) {
                    continue;
                }

                const candidateNode = this.grid.getNode(row, col);
                const cost = node.totalCost + candidateNode.weight;
                if (candidateNode.totalCost > cost) {
                    if (visiting.contains(candidateNode)) {
                        visiting.update(candidateNode, cost);
                    } else {
                        candidateNode.totalCost = cost;
                        visiting.insert(candidateNode);
                        await this.visiting(candidateNode);
                    }

                    candidateNode.prev = node;
                }
            }
        }

        callback(this.grid.getEndNode().totalCost);
    }
}

module.exports = Dijkstra;
