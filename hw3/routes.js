'use strict';

const controller = require('./controller');

module.exports = app => {
    app.post('/rest/cells/:rowIndex/:colIndex/click', controller.click);
    app.post('/rest/subscribe', controller.subscribe);
    app.post('/getPlayerNumber', controller.getPlayerNumber);
};
