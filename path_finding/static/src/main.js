const GridController = require('./grid_controller');
const {_, MAX_WEIGHT, MIN_WEIGHT} = require('./node');

const rows = parseInt(document.currentScript.getAttribute('rows'));
const cols = parseInt(document.currentScript.getAttribute('cols'));
const startRow = parseInt(document.currentScript.getAttribute('startRow'));
const startCol = parseInt(document.currentScript.getAttribute('startCol'));
const endRow = parseInt(document.currentScript.getAttribute('endRow'));
const endCol = parseInt(document.currentScript.getAttribute('endCol'));
const alg = document.getElementById('algorithmSelect').value;

const slider = new Slider('#weightSlider', {
    min: MIN_WEIGHT,
    max: MAX_WEIGHT,
    value: 5,
    ticks: [MIN_WEIGHT, MAX_WEIGHT],
    ticks_labels: [`${MIN_WEIGHT}`, `${MAX_WEIGHT}`],
});
const toggle = $('#weightToggle').bootstrapToggle();
const controller = new GridController(
    rows,
    cols,
    startRow,
    startCol,
    endRow,
    endCol,
    alg,
    slider,
    toggle,
).addEventListeners();
