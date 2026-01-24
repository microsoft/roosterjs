import { BackgroundColorKeys } from 'roosterjs-react';
import {
    BackgroundColorDropDownItems,
    BackgroundColors,
    getBackgroundColorValue,
} from '../../../lib/colorPicker/utils/backgroundColors';

describe('getBackgroundColorValue', () => {
    it('returns the value of each key in TextColors', () => {
        Object.keys(BackgroundColorDropDownItems).forEach(key => {
            const output = getBackgroundColorValue(key as BackgroundColorKeys);
            const expectedOutput = BackgroundColors[key];

            expect(output.lightModeColor).toBe(expectedOutput.lightModeColor);
            expect(output.darkModeColor).toBe(expectedOutput.darkModeColor);
        });
    });

    it('throws an error for none existing key', () => {
        const invalidKey = 'invalidKey';
        const output = getBackgroundColorValue(invalidKey as BackgroundColorKeys);

        expect(output).toBeUndefined();
    });
});
