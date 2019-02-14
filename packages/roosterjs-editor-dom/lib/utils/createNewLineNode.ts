import Browser from './Browser';
import fromHtml from './fromHtml';

/**
 * Create a new line node
 */
export default function createNewLineNode(document: Document): HTMLElement {
    // Edge can sometimes lose current format when Enter to new line.
    // So here we add an extra SPAN for Edge to workaround this bug
    return fromHtml(
        Browser.isEdge ? '<div><span><br></span></div>' : '<div><br></div>',
        document
    )[0] as HTMLElement;
}
