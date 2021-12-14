import { findClosestElementAncestor, Position } from 'roosterjs-editor-dom';
import {
    EditorPlugin,
    ExperimentalFeatures,
    IEditor,
    PendableFormatState,
    PluginEvent,
    PluginEventType,
    PositionType,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Typing Component helps to ensure typing is always happening under a DOM container
 */
export default class TypeInContainerPlugin implements EditorPlugin {
    private editor: IEditor;
    private pendableFormat: PendableFormatState;

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'TypeInContainer';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.KeyPress) {
            // If normalization was not possible before the keypress,
            // check again after the keyboard event has been processed by browser native behavior.
            //
            // This handles the case where the keyboard event that first inserts content happens when
            // there is already content under the selection (e.g. Ctrl+a -> type new content).
            //
            // Only schedule when the range is not collapsed to catch this edge case.
            let range = this.editor.getSelectionRange();
            let shouldAlwaysApplyDefaultFormat = this.editor.isFeatureEnabled(
                ExperimentalFeatures.AlwaysApplyDefaultFormat
            );
            if (event.rawEvent.key === 'Enter') {
                this.pendableFormat = this.editor.getPendableFormatState();
            }

            if (
                !range ||
                this.editor.contains(
                    findClosestElementAncestor(
                        range.startContainer,
                        null /* root */,
                        shouldAlwaysApplyDefaultFormat ? '[style]' : null /*selector*/
                    )
                )
            ) {
                return;
            }

            fixPendableFormatState(this.editor, this.pendableFormat);

            if (range.collapsed) {
                this.editor.ensureTypeInContainer(Position.getEnd(range), event.rawEvent);
            } else {
                this.editor.runAsync(editor => {
                    editor.ensureTypeInContainer(editor.getFocusedPosition(), event.rawEvent);
                });
            }
        }
    }
}

function fixPendableFormatState(editor: IEditor, pendableFormat: PendableFormatState) {
    const position = editor.getFocusedPosition();
    if (position.offset === PositionType.Begin && pendableFormat) {
        checkPendableFormat(editor, pendableFormat);
    }
}

function checkPendableFormat(editor: IEditor, pendableFormat: PendableFormatState) {
    const b = editor.getElementAtCursor('B');
    const i = editor.getElementAtCursor('I');
    const u = editor.getElementAtCursor('U');
    const strike = editor.getElementAtCursor('STRIKE');
    const sup = editor.getElementAtCursor('SUP');
    const sub = editor.getElementAtCursor('SUB');
    if (!pendableFormat.isBold) {
        removeNode(b);
    }
    if (!pendableFormat.isItalic) {
        removeNode(i);
    }
    if (!pendableFormat.isUnderline) {
        removeNode(u);
    }
    if (!pendableFormat.isStrikeThrough) {
        removeNode(strike);
    }
    if (!pendableFormat.isSuperscript) {
        removeNode(sup);
    }
    if (!pendableFormat.isSubscript) {
        removeNode(sub);
    }
}

function removeNode(element: HTMLElement) {
    if (element) {
        element.parentNode.replaceChild(element.firstElementChild, element);
    }
}
