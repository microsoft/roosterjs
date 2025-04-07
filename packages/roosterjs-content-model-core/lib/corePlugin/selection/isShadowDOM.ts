import { isNodeOfType } from 'roosterjs-content-model-dom';

export function isShadowDOM(focusNode: Node) {
    if (isNodeOfType(focusNode, 'ELEMENT_NODE')) {
        return (
            focusNode.shadowRoot ||
            (focusNode.firstElementChild == focusNode.lastElementChild &&
                focusNode.firstElementChild?.shadowRoot)
        );
    }
}
