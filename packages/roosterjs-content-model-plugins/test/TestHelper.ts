import { ContentModelDocument, CoreApiMap, EditorPlugin } from 'roosterjs-content-model-types';
import { Editor } from 'roosterjs-content-model-core';

export function initEditor(
    id: string,
    plugins?: EditorPlugin[],
    initialModel?: ContentModelDocument,
    coreApiOverride?: Partial<CoreApiMap>
) {
    let node = document.createElement('div');
    node.id = id;
    document.body.insertBefore(node, document.body.childNodes[0]);

    return new Editor(node, {
        plugins,
        initialModel,
        coreApiOverride,
    });
}

// Remove the element with id from the DOM
export function removeElement(id: string) {
    let node = document.getElementById(id);
    if (node && node.parentNode) {
        node.parentNode.removeChild(node);
    }
}
