import RibbonButton from './RibbonButton';
import RibbonPlugin from './RibbonPlugin';
import { ICommandBarProps } from '@fluentui/react/lib/CommandBar';
import { LocalizedStrings } from '../../common/type/LocalizedStrings';

/**
 * Properties of Ribbon component
 */
export default interface RibbonProps<T extends string> extends Partial<ICommandBarProps> {
    /**
     * The ribbon plugin used for connect editor and the ribbon
     */
    plugin: RibbonPlugin;

    /**
     * Buttons in this ribbon
     */
    buttons: RibbonButton<T>[];

    /**
     * A dictionary of localized strings for all buttons.
     * Key of the dictionary is the key of each button, value will be the string or a function to return the string
     */
    strings?: LocalizedStrings<T>;
}
