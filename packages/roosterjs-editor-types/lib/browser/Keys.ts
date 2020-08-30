/**
 * Key numbers common used keys
 */
export const enum Keys {
    NULL = 0,
    BACKSPACE = 8,
    TAB = 9,
    ENTER = 13,
    ESCAPE = 27,
    SPACE = 32,
    PAGEUP = 33,
    LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40,
    DELETE = 46,
    EIGHT_ASTIRISK = 56,
    B = 66,
    I = 73,
    U = 85,
    Y = 89,
    Z = 90,
    COMMA = 188,
    DASH_UNDERSCORE = 189,
    PERIOD = 190,
    FORWARDSLASH = 191,
    GRAVE_TILDE = 192,

    // Keys below are non-standard, and should be used in ContentEditFeatures only
    Ctrl = 0x100,
    Meta = 0x200,
    Shift = 0x400,
    CONTENTCHANGED = 0x800,
}
