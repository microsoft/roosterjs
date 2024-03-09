import * as createDomToModelContext from 'roosterjs-content-model-dom/lib/domToModel/context/createDomToModelContext';
import * as createSanitizeEntityProcessor from '../../../lib/editorCommand/createModelFromHtml/sanitizeEntityProcessor';
import * as createSanitizeGeneralProcessor from '../../../lib/editorCommand/createModelFromHtml/sanitizeGeneralProcessor';
import { containerSizeFormatParser } from '../../../lib/editorCommand/createModelFromHtml/containerSizeFormatParser';
import { createDomToModelContextForSanitizing } from '../../../lib/editorCommand/createModelFromHtml/createDomToModelContextForSanitizing';
import { DomToModelOptionForSanitizing } from 'roosterjs-content-model-types';
import { sanitizeCopyBlockEntityParser } from '../../../lib/editorCommand/createModelFromHtml/sanitizeCopyBlockEntityParser';
import { sanitizeDisplayFormatParser } from '../../../lib/editorCommand/createModelFromHtml/sanitizeDisplayFormatParser';
import { sanitizeTextProcessor } from '../../../lib/editorCommand/createModelFromHtml/sanitizeTextProcessor';

describe('createDomToModelContextForSanitizing', () => {
    const mockedPasteGeneralProcessor = 'GENERALPROCESSOR' as any;
    const mockedPasteEntityProcessor = 'ENTITYPROCESSOR' as any;
    const mockedResult = 'CONTEXT' as any;
    const defaultOptions: DomToModelOptionForSanitizing = {
        processorOverride: {},
        formatParserOverride: {},
        additionalFormatParsers: {},
        additionalAllowedTags: [],
        additionalDisallowedTags: [],
        styleSanitizers: {},
        attributeSanitizers: {},
    };
    let createDomToModelContextSpy: jasmine.Spy;

    let createPasteGeneralProcessorSpy: jasmine.Spy;
    let createPasteEntityProcessorSpy: jasmine.Spy;

    beforeEach(() => {
        createPasteGeneralProcessorSpy = spyOn(
            createSanitizeGeneralProcessor,
            'createSanitizeGeneralProcessor'
        ).and.returnValue(mockedPasteGeneralProcessor);
        createPasteEntityProcessorSpy = spyOn(
            createSanitizeEntityProcessor,
            'createSanitizeEntityProcessor'
        ).and.returnValue(mockedPasteEntityProcessor);

        createDomToModelContextSpy = spyOn(
            createDomToModelContext,
            'createDomToModelContext'
        ).and.returnValue(mockedResult);
    });

    it('no options', () => {
        const context = createDomToModelContextForSanitizing(document);

        expect(context).toBe(mockedResult);
        expect(createDomToModelContextSpy).toHaveBeenCalledWith(
            {
                defaultFormat: undefined,
                rootFontSize: 16,
            },
            undefined,
            {
                processorOverride: {
                    '#text': sanitizeTextProcessor,
                    entity: mockedPasteEntityProcessor,
                    '*': mockedPasteGeneralProcessor,
                },
                formatParserOverride: {
                    display: sanitizeDisplayFormatParser,
                },
                additionalFormatParsers: {
                    container: [containerSizeFormatParser],
                    entity: [sanitizeCopyBlockEntityParser],
                },
            },
            defaultOptions
        );
        expect(createPasteGeneralProcessorSpy).toHaveBeenCalledWith(defaultOptions);
        expect(createPasteEntityProcessorSpy).toHaveBeenCalledWith(defaultOptions);
    });

    it('with options', () => {
        const mockedDefaultFormat = 'FORMAT' as any;
        const mockedOption = 'OPTION' as any;
        const mockedAdditionalOption = { a: 'b' } as any;

        const context = createDomToModelContextForSanitizing(
            document,
            mockedDefaultFormat,
            mockedOption,
            mockedAdditionalOption
        );

        const additionalOption = {
            ...defaultOptions,
            ...mockedAdditionalOption,
        };

        expect(context).toBe(mockedResult);
        expect(createDomToModelContextSpy).toHaveBeenCalledWith(
            {
                defaultFormat: mockedDefaultFormat,
                rootFontSize: 16,
            },
            mockedOption,
            {
                processorOverride: {
                    '#text': sanitizeTextProcessor,
                    entity: mockedPasteEntityProcessor,
                    '*': mockedPasteGeneralProcessor,
                },
                formatParserOverride: {
                    display: sanitizeDisplayFormatParser,
                },
                additionalFormatParsers: {
                    container: [containerSizeFormatParser],
                    entity: [sanitizeCopyBlockEntityParser],
                },
            },
            additionalOption
        );
        expect(createPasteGeneralProcessorSpy).toHaveBeenCalledWith(additionalOption);
        expect(createPasteEntityProcessorSpy).toHaveBeenCalledWith(additionalOption);
    });
});
