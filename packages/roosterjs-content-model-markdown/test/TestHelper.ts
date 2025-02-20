import { ContentModelDocument, IEditor } from 'roosterjs-content-model-types';
import { Editor } from 'roosterjs-content-model-core';

export function initEditor(
    id: string,
    initialModel?: ContentModelDocument,
    anchorContainerSelector?: string
): IEditor {
    let node = document.createElement('div');
    node.id = id;

    if (anchorContainerSelector) {
        let anchorContainer = document.createElement('div');
        anchorContainer.className = anchorContainerSelector;
        document.body.insertBefore(anchorContainer, document.body.childNodes[0]);
        anchorContainer.insertBefore(node, anchorContainer.childNodes[0]);
    } else {
        document.body.insertBefore(node, document.body.childNodes[0]);
    }

    return new Editor(node, {
        plugins: [],
        initialModel,
    });
}
