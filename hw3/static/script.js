const updateTable = table => {
    document.querySelectorAll('.row').forEach((row, rowIndex) => {
        Array.from(row.children).forEach((cell, colIndex) => {
            const cellData = table[rowIndex][colIndex];
            if (cellData === null) {
                cell.classList.remove('cell_cross', 'cell_zero');
            } else if (cellData) {
                cell.classList.add('cell_zero');
            } else {
                cell.classList.add('cell_cross');
            }
        });
    });
};

const headers = {
    method: 'POST',
    credentials: 'include'
};

const handleClick = e => {
    const cell = e.target;
    const targetRow = cell.parentElement;

    const rowIndex = Array.from(document.querySelectorAll('.row')).indexOf(targetRow);
    const colIndex = Array.from(targetRow.children).indexOf(cell);

    fetch(`/cells/${rowIndex}/${colIndex}/click`, headers)
}

const showPlayerNumber = number => {
    document.querySelector('.info').innerHTML = `Вы игрок №${number}.`;
}

const getPlayerNumber = () => {
    fetch('/getPlayerNumber', headers)
        .then(response => response.json())
        .then(data => {
            showPlayerNumber(data.number);
        });
}

getPlayerNumber();

const showWinner = winner => {
    document.querySelector('.info').innerHTML = `Игрок №${++winner} выиграл!`;
}

const actionReceiver = () => {
    fetch('/subscribe', headers)
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }

            return response.json();
        })
        .then(response => {
            const {action, data} = response;

            switch (action) {
                case 'UPDATE_TABLE':
                    updateTable(data);
                    break;
                case 'SHOW_WINNER':
                    updateTable(data.table)
                    showWinner(data.winner)
                    break;
            }

            actionReceiver();
        })
        .catch(() => setTimeout(actionReceiver(), 1000));
}



actionReceiver();

const setClickListeners = () => {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', handleClick);
    });
}

const renderRow = rowData => {
    const row = document.createElement('div');
    row.classList.add('row');

    rowData.forEach(cellData => {
        const cell = document.createElement('div');
        const classList = cell.classList;
        classList.add('cell');

        if (cellData === 0) {
            classList.add('cell_cross');
        } else if (cellData === 1) {
            classList.add('cell_zero');
        }

        row.append(cell);
    });

    return row;
}

const renderTable = tableData => {
    if (!tableData) {
        return;
    }

    const table = document.createElement('div');
    table.classList.add('table');

    tableData.forEach(row => {
        table.append(renderRow(row));
    });

    document.querySelector('.table').remove();

    document.querySelector('body').append(table);

    setClickListeners();
}

const getTable = () => {
    fetch('/getTable', headers)
        .then(response => response.json())
        .then(data => {
            renderTable(data.table);
        });
};

getTable();