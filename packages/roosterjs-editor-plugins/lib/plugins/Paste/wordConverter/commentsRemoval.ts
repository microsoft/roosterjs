import { ElementCallbackMap } from 'roosterjs-editor-types';
import {
    chainSanitizerCallback,
    changeElementTag,
    getStyles,
    moveChildNodes,
    safeInstanceOf,
} from 'roosterjs-editor-dom';

const MSO_COMMENT_REFERENCE = 'mso-comment-reference';
const MSO_COMMENT_ANCHOR_HREF_REGEX = /#_msocom_/;
const MSO_SPECIAL_CHARACTER = 'mso-special-character';
const MSO_SPECIAL_CHARACTER_COMMENT = 'comment';
const MSO_COMMENT_CONTINUATION = 'mso-comment-continuation';
const MSO_ELEMENT = 'mso-element';
const MSO_ELEMENT_COMMENT_LIST = 'comment-list';

/**
 * @internal
 * Removes comments when pasting Word content.
 */
export default function commentsRemoval(elementCallbacks: ElementCallbackMap) {
    // 1st Step, Remove SPAN elements added after each comment.
    // Word adds multiple elements for comments as SPAN elements.
    // In this step we remove these elements:
    // Structure as of 4/18/2022
    // 1.   <span style="mso-special-character:comment">&nbsp;</span>
    // 2.   <span style="mso-comment-continuation:3">
    //          <span>
    //              <span style="font-size:8.0pt">
    //              <a href="#_msocom_2">[RS2]</a>
    //              <span style="mso-special-character:comment">&nbsp;</span>
    //              </span>
    //          </span>
    //      </span>
    chainSanitizerCallback(elementCallbacks, 'SPAN', element => {
        const styles = getStyles(element);
        if (
            styles[MSO_SPECIAL_CHARACTER] == MSO_SPECIAL_CHARACTER_COMMENT ||
            !!styles[MSO_COMMENT_CONTINUATION]
        ) {
            element.parentElement?.removeChild(element);
        }
        return true;
    });

    // 2nd Step, Modify Anchor elements.
    // 1.   When the element was selected to add a comment in Word, the selection is converted to
    //      an anchor element, so we change the tag to span.
    // 2.   Word also adds some Anchor elements with the following structure:
    //      Structure as of 4/18/2022
    //      <a href="#_msocom_{number}">[SS3]</a>
    //      In this step we remove this Anchor elements.
    chainSanitizerCallback(elementCallbacks, 'A', element => {
        const styles = getStyles(element);
        if (!!styles[MSO_COMMENT_REFERENCE]) {
            changeElementTag(element, 'span');
        } else if (
            safeInstanceOf(element, 'HTMLAnchorElement') &&
            MSO_COMMENT_ANCHOR_HREF_REGEX.test(element.href)
        ) {
            element.parentElement?.removeChild(element);
        }
        return true;
    });

    // 3rd Step, remove List of comments.
    // When the document have a long thread of comments, these comments are appended
    // at the end of the copied fragment, we also need to remove it.
    // Structure as of 4/18/2022
    //
    // <div style="mso-element:comment-list">
    //   <hr width="33%" size="1" align="left">
    //   <div style="mso-element:comment"> ... </div>
    //   <div style="mso-element:comment"> ... </div>
    //   <div style="mso-element:comment"> ... </div>
    //   </div>
    // </div>
    chainSanitizerCallback(elementCallbacks, 'DIV', element => {
        const styles = getStyles(element);
        if (styles[MSO_ELEMENT] == MSO_ELEMENT_COMMENT_LIST) {
            moveChildNodes(element);
        }
        return true;
    });
}
