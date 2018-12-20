// White space matching regex. It matches following chars:
// \s: white space
// \u00A0: no-breaking white space
// \u200B: zero width space
// \u3000: full width space (which can come from JPN IME)
const WHITESPACE_REGEX = /[\s\u00A0\u200B\u3000]+([^\s\u00A0\u200B\u3000]*)$/i;

export default function matchWhiteSpaces(source: string): string[] {
    return WHITESPACE_REGEX.exec(source);
}
