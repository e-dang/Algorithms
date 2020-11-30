const TIMEOUT = 10;
class Dijkstra {
    constructor(grid) {
        this.grid = grid;
    }

    async run(callback) {
        const dr = [-1, 0, 1, 0, 1, 1, -1, -1];
        const dc = [0, -1, 0, 1, 1, -1, 1, -1];

        const visiting = [];
        const startNode = this.grid.getStartNode();
        startNode.distance = 0;
        visiting.push(startNode);

        while (visiting.length) {
            const node = this.getMinimum(visiting);
            visiting.splice(visiting.indexOf(node), 1);
            await this.visit(node);

            for (let i = 0; i < 8; i++) {
                const row = node.row + dr[i];
                const col = node.col + dc[i];

                if (this.grid.isInvalidSpace(row, col)) {
                    continue;
                }

                const candidateNode = this.grid.getNode(row, col);
                if (candidateNode.distance > node.distance + 1) {
                    if (candidateNode.distance != Infinity) {
                        visiting.splice(visiting.indexOf(candidateNode), 1);
                    }

                    await this.visiting(candidateNode);
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

    async visit(node) {
        await sleep(TIMEOUT);
        node.setAsVisitedNode();
    }

    async visiting(node) {
        await sleep(TIMEOUT);
        node.setAsVisitingNode();
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = Dijkstra;
