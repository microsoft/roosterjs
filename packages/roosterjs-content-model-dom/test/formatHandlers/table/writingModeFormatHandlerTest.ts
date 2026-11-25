import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { writingModeFormatHandler } from '../../../lib/formatHandlers/table/writingModeFormatHandler';
import { WritingModeFormat } from 'roosterjs-content-model-types';

describe('writingModeFormatHandler', () => {
    it('preserves vertical, sideways and explicit horizontal modes', () => {
        const cell = document.createElement('td');
        const context = createDomToModelContext();
        const format: WritingModeFormat = {};

        ['vertical-rl', 'sideways-lr', 'horizontal-tb'].forEach(value => {
            cell.style.writingMode = value;
            writingModeFormatHandler.parse(format, cell, context, {});
            expect(format.writingMode).toBe(value);
        });
    });

    it('uses standard defaults and ignores legacy-only rotation and unknown values', () => {
        const cell = document.createElement('td');
        const context = createDomToModelContext();
        const format: WritingModeFormat = {};

        cell.style.cssText = 'mso-rotate:90;layout-flow:vertical-ideographic';
        writingModeFormatHandler.parse(format, cell, context, { writingMode: 'unknown' });
        expect(format).toEqual({});
        writingModeFormatHandler.parse(format, cell, context, { writingMode: 'vertical-rl' });
        expect(format.writingMode).toBe('vertical-rl');
    });

    it('applies writing mode without changing dimensions or adding a transform', () => {
        const cell = document.createElement('td');

        cell.style.width = '100px';
        writingModeFormatHandler.apply(
            { writingMode: 'sideways-lr' },
            cell,
            createModelToDomContext()
        );
        expect(cell.style.writingMode).toBe('sideways-lr');
        expect(cell.style.width).toBe('100px');
        expect(cell.style.transform).toBe('');
    });
});
