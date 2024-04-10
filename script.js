const ps = require("prompt-sync");
const prompt = ps();

const Gameboard = (() => {

    //Initialization of Gameboard
    const array = new Array(3);
    for(i = 0 ; i < 3; i++){
        array[i] = new Array(3);
        for(j = 0; j < 3; j++){
            array[i][j] = ' ';
        }
    }

    //returns the array
    const getArray = () => array;

    //logs in gameboard the array
    const showArray = () => {
        array.forEach((e) => {
            console.log(e);
        })
        console.log(' ');
    }

    //resets the board
    const resetBoard = () => {
        console.log("Board reset..");
        for(i = 0; i < 3; i++){
            for(j = 0; j < 3; j++){
                array[i][j] = ' ';
            }
        }
        showArray();
    }

    //handles actions for the board, appends X or O on the specified row and column
    const doAction = (row, column, player) => {
        let status = true;
        if((row >= 1 && row <= 3) && (column >= 1 && column <= 3)){
            if(array[row-1][column-1] != 'X' && array[row-1][column-1] != 'O'){
                if(player === 1){
                    array[row-1][column-1] = 'X';
                }
                if(player === 2){
                    array[row-1][column-1] = 'O';
                }
            }
            else{
                status = false;
                console.log('\nInvalid Move');
            }
        }
        else{
            status = false;
            console.log('\nInvalid Move');
        }
        showArray();
        return status;
    }

    return { getArray, showArray, doAction, resetBoard }

})();

const Player = function(name){
    let points = 0;

    const getName = () => name;
    
    //return and point increment
    const getPoints = () => points;
    const addPoint = () => {
        console.log(`${name} gained a point!`);
        points++;
        return getPoints();
    }
    //prompts the move for the player and returns it in a 2D array
    const promptMove = () => {
        let move = new Array(2);
        console.log(`${name}'s turn!`);
        move[0] = prompt("enter row: ");
        move[1] = prompt("enter column: ");
        return move;
    }
    
    return { name, getName, getPoints, addPoint, promptMove }
}

const player1 = Player("fynn");
const player2 = Player("alden");

const Gamemaster = (() => {
    let game_over = false;
    const startGame = (Gameboard, player1, player2) => {
        let turn = 1;
        while(!game_over){
            let move;
            if(turn === 1){
                move = player1.promptMove();
            }
            if(turn === 2){
                move = player2.promptMove();
            }
            if(move.includes('q')){
                return;
            }

            let status = Gameboard.doAction(move[0], move[1], turn);
            let win_status = checkWin(Gameboard);
            let tie_status = checkTie(Gameboard);

            if(tie_status || win_status){
                if(win_status){
                    if(turn === 1){
                        player1.addPoint();
                        if(player1.getPoints() >= 5){
                            console.log(`${player1.getName()} Wins!`);
                            game_over = true;
                            break;
                        }
                    }
                    if(turn === 2){
                        player2.addPoint();
                        if(player2.getPoints() >= 5){
                            console.log(`${player2.getPoints()} Wins`);
                            game_over = true;
                            break;
                        }
                    }
                }
                displayPoints(player1, player2);
                Gameboard.resetBoard();
            }

            if(status && !tie_status && !win_status){
                if(turn == 1){
                    turn = 2;
                }
                else if(turn == 2){
                    turn = 1;
                }
            }
        }
    }

    //checks win condition, if so, returns true
    const checkWin = (Gameboard) => {
        win_check = 1;
        const board = Gameboard.getArray();

        //check horizontal
        for(i = 0; i < 3; i++){
            const first_element = board[i][0];
            if(first_element == ' '){
                continue;
            }
            for(j = 0; j < 3; j++){
                if(board[i][j] != first_element){
                    win_check = 0;
                }
            }
            if(win_check == 1){
                return true;
            }
            win_check = 1;
        }

        //check vertical
        for(i = 0; i < 3; i++){
            const first_element = board[0][i];
            if(first_element == ' '){
                continue;
            }
            for(j = 0; j < 3; j++){
                if(board[j][i] != first_element){
                    win_check = 0;
                }
            }
            if(win_check == 1){
                return true;
            }
            win_check = 1;
        }

        //check diagonal
        const first_element_first = board[0][0];
        const first_element_second = board[0][2];
        if(board[1][1] == first_element_first && board[2][2] == first_element_first && first_element_first != ' '){
            return true;
        }
        else if(board[1][1] == first_element_second && board[2][0] == first_element_second && first_element_second != ' '){
            return true;

        }


        return false;
    }

    const displayPoints = (player1, player2) => {
        console.log(`${player1.getName()} points = ${player1.getPoints()} || ${player2.getName()} points = ${player2.getPoints()}`);
    }

    //checks if the board is filled, and if so, returns true
    const checkTie = (Gameboard) => {
        let tie = true;
        const board = Gameboard.getArray();
        for(i = 0; i < 3; i++){
            for(j = 0; j < 3; j++){
                if(board[i][j] == ' '){
                    tie = false;
                }
            }
        }
        return tie;
    }
    return { startGame, checkTie }
})();

Gamemaster.startGame(Gameboard, player1, player2);