import * as React from "react";
import { pos, negamax, bestMove } from "./solver";
import { useState } from "react";
// import * as bootstrap from "bootstrap";
// import { createRoot } from "react-dom/client";
import type {
    Board2D,
    BoardProp,
    CellProp,
    StatusProp,
} from "../../types/connect4";

// import * as $ from "jquery";

import { boardHeight, boardWidth } from "./utility";

declare global {
    interface Window {
        // jQuery: any;
        // $: any;
        pos: any;
        negamax: any;
    }
}

window.pos = pos;
window.negamax = negamax;
window.bestMove = bestMove;
// expose jQuery to global
/*
window.jQuery = window.$ = $;
*/

function calculateWinner(
    nextContent: Board2D
): null | [String, number, number] {
    const getter = (x: number, y: number): String | null => {
        if (x < 0 || x >= boardWidth) return null;
        if (y < 0 || y >= boardHeight) return null;
        return nextContent[y][x];
    };
    for (let i = 0; i < boardWidth; i++) {
        for (let j = 0; j < boardHeight; j++) {
            let x = i,
                y = j;
            let piece = getter(x, y);
            if (piece === null) continue;
            // horizontal
            const toID = (x: number, y: number) => {
                return x * boardWidth + y;
            };
            if (
                getter(x + 1, y) === piece &&
                getter(x + 2, y) === piece &&
                getter(x + 3, y) === piece
            ) {
                return [piece, toID(x, y), toID(x + 3, y)];
            }
            // vertical
            if (
                getter(x, y + 1) === piece &&
                getter(x, y + 2) === piece &&
                getter(x, y + 3) === piece
            ) {
                return [piece, toID(x, y), toID(x, y + 3)];
            }
            // main diagonal
            if (
                getter(x + 1, y + 1) === piece &&
                getter(x + 2, y + 2) === piece &&
                getter(x + 3, y + 3) === piece
            ) {
                return [piece, toID(x, y), toID(x + 3, y + 3)];
            }
            // anti diagonal
            if (
                getter(x + 1, y - 1) === piece &&
                getter(x + 2, y - 2) === piece &&
                getter(x + 3, y - 3) === piece
            ) {
                return [piece, toID(x, y), toID(x + 3, y - 3)];
            }
        }
    }
    return null;
}

function Cell({
    id,
    value,
    onCellClick,
    onCellMouseEnter,
    onCellMouseLeave,
}: CellProp) {
    return (
        <div
            id={String(id)}
            className={"cell " + value}
            onClick={() => onCellClick()}
            onMouseOver={() => onCellMouseEnter()}
            onMouseOut={() => onCellMouseLeave()}
        ></div>
    );
}

function drawLine(start: number, end: number) {
    const xStart = start % boardWidth;
    const yStart = Math.floor(start / boardWidth);
    const xEnd = end % boardWidth;
    const yEnd = Math.floor(end / boardWidth);
    // TODO: show something?
}

function Board({
    content,
    updateTempBoard,
    piece,
    winner,
    play
}: BoardProp) {
    const rows = [];
    function handleClick(j: number) {
        play(j);
    }
    function handleMouseEnter(j: number) {
        updateTempBoard(j, piece, false);
    }
    function handleMouseLeave(j: number) {
        updateTempBoard(j, piece, true);
    }
    let res;
    if (winner) {
        for (let i = 0; i < boardHeight; i++) {
            const cells = [];
            for (let j = 0; j < boardWidth; j++) {
                cells.push(
                    <Cell
                        id={i * boardWidth + j}
                        key={i * boardWidth + j}
                        value={content[i][j]}
                        onCellClick={() => {}}
                        onCellMouseEnter={() => {}}
                        onCellMouseLeave={() => {}}
                    />
                );
            }
            rows.push(
                <div
                    key={i}
                    className={
                        "board-row row " +
                        (i === boardHeight - 1 ? "last-row" : null)
                    }
                >
                    {cells}
                </div>
            );
        }
        res =  <div className="board won row">{rows}</div>;
    } else {
        for (let i = 0; i < boardHeight; i++) {
            const cells = [];
            for (let j = 0; j < boardWidth; j++) {
                cells.push(
                    <Cell
                        id={i * boardWidth + j}
                        key={i * boardWidth + j}
                        value={content[i][j]}
                        onCellClick={() => {
                            handleClick(j);
                        }}
                        onCellMouseEnter={() => {
                            handleMouseEnter(j);
                        }}
                        onCellMouseLeave={() => {
                            handleMouseLeave(j);
                        }}
                    />
                );
            }
            rows.push(
                <div
                    key={i}
                    className={
                        "board-row row " +
                        (i === boardHeight - 1 ? "last-row" : null)
                    }
                >
                    {cells}
                </div>
            );
        }
        res = <div className="board row">{rows}</div>;
    }
    return <div className="board-container">{res}</div>;
}

function Status({ xIsNext, winner, moves }: StatusProp) {
    return (
        <>
            <div className="connect4-status">
                {winner === null
                    ? `This is ${xIsNext ? "Blue" : "Red"}'s turn.`
                    : `${winner == "X" ? "Blue" : "Red"} won. You may view the history by using the prev/next button.`}
            </div>
            <div className="jump-btn-group">
                <div
                    className="btn-toolbar"
                    role="toolbar"
                    aria-label="Toolbar with button groups"
                >
                    <div
                        className="btn-group mr-2"
                        role="group"
                        aria-label="First group"
                    >
                        {moves}
                    </div>
                </div>
            </div>
        </>
    );
}

