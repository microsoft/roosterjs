import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { createText } from '../../../lib/modelApi/creators/createText';
import { getSegmentTextFormat } from '../../../lib/modelApi/editing/getSegmentTextFormat';
import { textTransformFormatHandler } from '../../../lib/formatHandlers/segment/textTransformFormatHandler';
import { TextTransformFormat } from 'roosterjs-content-model-types';

describe('textTransformFormatHandler', () => {
    it('parses default styles, preserves inherited values and explicit none reset', () => {
        const element = document.createElement('span');
        const context = createDomToModelContext();
        const format: TextTransformFormat = {};

        textTransformFormatHandler.parse(format, element, context, { textTransform: 'uppercase' });
        expect(format.textTransform).toBe('uppercase');
        element.style.textTransform = 'inherit';
        textTransformFormatHandler.parse(format, element, context, {});
        expect(format.textTransform).toBe('uppercase');
        element.style.textTransform = 'none';
        textTransformFormatHandler.parse(format, element, context, {});
        expect(format.textTransform).toBe('none');
    });

    it('ignores unsupported defaults and does not add normal formatting', () => {
        const element = document.createElement('span');
        const context = createDomToModelContext();
        const format: TextTransformFormat = {};

        textTransformFormatHandler.parse(format, element, context, { textTransform: 'unknown' });
        expect(format).toEqual({});
        element.style.textTransform = 'none';
        textTransformFormatHandler.parse(format, element, context, {});
        expect(format).toEqual({});
    });

    it('applies and copies case presentation without changing text', () => {
        const element = document.createElement('span');
        const segment = createText('Mixed', { textTransform: 'uppercase' });

        element.textContent = segment.text;
        textTransformFormatHandler.apply(segment.format, element, createModelToDomContext());
        expect(element.style.textTransform).toBe('uppercase');
        expect(element.textContent).toBe('Mixed');
        expect(getSegmentTextFormat(segment)).toEqual({ textTransform: 'uppercase' });
    });
});
