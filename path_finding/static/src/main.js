const GridController = require('./grid_controller');

const rows = parseInt(document.getElementById('rows').textContent);
const cols = parseInt(document.getElementById('cols').textContent);
const startRow = parseInt(document.getElementById('startRow').textContent);
const startCol = parseInt(document.getElementById('startCol').textContent);
const endRow = parseInt(document.getElementById('endRow').textContent);
const endCol = parseInt(document.getElementById('endCol').textContent);
const alg = document.getElementById('algorithmSelect').value;
const controller = new GridController(rows, cols, startRow, startCol, endRow, endCol, alg)
    .addUpdateGridEventListener()
    .addUpdateAlgorithmEventListener()
    .addRunAlgorithmEventListener()
    .addResetEventListener();
