import { boardHeight, boardWidth } from "./utility";

// 0 for 'X' (play first)
// 1 for 'O' (play second)
// -1 for empty

const boardHeightBigInt = BigInt(boardHeight);
const boardWidthBigInt = BigInt(boardWidth);

class TranspositionTable {
    static size: number = 1e7;
    private hmap: Array<number[]> = new Array(TranspositionTable.size);
    public put(key: bigint, val: number[]) {
        this.hmap[Number(key) % TranspositionTable.size] = [
            Number(key),
            ...val,
        ];
    }
    public hasKey(key: bigint) {
        return (
            this.hmap[Number(key) % TranspositionTable.size] != undefined &&
            Number(key) === this.hmap[Number(key) % TranspositionTable.size][0]
        );
    }
    // User must check hasKey before using this
    public get(key: bigint): number[] {
        return this.hmap[Number(key) % TranspositionTable.size];
    }
}

class Position {
    private position: bigint;
    private mask: bigint;
    private moves: number;
    static bottom: bigint = (function() {
        let res = 0n;
        for (let i = 0n; i < boardWidthBigInt; i++) {
            res += (1n << (i * (boardHeightBigInt + 1n)));
        }
        return res;
    })();
    static boardMask() : bigint {
        return Position.bottom * ((1n << boardHeightBigInt) - 1n);
    }
    static topMask(col: number): bigint {
        return 1n << (boardHeightBigInt - 1n) << (BigInt(col) * (boardHeightBigInt + 1n));
    }
    static bottomMask(col: number): bigint {
        return 1n << (BigInt(col) * (boardHeightBigInt + 1n));
    }
    static columnMask(col: number) : bigint {
        return ((1n << boardHeightBigInt) - 1n) << ((boardHeightBigInt + 1n) * BigInt(col));
    }
    static popcount(m: bigint) {
        let c;
        for (c = 0; m; c++) m &= m - 1n;
        return c;
    }
    static alignment(pos: bigint) {
        // horizontal 
        let m : bigint = pos & (pos >> (boardHeightBigInt + 1n));
        if(m & (m >> (2n *(boardHeightBigInt + 1n)))) return true;
        // diagonal 1
        m = pos & (pos >> boardHeightBigInt);
        if(m & (m >> (2n * boardHeightBigInt))) return true;
        // diagonal 2 
        m = pos & (pos >> (boardHeightBigInt + 2n));
        if (m & (m >> (2n * (boardHeightBigInt + 2n)))) return true;
        // vertical;
        m = pos & (pos >> 1n);
        if(m & (m >> 2n)) return true;
        return false;
    }
    public key() {
        return this.position + this.mask + Position.bottom;
    }
    public clear() {
        this.position = 0n;
        this.mask = 0n;
        this.moves = 0;
    }
    public canPlay(col: number): boolean {
        return (this.mask & Position.topMask(col)) === 0n;
    }
    public play(col: number) {
        this.position ^= this.mask;
        this.mask |= this.mask + Position.bottomMask(col);
        this.moves++;
    }
    public getMoves() {
        return this.moves;
    }
    public getTurn() {
        return this.moves % 2;
    }
    public getCell(row : number, col: number) {
        let rowBigInt = BigInt(row), colBigInt = BigInt(col);
        if (((this.mask >> rowBigInt) >> ((boardHeightBigInt + 1n) * colBigInt)) & 1n) {
            return Number((this.position >> rowBigInt) >> ((boardHeightBigInt + 1n) * colBigInt) & 1n);
        } else {
            return null;  
        }
    }
    public clone() {
        let temp: Position = new Position(this.position, this.mask, this.moves);
        return temp;
    }
    public isWinningMove(col: number) {
        let temp : Position = this.clone();
        temp.play(col);
        let res = Position.alignment(temp.position ^ temp.mask);
        return res;
    }
    public logContent() {
        for (let i = boardHeight - 1; i >= 0; i--) {
            let line = "";
            for (let j = 0; j < boardWidth; j++) {
                let now = this.getTurn() === 1 ? 'X' : 'O'; // this.moves already increased
                let next = this.getTurn() === 0 ? 'X' : 'O';
                let cell = this.getCell(i, j);
                if (cell === null)
                    line += "#";
                else
                    line += (cell == 0) ? now : next;
            }
            console.log(line);
        }
        console.log("The next turn is ", this.getTurn() == 0 ? 'X' : 'O');
    }
    public computeWinningPosition(position: bigint, mask: bigint) {
        const height = boardHeightBigInt, width = boardWidthBigInt;
        // horizontal
        let r = (position << 1n) & (this.position << 2n) & (this.position & 3n);
        let p = (position << (height + 1n)) & (this.position << (2n * (height + 1n)))
        r |= p & (position << (3n * (height + 1n))); // XXX.
        r |= p & (position >> (height + 1n)); // XX.X
        p >>= 3n * (height + 1n);
        r |= p & (position << (height + 1n)); // .XXX
        r |= p & (position >> 3n * (height + 1n));

        p = (position << height) & (this.position << (2n * height));
        r |= p & (position << 3n * height);
        r |= p & (position >> height);
        p >>= 3n * height;
        r |= p & (position << height);
        r |= p & (position >> 3n * height);
      
        //diagonal 2
        p = (position << (height + 2n)) & (this.position << 2n * (height + 2n));
        r |= p & (position << 3n * (height + 2n));
        r |= p & (position >> (height + 2n));
        p >>= 3n * (height + 2n);
        r |= p & (position << (height + 2n));
        r |= p & (position >> 3n * (height + 2n));

        return r & (Position.boardMask() & mask);
    }
    public possible() {
        return (this.mask + Position.bottom) & Position.boardMask();
    }
    public opponentWinningPosition() {
        return this.computeWinningPosition(this.position ^ this.mask, this.mask);
    }
    public possibleNonLosingMove() {
        let possibleMask = this.possible();
        let opponentWin = this.opponentWinningPosition();
        let forcedMoves = possibleMask & opponentWin;
        if (forcedMoves) {
            if (forcedMoves & (forcedMoves - 1n)) { // if more than 1 forced moves
                return 0n;
            } else possibleMask = forcedMoves;
        }
        return possibleMask & (~(opponentWin >> 1n) );
    }
    public moveScore(col: number) {
        return Position.popcount(this.computeWinningPosition(this.position | (Position.bottomMask(col) + this.mask), this.mask | (Position.bottomMask(col) + this.mask)));
    }
    public setContent(pos: string[][]) {
        pos.reverse();
        let x = 0, o = 0;
        for (let i = 0; i < boardHeight; i++) {
            for (let j = 0 ; j < boardWidth; j++) {
                if (pos[i][j] == "X") {
                    x++;
                } else if (pos[i][j] == "O") {
                    o++;
                }
            }
        }
        this.moves = x + o;
        this.position = 0n;
        this.mask = 0n;
        let last = x > o ? 'X' : 'O';
        let next = x <= o ? 'X' : 'O';
        for (let i = 0n; i < boardHeightBigInt; i++) {
            for (let j = 0n ; j < boardWidthBigInt; j++) {
                if (pos[Number(i)][Number(j)] == last) {
                    this.mask |= (1n << i) << ((boardHeightBigInt + 1n) * j);
                } else if (pos[Number(i)][Number(j)] == next) {
                    this.position |= (1n << i) << ((boardHeightBigInt + 1n) * j);
                    this.mask |= (1n << i) << ((boardHeightBigInt + 1n) * j);
                }
            }
        }
    }
    static moves = [3, 2, 4, 1, 5, 0, 6];
    public getMoveOrder() {
        let res = [];
        for (let i = 0; i < 7; i++)
            if (this.canPlay(Position.moves[i]))
                res.push(Position.moves[i]);
        for (let i = 1; i < res.length; i++) {
            let j = i;
            while (j > 0 && this.moveScore(res[j]) < this.moveScore(res[i]))  {
                let temp: number = res[j];
                res[j] = res[i];
                res[i] = temp;
                j--;
            }
        }
        return res;
    }
    constructor(position = 0n, mask = 0n, moves = 0) {
        this.position = position;
        this.mask = mask;
        this.moves = moves;
    }
}

