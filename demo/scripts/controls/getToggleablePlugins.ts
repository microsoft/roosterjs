import BuildInPluginState, { BuildInPluginList, UrlPlaceholder } from './BuildInPluginState';
import { AutoFormat } from 'roosterjs-editor-plugins/lib/AutoFormat';
import { ContentEdit } from 'roosterjs-editor-plugins/lib/ContentEdit';
import { CustomReplace as CustomReplacePlugin } from 'roosterjs-editor-plugins/lib/CustomReplace';
import { CutPasteListChain } from 'roosterjs-editor-plugins/lib/CutPasteListChain';
import { EditorPlugin } from 'roosterjs-editor-types';
import { HyperLink } from 'roosterjs-editor-plugins/lib/HyperLink';
import { ImageEdit } from 'roosterjs-editor-plugins/lib/ImageEdit';
import { Paste } from 'roosterjs-editor-plugins/lib/Paste';
import { TableCellSelection } from 'roosterjs-editor-plugins/lib/TableCellSelection';
import { TableResize } from 'roosterjs-editor-plugins/lib/TableResize';
import { Watermark } from 'roosterjs-editor-plugins/lib/Watermark';
import { ContentModelPastePlugin } from 'roosterjs-content-model';
import {
    createContextMenuPlugin,
    createImageEditMenuProvider,
    createListEditMenuProvider,
    createTableEditMenuProvider,
} from 'roosterjs-react/lib/contextMenu';

export default function getToggleablePlugins(initState: BuildInPluginState) {
    const { pluginList, linkTitle } = initState;
    const imageEdit = pluginList.imageEdit
        ? new ImageEdit({
              preserveRatio: initState.forcePreserveRatio,
          })
        : null;

    const plugins: Record<keyof BuildInPluginList, EditorPlugin | null> = {
        contentEdit: pluginList.contentEdit ? new ContentEdit(initState.contentEditFeatures) : null,
        hyperlink: pluginList.hyperlink
            ? new HyperLink(
                  linkTitle?.indexOf(UrlPlaceholder) >= 0
                      ? url => linkTitle.replace(UrlPlaceholder, url)
                      : linkTitle
                      ? () => linkTitle
                      : null
              )
            : null,
        paste: pluginList.paste ? new Paste() : null,
        watermark: pluginList.watermark ? new Watermark(initState.watermarkText) : null,
        imageEdit,
        cutPasteListChain: pluginList.cutPasteListChain ? new CutPasteListChain() : null,
        tableCellSelection: pluginList.tableCellSelection ? new TableCellSelection() : null,
        tableResize: pluginList.tableResize ? new TableResize() : null,
        customReplace: pluginList.customReplace ? new CustomReplacePlugin() : null,
        autoFormat: pluginList.autoFormat ? new AutoFormat() : null,
        listEditMenu:
            pluginList.contextMenu && pluginList.listEditMenu ? createListEditMenuProvider() : null,
        imageEditMenu:
            pluginList.contextMenu && pluginList.imageEditMenu && imageEdit
                ? createImageEditMenuProvider(imageEdit)
                : null,
        tableEditMenu:
            pluginList.contextMenu && pluginList.tableEditMenu
                ? createTableEditMenuProvider()
                : null,
        contextMenu: pluginList.contextMenu ? createContextMenuPlugin() : null,
        contentModelPaste: pluginList.contentModelPaste ? new ContentModelPastePlugin() : null,
    };

    return Object.values(plugins);
}
