export type Board2D = (String | null)[][];

export interface BoardProp {
    content: Board2D;
    updateHistory: (nextContent: Board2D) => void;
    updateTempBoard: (j: number, piece: String, remove: Boolean) => void;
    setTempBoard: React.Dispatch<React.SetStateAction<Board2D>>;
    xIsNext: Boolean;
    winner?: String;
    setWinner: React.Dispatch<React.SetStateAction<String | null>>;
    incCurrentMove: Function;
    updateAlerts: Function;
    alertLength: number;
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
    moves: React.ReactElement[];
}