export interface RizzAnalysisMessage {
    message: string;
    from: "from_usr" | "to_usr";

    rating: number;

    analysis: "great_find" | "good" | "missed_win" | "blunder" | "mistake" | "brilliant" | "inaccuracy" | "incorrect" | "correct" | "best" | "book" | "excellent" | "forced"
    analysis_reason: string;

    example_best_move: string;
}

export interface RizzAnalysis {
    analysis: RizzAnalysisMessage[];
    overall_rating: number;
}

export interface message {
    message: string;
    from: "to_usr" | "from_usr";
}