const BaseAlgorithm = require('./base_algorithm');
const NodeMinHeap = require('../utils/node_min_heap');

class Dijkstra extends BaseAlgorithm {
    async run(callback) {
        const dr = [-1, 0, 1, 0, 1, 1, -1, -1];
        const dc = [0, -1, 0, 1, 1, -1, 1, -1];

        const visiting = new NodeMinHeap();
        const startNode = this.grid.getStartNode();
        startNode.distance = 0;
        visiting.insert(startNode);

        while (!visiting.isEmpty()) {
            const node = visiting.pop();
            await this.visit(node);

            for (let i = 0; i < dr.length; i++) {
                const row = node.row + dr[i];
                const col = node.col + dc[i];

                if (this.grid.isInvalidSpace(row, col)) {
                    continue;
                }

                const candidateNode = this.grid.getNode(row, col);
                if (candidateNode.distance > node.distance + 1) {
                    if (visiting.contains(candidateNode)) {
                        visiting.update(candidateNode, node.distance + 1);
                    } else {
                        candidateNode.distance = node.distance + 1;
                        visiting.insert(candidateNode);
                        await this.visiting(candidateNode);
                    }

                    candidateNode.prev = node;
                }
            }

            if (node === this.grid.getEndNode()) {
                break;
            }
        }

        callback();
    }
}

module.exports = Dijkstra;
