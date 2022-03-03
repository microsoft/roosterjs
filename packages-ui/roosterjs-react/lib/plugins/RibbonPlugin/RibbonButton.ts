import { FormatState, IEditor } from 'roosterjs-editor-types';

/**
 * Represents a button on format ribbon
 */
export default interface RibbonButton {
    /**
     * key of this button, needs to be unique
     */
    key: string;

    /**
     * Name of button icon. See https://developer.microsoft.com/en-us/fluentui#/styles/web/icons for all icons
     */
    iconName: string;

    /**
     * Optional icon used for Right-to-left layout. See https://developer.microsoft.com/en-us/fluentui#/styles/web/icons for all icons.
     * This will only be used when isRtl is set to true
     */
    rtlIconName?: string;

    /**
     * Text of the button. This text is not localized. To show a localized text, pass a dictionary to Ribbon component via RibbonProps.strings.
     */
    unlocalizedText: string;

    /**
     * A key-value map for child items.
     * When click on a child item, onClick handler will be triggered with the key of the clicked child item passed in as the second parameter
     */
    dropDownItems?: Record<string, string>;

    /**
     * Click handler of this button.
     * @param editor the editor instance
     * @returns True if a refresh of button state is needed. Otherwise, false or void
     */
    onClick: (editor: IEditor, key?: string) => void | boolean;

    /**
     * Get if the current button should be checked
     * @param formatState The current formatState of editor
     * @returns True to show the button in a checked state, otherwise false
     * @default False When not specified, it is treated as always returning false
     */
    checked?: (formatState: FormatState) => boolean;

    /**
     * Get if the current button should be disabled
     * @param formatState The current formatState of editor
     * @returns True to show the button in a disabled state, otherwise false
     * @default False When not specified, it is treated as always returning false
     */
    disabled?: (formatState: FormatState) => boolean;

    /**
     * Whether live preview feature is enabled for this plugin.
     * When live preview is enabled, hovering on a sub item will show the format result immediately in editor.
     * This option needs dropDownItems to have values
     */
    allowLivePreview?: boolean;
}
