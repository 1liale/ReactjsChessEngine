import "chess.js";

export function randomMoves(possibleMoves) {
    const random_move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    return random_move;
}

function eval_board(chess, maxColor) {
    const curState = evaluate(chess, maxColor);
    if (maxColor == 1) {
        return curState[1] - curState[0];
    }
    else {
        return curState[0] - curState[1];
    }
}

export function minMaxStart(depth, chess, maxPlayer, maxColor) {
    if (depth == 0 || chess.game_over()) {
        return [null, eval_board(chess, maxColor)];
    }
    let alpha = Number.MIN_VALUE;
    let beta = Number.MAX_VALUE;
    let maxEval = Number.MIN_VALUE;
    const possibleMoves = chess.moves();
    let bestMove = randomMoves(possibleMoves);
    if (maxPlayer) {
        for (let i = 0; i < possibleMoves.length; i++) {
            let move = possibleMoves[i];
            chess.move(move);
            let curEval = minMax(depth - 1, chess, alpha, beta, false, maxColor)[1];
            chess.undo();
            if (curEval > maxEval) {
                maxEval = curEval;
                bestMove = move;
            }
        }
        return [bestMove, maxEval];
    }
    else {
        let minEval = Number.MAX_VALUE;
        for (let i = 0; i < possibleMoves.length; i++) {
            let move = possibleMoves[i];
            chess.move(move);
            let curEval = minMax(depth - 1, chess, alpha, beta, true, maxColor)[1];
            chess.undo();
            if (curEval < minEval) {
                minEval = curEval;
                bestMove = move;
            }
        }
        return [bestMove, minEval];
    }
}

function minMax(depth, chess, alpha, beta, maxPlayer, maxColor) {
    if (depth == 0 || chess.game_over()) {
        return [null, eval_board(chess, maxColor)];
    }
    let possibleMoves = chess.moves();
    let bestMove = randomMoves(possibleMoves);

    if (maxPlayer) {
        let maxEval = Number.MIN_VALUE;
        for (let i = 0; i < possibleMoves.length; i++) {
            let move = possibleMoves[i];
            chess.move(move);
            let curEval = minMax(depth - 1, chess, alpha, beta, false, maxColor)[1];
            chess.undo();
            if (curEval > maxEval) {
                maxEval = curEval;
                bestMove = move;
                if (alpha < curEval) {
                    alpha = curEval;
                }
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return [bestMove, maxEval];
    }
    else {
        let minEval = Number.MAX_VALUE;
        for (let i = 0; i < possibleMoves.length; i++) {
            let move = possibleMoves[i];
            chess.move(move);
            let curEval = minMax(depth - 1, chess, alpha, beta, true, maxColor)[1];
            chess.undo();
            if (curEval < minEval) {
                minEval = curEval;
                bestMove = move;
                if (curEval < beta) {
                    beta = curEval;
                }
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return [bestMove, minEval];
    }
}

function evaluate(chess, player) {
    let curScore1 = 0, curScore2 = 0;
    let pieces = chess.fen();
    let space_index = pieces.indexOf(' ');
    let newStr = pieces.slice(0, space_index);
    for (let i = 0; i < newStr.length; i++) {
        if (newStr.charAt(i) === 'p') { curScore1 += player * -10; }
        else if (newStr.charAt(i) === 'b') curScore1 += player * -30;
        else if (newStr.charAt(i) === 'n') curScore1 += player * -30;
        else if (newStr.charAt(i) === 'r') curScore1 += player * -50;
        else if (newStr.charAt(i) === 'q') curScore1 += player * -90;
        else if (newStr.charAt(i) === 'k') curScore1 += player * -900;

        else if (newStr.charAt(i) === 'P') curScore2 += player * 10;
        else if (newStr.charAt(i) === 'N') curScore2 += player * 30;
        else if (newStr.charAt(i) === 'B') curScore2 += player * 30;
        else if (newStr.charAt(i) === 'R') curScore2 += player * 50;
        else if (newStr.charAt(i) === 'Q') curScore2 += player * 90;
        else if (newStr.charAt(i) === 'K') curScore2 += player * 900;
    }
    return [curScore1, curScore2];
}

export function simpleEval(possibleMoves, chess) {
    let simpleMove;
    let enabled = false;
    let maxScore = 0;
    const turn = chess.turn();
    let player = 1;
    if (turn === 'b') {
        player = -1;
        console.log("Black's turn");
    }

    console.log("init:" + chess.fen());
    for (let j = 0; j < possibleMoves.length; j++) {
        let curScore = 0;
        let move = possibleMoves[j];
        console.log("move:" + j + " " + move);
        chess.move(move);
        const result = evaluate(chess, player)
        curScore = result[0] + result[1];
        console.log(curScore + " " + maxScore);
        chess.undo();
        if (curScore > maxScore) {
            maxScore = curScore;
            simpleMove = move;
            console.log("new max:" + simpleMove);
            enabled = true;
        }
        else {
            if (!enabled)
                simpleMove = possibleMoves[0];
        }
    }
    return chess.move(simpleMove);
}

