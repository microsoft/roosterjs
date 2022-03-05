import IRibbonPlugin from '../../plugins/RibbonPlugin/IRibbonPlugin';
import RibbonButton from '../../plugins/RibbonPlugin/RibbonButton';

/**
 * Properties of Ribbon component
 */
export default interface RibbonProps {
    /**
     * The ribbon plugin used for connect editor and the ribbon
     */
    plugin: IRibbonPlugin;

    /**
     * Buttons in this ribbon
     */
    buttons: RibbonButton[];

    /**
     * DOM attributes for the DIV tag of ribbon. All properties passed in from this property will be
     * rendered as DOM attribute of the ribbon DIV node.
     */
    domAttributes?: React.HTMLAttributes<HTMLDivElement>;

    /**
     * Whether this ribbon should be render from right to left or left to right
     */
    isRtl?: boolean;

    /**
     * A dictionary of localized strings for all buttons.
     * Key of the dictionary is the key of each button, value will be the string or a function to return the string
     */
    strings?: Record<string, string | (() => string)>;
}
