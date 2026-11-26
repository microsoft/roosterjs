import { hyphensFormatHandler } from '../../../lib/formatHandlers/segment/hyphensFormatHandler';
import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import type { HyphensFormat } from 'roosterjs-content-model-types';

describe('hyphensFormatHandler', () => {
    it('preserves supplied manual policy', () => {
        const element = document.createElement('span');
        element.style.hyphens = 'manual';
        const format: HyphensFormat = {};
        hyphensFormatHandler.parse(format, element, createDomToModelContext(), {});
        expect(format.hyphens).toBe('manual');
    });
    it('resolves inherited policy before DOM flattening', () => {
        const element = document.createElement('span');
        element.style.hyphens = 'unset';
        const format: HyphensFormat = { hyphens: 'none' };
        hyphensFormatHandler.parse(format, element, createDomToModelContext(), {});
        expect(format.hyphens).toBe('none');
    });
    it('resets inherited policy when leaving modeled content', () => {
        const element = document.createElement('span');
        const context = createModelToDomContext();
        context.implicitFormat.hyphens = 'none';
        hyphensFormatHandler.apply({}, element, context);
        expect(element.style.hyphens).toBe('initial');
    });
});
