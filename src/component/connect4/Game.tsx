import * as React from "react";
import { useState } from "react";

const boardWidth = 7;
const boardHeight = 6;

function calculateWinner(nextContent: Array<Array<String | null>>) {
    const getter = (x: number, y: number) => {
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
            if (
                getter(x + 1, y) === piece &&
                getter(x + 2, y) === piece &&
                getter(x + 3, y) === piece
            ) {
                return piece;
            }
            // vertical
            if (
                getter(x, y + 1) === piece &&
                getter(x, y + 2) === piece &&
                getter(x, y + 3) === piece
            ) {
                return piece;
            }
            // main diagonal
            if (
                getter(x + 1, y + 1) === piece &&
                getter(x + 2, y + 2) === piece &&
                getter(x + 3, y + 3) === piece
            ) {
                return piece;
            }
            // anti diagonal
            if (
                getter(x + 1, y - 1) === piece &&
                getter(x + 2, y - 2) === piece &&
                getter(x + 3, y - 3) === piece
            ) {
                return piece;
            }
        }
    }
    return null;
}

interface CellProp {
    value: String;
    onCellClick: Function;
}

function Cell({ value, onCellClick }: CellProp) {
    return (
        <div className={"cell " + value} onClick={() => onCellClick()}></div>
    );
}

interface BoardProp {
    content: Array<Array<String | null>>;
    updateHistory: (nextContent: (String | null)[][]) => void;
    xIsNext: Boolean;
    winner?: String;
    setWinner: React.Dispatch<React.SetStateAction<String | null>>;
    incCurrentMove: Function;
}

function Board({
    content,
    updateHistory,
    xIsNext,
    winner,
    setWinner,
    incCurrentMove,
}: BoardProp) {
    const rows = [];
    function handleClick(j: number) {
        if (winner) {
            alert("TODO: The game has ended.");
            return;
        }
        const nextContent = structuredClone(content);
        for (var i = boardHeight - 1; i >= 0; i--)
            if (content[i][j] === null) break;
        if (i == -1) return;
        nextContent[i][j] = xIsNext ? "X" : "O";
        updateHistory(nextContent);
        incCurrentMove();
        if (calculateWinner(nextContent) !== null) {
            setWinner(calculateWinner(nextContent));
        }
    }
    for (let i = 0; i < boardHeight; i++) {
        const cells = [];
        for (let j = 0; j < boardWidth; j++) {
            cells.push(
                <Cell
                    key={i * boardWidth + j}
                    value={content[i][j]}
                    onCellClick={() => {
                        handleClick(j);
                    }}
                />
            );
        }
        rows.push(
            <div key={i} className="board-row row">
                {cells}
            </div>
        );
    }
    return <div className="board row">{rows}</div>;
}

interface StatusProp {
    xIsNext: Boolean;
    winner?: String;
    moves: React.ReactElement[];
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
                        {moves}
                    </div>
                </div>
            </div>
        </>
    );
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
    let xIsNext = currentMove % 2 === 0;
    function incCurrentMove() {
        setCurrentMove(currentMove + 1);
    }
    function updateHistory(nextContent: (String | null)[][]) {
        setHistory([...history.splice(0, currentMove + 1), nextContent]);
    }
    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove);
    }
    const moves: React.ReactElement[] = history.map((squares, move) => {
        let description;
        if (move === 0) {
            description = "start";
        } else if (move === history.length - 1) {
            description = "end";
        } else {
            description = move;
        }
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
            <Board
                content={history[currentMove]}
                updateHistory={updateHistory}
                xIsNext={xIsNext}
                winner={winner}
                setWinner={setWinner}
                incCurrentMove={incCurrentMove}
            />
            <Status xIsNext={xIsNext} winner={winner} moves={moves} />
        </div>
    );
}

export default Game;