const pos = new Position();
const transpositionTable = new TranspositionTable();

let cnt = 0;
let cnt2 = 0;
let step = 100000;

// search for a score in the window [alpha, beta]
function negamax(pos: Position, alpha: number, beta: number) : number[] {
    cnt++;
    if (cnt % step == 0) console.log("# of iteration: " + cnt);
    let key = pos.key();
    if (transpositionTable.hasKey(key)) {
        cnt2++;
        if (cnt2 % step == 0) console.log("# of hit in transposition table: " + cnt2);
        return transpositionTable.get(key).slice(1);
    }
    if (pos.getMoves() === boardWidth * boardHeight) {
        return [null, 0]; // dead draw
    }
    for (let x = 0; x < boardWidth; x++) {
        if (pos.canPlay(x) && pos.isWinningMove(x)) {
            return [x, boardWidth * boardHeight - pos.getMoves() - 1];
        }
    }
    let theoryBestScore = boardWidth * boardHeight - pos.getMoves();
    if (beta > theoryBestScore) {
        beta = theoryBestScore;
    }
    // if (alpha >= beta) return [null, Infinity]; // this path should be pruned
    let bestScore = -100;
    let best;
    // let next = pos.possibleNonLosingMove();
    let order = pos.getMoveOrder();
    for (let i = 0; i < order.length; i++) {
        let x = order[i];
        if (Position.columnMask(x) ) {
            let newPos = pos.clone();
            newPos.play(x);
            let score: number = -negamax(newPos, -beta, -alpha)[1]; // the window becomes [-beta, -alpha]
            if (score >= beta) return [null, Infinity]; // this path should be pruned
            if (score > alpha) alpha = score;
            if (score > bestScore) {
                bestScore = score; // can be replaced by alpha
                best = x;
            }
        }
    }
    transpositionTable.put(pos.key(), [best, bestScore])
    return [best, bestScore]; // can be replaced by alpha
}

