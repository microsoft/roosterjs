import { DelimiterType } from '../enum/DelimiterType';

/**
 * Represents a Delimiter. Mainly used to fix some scenarios where the browser is not handling
 * Inline Read only entities cursor functionality, causing sometimes the cursor caret to not be displayed
 * to the user.
 */
export default interface Delimiter {
    /**
     * Type of delimiter, whether is after or before of the surrounding element
     */
    type: DelimiterType;
    /**
     * id of the delimiter
     */
    id: string;
    /**
     * Element that is the delimiter.
     */
    element: Element;
}
