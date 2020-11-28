class Dijkstra {
    constructor(grid) {
        this.grid = grid;
    }

    async run(callback) {
        const dr = [-1, 0, 1, 0, 1, 1, -1, -1];
        const dc = [0, -1, 0, 1, 1, -1, 1, -1];

        const visiting = [];
        visiting.push(this.grid.getStartNode());

        while (visiting.length) {
            const node = this.getMinimum(visiting);
            visiting.splice(visiting.indexOf(node), 1);
            node.visit();

            for (let i = 0; i < 8; i++) {
                const row = node.row + dr[i];
                const col = node.col + dc[i];
                const candidateNode = this.grid.getNode(row, col);

                if (this.grid.isInvalidSpace(row, col)) {
                    continue;
                }

                if (candidateNode.distance > node.distance + 1) {
                    if (candidateNode.dist != Infinity) {
                        visiting.splice(visiting.indexOf(candidateNode), 1);
                    }

                    candidateNode.visiting();
                    candidateNode.distance = node.distance + 1;
                    candidateNode.prev = node;
                    visiting.push(candidateNode);
                }
            }
        }

        callback();
    }

    getMinimum(nodes) {
        let minNode;
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            if (minNode === undefined || node.distance < minNode.distance) {
                minNode = node;
            }
        }

        return minNode;
    }

    visit(node) {
        node.setAsVisitedNode();
    }

    visiting(node) {
        node.setAsVisitingNode();
    }
}

module.exports = Dijkstra;