function bestMove(pos: Position) {
    let res = negamax(pos, -Infinity, Infinity);
    return [res[0], res[1]];
}

// All test has to be valid assuming X goes first

function test1() {
    pos.setContent([
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['X', 'O', 'X', 'O', 'X', 'O', 'X'],
        ['X', 'O', 'X', 'O', 'O', 'X', 'O']
    ]);
    pos.logContent();
    return negamax(pos, -Infinity, Infinity);
}

function test2() {
    pos.clear();
    pos.setContent([
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['X', 'O', 'X', 'O', 'X', 'X', 'O']
    ]);
    pos.logContent();
    return negamax(pos, -Infinity, Infinity);
}

function test3() {
    pos.clear();
    pos.setContent([
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['X', ' ', ' ', ' ', ' ', ' ', ' '],
        ['O', ' ', 'O', ' ', 'O', ' ', ' '],
        ['X', ' ', 'X', ' ', 'X', ' ', ' '],
        ['O', 'O', 'X', ' ', 'O', ' ', ' '],
        ['X', 'O', 'X', 'O', 'X', 'X', 'O']
    ]);
    pos.logContent();
    return negamax(pos, -Infinity, Infinity);
}

function test4() {
    pos.clear();
    pos.setContent([
        ['O', ' ', ' ', ' ', ' ', ' ', 'O'],
        ['X', ' ', ' ', 'X', ' ', ' ', 'X'],
        ['O', ' ', ' ', 'O', ' ', ' ', 'O'],
        ['X', ' ', ' ', 'X', ' ', ' ', 'X'],
        ['O', ' ', ' ', 'O', ' ', ' ', 'O'],
        ['X', 'X', 'O', 'X', 'O', 'X', 'X']
    ]);
    for (let i = 0; i < 7; i++) {
        console.log(Position.columnMask(i) & pos.possibleNonLosingMove());
    }
    pos.logContent();
    return negamax(pos, -Infinity, Infinity);
}


declare global {
    interface Window {
        test1: any;
        test2: any;
        test3: any;
        test4: any;
        bestMove: any;
    }
}

// For debug:

window.test1 = test1;
window.test2 = test2;
window.test3 = test3;
window.test4 = test4;
window.bestMove = bestMove;

export { pos, negamax, bestMove };
