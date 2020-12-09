class BaseGenerator {
    constructor(grid) {
        this.grid = grid;
        this.dr = [2, 0, -2, 0];
        this.dc = [0, 2, 0, -2];
    }
}

module.exports = BaseGenerator;
