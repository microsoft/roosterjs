import * as selectionConvert from '../../../lib/editor/utils/selectionConverter';
import { newEventToOldEvent, oldEventToNewEvent } from '../../../lib/editor/utils/eventConverter';
import {
    EntityOperation,
    KnownAnnounceStrings,
    PasteType,
    PluginEventType,
} from 'roosterjs-editor-types';
import type { ContentChangedEvent, PluginEvent as OldEvent } from 'roosterjs-editor-types';
import type { PluginEvent as NewEvent } from 'roosterjs-content-model-types';

describe('oldEventToNewEvent', () => {
    function runTest(
        oldEvent: OldEvent,
        refEvent: NewEvent | undefined,
        expectedResult: NewEvent | undefined
    ) {
        const result = oldEventToNewEvent(oldEvent, refEvent);

        expect(result).toEqual(expectedResult);
    }

    const mockedDataCache = 'CACHE' as any;
    const mockedRawEvent = 'EVENT' as any;

    it('BeforeCutCopy', () => {
        const mockedRoot = 'ROOT' as any;
        const mockedIsCut = 'CUT' as any;
        const mockedRange = 'RANGE' as any;

        runTest(
            {
                eventType: PluginEventType.BeforeCutCopy,
                clonedRoot: mockedRoot,
                eventDataCache: mockedDataCache,
                isCut: mockedIsCut,
                range: mockedRange,
                rawEvent: mockedRawEvent,
            },
            undefined,
            {
                eventType: 'beforeCutCopy',
                clonedRoot: mockedRoot,
                eventDataCache: mockedDataCache,
                isCut: mockedIsCut,
                range: mockedRange,
                rawEvent: mockedRawEvent,
            }
        );
    });

    it('BeforeDispose', () => {
        runTest(
            {
                eventType: PluginEventType.BeforeDispose,
                eventDataCache: mockedDataCache,
            },
            undefined,
            {
                eventType: 'beforeDispose',
                eventDataCache: mockedDataCache,
            }
        );
    });

    it('BeforeKeyboardEditing', () => {
        runTest(
            {
                eventType: PluginEventType.BeforeKeyboardEditing,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            },
            undefined,
            {
                eventType: 'beforeKeyboardEditing',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            }
        );
    });

    it('BeforePaste without ref', () => {
        const mockedClipboardData = 'CLIPBOARDDATA' as any;
        const mockedFragment = 'FRAGMENT' as any;
        const mockedHtmlBefore = 'BEFORE' as any;
        const mockedHtmlAfter = 'AFTER' as any;
        const mockedHTmlAttributes = 'ATTRIBUTES' as any;
        const mockedSanitizeOption = 'OPTION' as any;

        runTest(
            {
                eventType: PluginEventType.BeforePaste,
                eventDataCache: mockedDataCache,
                clipboardData: mockedClipboardData,
                fragment: mockedFragment,
                htmlAfter: mockedHtmlAfter,
                htmlBefore: mockedHtmlBefore,
                htmlAttributes: mockedHTmlAttributes,
                pasteType: PasteType.AsImage,
                sanitizingOption: mockedSanitizeOption,
            },
            undefined,
            {
                eventType: 'beforePaste',
                clipboardData: mockedClipboardData,
                customizedMerge: undefined,
                domToModelOption: {
                    additionalAllowedTags: [],
                    additionalDisallowedTags: [],
                    additionalFormatParsers: {},
                    formatParserOverride: {},
                    processorOverride: {},
                },
                eventDataCache: mockedDataCache,
                fragment: mockedFragment,
                htmlAfter: mockedHtmlAfter,
                htmlBefore: mockedHtmlBefore,
                htmlAttributes: mockedHTmlAttributes,
                pasteType: 'asImage',
            }
        );
    });

    it('BeforePaste with ref', () => {
        const mockedClipboardData = 'CLIPBOARDDATA' as any;
        const mockedFragment = 'FRAGMENT' as any;
        const mockedHtmlBefore = 'BEFORE' as any;
        const mockedHtmlAfter = 'AFTER' as any;
        const mockedHTmlAttributes = 'ATTRIBUTES' as any;
        const mockedSanitizeOption = 'OPTION' as any;
        const mockedDomToModelOption = 'DOMTOMODEL' as any;
        const mockedCustomizedMerge = 'MERGE' as any;

        runTest(
            {
                eventType: PluginEventType.BeforePaste,
                eventDataCache: mockedDataCache,
                clipboardData: mockedClipboardData,
                fragment: mockedFragment,
                htmlAfter: mockedHtmlAfter,
                htmlBefore: mockedHtmlBefore,
                htmlAttributes: mockedHTmlAttributes,
                pasteType: PasteType.AsPlainText,
                sanitizingOption: mockedSanitizeOption,
            },
            {
                eventType: 'beforePaste',
                clipboardData: mockedClipboardData,
                customizedMerge: mockedCustomizedMerge,
                domToModelOption: mockedDomToModelOption,
                eventDataCache: mockedDataCache,
                fragment: mockedFragment,
                htmlAfter: mockedHtmlAfter,
                htmlBefore: mockedHtmlBefore,
                htmlAttributes: mockedHTmlAttributes,
                pasteType: 'asImage',
            },
            {
                eventType: 'beforePaste',
                clipboardData: mockedClipboardData,
                customizedMerge: mockedCustomizedMerge,
                domToModelOption: mockedDomToModelOption,
                eventDataCache: mockedDataCache,
                fragment: mockedFragment,
                htmlAfter: mockedHtmlAfter,
                htmlBefore: mockedHtmlBefore,
                htmlAttributes: mockedHTmlAttributes,
                pasteType: 'asPlainText',
            }
        );
    });

    it('BeforeSetContent', () => {
        const mockedNewContent = 'CONTENT' as any;

        runTest(
            {
                eventType: PluginEventType.BeforeSetContent,
                eventDataCache: mockedDataCache,
                newContent: mockedNewContent,
            },
            undefined,
            {
                eventType: 'beforeSetContent',
                eventDataCache: mockedDataCache,
                newContent: mockedNewContent,
            }
        );
    });

    it('CompositionEnd', () => {
        runTest(
            {
                eventType: PluginEventType.CompositionEnd,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            },
            undefined,
            {
                eventType: 'compositionEnd',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            }
        );
    });

    it('ContentChanged without ref', () => {
        const mockedApiName = 'API' as any;
        const mockedFormatString = 'STRING' as any;
        const mockedText = 'TEXT' as any;
        const mockedEntityState = 'STATE' as any;
        const mockedData = 'DATA' as any;
        const mockedSource = 'SOURCE' as any;

        runTest(
            {
                eventType: PluginEventType.ContentChanged,
                eventDataCache: mockedDataCache,
                additionalData: {
                    formatApiName: mockedApiName,
                    getAnnounceData: () => ({
                        defaultStrings: KnownAnnounceStrings.AnnounceListItemBullet,
                        formatStrings: mockedFormatString,
                        text: mockedText,
                    }),
                    getEntityState: () => mockedEntityState,
                },
                data: mockedData,
                source: mockedSource,
            },
            undefined,
            {
                eventType: 'contentChanged',
                eventDataCache: mockedDataCache,
                changedEntities: undefined,
                contentModel: undefined,
                data: mockedData,
                entityStates: mockedEntityState,
                selection: undefined,
                source: mockedSource,
                formatApiName: mockedApiName,
                announceData: {
                    defaultStrings: 'announceListItemBullet',
                    formatStrings: mockedFormatString,
                    text: mockedText,
                },
            }
        );
    });

    it('ContentChanged with ref', () => {
        const mockedApiName = 'API' as any;
        const mockedFormatString = 'STRING' as any;
        const mockedText = 'TEXT' as any;
        const mockedEntityState = 'STATE' as any;
        const mockedData = 'DATA' as any;
        const mockedSource = 'SOURCE' as any;
        const mockedChangedEntity = 'ENTITY' as any;
        const mockedContentModel = 'MODEL' as any;
        const mockedSelection = 'SELECTION' as any;

        runTest(
            {
                eventType: PluginEventType.ContentChanged,
                eventDataCache: mockedDataCache,
                additionalData: {
                    formatApiName: mockedApiName,
                    getAnnounceData: () => ({
                        defaultStrings: KnownAnnounceStrings.AnnounceListItemBullet,
                        formatStrings: mockedFormatString,
                        text: mockedText,
                    }),
                    getEntityState: () => mockedEntityState,
                },
                data: mockedData,
                source: mockedSource,
            },
            {
                eventType: 'contentChanged',
                changedEntities: mockedChangedEntity,
                contentModel: mockedContentModel,
                selection: mockedSelection,
                source: mockedSource,
            },
            {
                eventType: 'contentChanged',
                eventDataCache: mockedDataCache,
                changedEntities: mockedChangedEntity,
                contentModel: mockedContentModel,
                data: mockedData,
                entityStates: mockedEntityState,
                selection: mockedSelection,
                source: mockedSource,
                formatApiName: mockedApiName,
                announceData: {
                    defaultStrings: 'announceListItemBullet',
                    formatStrings: mockedFormatString,
                    text: mockedText,
                },
            }
        );
    });

    it('ContextMenu', () => {
        const mockedItems = 'ITEMS' as any;

        runTest(
            {
                eventType: PluginEventType.ContextMenu,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
                items: mockedItems,
            },
            undefined,
            {
                eventType: 'contextMenu',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
                items: mockedItems,
            }
        );
    });

    it('EditImage', () => {
        const mockedImage = 'IMAGE' as any;
        const mockedNewSrc = 'NEWSRC' as any;
        const mockedOriginalSrc = 'ORIGINALSRC' as any;
        const mockedPreviousSrc = 'PREVIOUSSRC' as any;

        runTest(
            {
                eventType: PluginEventType.EditImage,
                eventDataCache: mockedDataCache,
                image: mockedImage,
                newSrc: mockedNewSrc,
                originalSrc: mockedOriginalSrc,
                previousSrc: mockedPreviousSrc,
            },
            undefined,
            {
                eventType: 'editImage',
                eventDataCache: mockedDataCache,
                image: mockedImage,
                newSrc: mockedNewSrc,
                originalSrc: mockedOriginalSrc,
                previousSrc: mockedPreviousSrc,
            }
        );
    });

    it('EditorReady', () => {
        runTest(
            {
                eventType: PluginEventType.EditorReady,
                eventDataCache: mockedDataCache,
            },
            undefined,
            {
                eventType: 'editorReady',
                eventDataCache: mockedDataCache,
            }
        );
    });

    it('EnteredShadowEdit', () => {
        runTest(
            {
                eventType: PluginEventType.EnteredShadowEdit,
                eventDataCache: mockedDataCache,
                fragment: null!,
                selectionPath: null!,
            },
            undefined,
            {
                eventType: 'enteredShadowEdit',
                eventDataCache: mockedDataCache,
            }
        );
    });

    it('EntityOperation', () => {
        const mockedEntity = 'Entity' as any;
        const mockedShouldPersist = 'PERSIST' as any;
        const mockedState = 'STATE' as any;

        runTest(
            {
                eventType: PluginEventType.EntityOperation,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
                entity: mockedEntity,
                operation: EntityOperation.NewEntity,
                shouldPersist: mockedShouldPersist,
                state: mockedState,
            },
            undefined,
            {
                eventType: 'entityOperation',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
                entity: mockedEntity,
                operation: 'newEntity',
                shouldPersist: mockedShouldPersist,
                state: mockedState,
            }
        );
    });

    it('ExtractContentWithDom', () => {
        const mockedClonedRoot = 'ROOT' as any;

        runTest(
            {
                eventType: PluginEventType.ExtractContentWithDom,
                eventDataCache: mockedDataCache,
                clonedRoot: mockedClonedRoot,
            },
            undefined,
            {
                eventType: 'extractContentWithDom',
                eventDataCache: mockedDataCache,
                clonedRoot: mockedClonedRoot,
            }
        );
    });

    it('Input', () => {
        runTest(
            {
                eventType: PluginEventType.Input,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            },
            undefined,
            {
                eventType: 'input',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            }
        );
    });

    it('KeyDown', () => {
        runTest(
            {
                eventType: PluginEventType.KeyDown,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            },
            undefined,
            {
                eventType: 'keyDown',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            }
        );
    });

    it('KeyPress', () => {
        runTest(
            {
                eventType: PluginEventType.KeyPress,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            },
            undefined,
            {
                eventType: 'keyPress',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            }
        );
    });

    it('KeyUp', () => {
        runTest(
            {
                eventType: PluginEventType.KeyUp,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            },
            undefined,
            {
                eventType: 'keyUp',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            }
        );
    });

    it('LeavingShadowEdit', () => {
        runTest(
            {
                eventType: PluginEventType.LeavingShadowEdit,
                eventDataCache: mockedDataCache,
            },
            undefined,
            {
                eventType: 'leavingShadowEdit',
                eventDataCache: mockedDataCache,
            }
        );
    });

    it('MouseDown', () => {
        runTest(
            {
                eventType: PluginEventType.MouseDown,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            },
            undefined,
            {
                eventType: 'mouseDown',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            }
        );
    });

    it('MouseUp', () => {
        const mockedIsClicking = 'CLICKING' as any;

        runTest(
            {
                eventType: PluginEventType.MouseUp,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
                isClicking: mockedIsClicking,
            },
            undefined,
            {
                eventType: 'mouseUp',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
                isClicking: mockedIsClicking,
            }
        );
    });

    it('Scroll', () => {
        const mockedScrollContainer = 'CONTAINER' as any;

        runTest(
            {
                eventType: PluginEventType.Scroll,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
                scrollContainer: mockedScrollContainer,
            },
            undefined,
            {
                eventType: 'scroll',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
                scrollContainer: mockedScrollContainer,
            }
        );
    });

    it('SelectionChanged without ref', () => {
        const mockedRangeEx = 'RANGEEX' as any;
        const mockedNewSelection = 'NEWSELECTION' as any;
        spyOn(selectionConvert, 'convertRangeExToDomSelection').and.returnValue(mockedNewSelection);

        runTest(
            {
                eventType: PluginEventType.SelectionChanged,
                eventDataCache: mockedDataCache,
                selectionRangeEx: mockedRangeEx,
            },
            undefined,
            {
                eventType: 'selectionChanged',
                eventDataCache: mockedDataCache,
                newSelection: mockedNewSelection,
            }
        );
        expect(selectionConvert.convertRangeExToDomSelection).toHaveBeenCalledWith(mockedRangeEx);
    });

    it('SelectionChanged with ref', () => {
        const mockedRangeEx = 'RANGEEX' as any;
        const mockedNewSelection = 'NEWSELECTION' as any;
        spyOn(selectionConvert, 'convertRangeExToDomSelection').and.returnValue(null);

        runTest(
            {
                eventType: PluginEventType.SelectionChanged,
                eventDataCache: mockedDataCache,
                selectionRangeEx: mockedRangeEx,
            },
            {
                eventType: 'selectionChanged',
                eventDataCache: mockedDataCache,
                newSelection: mockedNewSelection,
            },
            {
                eventType: 'selectionChanged',
                eventDataCache: mockedDataCache,
                newSelection: mockedNewSelection,
            }
        );
        expect(selectionConvert.convertRangeExToDomSelection).not.toHaveBeenCalled();
    });

    it('ZoomChanged', () => {
        const mockedNewZoomScale = 'NEWSCALE' as any;
        const mockedOldZoomScale = 'OLDSCALE' as any;

        runTest(
            {
                eventType: PluginEventType.ZoomChanged,
                eventDataCache: mockedDataCache,
                newZoomScale: mockedNewZoomScale,
                oldZoomScale: mockedOldZoomScale,
            },
            undefined,
            {
                eventType: 'zoomChanged',
                eventDataCache: mockedDataCache,
                newZoomScale: mockedNewZoomScale,
                oldZoomScale: mockedOldZoomScale,
            }
        );
    });
});

