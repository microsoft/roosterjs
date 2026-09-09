import type { FencedCodeBlock } from '../types/FencedCodeBlock';

/** @internal Read a fence from physical lines, without interpreting its body. */
export function readFencedCodeBlock(
    lines: string[],
    start: number,
    stripPrefix: (line: string) => string | undefined = line => line
): { block: FencedCodeBlock; end: number } | undefined {
    const first = stripPrefix(lines[start]);
    const match = first === undefined ? null : /^( {0,3})(`{3,}|~{3,})(.*)$/.exec(first);
    if (!match || (match[2][0] == '`' && match[3].indexOf('`') >= 0)) {
        return;
    }
    const source: string[] = [];
    let end = start + 1;
    let closed = false;
    for (; end < lines.length; end++) {
        const line = stripPrefix(lines[end]);
        if (line === undefined) {
            break;
        }
        const closing = /^ {0,3}(`{3,}|~{3,})[ \t]*$/.exec(line);
        if (closing && closing[1][0] == match[2][0] && closing[1].length >= match[2].length) {
            closed = true;
            end++;
            break;
        }
        // CommonMark removes up to the opener's indentation from each body line.
        source.push(line.replace(new RegExp('^ {0,' + match[1].length + '}'), ''));
    }
    return {
        block: {
            source:
                source.join('\n') + (source.length && (closed || end < lines.length) ? '\n' : ''),
            info: match[3].trim(),
            fence: match[2],
            closed,
        },
        end,
    };
}
