const domTests = require('@testing-library/jest-dom');
global.window = window;
global.$ = require('jquery');
global.jQuery = global.$;
const bootstrapSelect = require('bootstrap-select');
$.fn.selectpicker.Constructor.BootstrapVersion = '4';
const bootstrapToggle = require('bootstrap-toggle');
