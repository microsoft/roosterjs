import { textEmphasisFormatHandler } from '../../../lib/formatHandlers/segment/textEmphasisFormatHandler';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import type { TextEmphasisFormat } from 'roosterjs-content-model-types';

describe('textEmphasisFormatHandler', () => {
    it('preserves a standard custom mark, position and color', () => {
        const element = document.createElement('span');
        element.style.cssText =
            'text-emphasis-style:"*";text-emphasis-position:under right;text-emphasis-color:red';
        const format: TextEmphasisFormat = {};
        textEmphasisFormatHandler.parse(format, element, createDomToModelContext(), {});
        expect(format).toEqual({
            textEmphasisStyle: '"*"',
            textEmphasisPosition: 'under right',
            textEmphasisColor: 'red',
        });
    });
    it('resolves inherited emphasis before DOM flattening', () => {
        const element = document.createElement('span');
        element.style.textEmphasisStyle = 'unset';
        const format: TextEmphasisFormat = { textEmphasisStyle: '"*"' };
        textEmphasisFormatHandler.parse(format, element, createDomToModelContext(), {});
        expect(format.textEmphasisStyle).toBe('"*"');
    });
    it('resets marks, placement and color when leaving modeled emphasis', () => {
        const element = document.createElement('span');
        const context = createModelToDomContext();
        context.implicitFormat.textEmphasisStyle = '"*"';
        context.implicitFormat.textEmphasisPosition = 'under right';
        context.implicitFormat.textEmphasisColor = 'red';
        textEmphasisFormatHandler.apply({}, element, context);
        expect(element.style.textEmphasisStyle).toBe('none');
        expect(element.style.textEmphasisPosition).toBe('over right');
        expect(element.style.textEmphasisColor).toBe('currentcolor');
    });
});
