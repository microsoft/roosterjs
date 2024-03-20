import { convertDomSelectionToRangeEx, convertRangeExToDomSelection } from './selectionConverter';
import { createDefaultHtmlSanitizerOptions } from 'roosterjs-editor-dom';
import type { BeforePasteAdapterEvent } from '../../publicTypes/BeforePasteAdapterEvent';
import {
    KnownAnnounceStrings as OldKnownAnnounceStrings,
    PasteType as OldPasteType,
    EntityOperation as OldEntityOperation,
    PluginEventType,
} from 'roosterjs-editor-types';
import type {
    PluginEvent as OldEvent,
    AnnounceData as OldAnnounceData,
} from 'roosterjs-editor-types';
import type {
    PluginEvent as NewEvent,
    PasteType as NewPasteType,
    AnnounceData as NewAnnounceData,
    KnownAnnounceStrings as NewKnownAnnounceStrings,
    EntityOperation as NewEntityOperation,
    PluginEventType as NewPluginEventType,
} from 'roosterjs-content-model-types';

const PasteTypeNewToOld: Record<NewPasteType, OldPasteType> = {
    asImage: OldPasteType.AsImage,
    asPlainText: OldPasteType.AsPlainText,
    mergeFormat: OldPasteType.MergeFormat,
    normal: OldPasteType.Normal,
};

const PasteTypeOldToNew: Record<OldPasteType, NewPasteType> = {
    [OldPasteType.AsImage]: 'asImage',
    [OldPasteType.AsPlainText]: 'asPlainText',
    [OldPasteType.MergeFormat]: 'mergeFormat',
    [OldPasteType.Normal]: 'normal',
};

const KnownAnnounceStringsOldToNew: Record<OldKnownAnnounceStrings, NewKnownAnnounceStrings> = {
    [OldKnownAnnounceStrings.AnnounceListItemBullet]: 'announceListItemBullet',
    [OldKnownAnnounceStrings.AnnounceListItemNumbering]: 'announceListItemNumbering',
    [OldKnownAnnounceStrings.AnnounceOnFocusLastCell]: 'announceOnFocusLastCell',
};

const KnownAnnounceStringsNewToOld: Record<NewKnownAnnounceStrings, OldKnownAnnounceStrings> = {
    announceListItemBullet: OldKnownAnnounceStrings.AnnounceListItemBullet,
    announceListItemNumbering: OldKnownAnnounceStrings.AnnounceListItemNumbering,
    announceOnFocusLastCell: OldKnownAnnounceStrings.AnnounceOnFocusLastCell,
};

const EntityOperationOldToNew: Record<OldEntityOperation, NewEntityOperation | undefined> = {
    [OldEntityOperation.NewEntity]: 'newEntity',
    [OldEntityOperation.Overwrite]: 'overwrite',
    [OldEntityOperation.RemoveFromEnd]: 'removeFromEnd',
    [OldEntityOperation.RemoveFromStart]: 'removeFromStart',
    [OldEntityOperation.ReplaceTemporaryContent]: 'replaceTemporaryContent',
    [OldEntityOperation.UpdateEntityState]: 'updateEntityState',
    [OldEntityOperation.Click]: 'click',
    [OldEntityOperation.ContextMenu]: undefined,
    [OldEntityOperation.Escape]: undefined,
    [OldEntityOperation.PartialOverwrite]: undefined,
    [OldEntityOperation.AddShadowRoot]: undefined,
    [OldEntityOperation.RemoveShadowRoot]: undefined,
};

const EntityOperationNewToOld: Record<NewEntityOperation, OldEntityOperation | null> = {
    newEntity: OldEntityOperation.NewEntity,
    overwrite: OldEntityOperation.Overwrite,
    removeFromEnd: OldEntityOperation.RemoveFromEnd,
    removeFromStart: OldEntityOperation.RemoveFromStart,
    replaceTemporaryContent: OldEntityOperation.ReplaceTemporaryContent,
    updateEntityState: OldEntityOperation.UpdateEntityState,
    snapshotEntityState: null,
    click: OldEntityOperation.Click,
};

