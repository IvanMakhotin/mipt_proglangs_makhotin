'use strict';

const table = [];

const players = [];

let winner = null;

let step = 0;

let subscribers = [];

const generateTable = dimension => {
    for (let i = 0; i < dimension; i++) {
        const row = [];
        for (let i = 0; i < dimension; i++) {
            row.push(null);
        }

        table.push(row);
    }
}

const DIMENSION = 10;

generateTable(DIMENSION);

const notify = () => {
    let data;
    if (typeof winner === 'number') {
        data = {
            action: 'SHOW_WINNER',
            data: {
                winner,
                table
            }
        };
    } else {
        data = {
            action: 'UPDATE_TABLE',
            data: table
        }
    }

    subscribers.forEach(res => res.send(data));
    subscribers = [];
};

const LINE_LENGTH = 5;

const checkLine = (rowIndex, colIndex, rowInc, colInc) => {
    let length = 0;
    let player = null;

    for (let i = -LINE_LENGTH; i <= LINE_LENGTH; i++) {
        const row = rowIndex + i * rowInc;
        const col = colIndex + i * colInc;

        if (row >= 0 && row < DIMENSION && col >=0 && col <DIMENSION) {        
            const currentPlayer = table[row][col];
            if (currentPlayer !== null && currentPlayer === player) {
                length++;
                if (length >= LINE_LENGTH) {
                    return player;
                }
            } else {
                player = currentPlayer;
                length = 1;
            }
        }
    }
};

const checkWin = (rowIndex, colIndex) => {
    const lines = [
        checkLine(rowIndex, colIndex, 0, 1),
        checkLine(rowIndex, colIndex, 1, 0),
        checkLine(rowIndex, colIndex, 1, 1),
        checkLine(rowIndex, colIndex, -1, 1)
    ];

    return lines.find(checkResult => typeof checkResult === 'number');
};

exports.click = (player, rowIndex, colIndex) => {
    if (typeof winner === 'number') {
        notify();
        return;
    }

    const playerIndex = players.indexOf(player);
    if (step !== playerIndex) {
        return;
    }

    const row = table[rowIndex];
    if (row[colIndex] !== null) {
        return;
    }

    row[colIndex] = playerIndex;
    step = playerIndex ? 0 : 1;

    winner = checkWin(rowIndex, colIndex);

    notify();
};

exports.getTable = () => table;

exports.getPlayer = () => {
    const player = new Date().getTime();

    if (players.length < 2) {
        players.push(player);
    }

    return player;
}

exports.getPlayerNumber = player => {
    return players.indexOf(player) + 1;
}

exports.hasPlayer = player => players.indexOf(player) !== -1;

exports.subscribe = res => {
    subscribers.push(res);
};

exports.getTable = () => {
    return table;
}