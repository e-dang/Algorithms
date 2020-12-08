const GridController = require('./grid_controller');

const rows = parseInt(document.currentScript.getAttribute('rows'));
const cols = parseInt(document.currentScript.getAttribute('cols'));
const startRow = parseInt(document.currentScript.getAttribute('startRow'));
const startCol = parseInt(document.currentScript.getAttribute('startCol'));
const endRow = parseInt(document.currentScript.getAttribute('endRow'));
const endCol = parseInt(document.currentScript.getAttribute('endCol'));
const alg = document.getElementById('algorithmSelect').value;
const controller = new GridController(rows, cols, startRow, startCol, endRow, endCol, alg).addEventListeners();