/**
 * @internal
 */
export const OldEventTypeToNewEventType: Record<PluginEventType, NewPluginEventType | undefined> = {
    [PluginEventType.BeforeCutCopy]: 'beforeCutCopy',
    [PluginEventType.BeforeDispose]: 'beforeDispose',
    [PluginEventType.BeforeKeyboardEditing]: 'beforeKeyboardEditing',
    [PluginEventType.BeforePaste]: 'beforePaste',
    [PluginEventType.BeforeSetContent]: 'beforeSetContent',
    [PluginEventType.CompositionEnd]: 'compositionEnd',
    [PluginEventType.ContentChanged]: 'contentChanged',
    [PluginEventType.ContextMenu]: 'contextMenu',
    [PluginEventType.EditImage]: 'editImage',
    [PluginEventType.EditorReady]: 'editorReady',
    [PluginEventType.EnteredShadowEdit]: 'enteredShadowEdit',
    [PluginEventType.EntityOperation]: 'entityOperation',
    [PluginEventType.ExtractContentWithDom]: 'extractContentWithDom',
    [PluginEventType.Input]: 'input',
    [PluginEventType.KeyDown]: 'keyDown',
    [PluginEventType.KeyPress]: 'keyPress',
    [PluginEventType.KeyUp]: 'keyUp',
    [PluginEventType.LeavingShadowEdit]: 'leavingShadowEdit',
    [PluginEventType.MouseDown]: 'mouseDown',
    [PluginEventType.MouseUp]: 'mouseUp',
    [PluginEventType.PendingFormatStateChanged]: undefined,
    [PluginEventType.Scroll]: 'scroll',
    [PluginEventType.SelectionChanged]: 'selectionChanged',
    [PluginEventType.ZoomChanged]: 'zoomChanged',
};

/**
 * @internal Convert legacy event object to new event object
 */
