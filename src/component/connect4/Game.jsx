import React from "react";
import { useState } from "react";
const boardWidth = 7;
const boardHeight = 6;

function calculateWinner(nextContent) {
    const getter = (x, y) => {
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

function Cell({ value, onCellClick }) {
    return (
        <div className="cell" onClick={onCellClick}>
            {value}
        </div>
    );
}

function Board({
    content,
    setContent,
    xIsNext,
    setXIsNext,
    winner,
    setWinner,
}) {
    const rows = [];
    function handleClick(j) {
        if (winner) alert("TODO: The game has ended.");
        const nextContent = content.slice();
        for (var i = boardHeight - 1; i >= 0; i--)
            if (content[i][j] === null) break;
        if (i == -1) return;
        nextContent[i][j] = xIsNext ? "X" : "O";
        setContent(nextContent);
        setXIsNext(!xIsNext);
        if (calculateWinner(nextContent) !== null) {
            setWinner(calculateWinner(nextContent));
        }
    }
    for (let i = 0; i < boardHeight; i++) {
        const cells = [];
        for (let j = 0; j < boardWidth; j++) {
            cells.push(
                <Cell
                    key={[i, j]}
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
    return <div className="board col">{rows}</div>;
}

function Status({ xIsNext, winner }) {
    return (
        <div className="connect4-status col">
            {winner === null
                ? `This is ${xIsNext ? "X" : "O"}'s turn.`
                : `${winner} won.`}
        </div>
    );
}

function Game() {
    function getInitialBoard() {
        return Array.from({ length: boardHeight }, () =>
            new Array(boardWidth).fill(null)
        );
    }
    const [board, setBoard] = useState(getInitialBoard());
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState(null);
    return (
        <div className="row game-region">
            <Board
                content={board}
                setContent={setBoard}
                xIsNext={xIsNext}
                setXIsNext={setXIsNext}
                winner={winner}
                setWinner={setWinner}
            />
            <Status xIsNext={xIsNext} winner={winner} />
        </div>
    );
}

export default Game;
