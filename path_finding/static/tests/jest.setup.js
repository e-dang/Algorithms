const domTests = require('@testing-library/jest-dom');
global.window = window;
global.$ = require('jquery');
const bootstrapSelect = require('bootstrap-select');
$.fn.selectpicker.Constructor.BootstrapVersion = '4';
