import handleKeyDownEvent from '../../publicApi/editing/handleKeyDownEvent';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { DeleteResult } from '../../modelApi/edit/utils/DeleteSelectionStep';
import { deleteSelection } from '../../modelApi/edit/deleteSelection';
import { formatWithContentModel } from '../../publicApi/utils/formatWithContentModel';
import { getOnDeleteEntityCallback } from '../utils/handleKeyboardEventCommon';
import { getPendingFormat, setPendingFormat } from '../../modelApi/format/pendingFormat';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { normalizeContentModel } from '../../modelApi/common/normalizeContentModel';
import {
    getObjectKeys,
    isBlockElement,
    isCharacterValue,
    isModifierKey,
    Position,
} from 'roosterjs-editor-dom';
import {
    EditorPlugin,
    EntityOperationEvent,
    ExperimentalFeatures,
    IEditor,
    Keys,
    NodePosition,
    NodeType,
    PluginEvent,
    PluginEventType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

// During IME input, KeyDown event will have "Process" as key
const ProcessKey = 'Process';

/**
 * ContentModel plugins helps editor to do editing operation on top of content model.
 * This includes:
 * 1. Delete Key
 * 2. Backspace Key
 */
export default class ContentModelEditPlugin implements EditorPlugin {
    private editor: IContentModelEditor | null = null;
    private triggeredEntityEvents: EntityOperationEvent[] = [];
    private editWithContentModel = false;
    private hasDefaultFormat = false;

    /**
     * Get name of this plugin
     */
    getName() {
        return 'ContentModelEdit';
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
        this.editWithContentModel = this.editor.isFeatureEnabled(
            ExperimentalFeatures.EditWithContentModel
        );

        const defaultFormat = this.editor.getContentModelDefaultFormat();
        this.hasDefaultFormat =
            getObjectKeys(defaultFormat).filter(x => typeof defaultFormat[x] !== 'undefined')
                .length > 0;
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.editor = null;
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        if (this.editor) {
            switch (event.eventType) {
                case PluginEventType.EntityOperation:
                    this.handleEntityOperationEvent(this.editor, event);
                    break;

                case PluginEventType.KeyDown:
                    this.handleKeyDownEvent(this.editor, event.rawEvent);
                    break;

                case PluginEventType.ContentChanged:
                case PluginEventType.MouseUp:
                    this.editor.cacheContentModel(null);
                    break;
            }
        }
    }

    private handleEntityOperationEvent(editor: IContentModelEditor, event: EntityOperationEvent) {
        if (event.rawEvent?.type == 'keydown') {
            // If we see an entity operation event triggered from keydown event, it means the event can be triggered from original
            // EntityFeatures or EntityPlugin, so we don't need to trigger the same event again from ContentModel.
            // TODO: This is a temporary solution. Once Content Model can fully replace Entity Features, we can remove this.
            this.triggeredEntityEvents.push(event);
        }
    }

    private handleKeyDownEvent(editor: IContentModelEditor, rawEvent: KeyboardEvent) {
        const which = rawEvent.which;

        if (!this.editWithContentModel || rawEvent.defaultPrevented) {
            // Other plugins already handled this event, so it is most likely content is already changed, we need to clear cached content model
            editor.cacheContentModel(null /*model*/);
        } else if (!rawEvent.defaultPrevented) {
            // TODO: Consider use ContentEditFeature and need to hide other conflict features that are not based on Content Model
            switch (which) {
                case Keys.BACKSPACE:
                case Keys.DELETE:
                    const rangeEx = editor.getSelectionRangeEx();
                    const range =
                        rangeEx.type == SelectionRangeTypes.Normal ? rangeEx.ranges[0] : null;

                    if (this.shouldDeleteWithContentModel(range, rawEvent)) {
                        handleKeyDownEvent(editor, rawEvent, this.triggeredEntityEvents);
                    } else {
                        editor.cacheContentModel(null);
                    }

                    break;

                default:
                    if (
                        (isCharacterValue(rawEvent) || rawEvent.key == ProcessKey) &&
                        this.hasDefaultFormat
                    ) {
                        this.tryApplyDefaultFormat(editor);
                    }

                    editor.cacheContentModel(null);
                    break;
            }
        }

        if (this.triggeredEntityEvents.length > 0) {
            this.triggeredEntityEvents = [];
        }
    }

    private tryApplyDefaultFormat(editor: IContentModelEditor) {
        const rangeEx = editor.getSelectionRangeEx();
        const range = rangeEx?.type == SelectionRangeTypes.Normal ? rangeEx.ranges[0] : null;
        const startPos = range ? Position.getStart(range) : null;
        let node: Node | null = startPos?.node ?? null;

        while (node && editor.contains(node)) {
            if (isNodeOfType(node, NodeType.Element) && node.getAttribute?.('style')) {
                return;
            } else if (isBlockElement(node)) {
                break;
            } else {
                node = node.parentNode;
            }
        }

        formatWithContentModel(editor, 'input', model => {
            const result = deleteSelection(
                model,
                getOnDeleteEntityCallback(
                    editor,
                    undefined /*rawEvent*/,
                    this.triggeredEntityEvents
                )
            );

            if (result.deleteResult == DeleteResult.Range) {
                normalizeContentModel(model);
                editor.addUndoSnapshot();

                return true;
            } else if (
                result.deleteResult == DeleteResult.NotDeleted &&
                result.insertPoint &&
                startPos
            ) {
                const { paragraph, path, marker } = result.insertPoint;
                const blocks = path[0].blocks;
                const blockCount = blocks.length;
                const blockIndex = blocks.indexOf(paragraph);

                if (
                    paragraph.isImplicit &&
                    paragraph.segments.length == 1 &&
                    paragraph.segments[0] == marker &&
                    blockCount > 0 &&
                    blockIndex == blockCount - 1
                ) {
                    // Focus is in the last paragraph which is implicit and there is not other segments.
                    // This can happen when focus is moved after all other content under current block group.
                    // We need to check if browser will merge focus into previous paragraph by checking if
                    // previous block is block. If previous block is paragraph, browser will most likely merge
                    // the input into previous paragraph, then nothing need to do here. Otherwise we need to
                    // apply pending format since this input event will start a new real paragraph.
                    const previousBlock = blocks[blockIndex - 1];

                    if (previousBlock?.blockType != 'Paragraph') {
                        this.applyDefaultFormat(editor, marker.format, startPos);
                    }
                } else if (paragraph.segments.every(x => x.segmentType != 'Text')) {
                    this.applyDefaultFormat(editor, marker.format, startPos);
                }

                // We didn't do any change but just apply default format to pending format, so no need to write back
                return false;
            } else {
                return false;
            }
        });
    }

    private applyDefaultFormat(
        editor: IContentModelEditor,
        currentFormat: ContentModelSegmentFormat,
        startPos: NodePosition
    ) {
        const pendingFormat = getPendingFormat(editor) || {};
        const defaultFormat = editor.getContentModelDefaultFormat();
        const newFormat: ContentModelSegmentFormat = {
            ...defaultFormat,
            ...pendingFormat,
            ...currentFormat,
        };

        setPendingFormat(editor, newFormat, startPos);
    }

    private shouldDeleteWithContentModel(range: Range | null, rawEvent: KeyboardEvent) {
        return !(
            range?.collapsed &&
            range.startContainer.nodeType == NodeType.Text &&
            !isModifierKey(rawEvent) &&
            (this.canDeleteBefore(rawEvent, range) || this.canDeleteAfter(rawEvent, range))
        );
    }

    private canDeleteBefore(rawEvent: KeyboardEvent, range: Range) {
        return (
            rawEvent.which == Keys.BACKSPACE &&
            (range.startOffset > 1 || range.startContainer.previousSibling)
        );
    }

    private canDeleteAfter(rawEvent: KeyboardEvent, range: Range) {
        return (
            rawEvent.which == Keys.DELETE &&
            (range.startOffset < (range.startContainer.nodeValue?.length ?? 0) - 1 ||
                range.startContainer.nextSibling)
        );
    }
}
