import * as React from "react";
import { pos, negamax } from "./solver";
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
// expose jQuery to global
/*
window.jQuery = window.$ = $;
*/

// remove this
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
    updateHistory,
    updateTempBoard,
    setTempBoard,
    xIsNext,
    winner,
    setWinner,
    incCurrentMove,
    updateAlerts,
    alertLength,
}: BoardProp) {
    const rows = [];
    const piece = xIsNext ? "X" : "O";
    function handleClick(j: number) {
        if (winner) {
            updateAlerts(
                <div
                    key={alertLength}
                    id={alertLength.toString()}
                    className="alert alert-warning alert-dismissible fade show"
                    role="alert"
                >
                    <strong>The game has ended!</strong> Click refresh to
                    restart the game!
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                    ></button>
                </div>
            );
            return;
        }
        const nextContent = structuredClone(content);
        for (var i = boardHeight - 1; i >= 0; i--)
            if (
                content[i][j] === null ||
                content[i][j] === "tempO" ||
                content[i][j] === "tempX"
            )
                break;
        if (i == -1) return;
        nextContent[i][j] = piece;
        updateHistory(nextContent);
        setTempBoard(nextContent);
        incCurrentMove();
        if (calculateWinner(nextContent) !== null) {
            const [_winner, start, end] = calculateWinner(nextContent);
            // drawLine(start, end);
            setWinner(_winner);
        }
    }
    function handleMouseEnter(j: number) {
        updateTempBoard(j, piece, false);
    }
    function handleMouseLeave(j: number) {
        updateTempBoard(j, piece, true);
    }
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
    return <div className="board row">{rows}</div>;
}

function Status({ xIsNext, winner, moves }: StatusProp) {
    return (
        <>
            <div className="connect4-status">
                {winner === null
                    ? `This is ${xIsNext ? "Blue" : "Red"}'s turn.`
                    : `${winner == "X" ? "Blue" : "Red"} won.`}
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
                        {moves.slice(1)}
                    </div>
                </div>
            </div>
        </>
    );
}

function play(content: Board2D, x: number, piece: string) {
    for (var y = boardHeight - 1; y >= 0; y--) {
        if (content[y][x] === null) break;
    }
    if (y >= 0) content[y][x] = piece;
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
            play(tempBoard2, j, "temp" + piece);
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
    const moves: React.ReactElement[] = history.map((squares, move) => {
        let description = move;
        return (
            <button
                key={move}
                type="button"
                className="btn btn-primary"
                onClick={() => jumpTo(move)}
            >
                {description}
            </button>
        );
    });
    return (
        <div className="game-region">
            <div className="alert-area container">{alerts}</div>
            <div className="form-check form-switch">
                <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="playWithAI"
                    onChange={() => {
                        const ele = document.getElementById(
                            "playWithAI"
                        ) as HTMLInputElement;
                        setPlayWithAI(ele.checked);
                    }}
                />
                <label className="form-check-label" htmlFor="playWithAI">
                    Play With AI
                </label>
            </div>
            <Board
                content={tempBoard}
                updateHistory={updateHistory}
                setTempBoard={setTempBoard}
                updateTempBoard={updateTempBoard}
                xIsNext={xIsNext}
                winner={winner}
                setWinner={setWinner}
                incCurrentMove={incCurrentMove}
                updateAlerts={updateAlerts}
                alertLength={alerts.length}
            />
            <Status xIsNext={xIsNext} winner={winner} moves={moves} />
        </div>
    );
}

export default Game;
