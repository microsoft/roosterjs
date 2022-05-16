import BuildInPluginState, { BuildInPluginList, UrlPlaceholder } from './BuildInPluginState';
import SampleColorPickerPluginDataProvider from './samplepicker/SampleColorPickerPluginDataProvider';
import { ContentEdit } from 'roosterjs-editor-plugins/lib/ContentEdit';
import { CustomReplace as CustomReplacePlugin } from 'roosterjs-editor-plugins/lib/CustomReplace';
import { CutPasteListChain } from 'roosterjs-editor-plugins/lib/CutPasteListChain';
import { EditorPlugin } from 'roosterjs-editor-types';
import { HyperLink } from 'roosterjs-editor-plugins/lib/HyperLink';
import { ImageEdit } from 'roosterjs-editor-plugins/lib/ImageEdit';
import { Paste } from 'roosterjs-editor-plugins/lib/Paste';
import { PickerPlugin } from 'roosterjs-editor-plugins/lib/Picker';
import { TableCellSelection } from 'roosterjs-editor-plugins/lib/TableCellSelection';
import { TableResize } from 'roosterjs-editor-plugins/lib/TableResize';
import { Watermark } from 'roosterjs-editor-plugins/lib/Watermark';
import {
    createContextMenuPlugin,
    createImageEditMenuProvider,
    createListEditMenuProvider,
} from 'roosterjs-react/lib/contextMenu';

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
        new ImageEdit({
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
    resetListMenu: _ => createListEditMenuProvider(),
    imageEditMenu: _ => createImageEditMenuProvider(),
    contextMenu: _ => createContextMenuPlugin(),
};

export default function getToggleablePlugins(initState: BuildInPluginState) {
    return Object.keys(PluginCreators).map((key: keyof BuildInPluginList) =>
        initState.pluginList[key] ? PluginCreators[key](initState) : null
    );
}
