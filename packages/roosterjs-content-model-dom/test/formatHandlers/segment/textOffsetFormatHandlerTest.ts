import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { createText } from '../../../lib/modelApi/creators/createText';
import { getSegmentTextFormat } from '../../../lib/modelApi/editing/getSegmentTextFormat';
import { textOffsetFormatHandler } from '../../../lib/formatHandlers/segment/textOffsetFormatHandler';
import { TextOffsetFormat } from 'roosterjs-content-model-types';

describe('textOffsetFormatHandler', () => {
    it('accumulates signed absolute offsets including nested zero', () => {
        const element = document.createElement('span');
        const context = createDomToModelContext();
        const format: TextOffsetFormat = {};

        element.style.cssText = 'position:relative;top:-3pt';
        textOffsetFormatHandler.parse(format, element, context, {});
        expect(format.textOffset).toBe('-4px');
        element.style.top = '0pt';
        textOffsetFormatHandler.parse(format, element, context, {});
        expect(format.textOffset).toBe('-4px');
        element.style.top = '3pt';
        textOffsetFormatHandler.parse(format, element, context, {});
        expect(format.textOffset).toBe('0px');
    });

    it('ignores MSO-only, absolute, static and unsupported relative positioning', () => {
        const element = document.createElement('span');
        const context = createDomToModelContext();
        const format: TextOffsetFormat = { textOffset: '-4px' };

        [
            'mso-text-raise:3pt',
            'position:absolute;top:3pt',
            'position:static;top:3pt',
            'position:relative;top:auto',
            'position:relative;top:20%',
        ].forEach(style => {
            element.style.cssText = style;
            textOffsetFormatHandler.parse(format, element, context, {});
            expect(format.textOffset).toBe('-4px');
        });
    });

    it('applies and copies the offset without adding super/sub or changing font size', () => {
        const element = document.createElement('span');
        const segment = createText('Raised', { textOffset: '-4px', fontSize: '12pt' });

        textOffsetFormatHandler.apply(segment.format, element, createModelToDomContext());
        expect(element.style.position).toBe('relative');
        expect(element.style.top).toBe('-4px');
        expect(element.style.fontSize).toBe('');
        expect(element.querySelector('sup,sub')).toBeNull();
        expect(getSegmentTextFormat(segment)).toEqual({ textOffset: '-4px', fontSize: '12pt' });
    });
});
