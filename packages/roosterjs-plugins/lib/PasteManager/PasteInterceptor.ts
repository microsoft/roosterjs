import ClipboardData from './ClipboardData';
import { Editor } from 'roosterjs-core';
import { ContentPosition, InsertOption } from 'roosterjs-types';
import { processImages } from './PasteUtility';

const PASTE_NODE_INSERT_OPTION: InsertOption = {
    position: ContentPosition.SelectionStart,
    updateCursor: true,
    replaceSelection: true,
    insertOnNewLine: false,
};
const InlinePositionStyle = /(<\w+[^>]*style=['"][^>]*)position:[^>;'"]*/gi;

let pasteInterceptor = function preparePasteAndPickupPostPaste(
    editor: Editor,
    clipboardData: ClipboardData,
    completeCallback: (clipboardData: ClipboardData) => void
) {
    let [originalSelectionRange, pasteContainer] = preparePasteEnvironment(editor);
    setTimeout(function() {
        onPostPaste(
            editor,
            originalSelectionRange,
            pasteContainer,
            clipboardData,
            completeCallback
        );
    }, 0);
};

function preparePasteEnvironment(editor: Editor): [Range, HTMLElement] {
    // cache original selection range in editor
    let originalSelectionRange = editor.getSelectionRange();

    // create paste container, append to body, and set selection to it, so paste content goes inside
    let pasteContainer = editor.getDocument().createElement('div');
    pasteContainer.setAttribute('contenteditable', 'true');
    pasteContainer.style.width = '1px';
    pasteContainer.style.height = '1px';
    pasteContainer.style.overflow = 'hidden';
    pasteContainer.style.position = 'absolute';
    pasteContainer.style.top = '100px'; // just pick 100px to have pasteContainer in viewport
    pasteContainer.style.left = '0px';
    pasteContainer.style.webkitUserSelect = 'text';
    editor.getDocument().body.appendChild(pasteContainer);
    let pasteContainerRange = editor.getDocument().createRange();
    pasteContainerRange.selectNodeContents(pasteContainer);
    let selection = editor.getSelection();
    selection.removeAllRanges();
    selection.addRange(pasteContainerRange);
    pasteContainer.focus();
    return [originalSelectionRange, pasteContainer];
}

function onPostPaste(
    editor: Editor,
    originalSelectionRange: Range,
    pasteContainer: HTMLElement,
    clipboardData: ClipboardData,
    completeCallback: (clipboardData: ClipboardData) => void
) {
    let innerText = pasteContainer.innerText;

    // There is visible text copied or there is no image, then we should use the text
    // Add this check because we don't want to run into this code if the copied content has image and no visible text
    // This can happen when copy image from oneNote. Then copied HTML is something like <div><img ...></div>.
    // In that case we paste the image only instead of the HTML.
    if ((innerText && innerText.trim() != '') || !clipboardData.imageData.file) {
        // There is text to paste, so clear any image data if any.
        // Otherwise both text and image will be pasted, this will cause duplicated paste
        clipboardData.imageData = {};
        clipboardData.htmlData = pasteContainer.innerHTML;
        processImages(pasteContainer, clipboardData);
    }

    // restore original selection range in editor
    editor.updateSelection(originalSelectionRange);

    // If the clipboard data contains an image file don't restore the paste container.
    // The image file will be added as an attachment, so if we restore the paste environment and it also
    // contains the image we will get the image twice
    if (!clipboardData.imageData.file) {
        restorePasteEnvironment(editor, originalSelectionRange, pasteContainer);
    }

    completeCallback(clipboardData);
}

function restorePasteEnvironment(
    editor: Editor,
    originalSelectionRange: Range,
    pasteContainer: HTMLElement
) {
    // move all children out of pasteContainer and insert them to selection start
    normalizeContent(pasteContainer);
    while (pasteContainer.firstChild) {
        editor.insertNode(pasteContainer.firstChild, PASTE_NODE_INSERT_OPTION);
    }

    // remove pasteContainer
    pasteContainer.parentNode.removeChild(pasteContainer);
}

function normalizeContent(container: HTMLElement) {
    let content = container.innerHTML;

    // Remove 'position' style from source HTML
    content = content.replace(InlinePositionStyle, '$1');
    container.innerHTML = content;
}

export default pasteInterceptor;
