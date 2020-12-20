const BaseGenerator = require('./base_generator');
const {MAX_WEIGHT, MIN_WEIGHT} = require('../node');
const utils = require('../utils/utils');

const WEIGHT_NODE_PROB = 0.55;
class RandomWeightMaze extends BaseGenerator {
    async generate() {
        const diff = MAX_WEIGHT - MIN_WEIGHT;

        for (const node of this.grid.nodes) {
            if (Math.random() <= WEIGHT_NODE_PROB) {
                await utils.sleep(utils.FAST);

                node.setAsWeightNode(MIN_WEIGHT + Math.round(Math.random() * diff));
            }
        }
    }
}

module.exports = RandomWeightMaze;
