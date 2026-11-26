import { textAutospaceFormatHandler } from '../../../lib/formatHandlers/segment/textAutospaceFormatHandler';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import type { TextAutospaceFormat } from 'roosterjs-content-model-types';

describe('textAutospaceFormatHandler', () => {
    it('preserves supported values supplied by default styles', () => {
        const format: TextAutospaceFormat = {};
        const defaultStyle = { fontFamily: 'Arial', textAutospace: 'normal' };
        textAutospaceFormatHandler.parse(
            format,
            document.createElement('span'),
            createDomToModelContext(),
            defaultStyle
        );
        expect(format.textAutospace).toBe('normal');
    });
    it('retains inherited spacing for unset before flattening', () => {
        const format: TextAutospaceFormat = { textAutospace: 'normal' };
        const element = document.createElement('span');
        element.style.setProperty('text-autospace', 'unset');
        textAutospaceFormatHandler.parse(format, element, createDomToModelContext(), {});
        expect(format.textAutospace).toBe('normal');
    });
    it('resets inherited spacing to the browser initial value', () => {
        const context = createModelToDomContext();
        context.implicitFormat.textAutospace = 'normal';
        const element = document.createElement('span');
        textAutospaceFormatHandler.apply({}, element, context);
        expect(element.style.getPropertyValue('text-autospace')).toBe('initial');
    });
});
