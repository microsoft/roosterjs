import { ContentPosition, IEditor } from 'roosterjs-editor-types';

const MESSAGE_CONTAINER_ID = 'roosterjs_NarratorMessage';
let MESSAGE_JOB: number;
/**
 * Makes the narrator announce a message
 * @param file The file to read
 * @param message Message to announce
 * @param priority priority (non mandatory): "polite" (by default) or "assertive"
 */
export default function narratorMessage(
    editor: IEditor,
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
) {
    const editorDocument = editor.getDocument() || document;
    const currentWindow = editorDocument.defaultView || window;

    currentWindow.clearTimeout(MESSAGE_JOB);

    const el = document.createElement('div');
    const id = 'roosterjs-make-a-screen-reader-talk-' + Date.now();
    const containerId = MESSAGE_CONTAINER_ID + Date.now();
    el.setAttribute('id', id);
    el.setAttribute('aria-live', priority);
    el.classList.add('sr-only');
    el.style.position = '';

    let container = editorDocument.getElementById(containerId);

    if (!container) {
        container = editorDocument.createElement('DIV');
        container.id = containerId;
        container.style.zIndex = '-1';
        editor.insertNode(container, {
            updateCursor: false,
            insertOnNewLine: false,
            replaceSelection: false,
            position: ContentPosition.Outside,
        });
    }

    container.appendChild(el);

    MESSAGE_JOB = currentWindow.setTimeout(function () {
        editorDocument.getElementById(id).textContent = message;
    }, 200);

    currentWindow.setTimeout(function () {
        const element = editorDocument.getElementById(id);
        element?.parentNode.removeChild(element);
        container?.parentNode?.removeChild(container);
    }, 1000);
}