function getHoverEffect(content: Board2D, x: number, piece: string) {
    for (var y = boardHeight - 1; y >= 0; y--) {
        if (content[y][x] === null) break;
    }
    if (y >= 0) content[y][x] = "temp" + piece;
}

function Game() {
    function getInitialBoard() {
        return Array.from({ length: boardHeight }, () =>
            new Array(boardWidth).fill(null)
        );
    }
    const [history, setHistory] = useState([getInitialBoard()]);
    const [winner, setWinner] = useState(null);
    const [currentMove, setCurrentMove] = useState(0);
    const [tempBoard, setTempBoard] = useState(getInitialBoard());
    const [alerts, setAlerts] = useState([]);
    const [playWithAI, setPlayWithAI] = useState(false);
    let xIsNext = currentMove % 2 === 0;
    const piece: string = xIsNext ? "X" : "O";
    function updateTempBoard(j: number, piece: String, remove: Boolean) {
        const tempBoard2 = structuredClone(tempBoard);
        for (let i = 0; i < boardHeight; i++) {
            for (let j = 0; j < boardWidth; j++) {
                if (
                    tempBoard2[i][j] === "tempO" ||
                    tempBoard2[i][j] === "tempX"
                )
                    tempBoard2[i][j] = null;
            }
        }
        if (!remove) {
            getHoverEffect(tempBoard2, j, piece.toString());
        }
        setTempBoard(tempBoard2);
    }
    function incCurrentMove() {
        setCurrentMove(currentMove + 1);
    }
    function updateHistory(nextContent: Board2D) {
        setHistory([...history.splice(0, currentMove + 1), nextContent]);
    }
    function updateAlerts(alert: React.ReactNode) {
        setAlerts([...alerts, alert]);
    }
    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove);
        setTempBoard(history[nextMove]);
    }
    const moves = 
    <>
            <button
                id="prev"
                key={-1}
                type="button"
                className="btn btn-primary"
                onClick={() => jumpTo(currentMove - 1)}
                disabled={currentMove === 0}
            >
                prev
            </button>
            <button
                id="next"
                key={1}
                type="button"
                className="btn btn-primary"
                onClick={() => jumpTo(currentMove + 1)}
                disabled={currentMove === history.length - 1}
            >
                next
            </button>
    </>
    function play(j: number) {
        const nextContent = structuredClone(tempBoard);
        for (var i = boardHeight - 1; i >= 0; i--)
            if (
                tempBoard[i][j] === null ||
                tempBoard[i][j] === "tempO" ||
                tempBoard[i][j] === "tempX"
            )
                break;
        if (i == -1) return;
        nextContent[i][j] = piece;
        updateHistory(nextContent);
        setTempBoard(nextContent);
        const reformat = (content: Board2D) => {
            // make this usable by Position in solver.ts
            let board = [];
            for (let i = 0; i < boardHeight; i++) {
                let row = [];
                for (let j = 0; j < boardWidth; j++) {
                    if (content[i][j] == null) {
                        row.push(" ");
                    } else if (content[i][j] == "O") {
                        row.push("O");
                    } else if (content[i][j] == "X") {
                        row.push("X");
                    } else {
                        console.log(
                            "Unknown element present in content: " +
                                content[i][j]
                        );
                    }
                }
                board.push(row);
            }
            // console.log(board);
            return board;
        };
        pos.setContent(reformat(nextContent));
        incCurrentMove();
        if (calculateWinner(nextContent) !== null) {
            const [_winner, start, end] = calculateWinner(nextContent);
            // drawLine(start, end);
            setWinner(_winner);
        }
    }
    const [winningMsg, setWinningMsg] = useState("Click the AI Button to know who is winning!");
    function playComputerMove () {
        let [res0, res1] = bestMove(pos);
        if (res1 > 0) {
            if ((boardHeight * boardWidth - res1 - pos.getMoves() - 1) === 0) {
                setWinningMsg((pos.getTurn() % 2 == 0 ? 'Blue' : 'Red') + ' won');
            } else {
                setWinningMsg((pos.getTurn() % 2 == 0 ? 'Blue' : 'Red') + ' will win in ' + (boardHeight * boardWidth - res1 - pos.getMoves() - 1).toString() + ' moves');
            }
        } else {
            if ((boardHeight * boardWidth - res1 - pos.getMoves() - 1) === 0) {
                setWinningMsg((pos.getTurn() % 2 == 0 ? 'Red' : 'Blue') + ' won');
            } else {
                setWinningMsg((pos.getTurn() % 2 == 0 ? 'Red' : 'Blue') + ' will win in ' + (boardHeight * boardWidth + res1 - pos.getMoves() - 1).toString() + ' moves');
            }
        }
        play(res0);
    };
    return (
        <div className="game-region">
            <div className="alert-area container">{alerts}</div>
            <div className="ai-region">
                <div>
                    <button type="button" className="btn-ai btn btn-primary" onClick={() => playComputerMove()} disabled={winner}>AI move (enable after move 10)*</button>
                </div>
                <div>
                    {winningMsg}
                </div>
                <div className="ai-disclaimer">
                    *: The solver is very slow at solving games with less than 15 moves
                </div>
            </div>
            <Board
                content={tempBoard}
                updateTempBoard={updateTempBoard}
                piece={piece}
                winner={winner}
                play={play}
            />
            <Status xIsNext={xIsNext} winner={winner} moves={moves} />
        </div>
    );
}

export default Game;