describe('newEventToOldEvent', () => {
    function runTest(
        newEvent: NewEvent,
        refEvent: OldEvent | undefined,
        expectedResult: OldEvent | undefined
    ) {
        const result = newEventToOldEvent(newEvent, refEvent);

        expect(result).toEqual(expectedResult);

        return result;
    }

    const mockedRoot = 'ROOT' as any;
    const mockedDataCache = 'CACHE' as any;
    const mockedIsCut = 'CUT' as any;
    const mockedRange = 'RANGE' as any;
    const mockedRawEvent = 'EVENT' as any;

    it('BeforeCutCopy', () => {
        runTest(
            {
                eventType: 'beforeCutCopy',
                clonedRoot: mockedRoot,
                eventDataCache: mockedDataCache,
                isCut: mockedIsCut,
                range: mockedRange,
                rawEvent: mockedRawEvent,
            },
            undefined,
            {
                eventType: PluginEventType.BeforeCutCopy,
                clonedRoot: mockedRoot,
                eventDataCache: mockedDataCache,
                isCut: mockedIsCut,
                range: mockedRange,
                rawEvent: mockedRawEvent,
            }
        );
    });

    it('BeforeDispose', () => {
        runTest(
            {
                eventType: 'beforeDispose',
                eventDataCache: mockedDataCache,
            },
            undefined,
            {
                eventType: PluginEventType.BeforeDispose,
                eventDataCache: mockedDataCache,
            }
        );
    });

    it('BeforeKeyboardEditing', () => {
        runTest(
            {
                eventType: 'beforeKeyboardEditing',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            },
            undefined,
            {
                eventType: PluginEventType.BeforeKeyboardEditing,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            }
        );
    });

    it('BeforePaste without ref', () => {
        const mockedClipboardData = 'CLIPBOARDDATA' as any;
        const mockedFragment = 'FRAGMENT' as any;
        const mockedHtmlBefore = 'BEFORE' as any;
        const mockedHtmlAfter = 'AFTER' as any;
        const mockedHTmlAttributes = 'ATTRIBUTES' as any;
        const mockedCustomizedMerge = 'MERGE' as any;
        const mockedDomToModelOption = 'DOMTOMODEL' as any;

        runTest(
            {
                eventType: 'beforePaste',
                eventDataCache: mockedDataCache,
                clipboardData: mockedClipboardData,
                fragment: mockedFragment,
                htmlAfter: mockedHtmlAfter,
                htmlBefore: mockedHtmlBefore,
                htmlAttributes: mockedHTmlAttributes,
                pasteType: 'asImage',
                customizedMerge: mockedCustomizedMerge,
                domToModelOption: mockedDomToModelOption,
            },
            undefined,
            {
                eventType: PluginEventType.BeforePaste,
                clipboardData: mockedClipboardData,
                eventDataCache: mockedDataCache,
                fragment: mockedFragment,
                htmlAfter: mockedHtmlAfter,
                htmlBefore: mockedHtmlBefore,
                htmlAttributes: mockedHTmlAttributes,
                pasteType: PasteType.AsImage,
                sanitizingOption: {
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
                },
            }
        );
    });

    it('BeforePaste with ref', () => {
        const mockedClipboardData = 'CLIPBOARDDATA' as any;
        const mockedFragment = 'FRAGMENT' as any;
        const mockedHtmlBefore = 'BEFORE' as any;
        const mockedHtmlAfter = 'AFTER' as any;
        const mockedHTmlAttributes = 'ATTRIBUTES' as any;
        const mockedSanitizeOption = 'OPTION' as any;
        const mockedDomToModelOption = 'DOMTOMODEL' as any;
        const mockedCustomizedMerge = 'MERGE' as any;

        runTest(
            {
                eventType: 'beforePaste',
                eventDataCache: mockedDataCache,
                clipboardData: mockedClipboardData,
                fragment: mockedFragment,
                htmlAfter: mockedHtmlAfter,
                htmlBefore: mockedHtmlBefore,
                htmlAttributes: mockedHTmlAttributes,
                pasteType: 'asImage',
                customizedMerge: mockedCustomizedMerge,
                domToModelOption: mockedDomToModelOption,
            },
            {
                eventType: PluginEventType.BeforePaste,
                clipboardData: mockedClipboardData,
                eventDataCache: mockedDataCache,
                fragment: mockedFragment,
                htmlAfter: mockedHtmlAfter,
                htmlBefore: mockedHtmlBefore,
                htmlAttributes: mockedHTmlAttributes,
                pasteType: PasteType.AsPlainText,
                sanitizingOption: mockedSanitizeOption,
            },
            {
                eventType: PluginEventType.BeforePaste,
                clipboardData: mockedClipboardData,
                eventDataCache: mockedDataCache,
                fragment: mockedFragment,
                htmlAfter: mockedHtmlAfter,
                htmlBefore: mockedHtmlBefore,
                htmlAttributes: mockedHTmlAttributes,
                pasteType: PasteType.AsImage,
                sanitizingOption: mockedSanitizeOption,
            }
        );
    });

    it('BeforeSetContent', () => {
        const mockedNewContent = 'CONTENT' as any;

        runTest(
            {
                eventType: 'beforeSetContent',
                eventDataCache: mockedDataCache,
                newContent: mockedNewContent,
            },
            undefined,
            {
                eventType: PluginEventType.BeforeSetContent,
                eventDataCache: mockedDataCache,
                newContent: mockedNewContent,
            }
        );
    });

    it('CompositionEnd', () => {
        runTest(
            {
                eventType: 'compositionEnd',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            },
            undefined,
            {
                eventType: PluginEventType.CompositionEnd,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            }
        );
    });

    it('ContentChanged without ref', () => {
        const mockedApiName = 'API' as any;
        const mockedFormatString = 'STRING' as any;
        const mockedText = 'TEXT' as any;
        const mockedEntityState = 'STATE' as any;
        const mockedData = 'DATA' as any;
        const mockedSource = 'SOURCE' as any;

        const result = runTest(
            {
                eventType: 'contentChanged',
                eventDataCache: mockedDataCache,
                data: mockedData,
                entityStates: mockedEntityState,
                source: mockedSource,
                formatApiName: mockedApiName,
                announceData: {
                    defaultStrings: 'announceListItemBullet',
                    formatStrings: mockedFormatString,
                    text: mockedText,
                },
            },
            undefined,
            {
                eventType: PluginEventType.ContentChanged,
                eventDataCache: mockedDataCache,
                data: mockedData,
                source: mockedSource,
                additionalData: {
                    formatApiName: mockedApiName,
                    getAnnounceData: jasmine.anything() as any,
                    getEntityState: jasmine.anything() as any,
                },
            }
        ) as ContentChangedEvent;

        expect(result.additionalData!.getAnnounceData!()).toEqual({
            defaultStrings: KnownAnnounceStrings.AnnounceListItemBullet,
            formatStrings: mockedFormatString,
            text: mockedText,
        });
        expect(result.additionalData!.getEntityState!()).toEqual(mockedEntityState);
    });

    it('ContextMenu', () => {
        const mockedItems = 'ITEMS' as any;

        runTest(
            {
                eventType: 'contextMenu',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
                items: mockedItems,
            },
            undefined,
            {
                eventType: PluginEventType.ContextMenu,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
                items: mockedItems,
            }
        );
    });

    it('EditImage', () => {
        const mockedImage = 'IMAGE' as any;
        const mockedNewSrc = 'NEWSRC' as any;
        const mockedOriginalSrc = 'ORIGINALSRC' as any;
        const mockedPreviousSrc = 'PREVIOUSSRC' as any;

        runTest(
            {
                eventType: 'editImage',
                eventDataCache: mockedDataCache,
                image: mockedImage,
                newSrc: mockedNewSrc,
                originalSrc: mockedOriginalSrc,
                previousSrc: mockedPreviousSrc,
            },
            undefined,
            {
                eventType: PluginEventType.EditImage,
                eventDataCache: mockedDataCache,
                image: mockedImage,
                newSrc: mockedNewSrc,
                originalSrc: mockedOriginalSrc,
                previousSrc: mockedPreviousSrc,
            }
        );
    });

    it('EditorReady', () => {
        runTest(
            {
                eventType: 'editorReady',
                eventDataCache: mockedDataCache,
            },
            undefined,
            {
                eventType: PluginEventType.EditorReady,
                eventDataCache: mockedDataCache,
            }
        );
    });

    it('EnteredShadowEdit without ref', () => {
        runTest(
            {
                eventType: 'enteredShadowEdit',
                eventDataCache: mockedDataCache,
            },
            undefined,
            {
                eventType: PluginEventType.EnteredShadowEdit,
                eventDataCache: mockedDataCache,
                fragment: document.createDocumentFragment(),
                selectionPath: {
                    end: [],
                    start: [],
                },
            }
        );
    });

    it('EnteredShadowEdit with ref', () => {
        const mockedFragment = 'FRAGMENT' as any;
        const mockedSelectionPath = 'PATH' as any;
        runTest(
            {
                eventType: 'enteredShadowEdit',
                eventDataCache: mockedDataCache,
            },
            {
                eventType: PluginEventType.EnteredShadowEdit,
                eventDataCache: mockedDataCache,
                fragment: mockedFragment,
                selectionPath: mockedSelectionPath,
            },
            {
                eventType: PluginEventType.EnteredShadowEdit,
                eventDataCache: mockedDataCache,
                fragment: mockedFragment,
                selectionPath: mockedSelectionPath,
            }
        );
    });

    it('EntityOperation', () => {
        const mockedEntity = 'Entity' as any;
        const mockedShouldPersist = 'PERSIST' as any;
        const mockedState = 'STATE' as any;

        runTest(
            {
                eventType: 'entityOperation',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
                entity: mockedEntity,
                operation: 'newEntity',
                shouldPersist: mockedShouldPersist,
                state: mockedState,
            },
            undefined,
            {
                eventType: PluginEventType.EntityOperation,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
                entity: mockedEntity,
                operation: EntityOperation.NewEntity,
                shouldPersist: mockedShouldPersist,
                state: mockedState,
            }
        );
    });

    it('ExtractContentWithDom', () => {
        const mockedClonedRoot = 'ROOT' as any;

        runTest(
            {
                eventType: 'extractContentWithDom',
                eventDataCache: mockedDataCache,
                clonedRoot: mockedClonedRoot,
            },
            undefined,
            {
                eventType: PluginEventType.ExtractContentWithDom,
                eventDataCache: mockedDataCache,
                clonedRoot: mockedClonedRoot,
            }
        );
    });

    it('Input', () => {
        runTest(
            {
                eventType: 'input',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            },
            undefined,
            {
                eventType: PluginEventType.Input,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            }
        );
    });

    it('KeyDown', () => {
        runTest(
            {
                eventType: 'keyDown',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            },
            undefined,
            {
                eventType: PluginEventType.KeyDown,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            }
        );
    });

    it('KeyPress', () => {
        runTest(
            {
                eventType: 'keyPress',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            },
            undefined,
            {
                eventType: PluginEventType.KeyPress,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            }
        );
    });

    it('KeyUp', () => {
        runTest(
            {
                eventType: 'keyUp',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            },
            undefined,
            {
                eventType: PluginEventType.KeyUp,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            }
        );
    });

    it('LeavingShadowEdit', () => {
        runTest(
            {
                eventType: 'leavingShadowEdit',
                eventDataCache: mockedDataCache,
            },
            undefined,
            {
                eventType: PluginEventType.LeavingShadowEdit,
                eventDataCache: mockedDataCache,
            }
        );
    });

    it('MouseDown', () => {
        runTest(
            {
                eventType: 'mouseDown',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            },
            undefined,
            {
                eventType: PluginEventType.MouseDown,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
            }
        );
    });

    it('MouseUp', () => {
        const mockedIsClicking = 'CLICKING' as any;

        runTest(
            {
                eventType: 'mouseUp',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
                isClicking: mockedIsClicking,
            },
            undefined,
            {
                eventType: PluginEventType.MouseUp,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
                isClicking: mockedIsClicking,
            }
        );
    });

    it('Scroll', () => {
        const mockedScrollContainer = 'CONTAINER' as any;

        runTest(
            {
                eventType: 'scroll',
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
                scrollContainer: mockedScrollContainer,
            },
            undefined,
            {
                eventType: PluginEventType.Scroll,
                eventDataCache: mockedDataCache,
                rawEvent: mockedRawEvent,
                scrollContainer: mockedScrollContainer,
            }
        );
    });

    it('SelectionChanged without ref', () => {
        const mockedRangeEx = 'RANGEEX' as any;
        const mockedNewSelection = 'NEWSELECTION' as any;
        spyOn(selectionConvert, 'convertDomSelectionToRangeEx').and.returnValue(mockedRangeEx);

        runTest(
            {
                eventType: 'selectionChanged',
                eventDataCache: mockedDataCache,
                newSelection: mockedNewSelection,
            },
            undefined,
            {
                eventType: PluginEventType.SelectionChanged,
                eventDataCache: mockedDataCache,
                selectionRangeEx: mockedRangeEx,
            }
        );
        expect(selectionConvert.convertDomSelectionToRangeEx).toHaveBeenCalledWith(
            mockedNewSelection
        );
    });

    it('SelectionChanged with ref', () => {
        const mockedRangeEx = 'RANGEEX' as any;
        const mockedNewSelection = 'NEWSELECTION' as any;
        spyOn(selectionConvert, 'convertDomSelectionToRangeEx').and.returnValue(null!);

        runTest(
            {
                eventType: 'selectionChanged',
                eventDataCache: mockedDataCache,
                newSelection: mockedNewSelection,
            },
            {
                eventType: PluginEventType.SelectionChanged,
                eventDataCache: mockedDataCache,
                selectionRangeEx: mockedRangeEx,
            },
            {
                eventType: PluginEventType.SelectionChanged,
                eventDataCache: mockedDataCache,
                selectionRangeEx: mockedRangeEx,
            }
        );
        expect(selectionConvert.convertDomSelectionToRangeEx).not.toHaveBeenCalled();
    });

    it('ZoomChanged', () => {
        const mockedNewZoomScale = 'NEWSCALE' as any;
        const mockedOldZoomScale = 'OLDSCALE' as any;

        runTest(
            {
                eventType: 'zoomChanged',
                eventDataCache: mockedDataCache,
                newZoomScale: mockedNewZoomScale,
                oldZoomScale: mockedOldZoomScale,
            },
            undefined,
            {
                eventType: PluginEventType.ZoomChanged,
                eventDataCache: mockedDataCache,
                newZoomScale: mockedNewZoomScale,
                oldZoomScale: mockedOldZoomScale,
            }
        );
    });
});
