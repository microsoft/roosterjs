import ContextMenuItem from '../types/ContextMenuItem';
import getLocalizedString from '../../common/utils/getLocalizedString';
import { ContextMenuProvider, EditorPlugin, IEditor } from 'roosterjs-editor-types';
import { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { LocalizedStrings } from '../../common/type/LocalizedStrings';

/**
 * A plugin of editor to provide context menu items
 */
class ContextMenuProviderImpl<TString extends string>
    implements ContextMenuProvider<IContextualMenuItem> {
    private editor: IEditor;
    private targetNode: Node;

    /**
     * Create a new instance of ContextMenuProviderImpl class
     * @param menuName Name of this group of menus
     * @param items Menu items that will be show
     * @param strings Localized strings of these menu items
     * @param shouldAddMenuItems A general checker to decide if we should add this group of menu items
     */
    constructor(
        private menuName: string,
        private items: ContextMenuItem<TString>[],
        private strings?: LocalizedStrings<TString>,
        private shouldAddMenuItems?: (editor: IEditor, node: Node) => boolean
    ) {}

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return this.menuName;
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
    }

    getContextMenuItems(node: Node) {
        this.targetNode = node;

        return this.shouldAddMenuItems(this.editor, node)
            ? this.items
                  .filter(item => !item.shouldShow || item.shouldShow(this.editor, node))
                  .map(item => this.convertMenuItems(item))
            : [];
    }

    private convertMenuItems(item: ContextMenuItem<TString>): IContextualMenuItem {
        return {
            key: item.key,
            data: item,
            text: getLocalizedString(this.strings, item.key, item.unlocalizedText),
            ariaLabel: getLocalizedString(this.strings, item.key, item.unlocalizedText),
            onClick: () => item.onClick(this.editor, this.targetNode),
        };
    }
}

/**
 * Create a new instance of ContextMenuProviderImpl class
 * @param menuName Name of this group of menus
 * @param items Menu items that will be show
 * @param strings Localized strings of these menu items
 * @param shouldAddMenuItems A general checker to decide if we should add this group of menu items
 */
export default function createContextMenuProvider<TString extends string>(
    menuName: string,
    items: ContextMenuItem<TString>[],
    strings?: LocalizedStrings<TString>,
    shouldAddMenuItems?: (editor: IEditor, node: Node) => boolean
): EditorPlugin {
    return new ContextMenuProviderImpl(menuName, items, strings, shouldAddMenuItems);
}
