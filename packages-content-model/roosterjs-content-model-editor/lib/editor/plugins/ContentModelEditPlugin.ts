import handleKeyDownEvent from '../../publicApi/editing/handleKeyDownEvent';
import { ContentModelSegmentFormat } from 'roosterjs-content-model-types';
import { DeleteResult } from '../../modelApi/edit/utils/DeleteSelectionStep';
import { deleteSelection } from '../../modelApi/edit/deleteSelection';
import { formatWithContentModel } from '../../publicApi/utils/formatWithContentModel';
import { getPendingFormat, setPendingFormat } from '../../modelApi/format/pendingFormat';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { isBlockElement, isCharacterValue, isModifierKey, Position } from 'roosterjs-editor-dom';
import { isNodeOfType, normalizeContentModel } from 'roosterjs-content-model-dom';
import {
    EditorPlugin,
    IEditor,
    Keys,
    NodePosition,
    NodeType,
    PluginEvent,
    PluginEventType,
    PluginKeyDownEvent,
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
                case PluginEventType.KeyDown:
                    this.handleKeyDownEvent(this.editor, event);
                    break;

                case PluginEventType.ContentChanged:
                    this.editor.clearCachedModel();
                    break;
            }
        }
    }

    private handleKeyDownEvent(editor: IContentModelEditor, event: PluginKeyDownEvent) {
        const rawEvent = event.rawEvent;
        const which = rawEvent.which;

        if (rawEvent.defaultPrevented || event.handledByEditFeature) {
            // Other plugins already handled this event, so it is most likely content is already changed, we need to clear cached content model
            editor.clearCachedModel();
        } else {
            // TODO: Consider use ContentEditFeature and need to hide other conflict features that are not based on Content Model
            switch (which) {
                case Keys.BACKSPACE:
                case Keys.DELETE:
                    const rangeEx = editor.getSelectionRangeEx();
                    const range =
                        rangeEx.type == SelectionRangeTypes.Normal ? rangeEx.ranges[0] : null;

                    if (this.shouldDeleteWithContentModel(range, rawEvent)) {
                        handleKeyDownEvent(editor, rawEvent);
                    } else {
                        editor.clearCachedModel();
                    }

                    break;

                default:
                    if (which == Keys.ENTER) {
                        // Enter key will start a new paragraph which the cache reconcile code cannot handle now, so clear cache
                        editor.clearCachedModel();
                    }

                    if (isCharacterValue(rawEvent) || rawEvent.key == ProcessKey) {
                        this.tryApplyDefaultFormat(editor);
                    }

                    break;
            }
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

        formatWithContentModel(editor, 'input', (model, context) => {
            const result = deleteSelection(model, [], context);

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
