import { IContextualMenuItem, IContextualMenuProps } from '@fluentui/react/lib/ContextualMenu';
import { IEditor } from 'roosterjs-editor-types';
import { LocalizedStrings, UIUtilities } from '../../common/index';

/**
 * Represent a context menu item
 */
export default interface ContextMenuItem<TString extends string, TContext = never> {
    /**
     * key of this button, needs to be unique
     */
    key: TString;

    /**
     * Text of the button. This text is not localized. To show a localized text, pass a dictionary to Ribbon component via RibbonProps.strings.
     */
    unlocalizedText: string;

    /**
     * Click event handler
     * @param key Key of the menu item that is clicked
     * @param editor The editor object that triggers this event
     * @param targetNode The node that user is clicking onto
     * @param strings The strings object used by getLocalizedString() function
     * @param uiUtilities UI Utilities to help render additional react component from this click event
     * @param context A context object that passed in from context menu provider, can be anything
     */
    onClick: (
        key: TString,
        editor: IEditor,
        targetNode: Node,
        strings: LocalizedStrings<TString> | undefined,
        uiUtilities: UIUtilities,
        context?: TContext
    ) => void;

    /**
     * A callback function to check whether this menu item should show now
     * @param editor The editor object that triggers this event
     * @param targetNode The node that user is clicking onto
     * @param context A context object that passed in from context menu provider, can be anything
     */
    shouldShow?: (editor: IEditor, targetNode: Node, context?: TContext) => boolean;

    /**
     * A key-value map for sub menu items, key is the key of menu item, value is unlocalized string
     * When click on a child item, onClick handler will be triggered with the key of the clicked child item passed in as the second parameter
     */
    subItems?: { [key in TString]?: string };

    /**
     * Custom render of drop down item
     * @param item This menu item
     * @param onClick click handler of this menu item
     */
    itemRender?: (
        item: IContextualMenuItem,
        onClick: (
            e: React.MouseEvent<Element> | React.KeyboardEvent<Element>,
            item: IContextualMenuItem
        ) => void
    ) => React.ReactNode;

    /**
     * CSS class name for drop down menu item
     */
    itemClassName?: string;

    /**
     * Use this property to pass in Fluent UI ContextMenu property directly. It will overwrite the values of other conflict properties
     */
    commandBarSubMenuProperties?: Partial<IContextualMenuProps>;
}
