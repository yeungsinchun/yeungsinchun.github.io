export const boardWidth = 7;
export const boardHeight = 6;

import type {
    Board2D,
    BoardProp,
    CellProp,
    StatusProp,
} from "../../types/connect4";

export function isFilled(content: Board2D) {
    let cnt = 0;
    for (let i = 0; i < boardHeight; i++) {
        for (let j = 0; j < boardWidth; j++) {
            if (content[i][j] != null) {
                cnt++;
            }
        }
    }
    return cnt === boardHeight * boardWidth;
}

export function canPlay(content: Board2D, x: number) {
    return content[x][boardHeight - 1] === null;
}

export function isWinningMove(content: Board2D, x: number) {
    const tempContent = structuredClone(content);
    return false; // tmp
}

export function calculateWinner(
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

export function play(content: Board2D, x: number, player: string) {
    if (!canPlay(content, x)) {
        return false;
    } else {
        for (let i = 0; i < boardHeight; i++) {
            if (content[x][i] === null) {
                content[x][i] = player;
                return true;
            }
        }
    }
}