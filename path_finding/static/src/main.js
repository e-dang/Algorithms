const GridController = require('./grid_controller');

const rows = parseInt(document.getElementById('rows').textContent);
const cols = parseInt(document.getElementById('cols').textContent);
const controller = new GridController(rows, cols);
controller.addUpdateGridEventListener();