export function oldEventToNewEvent<TOldEvent extends OldEvent>(
    input: TOldEvent,
    refEvent?: NewEvent
): NewEvent | undefined {
    switch (input.eventType) {
        case PluginEventType.BeforeCutCopy:
            return {
                eventType: 'beforeCutCopy',
                clonedRoot: input.clonedRoot,
                eventDataCache: input.eventDataCache,
                isCut: input.isCut,
                range: input.range,
                rawEvent: input.rawEvent,
            };

        case PluginEventType.BeforeDispose:
            return {
                eventType: 'beforeDispose',
                eventDataCache: input.eventDataCache,
            };

        case PluginEventType.BeforeKeyboardEditing:
            return {
                eventType: 'beforeKeyboardEditing',
                eventDataCache: input.eventDataCache,
                rawEvent: input.rawEvent,
            };

        case PluginEventType.BeforePaste:
            const refBeforePasteEvent = refEvent?.eventType == 'beforePaste' ? refEvent : undefined;
            const cmBeforePasteEvent = input as BeforePasteAdapterEvent;

            return {
                eventType: 'beforePaste',
                clipboardData: input.clipboardData,
                customizedMerge:
                    cmBeforePasteEvent.customizedMerge ?? refBeforePasteEvent?.customizedMerge,
                domToModelOption: cmBeforePasteEvent.domToModelOption ??
                    refBeforePasteEvent?.domToModelOption ?? {
                        additionalAllowedTags: [],
                        additionalDisallowedTags: [],
                        additionalFormatParsers: {},
                        formatParserOverride: {},
                        processorOverride: {},
                        styleSanitizers: {},
                        attributeSanitizers: {},
                    },
                eventDataCache: input.eventDataCache,
                fragment: input.fragment,
                htmlAfter: input.htmlAfter,
                htmlAttributes: input.htmlAttributes,
                htmlBefore: input.htmlBefore,
                pasteType: PasteTypeOldToNew[input.pasteType],
            };

        case PluginEventType.BeforeSetContent:
            return {
                eventType: 'beforeSetContent',
                eventDataCache: input.eventDataCache,
                newContent: input.newContent,
            };

        case PluginEventType.CompositionEnd:
            return {
                eventType: 'compositionEnd',
                eventDataCache: input.eventDataCache,
                rawEvent: input.rawEvent,
            };

        case PluginEventType.ContentChanged:
            const refContentChangedEvent =
                refEvent?.eventType == 'contentChanged' ? refEvent : undefined;
            return {
                eventType: 'contentChanged',
                eventDataCache: input.eventDataCache,
                changedEntities: refContentChangedEvent?.changedEntities,
                contentModel: refContentChangedEvent?.contentModel,
                data: input.data,
                entityStates:
                    input.additionalData?.getEntityState?.() ??
                    refContentChangedEvent?.entityStates,
                selection: refContentChangedEvent?.selection,
                source: input.source,
                formatApiName:
                    input.additionalData?.formatApiName ?? refContentChangedEvent?.formatApiName,
                announceData:
                    announceDataOldToNew(input.additionalData?.getAnnounceData?.()) ??
                    refContentChangedEvent?.announceData,
            };

        case PluginEventType.ContextMenu:
            return {
                eventType: 'contextMenu',
                eventDataCache: input.eventDataCache,
                rawEvent: input.rawEvent,
                items: input.items,
            };

        case PluginEventType.EditImage:
            return {
                eventType: 'editImage',
                eventDataCache: input.eventDataCache,
                image: input.image,
                newSrc: input.newSrc,
                originalSrc: input.originalSrc,
                previousSrc: input.previousSrc,
            };

        case PluginEventType.EditorReady:
            return {
                eventType: 'editorReady',
                eventDataCache: input.eventDataCache,
            };

        case PluginEventType.EnteredShadowEdit:
            return {
                eventType: 'enteredShadowEdit',
                eventDataCache: input.eventDataCache,
            };

        case PluginEventType.EntityOperation:
            const operation = EntityOperationOldToNew[input.operation];

            return operation === undefined
                ? undefined
                : {
                      eventType: 'entityOperation',
                      eventDataCache: input.eventDataCache,
                      rawEvent: input.rawEvent,
                      entity: input.entity,
                      operation: operation,
                      shouldPersist: input.shouldPersist,
                      state: input.state,
                  };

        case PluginEventType.ExtractContentWithDom:
            return {
                eventType: 'extractContentWithDom',
                eventDataCache: input.eventDataCache,
                clonedRoot: input.clonedRoot,
            };

        case PluginEventType.Input:
            return {
                eventType: 'input',
                eventDataCache: input.eventDataCache,
                rawEvent: input.rawEvent,
            };

        case PluginEventType.KeyDown:
        case PluginEventType.KeyPress:
        case PluginEventType.KeyUp:
            return {
                eventType:
                    input.eventType == PluginEventType.KeyDown
                        ? 'keyDown'
                        : input.eventType == PluginEventType.KeyPress
                        ? 'keyPress'
                        : 'keyUp',
                eventDataCache: input.eventDataCache,
                rawEvent: input.rawEvent,
            };

        case PluginEventType.LeavingShadowEdit:
            return {
                eventType: 'leavingShadowEdit',
                eventDataCache: input.eventDataCache,
            };

        case PluginEventType.MouseDown:
            return {
                eventType: 'mouseDown',
                eventDataCache: input.eventDataCache,
                rawEvent: input.rawEvent,
            };

        case PluginEventType.MouseUp:
            return {
                eventType: 'mouseUp',
                eventDataCache: input.eventDataCache,
                rawEvent: input.rawEvent,
                isClicking: input.isClicking,
            };

        case PluginEventType.Scroll:
            return {
                eventType: 'scroll',
                eventDataCache: input.eventDataCache,
                rawEvent: input.rawEvent,
                scrollContainer: input.scrollContainer,
            };

        case PluginEventType.SelectionChanged:
            const refSelectionChangedEvent =
                refEvent?.eventType == 'selectionChanged' ? refEvent : undefined;

            return {
                eventType: 'selectionChanged',
                eventDataCache: input.eventDataCache,
                newSelection:
                    refSelectionChangedEvent?.newSelection ??
                    convertRangeExToDomSelection(input.selectionRangeEx),
            };

        case PluginEventType.ZoomChanged:
            return {
                eventType: 'zoomChanged',
                eventDataCache: input.eventDataCache,
                newZoomScale: input.newZoomScale,
            };

        default:
            return undefined;
    }
}

