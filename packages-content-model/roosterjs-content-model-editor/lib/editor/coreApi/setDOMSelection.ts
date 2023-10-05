import type {
    ContentModelEditorCore,
    SetDOMSelection,
} from '../../publicTypes/ContentModelEditorCore';

const IMAGE_ID = 'imageSelected';
const TABLE_ID = 'tableSelected';
const CONTENT_DIV_ID = 'contentDiv_';
const STYLE_ID = 'imageStyle';

/**
 * @internal
 */
export const setDOMSelection: SetDOMSelection = (core, selection) => {
    unselect(core);

    switch (selection.type) {
        case 'image':
            addUniqueId(selection.image, IMAGE_ID);
            addUniqueId(core.contentDiv, CONTENT_DIV_ID);
            core.selection.imageSelection = selection;
            core.selection.tableSelection = undefined;
            break;

        case 'table':
            addUniqueId(selection.table, TABLE_ID);
            addUniqueId(core.contentDiv, CONTENT_DIV_ID);

            // TODO: Build Table selection CSS
            break;

        case 'range':
            break;
    }

    core.api.triggerEvent(
        core,
        {
            eventType: 'selectionChanged',
            domSelection: selection,
        },
        true /*broadcast*/
    );
};

function addUniqueId(el: HTMLElement, idPrefix: string) {
    const doc = el.ownerDocument;
    if (!el.id) {
        applyId(el, idPrefix, doc);
    } else {
        const elements = doc.querySelectorAll(`#${el.id}`);
        if (elements.length > 1) {
            el.removeAttribute('id');
            applyId(el, idPrefix, doc);
        }
    }
}

function applyId(el: HTMLElement, idPrefix: string, doc: Document) {
    let cont = 0;
    const getElement = () => doc.getElementById(idPrefix + cont);
    //Ensure that there are no elements with the same ID
    let element = getElement();
    while (element) {
        cont++;
        element = getElement();
    }

    el.id = idPrefix + cont;
}

function unselect(core: ContentModelEditorCore) {
    const doc = core.contentDiv.ownerDocument;
    removeGlobalCssStyle(doc, STYLE_ID + core.contentDiv.id);
}

function removeGlobalCssStyle(doc: Document, styleId: string) {
    const styleTag = doc.getElementById(styleId) as HTMLStyleElement;
    if (styleTag) {
        styleTag.parentNode?.removeChild(styleTag);
    }
}
