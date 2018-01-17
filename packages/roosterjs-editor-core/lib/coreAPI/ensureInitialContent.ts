import EditorCore from '../editor/EditorCore';
import {
    NodeBlockElement,
    applyFormat,
    getFirstBlockElement,
    fromHtml,
} from 'roosterjs-editor-dom';

export function ensureInitialContent(core: EditorCore) {
    let firstBlock = getFirstBlockElement(core.contentDiv, core.inlineElementFactory);
    let defaultFormatBlockElement: HTMLElement;

    if (!firstBlock) {
        // No first block, let's create one
        let nodes = fromHtml('<div><br></div>', core.document);
        defaultFormatBlockElement = core.contentDiv.appendChild(nodes[0]) as HTMLElement;
    } else if (firstBlock instanceof NodeBlockElement) {
        // There is a first block and it is a Node (P, DIV etc.) block
        // Check if it is empty block and apply default format if so
        // TODO: what about first block contains just an image? testing getTextContent won't tell that
        // Probably it is no harm since apply default format on an image block won't change anything for the image
        if (firstBlock.getTextContent() == '') {
            defaultFormatBlockElement = firstBlock.getStartNode() as HTMLElement;
        }
    }

    if (defaultFormatBlockElement) {
        applyFormat(defaultFormatBlockElement, core.defaultFormat);
    }
}
