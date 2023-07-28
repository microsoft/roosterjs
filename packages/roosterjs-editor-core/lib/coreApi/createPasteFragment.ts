import {
    createDefaultHtmlSanitizerOptions,
    createFragmentFromClipboardData,
    getPasteType,
} from 'roosterjs-editor-dom';
import {
    BeforePasteEvent,
    ClipboardData,
    CreatePasteFragment,
    EditorCore,
    PluginEventType,
    NodePosition,
    PasteType,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Create a DocumentFragment for paste from a ClipboardData
 * @param core The EditorCore object.
 * @param clipboardData Clipboard data retrieved from clipboard
 * @param position The position to paste to
 * @param pasteAsText True to force use plain text as the content to paste, false to choose HTML or Image if any
 * @param applyCurrentStyle True if apply format of current selection to the pasted content,
 * false to keep original format
 * @param pasteAsImage True if the image should be pasted as image
 */
export const createPasteFragment: CreatePasteFragment = (
    core: EditorCore,
    clipboardData: ClipboardData,
    position: NodePosition | null,
    pasteAsText: boolean,
    applyCurrentStyle: boolean,
    pasteAsImage: boolean = false
) => {
    if (!clipboardData) {
        return null;
    }

    const pasteType = getPasteType(pasteAsText, applyCurrentStyle, pasteAsImage);

    // Step 1: Prepare BeforePasteEvent object
    const event = createBeforePasteEvent(core, clipboardData, pasteType);
    return createFragmentFromClipboardData(
        core,
        clipboardData,
        position,
        pasteAsText,
        applyCurrentStyle,
        pasteAsImage,
        event
    );
};

function createBeforePasteEvent(
    core: EditorCore,
    clipboardData: ClipboardData,
    pasteType: PasteType
): BeforePasteEvent {
    const options = createDefaultHtmlSanitizerOptions();

    // Remove "caret-color" style generated by Safari to make sure caret shows in right color after paste
    options.cssStyleCallbacks['caret-color'] = () => false;

    return {
        eventType: PluginEventType.BeforePaste,
        clipboardData,
        fragment: core.contentDiv.ownerDocument.createDocumentFragment(),
        sanitizingOption: options,
        htmlBefore: '',
        htmlAfter: '',
        htmlAttributes: {},
        pasteType: pasteType,
    };
}
