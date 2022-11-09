import ContextMenuItem from '../types/ContextMenuItem';
import getLocalizedString from '../../common/utils/getLocalizedString';
import { ContextMenuProvider, EditorPlugin, IEditor } from 'roosterjs-editor-types';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';
import { LocalizedStrings, ReactEditorPlugin, UIUtilities } from '../../common/index';

/**
 * A plugin of editor to provide context menu items
 */
class ContextMenuProviderImpl<TString extends string, TContext>
    implements ContextMenuProvider<IContextualMenuItem>, ReactEditorPlugin {
    private editor: IEditor | null = null;
    private targetNode: Node | null = null;
    private uiUtilities: UIUtilities | null = null;

    /**
     * Create a new instance of ContextMenuProviderImpl class
     * @param menuName Name of this group of menus
     * @param items Menu items that will be show
     * @param strings Localized strings of these menu items
     * @param shouldAddMenuItems A general checker to decide if we should add this group of menu items
     */
    constructor(
        private menuName: string,
        private items: ContextMenuItem<TString, TContext>[],
        private strings?: LocalizedStrings<TString>,
        private shouldAddMenuItems?: (editor: IEditor, node: Node) => boolean,
        private context?: TContext
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

        return this.editor && this.shouldAddMenuItems?.(this.editor, node)
            ? this.items
                  .filter(
                      item => !item.shouldShow || item.shouldShow(this.editor!, node, this.context)
                  )
                  .map(item => this.convertMenuItems(item))
            : [];
    }

    setUIUtilities(uiUtilities: UIUtilities) {
        this.uiUtilities = uiUtilities;
    }

    private convertMenuItems(item: ContextMenuItem<TString, TContext>): IContextualMenuItem {
        return {
            key: item.key,
            data: item,
            text: getLocalizedString(this.strings, item.key, item.unlocalizedText),
            ariaLabel: getLocalizedString(this.strings, item.key, item.unlocalizedText),
            onClick: () => this.onClick(item, item.key),
            subMenuProps: item.subItems
                ? {
                      onItemClick: (_, menuItem) => menuItem && this.onClick(item, menuItem.data),
                      items: getObjectKeys(item.subItems).map(key => ({
                          key: key,
                          data: key,
                          text: getLocalizedString(this.strings, key, item.subItems?.[key]),
                          className: item.itemClassName,
                          onRender: item.itemRender
                              ? subItem => item.itemRender?.(subItem, () => this.onClick(item, key))
                              : undefined,
                      })),
                      ...(item.commandBarSubMenuProperties || {}),
                  }
                : undefined,
        };
    }

    private onClick(item: ContextMenuItem<TString, TContext>, key: TString) {
        if (this.editor && this.targetNode && this.uiUtilities) {
            item.onClick(
                key,
                this.editor,
                this.targetNode,
                this.strings,
                this.uiUtilities,
                this.context
            );
        }
    }
}

/**
 * Create a new instance of ContextMenuProviderImpl class
 * @param menuName Name of this group of menus
 * @param items Menu items that will be show
 * @param strings Localized strings of these menu items
 * @param shouldAddMenuItems A general checker to decide if we should add this group of menu items
 */
export default function createContextMenuProvider<TString extends string, TContext>(
    menuName: string,
    items: ContextMenuItem<TString, TContext>[],
    strings?: LocalizedStrings<TString>,
    shouldAddMenuItems?: (editor: IEditor, node: Node) => boolean,
    context?: TContext
): EditorPlugin {
    return new ContextMenuProviderImpl<TString, TContext>(
        menuName,
        items,
        strings,
        shouldAddMenuItems,
        context
    );
}
