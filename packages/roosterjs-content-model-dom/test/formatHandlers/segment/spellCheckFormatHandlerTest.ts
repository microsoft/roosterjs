import { spellCheckFormatHandler } from '../../../lib/formatHandlers/segment/spellCheckFormatHandler';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import type { SpellCheckFormat } from 'roosterjs-content-model-types';

describe('spellCheckFormatHandler', () => {
    it('keeps absent and invalid attributes inherited rather than enabling proofing', () => {
        const element = document.createElement('span');
        const format: SpellCheckFormat = { spellCheck: false };
        spellCheckFormatHandler.parse(format, element, createDomToModelContext(), {});
        expect(format.spellCheck).toBeFalse();
        element.setAttribute('spellcheck', 'unknown');
        spellCheckFormatHandler.parse(format, element, createDomToModelContext(), {});
        expect(format.spellCheck).toBeFalse();
    });
    it('recognizes an explicit empty attribute as enabled', () => {
        const element = document.createElement('span');
        element.setAttribute('spellcheck', '');
        const format: SpellCheckFormat = { spellCheck: false };
        spellCheckFormatHandler.parse(format, element, createDomToModelContext(), {});
        expect(format.spellCheck).toBeTrue();
    });
    it('emits nested proofing resets without overriding a neutral editor default', () => {
        const element = document.createElement('span');
        const context = createModelToDomContext();
        context.implicitFormat.spellCheck = false;
        spellCheckFormatHandler.apply({ spellCheck: '' }, element, context);
        expect(element.hasAttribute('spellcheck')).toBeFalse();
        spellCheckFormatHandler.apply({ spellCheck: true }, element, context);
        expect(element.getAttribute('spellcheck')).toBe('true');
    });
});
