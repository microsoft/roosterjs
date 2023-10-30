import { createDefaultHtmlSanitizerOptions } from 'roosterjs-editor-dom';
import { updateImageMetadata } from 'roosterjs-content-model-editor/lib';
import {
    AnnounceData as OldAnnounceData,
    EntityOperation as OldEntityOperation,
    KnownAnnounceStrings as OldKnownAnnounceStrings,
    PasteType as OldPasteType,
    PluginEventType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';
import type {
    ICoreEditor,
    EntityOperation,
    PasteType,
    AnnounceData,
    KnownAnnounceStrings,
    DOMSelection,
} from 'roosterjs-content-model-types';
import type { CoreEditorPlugin, PluginEvent } from 'roosterjs-content-model-core';
import type { PluginEvent as AdapterPluginEvent, SelectionRangeEx } from 'roosterjs-editor-types';

/**
 * @internal
 */
export class AdapterEditorPlugin implements CoreEditorPlugin {
    private editor: ICoreEditor | null = null;

    constructor(
        private onAdapterPluginEvent: (event: AdapterPluginEvent) => AdapterPluginEvent,
        private willHandleAdapterPluginEventExclusively: (event: AdapterPluginEvent) => boolean
    ) {}

    getName() {
        return 'AdapterEditor';
    }

    initialize(editor: ICoreEditor) {
        this.editor = editor;
    }

    dispose() {
        this.editor = null;
    }

    onPluginEvent(event: PluginEvent) {
        let adapterEvent = this.translateToAdapterEvent(event);

        if (adapterEvent) {
            adapterEvent = this.onAdapterPluginEvent(adapterEvent);
            return Object.assign(event, this.translateFromAdapterEvent(adapterEvent));
        } else {
            return event;
        }
    }

    willHandleEventExclusively(event: PluginEvent) {
        let adapterEvent = this.translateToAdapterEvent(event);

        return adapterEvent ? this.willHandleAdapterPluginEventExclusively(adapterEvent) : false;
    }

    private translateToAdapterEvent(event: PluginEvent): AdapterPluginEvent | null {
        switch (event.eventType) {
            case 'beforeCutCopy':
                return {
                    eventType: PluginEventType.BeforeCutCopy,
                    rawEvent: event.rawEvent,
                    clonedRoot: event.clonedRoot,
                    range: event.range,
                    isCut: event.isCut,
                    eventDataCache: event.eventDataCache,
                };
            case 'beforeDispose':
                return {
                    eventType: PluginEventType.BeforeDispose,
                    eventDataCache: event.eventDataCache,
                };
            case 'beforeKeyboardEditing':
                return {
                    eventType: PluginEventType.BeforeKeyboardEditing,
                    rawEvent: event.rawEvent,
                    eventDataCache: event.eventDataCache,
                };
            case 'beforePaste':
                return {
                    eventType: PluginEventType.BeforePaste,
                    clipboardData: event.clipboardData,
                    fragment: event.fragment,
                    sanitizingOption: createDefaultHtmlSanitizerOptions(),
                    htmlBefore: event.htmlBefore,
                    htmlAfter: event.htmlAfter,
                    htmlAttributes: event.htmlAttributes,
                    pasteType: NewToOldPasteTypeMap[event.pasteType],
                    eventDataCache: event.eventDataCache,
                };
            case 'compositionEnd':
                return {
                    eventType: PluginEventType.CompositionEnd,
                    rawEvent: event.rawEvent,
                    eventDataCache: event.eventDataCache,
                };
            case 'contentChanged':
                return {
                    eventType: PluginEventType.ContentChanged,
                    source: event.source,
                    data: event.changeData.additionalData,
                    additionalData: {
                        formatApiName: event.changeData.formatApiName,
                        getAnnounceData: this.translateGetAnnounceData(
                            event.changeData.getAnnounceData
                        ),
                        getEntityState: event.changeData.getEntityState,
                    },
                    eventDataCache: event.eventDataCache,
                };
            case 'contextMenu':
                return {
                    eventType: PluginEventType.ContextMenu,
                    items: event.items,
                    rawEvent: event.rawEvent,
                    eventDataCache: event.eventDataCache,
                };
            case 'editImage':
                const originalSrc = updateImageMetadata(event.image)?.src || '';
                const image = document.createElement('img');

                image.src = event.newSrc;

                return {
                    eventType: PluginEventType.EditImage,
                    previousSrc: event.previousSrc,
                    newSrc: event.newSrc,
                    originalSrc,
                    image,
                    eventDataCache: event.eventDataCache,
                };
            case 'editorReady':
                return {
                    eventType: PluginEventType.EditorReady,
                    eventDataCache: event.eventDataCache,
                };
            case 'enteredShadowEdit':
                return {
                    eventType: PluginEventType.EnteredShadowEdit,
                    fragment: document.createDocumentFragment(),
                    selectionPath: null,
                    eventDataCache: event.eventDataCache,
                };
            case 'entityOperation':
                const { entityType, id, isReadonly } = event.entity.entityFormat;

                return entityType && id
                    ? {
                          eventType: PluginEventType.EntityOperation,
                          operation: NewToOldEntityOperationMap[event.operation],
                          entity: {
                              id,
                              type: entityType,
                              isReadonly: !!isReadonly,
                              wrapper: event.entity.wrapper,
                          },
                          rawEvent: event.rawEvent,
                          state: event.state,
                          shouldPersist: event.shouldPersist,
                          eventDataCache: event.eventDataCache,
                      }
                    : null;
            case 'extractContentWithDom':
                return {
                    eventType: PluginEventType.ExtractContentWithDom,
                    clonedRoot: event.clonedRoot,
                    eventDataCache: event.eventDataCache,
                };
            case 'input':
                return {
                    eventType: PluginEventType.Input,
                    rawEvent: event.rawEvent,
                    eventDataCache: event.eventDataCache,
                };
            case 'keyDown':
                return {
                    eventType: PluginEventType.KeyDown,
                    rawEvent: event.rawEvent,
                    handledByEditFeature: event.handledByEditFeature,
                    eventDataCache: event.eventDataCache,
                };
            case 'keyUp':
                return {
                    eventType: PluginEventType.KeyUp,
                    rawEvent: event.rawEvent,
                    eventDataCache: event.eventDataCache,
                };
            case 'leavingShadowEdit':
                return {
                    eventType: PluginEventType.LeavingShadowEdit,
                    eventDataCache: event.eventDataCache,
                };
            case 'mouseDown':
                return {
                    eventType: PluginEventType.MouseDown,
                    rawEvent: event.rawEvent,
                    eventDataCache: event.eventDataCache,
                };
            case 'mouseUp':
                return {
                    eventType: PluginEventType.MouseUp,
                    rawEvent: event.rawEvent,
                    eventDataCache: event.eventDataCache,
                };
            case 'scroll':
                return {
                    eventType: PluginEventType.Scroll,
                    rawEvent: event.rawEvent,
                    scrollContainer: event.scrollContainer,
                    eventDataCache: event.eventDataCache,
                };
            case 'selectionChanged':
                return {
                    eventType: PluginEventType.SelectionChanged,
                    selectionRangeEx: this.translateDOMSelection(event.newSelection),
                    eventDataCache: event.eventDataCache,
                };
        }
    }

    private translateFromAdapterEvent(event: AdapterPluginEvent): Partial<PluginEvent> | null {
        switch (event.eventType) {
            case PluginEventType.BeforeCutCopy:
                return {
                    eventType: 'beforeCutCopy',
                    clonedRoot: event.clonedRoot,
                    range: event.range,
                    isCut: event.isCut,
                };
            case PluginEventType.BeforeDispose:
                return {
                    eventType: 'beforeDispose',
                };
            case PluginEventType.BeforeKeyboardEditing:
                return {
                    eventType: 'beforeKeyboardEditing',
                };
            case PluginEventType.BeforePaste:
                return {
                    eventType: 'beforePaste',
                    clipboardData: event.clipboardData,
                    fragment: event.fragment,
                    htmlBefore: event.htmlBefore,
                    htmlAfter: event.htmlAfter,
                    htmlAttributes: event.htmlAttributes,
                    pasteType: OldToNewPasteTypeMap[event.pasteType],
                };
            case PluginEventType.BeforeSetContent:
                return null;

            case PluginEventType.CompositionEnd:
                return {
                    eventType: 'compositionEnd',
                };
            case PluginEventType.ContentChanged:
                return {
                    eventType: 'contentChanged',
                };
            case PluginEventType.ContextMenu:
                return {
                    eventType: 'contextMenu',
                    items: event.items,
                };
            case PluginEventType.EditImage: {
                return {
                    eventType: 'editImage',
                    newSrc: event.newSrc,
                };
            }
            case PluginEventType.EditorReady:
                return {
                    eventType: 'editorReady',
                };
            case PluginEventType.EnteredShadowEdit:
                return {
                    eventType: 'enteredShadowEdit',
                };
            case PluginEventType.EntityOperation:
                return {
                    eventType: 'entityOperation',
                    state: event.state,
                    shouldPersist: event.shouldPersist,
                };
            case PluginEventType.ExtractContentWithDom:
                return {
                    eventType: 'extractContentWithDom',
                    clonedRoot: event.clonedRoot,
                };
            case PluginEventType.Input:
                return {
                    eventType: 'input',
                };
            case PluginEventType.KeyDown:
                return {
                    eventType: 'keyDown',
                    handledByEditFeature: event.handledByEditFeature,
                };
            case PluginEventType.KeyPress:
                return null;
            case PluginEventType.KeyUp:
                return {
                    eventType: 'keyUp',
                };
            case PluginEventType.LeavingShadowEdit:
                return {
                    eventType: 'leavingShadowEdit',
                };
            case PluginEventType.MouseDown:
                return {
                    eventType: 'mouseDown',
                };
            case PluginEventType.MouseUp:
                return {
                    eventType: 'mouseUp',
                };
            case PluginEventType.PendingFormatStateChanged:
                return null;
            case PluginEventType.Scroll:
                return {
                    eventType: 'scroll',
                };
            case PluginEventType.SelectionChanged:
                return {
                    eventType: 'selectionChanged',
                };
            case PluginEventType.ZoomChanged:
                return null;

            default:
                return null;
        }
    }

    private translateGetAnnounceData(
        func?: () => AnnounceData | undefined
    ): (() => OldAnnounceData | undefined) | undefined {
        return func
            ? () => {
                  const announceData = func();
                  return announceData
                      ? {
                            defaultStrings:
                                announceData.defaultStrings === undefined
                                    ? undefined
                                    : NewToOldKnownAnnounceStringsMap[announceData.defaultStrings],
                            formatStrings: announceData.formatStrings,
                            text: announceData.text,
                        }
                      : undefined;
              }
            : undefined;
    }

    private translateDOMSelection(selection: DOMSelection): SelectionRangeEx {
        return selection.type == 'range'
            ? {
                  type: SelectionRangeTypes.Normal,
                  ranges: [selection.range],
                  areAllCollapsed: selection.range.collapsed,
              }
            : selection.type == 'image'
            ? {
                  type: SelectionRangeTypes.ImageSelection,
                  ranges: [],
                  areAllCollapsed: false,
                  image: selection.image,
              }
            : {
                  type: SelectionRangeTypes.TableSelection,
                  ranges: [],
                  areAllCollapsed: false,
                  table: selection.table,
                  coordinates: {
                      firstCell: {
                          x: selection.firstColumn,
                          y: selection.firstRow,
                      },
                      lastCell: {
                          x: selection.lastColumn,
                          y: selection.lastRow,
                      },
                  },
              };
    }
}

// Map new PasteType to old PasteType
// TODO: We can remove this once we have standalone editor
const NewToOldPasteTypeMap: Record<PasteType, OldPasteType> = {
    asImage: OldPasteType.AsImage,
    asPlainText: OldPasteType.AsPlainText,
    mergeFormat: OldPasteType.MergeFormat,
    normal: OldPasteType.Normal,
};

const OldToNewPasteTypeMap: Record<OldPasteType, PasteType> = {
    [OldPasteType.AsImage]: 'asImage',
    [OldPasteType.AsPlainText]: 'asPlainText',
    [OldPasteType.MergeFormat]: 'mergeFormat',
    [OldPasteType.Normal]: 'normal',
};

const NewToOldKnownAnnounceStringsMap: Record<KnownAnnounceStrings, OldKnownAnnounceStrings> = {
    announceListItemBullet: OldKnownAnnounceStrings.AnnounceListItemBullet,
    announceListItemNumbering: OldKnownAnnounceStrings.AnnounceListItemNumbering,
    announceOnFocusLastCell: OldKnownAnnounceStrings.AnnounceOnFocusLastCell,
};

const NewToOldEntityOperationMap: Record<EntityOperation, OldEntityOperation> = {
    newEntity: OldEntityOperation.NewEntity,
    overwrite: OldEntityOperation.Overwrite,
    removeFromEnd: OldEntityOperation.RemoveFromEnd,
    removeFromStart: OldEntityOperation.RemoveFromStart,
    replaceTemporaryContent: OldEntityOperation.ReplaceTemporaryContent,
    updateEntityState: OldEntityOperation.UpdateEntityState,
};
