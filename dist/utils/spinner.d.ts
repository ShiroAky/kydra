export declare function createSpinner(text: string): {
    start: (newText?: string) => void;
    succeed: (message: string) => void;
    fail: (message: string) => void;
};
