import { generatePasteOptionFromPlugins } from '../../../lib/utils/paste/generatePasteOptionFromPlugins';
import { PasteType, PluginEventType } from 'roosterjs-editor-types';
import { StandaloneEditorCore } from 'roosterjs-content-model-types';

describe('generatePasteOptionFromPlugins', () => {
    let core: StandaloneEditorCore;
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
        core = {
            api: {
                triggerEvent: triggerPluginEventSpy,
            },
        } as any;
    });

    it('PasteType=Normal', () => {
        let originalEvent: any;

        triggerPluginEventSpy.and.callFake((core, event) => {
            originalEvent = { ...event };
            Object.assign(event, mockedResult);
        });
        const result = generatePasteOptionFromPlugins(
            core,
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
            eventType: PluginEventType.BeforePaste,
            clipboardData: mockedClipboardData,
            htmlBefore,
            htmlAfter,
            htmlAttributes: mockedMetadata,
            sanitizingOption,
        } as any);
        expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
        expect(originalEvent).toEqual({
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
        });
        expect(triggerPluginEventSpy).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.BeforePaste,
                clipboardData: mockedClipboardData,
                fragment: 'FragmentResult',
                htmlBefore: htmlBefore,
                htmlAfter: htmlAfter,
                htmlAttributes: mockedMetadata,
                pasteType: 'TypeResult',
                domToModelOption: 'OptionResult',
                sanitizingOption,
            },
            true
        );
    });

    it('PasteType=asImage, return customizedMerge', () => {
        const mockedCustomizedMerge = 'MERGE' as any;

        triggerPluginEventSpy.and.callFake((core, event) => {
            event.fragment = 'FragmentResult';
            event.domToModelOption = 'OptionResult';
            event.pasteType = 'TypeResult';
            event.customizedMerge = mockedCustomizedMerge;
        });

        const result = generatePasteOptionFromPlugins(
            core,
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
            eventType: PluginEventType.BeforePaste,
            clipboardData: mockedClipboardData,
            htmlBefore,
            htmlAfter,
            htmlAttributes: mockedMetadata,
            sanitizingOption,
        } as any);
        expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
        expect(triggerPluginEventSpy).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.BeforePaste,
                clipboardData: mockedClipboardData,
                fragment: 'FragmentResult',
                htmlBefore: htmlBefore,
                htmlAfter: htmlAfter,
                htmlAttributes: mockedMetadata,
                pasteType: 'TypeResult',
                domToModelOption: 'OptionResult',
                sanitizingOption,
                customizedMerge: mockedCustomizedMerge,
            },
            true
        );
    });

    it('PasteType=mergeFormat, no htmlBefore and htmlAfter', () => {
        let originalEvent: any;

        triggerPluginEventSpy.and.callFake((core, event) => {
            originalEvent = { ...event };
            Object.assign(event, mockedResult);
        });
        const result = generatePasteOptionFromPlugins(
            core,
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
            eventType: PluginEventType.BeforePaste,
            clipboardData: mockedClipboardData,
            htmlBefore: '',
            htmlAfter: '',
            htmlAttributes: mockedMetadata,
            sanitizingOption,
        } as any);
        expect(triggerPluginEventSpy).toHaveBeenCalledTimes(1);
        expect(triggerPluginEventSpy).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.BeforePaste,
                clipboardData: mockedClipboardData,
                fragment: 'FragmentResult',
                htmlBefore: '',
                htmlAfter: '',
                htmlAttributes: mockedMetadata,
                pasteType: 'TypeResult',
                domToModelOption: 'OptionResult',
                sanitizingOption,
            },
            true
        );
        expect(originalEvent).toEqual({
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
        });
    });

    it('PasteType=asPlainText', () => {
        triggerPluginEventSpy.and.callFake((core, event) => {
            Object.assign(event, mockedResult);
        });
        const result = generatePasteOptionFromPlugins(
            core,
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
            pasteType: PasteType.AsPlainText,
            eventType: PluginEventType.BeforePaste,
            clipboardData: mockedClipboardData,
            htmlBefore,
            htmlAfter,
            htmlAttributes: mockedMetadata,
            sanitizingOption,
        });
        expect(triggerPluginEventSpy).toHaveBeenCalledTimes(0);
    });
});
