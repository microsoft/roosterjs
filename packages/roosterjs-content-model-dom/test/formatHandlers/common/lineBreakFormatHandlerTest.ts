import { lineBreakFormatHandler } from '../../../lib/formatHandlers/common/lineBreakFormatHandler';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import type { LineBreakFormat } from 'roosterjs-content-model-types';

describe('lineBreakFormatHandler', () => {
    it('preserves supplied strict rules', () => {
        const element = document.createElement('span');
        element.style.setProperty('line-break', 'strict');
        const format: LineBreakFormat = {};
        lineBreakFormatHandler.parse(format, element, createDomToModelContext(), {});
        expect(format).toEqual({ lineBreak: 'strict' });
    });
    it('retains inherited rules for unset before DOM flattening', () => {
        const element = document.createElement('span');
        element.style.setProperty('line-break', 'unset');
        const format: LineBreakFormat = { lineBreak: 'strict' };
        lineBreakFormatHandler.parse(format, element, createDomToModelContext(), {});
        expect(format.lineBreak).toBe('strict');
    });
    it('resets modeled inherited rules to the CSS initial value', () => {
        const element = document.createElement('span');
        const context = createModelToDomContext();
        context.implicitFormat.lineBreak = 'strict';
        lineBreakFormatHandler.apply({}, element, context);
        expect(element.style.getPropertyValue('line-break')).toBe('initial');
    });
});
