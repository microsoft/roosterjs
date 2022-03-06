import IRibbonPlugin from '../../plugins/RibbonPlugin/IRibbonPlugin';
import RibbonButton from '../../plugins/RibbonPlugin/RibbonButton';
import { ICommandBarProps } from '@fluentui/react/lib/CommandBar';

/**
 * Properties of Ribbon component
 */
export default interface RibbonProps extends Partial<ICommandBarProps> {
    /**
     * The ribbon plugin used for connect editor and the ribbon
     */
    plugin: IRibbonPlugin;

    /**
     * Buttons in this ribbon
     */
    buttons: RibbonButton[];

    /**
     * A dictionary of localized strings for all buttons.
     * Key of the dictionary is the key of each button, value will be the string or a function to return the string
     */
    strings?: Record<string, string | (() => string)>;
}
