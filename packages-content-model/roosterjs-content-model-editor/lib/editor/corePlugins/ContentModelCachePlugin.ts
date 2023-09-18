import { ContentModelCachePluginState } from '../../publicTypes/pluginState/ContentModelCachePluginState';
import { ContentModelContentChangedEvent } from 'roosterjs-content-model/lib';
import { ContentModelDocument } from 'roosterjs-content-model-types/lib';
import { ContentModelSegment, ContentModelText, Selectable } from 'roosterjs-content-model-types';
import { createSelectionMarker, createText } from 'roosterjs-content-model-dom';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { isNodeOfType } from 'roosterjs-content-model-dom/lib';
import { setSelection } from 'roosterjs-content-model-editor/lib/modelApi/selection/setSelection';
import { updateTextSegments } from '../../editor/utils/contentModelDomIndexer';
import {
    Coordinates,
    IEditor,
    Keys,
    NodeType,
    PluginEvent,
    PluginEventType,
    PluginWithState,
    SelectionRangeEx,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

/**
 * ContentModel cache plugin manages cached Content Model, and refresh the cache when necessary
 */
export default class ContentModelCachePlugin
    implements PluginWithState<ContentModelCachePluginState> {
    private editor: IContentModelEditor | null = null;

    /**
     * Construct a new instance of ContentModelEditPlugin class
     * @param state State of this plugin
     */
    constructor(private state: ContentModelCachePluginState) {
        // TODO: Remove tempState parameter once we have standalone Content Model editor
    }

    /**
     * Get name of this plugin
     */
    getName() {
        return 'ContentModelCache';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
        // TODO: Later we may need a different interface for Content Model editor plugin
        this.editor = editor as IContentModelEditor;
        this.editor.getDocument().addEventListener('selectionchange', this.onNativeSelectionChange);
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        if (this.editor) {
            this.editor
                .getDocument()
                .removeEventListener('selectionchange', this.onNativeSelectionChange);
            this.editor = null;
        }
    }

    /**
     * Get plugin state object
     */
    getState(): ContentModelCachePluginState {
        return this.state;
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        if (!this.editor) {
            return;
        }

        switch (event.eventType) {
            case PluginEventType.KeyDown:
                switch (event.rawEvent.which) {
                    case Keys.ENTER:
                        // ENTER key will create new paragraph, so need to update cache to reflect this change
                        // TODO: Handle ENTER key to better reuse content model
                        this.editor.invalidateCache();

                        break;
                }
                break;

            case PluginEventType.Input:
                {
                    const rangeEx = this.forceGetSelectionRangeEx(this.editor);
                    this.reconcileSelection(this.editor, rangeEx);
                }
                break;

            case PluginEventType.SelectionChanged:
                this.reconcileSelection(
                    this.editor,
                    event.selectionRangeEx ?? this.forceGetSelectionRangeEx(this.editor)
                );
                break;

            case PluginEventType.ContentChanged:
                {
                    const { contentModel, rangeEx } = event as ContentModelContentChangedEvent;

                    if (contentModel) {
                        this.state.cachedModel = contentModel;
                        this.state.cachedRangeEx = rangeEx;
                        console.log('Content changed, reuse cache');
                    } else {
                        this.editor.invalidateCache();
                        this.editor.createContentModel();
                    }
                }

                break;
        }
    }

    private onNativeSelectionChange = () => {
        if (this.editor?.hasFocus()) {
            this.reconcileSelection(this.editor, this.forceGetSelectionRangeEx(this.editor));
        }
    };

    private reconcileSelection(editor: IContentModelEditor, newRangeEx: SelectionRangeEx) {
        const cachedRangeEx = this.state.cachedRangeEx;
        const model = this.state.cachedModel ?? editor.createContentModel();

        if (!cachedRangeEx || !areSameRangeEx(newRangeEx, cachedRangeEx)) {
            if (!this.internalReconcileSelection(model, cachedRangeEx, newRangeEx)) {
                editor.invalidateCache();
                editor.createContentModel();
            }
        }

        this.state.cachedRangeEx = newRangeEx;
    }

    private internalReconcileSelection(
        cachedModel: ContentModelDocument,
        cachedRangeEx: SelectionRangeEx | undefined,
        newRangeEx: SelectionRangeEx
    ) {
        if (cachedRangeEx) {
            this.unSelect(cachedModel, cachedRangeEx);
        }

        switch (newRangeEx.type) {
            case SelectionRangeTypes.ImageSelection:
                console.log('Reconcile -- Image selection');
                break;

            case SelectionRangeTypes.TableSelection:
                console.log('Reconcile -- Table selection');
                break;

            case SelectionRangeTypes.Normal:
                const newRange = newRangeEx.ranges[0];
                if (newRange) {
                    const {
                        startContainer,
                        startOffset,
                        endContainer,
                        endOffset,
                        collapsed,
                    } = newRange;

                    if (collapsed) {
                        const marker = !!reconcileSelection(startContainer, startOffset);
                        if (marker) {
                            console.log('Reconcile succeeded - Collapsed');
                        } else {
                            console.log('Reconcile failed - Collapsed');
                        }

                        return !!marker;
                    } else if (startContainer == endContainer) {
                        const marker = !!reconcileSelection(startContainer, startOffset, endOffset);
                        if (marker) {
                            console.log('Reconcile succeeded - Expand on same node');
                        } else {
                            console.log('Reconcile failed - Expand on same node');
                        }

                        return !!marker;
                    } else {
                        const marker1 = reconcileSelection(startContainer, startOffset);
                        const marker2 = reconcileSelection(endContainer, endOffset);

                        if (marker1 && marker2) {
                            console.log('Reconcile succeeded - Multiple nodes');
                            setSelection(cachedModel, marker1, marker2);
                            return true;
                        } else {
                            console.log('Reconcile failed - Multiple nodes');
                        }
                    }
                }

                break;
        }

        return false;
    }

    private unSelect(model: ContentModelDocument, rangeEx: SelectionRangeEx) {
        const range: Range | undefined = rangeEx.ranges[0];

        if (
            rangeEx?.type == SelectionRangeTypes.Normal &&
            range?.collapsed &&
            isNodeOfType(range.startContainer, NodeType.Text)
        ) {
            reconcileSelection(range.startContainer);
        } else {
            setSelection(model);
        }
    }

    private forceGetSelectionRangeEx(editor: IContentModelEditor) {
        const cachedRangeEx = this.state.cachedRangeEx;
        this.state.cachedRangeEx = undefined; // Clear it to force getSelectionRangeEx() retrieve the latest selection range

        const currentRangeEx = editor.getSelectionRangeEx();
        this.state.cachedRangeEx = cachedRangeEx;

        return currentRangeEx;
    }
}

function reconcileSelection(
    node: Node,
    startOffset?: number,
    endOffset?: number
): Selectable | undefined {
    let selectable: Selectable | undefined;

    updateTextSegments(node, (paragraph, first, last) => {
        const newSegments: ContentModelSegment[] = [];
        const txt = node.nodeValue || '';
        const textSegments: ContentModelText[] = [];

        if (startOffset === undefined) {
            first.text = txt;
            newSegments.push(first);
            textSegments.push(first);
        } else {
            if (startOffset > 0) {
                first.text = txt.substring(0, startOffset);
                newSegments.push(first);
                textSegments.push(first);
            }

            if (endOffset === undefined) {
                const marker = createSelectionMarker(first.format);
                newSegments.push(marker);

                selectable = marker;
                endOffset = startOffset;
            } else if (endOffset > startOffset) {
                const middle = createText(
                    txt.substring(startOffset, endOffset),
                    first.format,
                    first.link,
                    first.code
                );

                middle.isSelected = true;
                newSegments.push(middle);
                textSegments.push(middle);
                selectable = middle;
            }

            if (endOffset < txt.length) {
                const newLast = createText(
                    txt.substring(endOffset),
                    first.format,
                    first.link,
                    first.code
                );
                newSegments.push(newLast);
                textSegments.push(newLast);
            }
        }

        let firstIndex = paragraph.segments.indexOf(first);
        let lastIndex = paragraph.segments.indexOf(last);

        if (firstIndex >= 0 && lastIndex >= 0) {
            while (
                firstIndex > 0 &&
                paragraph.segments[firstIndex - 1].segmentType == 'SelectionMarker'
            ) {
                firstIndex--;
            }

            while (
                lastIndex < paragraph.segments.length - 1 &&
                paragraph.segments[lastIndex + 1].segmentType == 'SelectionMarker'
            ) {
                lastIndex++;
            }

            paragraph.segments.splice(firstIndex, lastIndex - firstIndex + 1, ...newSegments);
            return textSegments;
        } else {
            return [];
        }
    });

    return selectable;
}

function areSameRangeEx(range1: SelectionRangeEx, range2: SelectionRangeEx): boolean {
    switch (range1.type) {
        case SelectionRangeTypes.ImageSelection:
            return (
                range2.type == SelectionRangeTypes.ImageSelection && range2.image == range1.image
            );

        case SelectionRangeTypes.TableSelection:
            return (
                range2.type == SelectionRangeTypes.TableSelection &&
                range2.table == range1.table &&
                areSameCoordinates(range2.coordinates?.firstCell, range1.coordinates?.firstCell) &&
                areSameCoordinates(range2.coordinates?.lastCell, range1.coordinates?.lastCell)
            );

        case SelectionRangeTypes.Normal:
        default:
            return (
                range2.type == SelectionRangeTypes.Normal &&
                areSameRanges(range2.ranges[0], range1.ranges[0])
            );
    }
}

function areSameRanges(r1?: Range, r2?: Range): boolean {
    return !!(
        r1 &&
        r2 &&
        r1.startContainer == r2.startContainer &&
        r1.startOffset == r2.startOffset &&
        r1.endContainer == r2.endContainer &&
        r1.endOffset == r2.endOffset
    );
}

function areSameCoordinates(c1?: Coordinates, c2?: Coordinates): boolean {
    return !!(c1 && c2 && c1.x == c2.x && c1.y == c2.y);
}

/**
 * @internal
 * Create a new instance of ContentModelCachePlugin class.
 * This is mostly for unit test
 * @param state State of this plugin
 */
export function createContentModelCachePlugin(state: ContentModelCachePluginState) {
    return new ContentModelCachePlugin(state);
}
