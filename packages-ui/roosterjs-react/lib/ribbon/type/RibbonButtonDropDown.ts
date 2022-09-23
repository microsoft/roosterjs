import { FormatState } from 'roosterjs-editor-types';
import { IContextualMenuItem, IContextualMenuProps } from '@fluentui/react/lib/ContextualMenu';

/**
 * Represent a drop down menu of a ribbon button
 */
export default interface RibbonButtonDropDown {
    /**
     * A key-value map for child items.
     * When click on a child item, onClick handler will be triggered with the key of the clicked child item passed in as the second parameter
     */
    items: Record<string, string>;

    /**
     * CSS class name for drop down menu item
     */
    itemClassName?: string;

    /**
     * Whether live preview feature is enabled for this plugin.
     * When live preview is enabled, hovering on a sub item will show the format result immediately in editor.
     * This option needs dropDownItems to have values
     */
    allowLivePreview?: boolean;

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
     * Get the key of current selected item
     * @param formatState The current formatState of editor
     * @returns the key of selected item, it needs to be the same with the key in dropDownItems
     */
    getSelectedItemKey?: (formatState: FormatState) => string | null;

    /**
     * Use this property to pass in Fluent UI ContextMenu property directly. It will overwrite the values of other conflict properties
     */ commandBarSubMenuProperties?: Partial<IContextualMenuProps>;
}
