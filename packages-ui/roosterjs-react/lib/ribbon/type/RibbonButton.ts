import RibbonButtonDropDown from './RibbonButtonDropDown';
import { FormatState, IEditor } from 'roosterjs-editor-types';
import { ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { LocalizedStrings, UIUtilities } from '../../common/index';

/**
 * Represents a button on format ribbon
 */
export default interface RibbonButton<T extends string> {
    /**
     * key of this button, needs to be unique
     */
    key: T;

    /**
     * Name of button icon. See https://developer.microsoft.com/en-us/fluentui#/styles/web/icons for all icons
     */
    iconName: string;

    /**
     * True if we need to flip the icon when render in Right-to-left page
     */
    flipWhenRtl?: boolean;

    /**
     * Text of the button. This text is not localized. To show a localized text, pass a dictionary to Ribbon component via RibbonProps.strings.
     */
    unlocalizedText: string;

    /**
     * Click handler of this button.
     * @param editor the editor instance
     * @param key key of the button that is clicked
     * @param strings localized strings used by any UI element of this click handler
     * @param uiUtilities a utilities object to help render addition UI elements
     */
    onClick: (
        editor: IEditor,
        key: T,
        strings: LocalizedStrings<T> | undefined,
        uiUtilities: UIUtilities
    ) => void;

    /**
     * Get if the current button should be checked
     * @param formatState The current formatState of editor
     * @returns True to show the button in a checked state, otherwise false
     * @default False When not specified, it is treated as always returning false
     */
    isChecked?: (formatState: FormatState) => boolean;

    /**
     * Get if the current button should be disabled
     * @param formatState The current formatState of editor
     * @returns True to show the button in a disabled state, otherwise false
     * @default False When not specified, it is treated as always returning false
     */
    isDisabled?: (formatState: FormatState) => boolean;

    /**
     * A drop down menu of this button. When set this value, the button will has a "v" icon to let user
     * know it will open a drop down menu. And the onClick handler will only be triggered when user click
     * a menu item of the drop down.
     */
    dropDownMenu?: RibbonButtonDropDown;

    /**
     * Use this property to pass in Fluent UI CommandBar property directly. It will overwrite the values of other conflict properties
     *
     * Do not use ICommandBarItemProps.subMenuProps here since it will be overwritten.
     * If need, specify its value using RibbonButton.dropDownMenu.commandBarSubMenuProperties.
     */
    commandBarProperties?: Partial<ICommandBarItemProps>;
}
