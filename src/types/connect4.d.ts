export type Board2D = (String | null)[][];

export interface BoardProp {
    content: Board2D;
    updateTempBoard: (j: number, piece: String, remove: Boolean) => void;
    piece: String;
    winner?: String;
    play: Function;
}

export interface CellProp {
    id: number;
    value: String;
    onCellClick: Function;
    onCellMouseEnter: Function;
    onCellMouseLeave: Function;
}

export interface StatusProp {
    xIsNext: Boolean;
    winner?: String;
    moves: React.ReactElement;
}