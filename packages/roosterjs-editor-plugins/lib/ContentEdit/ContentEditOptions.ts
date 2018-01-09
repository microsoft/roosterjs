interface ContentEditOptions {
    indentWhenTab: boolean;
    outdentWhenShiftTab: boolean;
    outdentWhenBackspaceOnEmptyFirstLine: boolean;
    outdentWhenEnterOnEmptyLine: boolean;
    outdentWhenBackspaceOnFirstChar: boolean;
    unquoteWhenBackspaceOnEmptyFirstLine: boolean;
    unquoteWhenEnterOnEmptyLine: boolean;
    unquoteWhenBackspaceOnFirstChar: boolean;
}

export default ContentEditOptions;

export function getDefaultContentEditOptions(): ContentEditOptions {
    return {
        indentWhenTab: true,
        outdentWhenShiftTab: true,
        outdentWhenBackspaceOnEmptyFirstLine: true,
        outdentWhenEnterOnEmptyLine: true,
        outdentWhenBackspaceOnFirstChar: false,
        unquoteWhenBackspaceOnEmptyFirstLine: true,
        unquoteWhenEnterOnEmptyLine: true,
        unquoteWhenBackspaceOnFirstChar: false,
    };
}
