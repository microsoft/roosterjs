import execCommand from '../utils/execCommand';
import {
    Alignment,
    ChangeSource,
    DocumentCommand,
    IEditor,
    QueryScope,
} from 'roosterjs-editor-types';

const TABLE = 'TABLE';
const LIST = 'LIST';
const TEXT = 'TEXT';

/**
 * Set content alignment
 * @param editor The editor instance
 * @param alignment The alignment option:
 * Alignment.Center, Alignment.Left, Alignment.Right
 */
export default function setAlignment(editor: IEditor, alignment: Alignment) {
    let command = DocumentCommand.JustifyLeft;
    let align = 'left';
    const element = editor.getElementAtCursor();
    const elementType = isListOrATableOrText(element);
    console.log(elementType);

    if (alignment == Alignment.Center) {
        command = DocumentCommand.JustifyCenter;
        align = 'center';
    } else if (alignment == Alignment.Right) {
        command = DocumentCommand.JustifyRight;
        align = 'right';
    }
    editor.addUndoSnapshot(() => {
        alignElement(editor, element, elementType, alignment, command);
        editor.queryElements(
            '[align]',
            QueryScope.OnSelection,
            node => (node.style.textAlign = align)
        );
    }, ChangeSource.Format);
}

function isListOrATableOrText(element: HTMLElement) {
    const tag = element.tagName;
    if (tag === 'LI' || tag === 'UL' || tag === 'OL') {
        return LIST;
    } else if (tag === 'TABLE') {
        return TABLE;
    } else {
        return TEXT;
    }
}

function alignElement(
    editor: IEditor,
    element: HTMLElement,
    elementType: string,
    alignment: Alignment,
    command: DocumentCommand
) {
    if (elementType === LIST) {
        alignList(element, alignment);
    } else if (elementType === TABLE) {
        alignTable(element, alignment);
    } else {
        alignText(editor, alignment);
    }
}

function alignList(element: HTMLElement, alignment: Alignment) {
    if (alignment == Alignment.Center) {
        if (element.tagName === 'LI') {
            element.parentElement.parentElement.style.display = 'table';
            element.parentElement.parentElement.style.margin = '0 auto';
            element.parentElement.parentElement.style.float = '';
            return;
        }
        element.parentElement.style.display = 'table';
        element.parentElement.style.margin = '0 auto';
        element.parentElement.style.float = '';
    } else if (alignment == Alignment.Right) {
        if (element.tagName === 'LI') {
            element.parentElement.parentElement.style.display = '';
            element.parentElement.parentElement.style.margin = '';
            element.parentElement.parentElement.style.float = 'right';
            return;
        }
        element.parentElement.style.display = '';
        element.parentElement.style.margin = '';
        element.parentElement.style.float = 'right';
    } else {
        if (element.tagName === 'LI') {
            element.parentElement.parentElement.style.display = '';
            element.parentElement.parentElement.style.margin = '';
            element.parentElement.parentElement.style.float = 'left';
            return;
        }
        element.parentElement.style.display = '';
        element.parentElement.style.margin = '';
        element.parentElement.style.float = 'left';
    }
}

function alignTable(element: HTMLElement, alignment: Alignment) {
    if (alignment == Alignment.Center) {
        element.style.marginLeft = 'auto';
        element.style.marginRight = 'auto';
    } else if (alignment == Alignment.Right) {
        element.style.marginLeft = 'auto';
        element.style.marginRight = '';
    } else {
        element.style.marginLeft = '';
        element.style.marginRight = 'auto';
    }
}

function alignText(editor: IEditor, alignment: Alignment) {
    if (alignment == Alignment.Center) {
        execCommand(editor, DocumentCommand.JustifyCenter);
    } else if (alignment == Alignment.Right) {
        execCommand(editor, DocumentCommand.JustifyRight);
    } else {
        execCommand(editor, DocumentCommand.JustifyLeft);
    }
}
