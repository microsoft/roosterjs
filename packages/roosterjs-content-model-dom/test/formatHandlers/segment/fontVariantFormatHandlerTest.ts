import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { createText } from '../../../lib/modelApi/creators/createText';
import { getSegmentTextFormat } from '../../../lib/modelApi/editing/getSegmentTextFormat';
import { fontVariantFormatHandler } from '../../../lib/formatHandlers/segment/fontVariantFormatHandler';
import { FontVariantFormat } from 'roosterjs-content-model-types';

describe('fontVariantFormatHandler', () => {
    it('parses defaults, retains inheritance and preserves explicit normal reset', () => {
        const element = document.createElement('span');
        const context = createDomToModelContext();
        const format: FontVariantFormat = {};

        fontVariantFormatHandler.parse(format, element, context, { fontVariant: 'small-caps' });
        expect(format.fontVariant).toBe('small-caps');
        element.style.fontVariant = 'inherit';
        fontVariantFormatHandler.parse(format, element, context, {});
        expect(format.fontVariant).toBe('small-caps');
        element.style.fontVariant = 'normal';
        fontVariantFormatHandler.parse(format, element, context, {});
        expect(format.fontVariant).toBe('normal');
    });

    it('ignores unsupported defaults and unnecessary normal formatting', () => {
        const element = document.createElement('span');
        const context = createDomToModelContext();
        const format: FontVariantFormat = {};

        fontVariantFormatHandler.parse(format, element, context, { fontVariant: 'unknown' });
        expect(format).toEqual({});
        element.style.fontVariant = 'normal';
        fontVariantFormatHandler.parse(format, element, context, {});
        expect(format).toEqual({});
    });

    it('applies and copies small caps without changing text', () => {
        const element = document.createElement('span');
        const segment = createText('Mixed', { fontVariant: 'small-caps' });

        element.textContent = segment.text;
        fontVariantFormatHandler.apply(segment.format, element, createModelToDomContext());
        expect(element.style.fontVariant).toBe('small-caps');
        expect(element.textContent).toBe('Mixed');
        expect(getSegmentTextFormat(segment)).toEqual({ fontVariant: 'small-caps' });
    });
});
