import * as React from 'react';
import BuildInPluginState, { UrlPlaceholder } from '../BuildInPluginState';
import ImageEditPlugin from '../contextMenu/ImageEditPlugin';
import ResetListPlugin from '../contextMenu/ResetListPlugin';
import SampleColorPickerPluginDataProvider from '../samplepicker/SampleColorPickerPluginDataProvider';
import { ContentEdit } from 'roosterjs-editor-plugins/lib/ContentEdit';
import { CONTEXT_MENU_DATA_PROVIDER } from '../contextMenu/ContextMenuProvider';
import { ContextMenu } from 'roosterjs-editor-plugins/lib/ContextMenu';
import { CustomReplace as CustomReplacePlugin } from 'roosterjs-editor-plugins/lib/CustomReplace';
import { CutPasteListChain } from 'roosterjs-editor-plugins/lib/CutPasteListChain';
import { EditorInstanceToggleablePlugins } from './EditorInstanceToggleablePlugins';
import { EditorOptions, EditorPlugin, UndoSnapshotsService } from 'roosterjs-editor-types';
import { getDarkColor } from 'roosterjs-color-utils';
import { HyperLink } from 'roosterjs-editor-plugins/lib/HyperLink';
import { Paste } from 'roosterjs-editor-plugins/lib/Paste';
import { PickerPlugin } from 'roosterjs-editor-plugins/lib/Picker';
import { Rooster } from 'roosterjs-react';
import { TableCellSelection } from 'roosterjs-editor-plugins/lib/TableCellSelection';
import { TableResize } from 'roosterjs-editor-plugins/lib/TableResize';
import { trustedHTMLHandler } from '../../utils/trustedHTMLHandler';
import { Watermark } from 'roosterjs-editor-plugins/lib/Watermark';

const styles = require('./Editor.scss');

export interface EditorProps {
    plugins: EditorPlugin[];
    initState: BuildInPluginState;
    snapshotService: UndoSnapshotsService;
    scale: number;
    content: string;
    onDispose: (content: string) => void;
    className?: string;
}

export default function Editor(props: EditorProps) {
    const { scale, initState, plugins, content, onDispose } = props;
    const {
        pluginList,
        contentEditFeatures,
        linkTitle,
        watermarkText,
        forcePreserveRatio,
        defaultFormat,
        experimentalFeatures,
    } = initState;

    const getLinkCallback = React.useCallback(
        (): ((url: string) => string) =>
            linkTitle?.indexOf(UrlPlaceholder) >= 0
                ? url => linkTitle.replace(UrlPlaceholder, url)
                : linkTitle
                ? () => linkTitle
                : null,
        [linkTitle]
    );

    const editorInstanceToggleablePlugins: EditorInstanceToggleablePlugins = {
        contentEdit: pluginList.contentEdit ? new ContentEdit(contentEditFeatures) : null,
        hyperlink: pluginList.hyperlink ? new HyperLink(getLinkCallback()) : null,
        paste: pluginList.paste ? new Paste() : null,
        watermark: pluginList.watermark ? new Watermark(watermarkText) : null,
        imageEdit: pluginList.imageEdit
            ? new ImageEditPlugin({
                  preserveRatio: forcePreserveRatio,
              })
            : null,
        cutPasteListChain: pluginList.cutPasteListChain ? new CutPasteListChain() : null,
        tableCellSelection: pluginList.tableCellSelection ? new TableCellSelection() : null,
        tableResize: pluginList.tableResize ? new TableResize() : null,
        pickerPlugin: pluginList.pickerPlugin
            ? new PickerPlugin(new SampleColorPickerPluginDataProvider(), {
                  elementIdPrefix: 'samplePicker-',
                  changeSource: 'SAMPLE_COLOR_PICKER',
                  triggerCharacter: ':',
                  isHorizontal: true,
              })
            : null,
        customReplace: pluginList.customReplace ? new CustomReplacePlugin() : null,
        resetList: pluginList.contextMenu ? new ResetListPlugin() : null,
        contextMenu: pluginList.contextMenu ? new ContextMenu(CONTEXT_MENU_DATA_PROVIDER) : null,
    };
    const allPlugins = [
        ...Object.keys(editorInstanceToggleablePlugins).map(
            (k: keyof EditorInstanceToggleablePlugins) => editorInstanceToggleablePlugins[k]
        ),
        ...plugins,
    ];
    const options: EditorOptions = {
        plugins: allPlugins,
        defaultFormat,
        getDarkColor,
        experimentalFeatures: experimentalFeatures,
        undoSnapshotService: props.snapshotService,
        trustedHTMLHandler: trustedHTMLHandler,
        zoomScale: scale,
        initialContent: content,
    };

    const editorStyles = {
        transform: `scale(${scale})`,
        transformOrigin: 'left top',
        height: `calc(${100 / scale}%)`,
        width: `calc(${100 / scale}%)`,
    };

    return (
        <div className={props.className} style={{ width: '100%' }}>
            <div style={editorStyles}>
                <Rooster className={styles.editor} onDispose={onDispose} {...options} />
            </div>
        </div>
    );
}
