import { NodeType } from 'roosterjs-editor-types';

export default function isRangeInContainer(range: Range, container: Node): boolean {
    let ancestorContainer = range ? range.commonAncestorContainer : null;

    // use the parentNode if ancestorContainer is a text node
    if (ancestorContainer && ancestorContainer.nodeType == NodeType.Text) {
        ancestorContainer = ancestorContainer.parentNode;
    }

    return (
        ancestorContainer &&
        (container == ancestorContainer || container.contains(ancestorContainer))
    );
}
