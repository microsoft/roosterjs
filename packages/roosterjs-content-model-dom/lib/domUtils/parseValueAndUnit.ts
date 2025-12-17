import { ValueAndUnit } from 'roosterjs-content-model-types';

const MarginValueRegex = /(-?\d+(\.\d+)?)([a-z]+|%)/;

/**
 * @internal
 */
export function parseValueAndUnit(value: string): ValueAndUnit | null {
    const match = MarginValueRegex.exec(value);

    if (match) {
        const [_, numStr, __, unit] = match;
        const num = parseFloat(numStr);
        return { value: num, unit };
    } else {
        return null;
    }
}
