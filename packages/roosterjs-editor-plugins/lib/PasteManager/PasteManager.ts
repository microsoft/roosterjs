import ClipboardData from './ClipboardData';
import onPaste from './PasteHandler';
import onPasteIE from './PasteHandlerIE';
import onPasteSafari from './PasteHandlerSafari';
import {
    ContentPosition,
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import { Editor, EditorPlugin, browserData } from 'roosterjs-editor-core';

export type OnPasteHandler = (
    editor: Editor,
    PasteEvent: ClipboardEvent,
    completeCallback: (clipboardData: ClipboardData) => void,
    dataTransfer: DataTransfer,
    clipboardData: ClipboardData
) => void;

// An editor plugin that manages different types of paste.
export default class PasteManager implements EditorPlugin {
    private editor: Editor;

    constructor(private readonly pasteHandler?: (clipboardData: ClipboardData) => void) {}

    public initialize(editor: Editor) {
        this.editor = editor;
    }

    public dispose() {
        this.editor = null;
    }

    public willHandleEventExclusively(event: PluginEvent): boolean {
        return event.eventType == PluginEventType.Paste;
    }

    public onPluginEvent(event: PluginEvent) {
        if (event.eventType != PluginEventType.Paste) {
            return;
        }

        // add undo snapshot before paste
        this.editor.addUndoSnapshot();
        let pasteEvent = (event as PluginDomEvent).rawEvent as ClipboardEvent;
        let dataTransfer = pasteEvent.clipboardData;
        let onPasteHandler = getOnPasteHandler();
        if (onPasteHandler) {
            let clipboardData = createEmptyClipboardData();
            onPasteHandler(
                this.editor,
                pasteEvent,
                this.onPasteComplete,
                dataTransfer,
                clipboardData
            );
        }
    }

    private onPasteComplete = (clipboardData: ClipboardData) => {
        let pasteHandler = this.pasteHandler || this.defaultPasteHandler;
        if (clipboardData) {
            // if any clipboard data exists, call into pasteHandler
            pasteHandler(clipboardData);
        }

        // add undo snapshot after paste
        // broadcast contentChangedEvent to ensure the snapshot actually gets added
        let contentChangedEvent: PluginEvent = { eventType: PluginEventType.ContentChanged };
        this.editor.triggerEvent(contentChangedEvent, true /* broadcast */);
        this.editor.addUndoSnapshot();
    };

    private defaultPasteHandler = (clipboardData: ClipboardData) => {
        let file = clipboardData.imageData ? clipboardData.imageData.file : null;
        if (file) {
            let reader = new FileReader();
            reader.onload = (event: ProgressEvent) => {
                if (this.editor) {
                    let image = this.editor.getDocument().createElement('img');
                    image.src = (event.target as FileReader).result;
                    this.editor.insertNode(image, {
                        position: ContentPosition.SelectionStart,
                        updateCursor: true,
                        replaceSelection: true,
                        insertOnNewLine: false,
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };
}

function getOnPasteHandler(): OnPasteHandler {
    if (browserData.isChrome || browserData.isFirefox || browserData.isEdge) {
        return onPaste;
    } else if (browserData.isIE) {
        return onPasteIE;
    } else if (browserData.isSafari) {
        return onPasteSafari;
    } else {
        // let browser handle paste itself if it's not a known browser
        return null;
    }
}

/**
 * @returns empty clipboard data
 */
function createEmptyClipboardData(): ClipboardData {
    return {
        imageData: {},
        htmlData: null,
    };
}
