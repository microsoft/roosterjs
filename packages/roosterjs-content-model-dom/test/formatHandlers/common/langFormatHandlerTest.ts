import { createDomToModelContext } from '../../../lib/domToModel/context/createDomToModelContext';
import { createModelToDomContext } from '../../../lib/modelToDom/context/createModelToDomContext';
import { langFormatHandler } from '../../../lib/formatHandlers/common/langFormatHandler';
import { LangFormat } from 'roosterjs-content-model-types';

describe('langFormatHandler', () => {
    it('does not replace inherited language when the attribute is absent', () => {
        const element = document.createElement('span');
        const format: LangFormat = { lang: 'nl' };

        langFormatHandler.parse(format, element, createDomToModelContext(), {});

        expect(format).toEqual({ lang: 'nl' });
    });

    ['nl', 'zh-Hant-TW', ''].forEach(lang => {
        it('parses language ' + JSON.stringify(lang), () => {
            const element = document.createElement('span');
            const format: LangFormat = { lang: 'en' };
            element.setAttribute('lang', lang);

            langFormatHandler.parse(format, element, createDomToModelContext(), {});

            expect(format).toEqual({ lang });
        });

        it('applies language ' + JSON.stringify(lang), () => {
            const element = document.createElement('span');

            langFormatHandler.apply({ lang }, element, createModelToDomContext());

            expect(element.getAttribute('lang')).toBe(lang);
        });
    });

    it('does not add an attribute when language is unspecified', () => {
        const element = document.createElement('span');

        langFormatHandler.apply({}, element, createModelToDomContext());

        expect(element.hasAttribute('lang')).toBeFalse();
    });

    it('does not add a format property when the attribute is absent', () => {
        const element = document.createElement('span');
        const format: LangFormat = {};

        langFormatHandler.parse(format, element, createDomToModelContext(), {});

        expect(format).toEqual({});
    });
});
