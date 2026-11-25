import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { noShadeFormatHandler } from '../../../lib/formatHandlers/common/noShadeFormatHandler';
import { NoShadeFormat } from 'roosterjs-content-model-types';

describe('noShadeFormatHandler', () => {
    it('parses boolean attribute presence, regardless of its string value', () => {
        const rule = document.createElement('hr');
        const context = createDomToModelContext();
        const format: NoShadeFormat = {};

        noShadeFormatHandler.parse(format, rule, context, {});
        expect(format).toEqual({});
        rule.setAttribute('noshade', 'false');
        noShadeFormatHandler.parse(format, rule, context, {});
        expect(format.noShade).toBe(true);
    });

    it('applies native shading without adding width, height or borders, and supports removal', () => {
        const rule = document.createElement('hr');
        const context = createModelToDomContext();

        rule.setAttribute('size', '4');
        rule.style.width = '50%';
        noShadeFormatHandler.apply({ noShade: true }, rule, context);
        expect(rule.hasAttribute('noshade')).toBe(true);
        expect(rule.size).toBe('4');
        expect(rule.style.width).toBe('50%');
        expect(rule.style.border).toBe('');
        expect(rule.style.height).toBe('');
        noShadeFormatHandler.apply({ noShade: false }, rule, context);
        expect(rule.hasAttribute('noshade')).toBe(false);
    });

    it('does not treat a DIV divider as a horizontal rule', () => {
        const div = document.createElement('div');
        const format: NoShadeFormat = {};

        div.setAttribute('noshade', '');
        noShadeFormatHandler.parse(format, div, createDomToModelContext(), {});
        expect(format).toEqual({});
        div.removeAttribute('noshade');
        noShadeFormatHandler.apply({ noShade: true }, div, createModelToDomContext());
        expect(div.hasAttribute('noshade')).toBe(false);
    });
});
