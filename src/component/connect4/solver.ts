import { boardHeight, boardWidth } from "./utility";

type BitBoard2D = number[][];
// 0 for 'X' (play first)
// 1 for 'O' (play second)
// -1 for empty

class Position {
    private content: BitBoard2D;
    private moves: number;
    public clear() {
        this.content = [];
        for (let i = 0; i < boardHeight; i++) {
            this.content[i] = [];
            for (let j = 0; j < boardWidth; j++) {
                this.content[i][j] = -1;
            }
        }
        this.moves = 0;
    }
    public cntFilled(): number {
        let res = 0;
        for (let i = 0; i < boardHeight; i++) {
            for (let j = 0; j < boardWidth; j++) {
                if (this.content[i][j] != -1) {
                    res++;
                }
            }
        }
        return res;
    }
    public test(c: BitBoard2D) {
        this.content = c;
        this.moves = this.cntFilled();
    }
    public incMoves(moves: number) {
        this.moves += 1;
    }
    public getMoves() {
        return this.moves;
    }
    public getTurn() {
        return this.moves % 2;
    }
    public logContent() {
        for (let i = boardHeight - 1; i >= 0; i--) {
            let s: string = "";
            for (let j = 0; j < boardWidth; j++) {
                switch (this.content[i][j]) {
                    case 0: {
                        s += "X";
                        break;
                    }
                    case 1: {
                        s += "O";
                        break;
                    }
                    default: {
                        s += "#";
                        break;
                    }
                }
            }
            console.log(s);
        }
    }
    public canPlay(x: number) {
        for (let i = 0; i < boardHeight; i++) {
            if (this.content[i][x] === -1) {
                return true;
            }
        }
        return false;
    }
    public play(x: number) {
        for (let i = 0; i < boardHeight; i++) {
            if (this.content[i][x] === -1) {
                this.content[i][x] = this.getTurn();
                this.moves++;
                return true;
            }
        }
        return false;
    }
    public unplay(x: number) {
        for (let i = boardHeight - 1; i >= 0; i--) {
            if (this.content[i][x] != -1) {
                this.content[i][x] = -1;
                this.moves--;
                return true;
            }
        }
        return false;
    }
    public isWinningMove(x: number) {
        this.play(x);
        let res = calculateWinner(this.content);
        this.unplay(x);
        return res;
    }
    constructor() {
        this.moves = 0;
        this.content = [];
        for (let i = 0; i < boardHeight; i++) {
            this.content[i] = [];
            for (let j = 0; j < boardWidth; j++) {
                this.content[i][j] = -1;
            }
        }
    }
}

function calculateWinner(nextContent: BitBoard2D): number {
    const getter = (x: number, y: number): number | null => {
        if (x < 0 || x >= boardWidth) return null;
        if (y < 0 || y >= boardHeight) return null;
        return nextContent[y][x];
    };
    for (let i = 0; i < boardWidth; i++) {
        for (let j = 0; j < boardHeight; j++) {
            let x = i,
                y = j;
            let piece = getter(x, y);
            if (piece === -1) continue;
            // horizontal
            const toID = (x: number, y: number) => {
                return x * boardWidth + y;
            };
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

const order = [2, 3, 1, 4, 0, 5];
let cnt = 0;
function negamax(pos: Position, alpha: number, beta: number) : number[] {
    cnt++;
    console.log(cnt);
    if (pos.getMoves() === boardWidth * boardHeight) {
        return [null, 0]; // dead draw
    }
    for (let x = 0; x < boardWidth; x++) {
        if (pos.canPlay(x) && pos.isWinningMove(x) != null) {
            return [x, boardWidth * boardHeight - pos.getMoves() - 1];
        }
    }
    let theoryBestScore = boardWidth * boardHeight - pos.getMoves();
    if (beta > theoryBestScore) {
        beta = theoryBestScore;
        if (alpha >= beta) return [null, beta]; // both alpha and beta is ok; will be pruned anyway
    }
    let bestScore = -Infinity;
    let best;
    for (let i = 0; i < boardWidth; i++) {
        let x = order[i];
        if (pos.canPlay(x)) {
            pos.play(x);
            let score: number = -negamax(pos, -beta, -alpha)[1]; // the window becomes [-beta, -alpha] because
            pos.unplay(x);
            if (score >= beta) return [null, score];
            if (score > alpha) alpha = score;
            if (score > bestScore) {
                bestScore = score; // can be replaced by alpha
                best = x;
            }
        }
    }
    return [best, bestScore]; // can be replaced by alpha
}

const pos = new Position();

function test(a: number[][]) {
    pos.test(a.reverse());
    pos.logContent();
    console.log(negamax(pos, -Infinity, Infinity));
    console.log(cnt);
    cnt = 0;
}

// Test 1

/*
test([
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1,  1,  1, -1, -1, -1, -1],
        [ 1,  0,  0,  0, -1, -1, -1],
]); 
*/


// Test 2

/*
test(
    [
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1,  1,  1, -1, -1, -1, -1],
        [-1,  0,  0, -1, -1, -1, -1],
    ]
);
*/

// Test 3

/*
test(
    [
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [ 0,  0,  1, -1, -1, -1, -1],
        [ 0,  0,  1, -1, -1, -1, -1],
    ]
);
*/

declare global {
    interface Window {
        test: any;
    }
}
window.test = test;

export { pos, negamax };
