import { IEditor } from 'roosterjs-editor-types';
import { LocalizedStrings } from '../../common/type/LocalizedStrings';

/**
 * Represent a context menu item
 */
export default interface ContextMenuItem<T extends string> {
    /**
     * key of this button, needs to be unique
     */
    key: T;

    /**
     * Text of the button. This text is not localized. To show a localized text, pass a dictionary to Ribbon component via RibbonProps.strings.
     */
    unlocalizedText: string;

    /**
     * Click event handler
     * @param editor The editor object that triggers this event
     * @param targetNode The node that user is clicking onto
     */
    onClick: (editor: IEditor, targetNode: Node, strings: LocalizedStrings<T>) => void;

    /**
     * A callback function to check whether this menu item should show now
     * @param editor The editor object that triggers this event
     * @param targetNode The node that user is clicking onto
     */
    shouldShow?: (editor: IEditor, targetNode: Node) => boolean;
}
