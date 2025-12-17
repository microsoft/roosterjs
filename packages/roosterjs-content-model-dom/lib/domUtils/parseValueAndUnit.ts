const MarginValueRegex = /(-?\d+(\.\d+)?)([a-z]+|%)/;

/**
 * @internal
 */
export function parseValueAndUnit(value: string): { value: number; unit: string } | null {
    const match = MarginValueRegex.exec(value);
    if (match) {
        const [_, numStr, __, unit] = match;
        const num = parseFloat(numStr);
        return { value: num, unit };
    } else {
        return null;
    }
}
