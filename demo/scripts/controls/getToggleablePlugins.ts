import BuildInPluginState, { BuildInPluginList, UrlPlaceholder } from './BuildInPluginState';
import ImageEditPlugin from './contextMenu/ImageEditPlugin';
import ResetListPlugin from './contextMenu/ResetListPlugin';
import SampleColorPickerPluginDataProvider from './samplepicker/SampleColorPickerPluginDataProvider';
import { ContentEdit } from 'roosterjs-editor-plugins/lib/ContentEdit';
import { CONTEXT_MENU_DATA_PROVIDER } from './contextMenu/ContextMenuProvider';
import { ContextMenu } from 'roosterjs-editor-plugins/lib/ContextMenu';
import { CustomReplace as CustomReplacePlugin } from 'roosterjs-editor-plugins/lib/CustomReplace';
import { CutPasteListChain } from 'roosterjs-editor-plugins/lib/CutPasteListChain';
import { EditorPlugin } from 'roosterjs-editor-types';
import { HyperLink } from 'roosterjs-editor-plugins/lib/HyperLink';
import { MathNapkin as MathNapkinPlugin } from 'roosterjs-editor-plugins/lib/MathNapkin';
import { Paste } from 'roosterjs-editor-plugins/lib/Paste';
import { PickerPlugin } from 'roosterjs-editor-plugins/lib/Picker';
import { TableCellSelection } from 'roosterjs-editor-plugins/lib/TableCellSelection';
import { TableResize } from 'roosterjs-editor-plugins/lib/TableResize';
import { Watermark } from 'roosterjs-editor-plugins/lib/Watermark';

const PluginCreators: {
    [key in keyof BuildInPluginList]: (initState: BuildInPluginState) => EditorPlugin;
} = {
    contentEdit: initState => new ContentEdit(initState.contentEditFeatures),
    hyperlink: ({ linkTitle }) =>
        new HyperLink(
            linkTitle?.indexOf(UrlPlaceholder) >= 0
                ? url => linkTitle.replace(UrlPlaceholder, url)
                : linkTitle
                ? () => linkTitle
                : null
        ),
    paste: _ => new Paste(),
    watermark: initState => new Watermark(initState.watermarkText),
    imageEdit: initState =>
        new ImageEditPlugin({
            preserveRatio: initState.forcePreserveRatio,
        }),
    cutPasteListChain: _ => new CutPasteListChain(),
    tableCellSelection: _ => new TableCellSelection(),
    tableResize: _ => new TableResize(),
    pickerPlugin: _ =>
        new PickerPlugin(new SampleColorPickerPluginDataProvider(), {
            elementIdPrefix: 'samplePicker-',
            changeSource: 'SAMPLE_COLOR_PICKER',
            triggerCharacter: ':',
            isHorizontal: true,
        }),
    customReplace: _ => new CustomReplacePlugin(),
    resetList: _ => new ResetListPlugin(),
    contextMenu: _ => new ContextMenu(CONTEXT_MENU_DATA_PROVIDER),
    mathNapkin: _ => new MathNapkinPlugin(),
};

export default function getToggleablePlugins(initState: BuildInPluginState) {
    return Object.keys(PluginCreators).map((key: keyof BuildInPluginList) =>
        initState.pluginList[key] ? PluginCreators[key](initState) : null
    );
}
