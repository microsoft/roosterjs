import getInheritableStyles from '../htmlSanitizer/getInheritableStyles';
import HtmlSanitizer from '../htmlSanitizer/HtmlSanitizer';
import { BeforePasteEvent, NodePosition } from 'roosterjs-editor-types';

/**
 * Sanitize the content from the pasted content
 * @param event The before paste event
 * @param position the position of the cursor
 */
export default function sanitizePasteContent(
    event: BeforePasteEvent,
    position: NodePosition | null
) {
    const { fragment } = event;
    const sanitizer = new HtmlSanitizer(event.sanitizingOption);
    sanitizer.convertGlobalCssToInlineCss(fragment);
    sanitizer.sanitize(fragment, position ? getInheritableStyles(position.element) : undefined);
}
