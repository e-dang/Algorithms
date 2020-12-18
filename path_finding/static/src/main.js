const GridController = require('./grid_controller');
const {MAX_WEIGHT, MIN_WEIGHT} = require('./node');
const calcMaximumGridDims = require('./utils/utils').calcMaximumGridDims;

const {maxRows, maxCols} = calcMaximumGridDims();
const alg = document.getElementById('algorithmSelect').value;
const slider = new Slider('#weightSlider', {
    min: MIN_WEIGHT,
    max: MAX_WEIGHT,
    value: 5,
    ticks: [MIN_WEIGHT, MAX_WEIGHT],
    ticks_labels: [`${MIN_WEIGHT}`, `${MAX_WEIGHT}`],
});
const controller = new GridController(maxRows, maxCols, alg, slider).addEventListeners();
