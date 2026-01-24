import { TextColorKeys } from 'roosterjs-react';
import {
    getTextColorValue,
    TextColorDropDownItems,
    TextColors,
} from '../../../lib/colorPicker/utils/textColors';

describe('getTextColorValue', () => {
    it('returns the value of each key in TextColors', () => {
        Object.keys(TextColorDropDownItems).forEach(key => {
            const output = getTextColorValue(key as TextColorKeys);
            const expectedOutput = TextColors[key];

            expect(output.lightModeColor).toBe(expectedOutput.lightModeColor);
            expect(output.darkModeColor).toBe(expectedOutput.darkModeColor);
        });
    });

    it('throws an error for none existing key', () => {
        const invalidKey = 'invalidKey';
        const output = getTextColorValue(invalidKey as TextColorKeys);
        expect(output).toBeUndefined();
    });
});
