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

    fetch(`/rest/cells/${rowIndex}/${colIndex}/click`, headers)
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
    fetch('/rest/subscribe', headers)
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

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handleClick);
});