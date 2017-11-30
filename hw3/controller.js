'use strict';

const model = require('./model');

exports.click = (req, res) => {
    const params = req.params;

    model.click(req.session.player, Number(params.rowIndex), Number(params.colIndex));

    res.send();
};

exports.subscribe = (req, res) => {
    model.subscribe(res);
};

exports.getPlayerNumber = (req, res) => {
    res.send({number: model.getPlayerNumber(req.session.player)});
}
