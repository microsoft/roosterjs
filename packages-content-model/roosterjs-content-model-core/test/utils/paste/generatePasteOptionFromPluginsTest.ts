import { generatePasteOptionFromPlugins } from '../../../lib/utils/paste/generatePasteOptionFromPlugins';
import { IStandaloneEditor } from 'roosterjs-content-model-types';
import { PasteType, PluginEventType } from 'roosterjs-editor-types';

describe('generatePasteOptionFromPlugins', () => {
    let editor: IStandaloneEditor;
    let triggerPluginEventSpy: jasmine.Spy;

    const mockedClipboardData = 'CLIPBOARDDATA' as any;
    const mockedFragment = 'FRAGMENT' as any;
    const htmlBefore = 'HTMLBEFORE';
    const htmlAfter = 'HTMLAFTER';
    const mockedMetadata = 'METADATA' as any;
    const mockedCssRule = 'CSSRULE' as any;
    const mockedResult = {
        fragment: 'FragmentResult',
        domToModelOption: 'OptionResult',
        pasteType: 'TypeResult',
    } as any;
    const sanitizingOption: any = {
        elementCallbacks: {},
        attributeCallbacks: {},
        cssStyleCallbacks: {},
        additionalTagReplacements: {},
        additionalAllowedAttributes: [],
        additionalAllowedCssClasses: [],
        additionalDefaultStyleValues: {},
        additionalGlobalStyleNodes: [],
        additionalPredefinedCssForElement: {},
        preserveHtmlComments: false,
        unknownTagReplacement: null,
    };

    beforeEach(() => {
        triggerPluginEventSpy = jasmine.createSpy('triggerPluginEvent');
        editor = {
            triggerPluginEvent: triggerPluginEventSpy,
        } as any;
    });

    it('PasteType=Normal', () => {
        triggerPluginEventSpy.and.returnValue(mockedResult);
        const result = generatePasteOptionFromPlugins(
            editor,
            mockedClipboardData,
            mockedFragment,
            {
                htmlAfter,
                htmlBefore,
                metadata: mockedMetadata,
                globalCssRules: mockedCssRule,
            },
            'normal'
        );

        expect(result).toEqual({
            fragment: 'FragmentResult',
            domToModelOption: 'OptionResult',
            pasteType: 'TypeResult',
            customizedMerge: undefined,
        } as any);
        expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
        expect(triggerPluginEventSpy).toHaveBeenCalledWith(
            PluginEventType.BeforePaste,
            {
                eventType: PluginEventType.BeforePaste,
                clipboardData: mockedClipboardData,
                fragment: mockedFragment,
                htmlBefore: htmlBefore,
                htmlAfter: htmlAfter,
                htmlAttributes: mockedMetadata,
                pasteType: PasteType.Normal,
                domToModelOption: {
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    additionalFormatParsers: {},
                    formatParserOverride: {},
                    processorOverride: {},
                },
                sanitizingOption,
            },
            true
        );
    });

    it('PasteType=asImage, return customizedMerge', () => {
        const mockedCustomizedMerge = 'MERGE' as any;

        triggerPluginEventSpy.and.returnValue({
            fragment: 'FragmentResult',
            domToModelOption: 'OptionResult',
            pasteType: 'TypeResult',
            customizedMerge: mockedCustomizedMerge,
        });

        const result = generatePasteOptionFromPlugins(
            editor,
            mockedClipboardData,
            mockedFragment,
            {
                htmlAfter,
                htmlBefore,
                metadata: mockedMetadata,
                globalCssRules: mockedCssRule,
            },
            'asImage'
        );

        expect(result).toEqual({
            fragment: 'FragmentResult',
            domToModelOption: 'OptionResult',
            pasteType: 'TypeResult',
            customizedMerge: mockedCustomizedMerge,
        } as any);
        expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
        expect(triggerPluginEventSpy).toHaveBeenCalledWith(
            PluginEventType.BeforePaste,
            {
                eventType: PluginEventType.BeforePaste,
                clipboardData: mockedClipboardData,
                fragment: mockedFragment,
                htmlBefore: htmlBefore,
                htmlAfter: htmlAfter,
                htmlAttributes: mockedMetadata,
                pasteType: PasteType.AsImage,
                domToModelOption: {
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    additionalFormatParsers: {},
                    formatParserOverride: {},
                    processorOverride: {},
                },
                sanitizingOption,
            },
            true
        );
    });

    it('PasteType=mergeFormat, no htmlBefore and htmlAfter', () => {
        triggerPluginEventSpy.and.returnValue(mockedResult);
        const result = generatePasteOptionFromPlugins(
            editor,
            mockedClipboardData,
            mockedFragment,
            {
                metadata: mockedMetadata,
                globalCssRules: mockedCssRule,
            },
            'mergeFormat'
        );

        expect(result).toEqual({
            fragment: 'FragmentResult',
            domToModelOption: 'OptionResult',
            pasteType: 'TypeResult',
            customizedMerge: undefined,
        } as any);
        expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
        expect(triggerPluginEventSpy).toHaveBeenCalledWith(
            PluginEventType.BeforePaste,
            {
                eventType: PluginEventType.BeforePaste,
                clipboardData: mockedClipboardData,
                fragment: mockedFragment,
                htmlBefore: '',
                htmlAfter: '',
                htmlAttributes: mockedMetadata,
                pasteType: PasteType.MergeFormat,
                domToModelOption: {
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    additionalFormatParsers: {},
                    formatParserOverride: {},
                    processorOverride: {},
                },
                sanitizingOption,
            },
            true
        );
    });

    it('PasteType=asPlainText', () => {
        triggerPluginEventSpy.and.returnValue(mockedResult);
        const result = generatePasteOptionFromPlugins(
            editor,
            mockedClipboardData,
            mockedFragment,
            {
                htmlAfter,
                htmlBefore,
                metadata: mockedMetadata,
                globalCssRules: mockedCssRule,
            },
            'asPlainText'
        );

        expect(result).toEqual({
            fragment: mockedFragment,
            domToModelOption: {
                additionalAllowedTags: [],
                additionalDisallowedTags: [],
                additionalFormatParsers: {},
                formatParserOverride: {},
                processorOverride: {},
            },
            customizedMerge: undefined,
            pasteType: PasteType.AsPlainText,
        });
        expect(triggerPluginEventSpy).toHaveBeenCalledTimes(0);
    });
});
