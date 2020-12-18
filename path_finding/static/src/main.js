const GridController = require('./grid_controller');
const {MAX_WEIGHT, MIN_WEIGHT} = require('./node');
const calcInitialGridDims = require('./utils/utils').calcInitialGridDims;

const {rows, cols} = calcInitialGridDims();
const alg = document.getElementById('algorithmSelect').value;
const slider = new Slider('#weightSlider', {
    min: MIN_WEIGHT,
    max: MAX_WEIGHT,
    value: 5,
    ticks: [MIN_WEIGHT, MAX_WEIGHT],
    ticks_labels: [`${MIN_WEIGHT}`, `${MAX_WEIGHT}`],
});
const toggle = $('#weightToggle').bootstrapToggle();
const controller = new GridController(rows, cols, alg, slider, toggle).addEventListeners();