/**
 * @internal Convert new event object to legacy event object
 */
export function newEventToOldEvent(input: NewEvent, refEvent?: OldEvent): OldEvent | undefined {
    switch (input.eventType) {
        case 'beforeCutCopy':
            return {
                eventType: PluginEventType.BeforeCutCopy,
                clonedRoot: input.clonedRoot,
                eventDataCache: input.eventDataCache,
                isCut: input.isCut,
                range: input.range,
                rawEvent: input.rawEvent,
            };

        case 'beforeDispose':
            return {
                eventType: PluginEventType.BeforeDispose,
                eventDataCache: input.eventDataCache,
            };

        case 'beforeKeyboardEditing':
            return {
                eventType: PluginEventType.BeforeKeyboardEditing,
                eventDataCache: input.eventDataCache,
                rawEvent: input.rawEvent,
            };

        case 'beforePaste':
            const refBeforePasteEvent =
                refEvent?.eventType == PluginEventType.BeforePaste ? refEvent : undefined;

            const oldBeforePasteEvent: BeforePasteAdapterEvent = {
                eventType: PluginEventType.BeforePaste,
                clipboardData: input.clipboardData,
                eventDataCache: input.eventDataCache,
                fragment: input.fragment,
                htmlAfter: input.htmlAfter,
                htmlAttributes: input.htmlAttributes,
                htmlBefore: input.htmlBefore,
                pasteType: PasteTypeNewToOld[input.pasteType],
                sanitizingOption:
                    refBeforePasteEvent?.sanitizingOption ?? createDefaultHtmlSanitizerOptions(),
                domToModelOption: input.domToModelOption,
                customizedMerge: input.customizedMerge,
            };

            return oldBeforePasteEvent;

        case 'beforeSetContent':
            return {
                eventType: PluginEventType.BeforeSetContent,
                eventDataCache: input.eventDataCache,
                newContent: input.newContent,
            };

        case 'compositionEnd':
            return {
                eventType: PluginEventType.CompositionEnd,
                eventDataCache: input.eventDataCache,
                rawEvent: input.rawEvent,
            };

        case 'contentChanged':
            const entityStates = input.entityStates;

            return {
                eventType: PluginEventType.ContentChanged,
                eventDataCache: input.eventDataCache,
                data: input.data,
                source: input.source,
                additionalData: {
                    formatApiName: input.formatApiName,
                    getAnnounceData: input.announceData
                        ? () => announceDataNewToOld(input.announceData)
                        : undefined,
                    getEntityState: entityStates ? () => entityStates : undefined,
                },
            };

        case 'contextMenu':
            return {
                eventType: PluginEventType.ContextMenu,
                eventDataCache: input.eventDataCache,
                rawEvent: input.rawEvent,
                items: input.items,
            };

        case 'editImage':
            return {
                eventType: PluginEventType.EditImage,
                eventDataCache: input.eventDataCache,
                image: input.image,
                newSrc: input.newSrc,
                originalSrc: input.originalSrc,
                previousSrc: input.previousSrc,
            };

        case 'editorReady':
            return {
                eventType: PluginEventType.EditorReady,
                eventDataCache: input.eventDataCache,
            };

        case 'enteredShadowEdit':
            const refEnteredShadowEditEvent =
                refEvent?.eventType == PluginEventType.EnteredShadowEdit ? refEvent : undefined;

            return {
                eventType: PluginEventType.EnteredShadowEdit,
                eventDataCache: input.eventDataCache,
                fragment: refEnteredShadowEditEvent?.fragment ?? document.createDocumentFragment(),
                selectionPath: refEnteredShadowEditEvent?.selectionPath ?? {
                    end: [],
                    start: [],
                },
            };

        case 'entityOperation':
            const oldOperation = EntityOperationNewToOld[input.operation];
            if (oldOperation !== null) {
                return {
                    eventType: PluginEventType.EntityOperation,
                    eventDataCache: input.eventDataCache,
                    rawEvent: input.rawEvent,
                    entity: input.entity,
                    operation: oldOperation,
                    shouldPersist: input.shouldPersist,
                    state: input.state,
                };
            } else {
                return undefined;
            }

        case 'extractContentWithDom':
            return {
                eventType: PluginEventType.ExtractContentWithDom,
                eventDataCache: input.eventDataCache,
                clonedRoot: input.clonedRoot,
            };

        case 'input':
            return {
                eventType: PluginEventType.Input,
                eventDataCache: input.eventDataCache,
                rawEvent: input.rawEvent,
            };

        case 'keyDown':
        case 'keyPress':
        case 'keyUp':
            return {
                eventType:
                    input.eventType == 'keyDown'
                        ? PluginEventType.KeyDown
                        : input.eventType == 'keyPress'
                        ? PluginEventType.KeyPress
                        : PluginEventType.KeyUp,
                eventDataCache: input.eventDataCache,
                rawEvent: input.rawEvent,
            };

        case 'leavingShadowEdit':
            return {
                eventType: PluginEventType.LeavingShadowEdit,
                eventDataCache: input.eventDataCache,
            };

        case 'mouseDown':
            return {
                eventType: PluginEventType.MouseDown,
                eventDataCache: input.eventDataCache,
                rawEvent: input.rawEvent,
            };

        case 'mouseUp':
            return {
                eventType: PluginEventType.MouseUp,
                eventDataCache: input.eventDataCache,
                rawEvent: input.rawEvent,
                isClicking: input.isClicking,
            };

        case 'scroll':
            return {
                eventType: PluginEventType.Scroll,
                eventDataCache: input.eventDataCache,
                rawEvent: input.rawEvent,
                scrollContainer: input.scrollContainer,
            };

        case 'selectionChanged':
            const refSelectionChangedEvent =
                refEvent?.eventType == PluginEventType.SelectionChanged ? refEvent : undefined;

            return {
                eventType: PluginEventType.SelectionChanged,
                eventDataCache: input.eventDataCache,
                selectionRangeEx:
                    refSelectionChangedEvent?.selectionRangeEx ??
                    convertDomSelectionToRangeEx(input.newSelection),
            };

        case 'zoomChanged':
            return {
                eventType: PluginEventType.ZoomChanged,
                eventDataCache: input.eventDataCache,
                newZoomScale: input.newZoomScale,
                oldZoomScale:
                    refEvent?.eventType == PluginEventType.ZoomChanged ? refEvent.oldZoomScale : 1, // In new ZoomChangedEvent we don't really have oldZoomScale. So if we can't get it, just use 1 instead
            };

        default:
            return undefined;
    }
}

function announceDataOldToNew(data: OldAnnounceData | undefined): NewAnnounceData | undefined {
    return data
        ? {
              defaultStrings: data.defaultStrings
                  ? KnownAnnounceStringsOldToNew[data.defaultStrings]
                  : undefined,
              formatStrings: data.formatStrings,
              text: data.text,
          }
        : undefined;
}

function announceDataNewToOld(data: NewAnnounceData | undefined): OldAnnounceData | undefined {
    return data
        ? {
              defaultStrings: data.defaultStrings
                  ? KnownAnnounceStringsNewToOld[data.defaultStrings]
                  : undefined,
              formatStrings: data.formatStrings,
              text: data.text,
          }
        : undefined;
}
