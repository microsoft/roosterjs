import * as createDomToModelContext from 'roosterjs-content-model-dom/lib/domToModel/context/createDomToModelContext';
import * as createPasteEntityProcessor from '../../../lib/override/pasteEntityProcessor';
import * as createPasteGeneralProcessor from '../../../lib/override/pasteGeneralProcessor';
import { containerSizeFormatParser } from '../../../lib/override/containerSizeFormatParser';
import { createDomToModelContextForSanitizing } from '../../../lib/command/createModelFromHtml/createDomToModelContextForSanitizing';
import { DomToModelOptionForSanitizing } from 'roosterjs-content-model-types';
import { pasteBlockEntityParser } from '../../../lib/override/pasteCopyBlockEntityParser';
import { pasteDisplayFormatParser } from '../../../lib/override/pasteDisplayFormatParser';
import { pasteTextProcessor } from '../../../lib/override/pasteTextProcessor';

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
            createPasteGeneralProcessor,
            'createPasteGeneralProcessor'
        ).and.returnValue(mockedPasteGeneralProcessor);
        createPasteEntityProcessorSpy = spyOn(
            createPasteEntityProcessor,
            'createPasteEntityProcessor'
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
                    '#text': pasteTextProcessor,
                    entity: mockedPasteEntityProcessor,
                    '*': mockedPasteGeneralProcessor,
                },
                formatParserOverride: {
                    display: pasteDisplayFormatParser,
                },
                additionalFormatParsers: {
                    container: [containerSizeFormatParser],
                    entity: [pasteBlockEntityParser],
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
                    '#text': pasteTextProcessor,
                    entity: mockedPasteEntityProcessor,
                    '*': mockedPasteGeneralProcessor,
                },
                formatParserOverride: {
                    display: pasteDisplayFormatParser,
                },
                additionalFormatParsers: {
                    container: [containerSizeFormatParser],
                    entity: [pasteBlockEntityParser],
                },
            },
            additionalOption
        );
        expect(createPasteGeneralProcessorSpy).toHaveBeenCalledWith(additionalOption);
        expect(createPasteEntityProcessorSpy).toHaveBeenCalledWith(additionalOption);
    });
});
