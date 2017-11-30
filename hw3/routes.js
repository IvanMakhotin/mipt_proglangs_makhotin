'use strict';

const controller = require('./controller');

module.exports = app => {
    app.post('/cells/:rowIndex/:colIndex/click', controller.click);
    app.post('/subscribe', controller.subscribe);
    app.post('/getPlayerNumber', controller.getPlayerNumber);
    app.post('/getTable', controller.getTable)
};
