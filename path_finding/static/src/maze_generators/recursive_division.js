const BaseGenerator = require('./base_generator');
const utils = require('../utils/utils');

class RecursiveDivision extends BaseGenerator {
    constructor(grid, useWalls) {
        super(grid);
        this.drawLine = useWalls ? this._drawWallLine : this._drawWeightLine;
    }

    async generate() {
        const rowLine = (row) => (idx) => this.grid.getNode(row, idx);
        const colLine = (col) => (idx) => this.grid.getNode(idx, col);

        await this.drawLine(rowLine(0), 0, this.grid.nCols - 1);
        await this.drawLine(colLine(this.grid.nCols - 1), 0, this.grid.nRows - 1);
        await this.drawLine(colLine(0), 0, this.grid.nRows - 1);
        await this.drawLine(rowLine(this.grid.nRows - 1), 0, this.grid.nCols - 1);

        await this._generateHelper(2, this.grid.nRows - 3, 2, this.grid.nCols - 3);
    }

    async _generateHelper(minRow, maxRow, minCol, maxCol) {
        if (maxRow < minRow || maxCol < minCol) {
            return;
        }

        const height = maxRow - minRow;
        const width = maxCol - minCol;
        if (this._isNextWallHorizontal(width, height)) {
            const row = minRow + utils.getRandEven(height);
            await this._drawRow(row, minCol - 1, maxCol + 1);
            await this._generateHelper(minRow, row - 2, minCol, maxCol);
            await this._generateHelper(row + 2, maxRow, minCol, maxCol);
        } else {
            const col = minCol + utils.getRandEven(width);
            await this._drawCol(col, minRow - 1, maxRow + 1);
            await this._generateHelper(minRow, maxRow, minCol, col - 2);
            await this._generateHelper(minRow, maxRow, col + 2, maxCol);
        }
    }

    _isNextWallHorizontal(width, height) {
        if (width < height) {
            return true;
        } else if (height < width) {
            return false;
        } else {
            return Math.round(Math.random());
        }
    }

    async _drawRow(row, begin, end) {
        await this._divideChamber((idx) => this.grid.getNode(row, idx), begin, end);
    }

    async _drawCol(col, begin, end) {
        await this._divideChamber((idx) => this.grid.getNode(idx, col), begin, end);
    }

    async _divideChamber(getNode, begin, end) {
        const nums = [];
        for (let i = begin; i <= end; i += 2) {
            nums.push(i);
        }

        const passageIdx = nums[Math.floor(Math.random() * nums.length)];
        await this.drawLine(getNode, begin, end, passageIdx);
    }

    async _drawWallLine(getNode, begin, end, skipIdx = -1) {
        for (let i = begin; i <= end; i++) {
            if (i !== skipIdx) {
                await utils.sleep(10);
                getNode(i).setAsWallNode();
            }
        }
    }

    async _drawWeightLine(getNode, begin, end, skipIdx = -1) {
        console.log(this.grid.weight);
        for (let i = begin; i <= end; i++) {
            if (i !== skipIdx || Math.random() < 0.5) {
                await utils.sleep(10);
                getNode(i).setAsWeightNode(this.grid.weight);
            }
        }
    }
}

module.exports = RecursiveDivision;
