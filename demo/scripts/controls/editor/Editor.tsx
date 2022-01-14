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
import { Editor as RoosterJsEditor } from 'roosterjs-editor-core';
import { EditorInstanceToggleablePlugins } from './EditorInstanceToggleablePlugins';
import { EditorOptions, EditorPlugin, IEditor, UndoSnapshotsService } from 'roosterjs-editor-types';
import { getDarkColor } from 'roosterjs-color-utils';
import { HyperLink } from 'roosterjs-editor-plugins/lib/HyperLink';
import { Paste } from 'roosterjs-editor-plugins/lib/Paste';
import { PickerPlugin } from 'roosterjs-editor-plugins/lib/Picker';
import { TableResize } from 'roosterjs-editor-plugins/lib/TableResize';
import { trustedHTMLHandler } from '../../utils/trustedHTMLHandler';
import { Watermark } from 'roosterjs-editor-plugins/lib/Watermark';

const styles = require('./Editor.scss');

export interface EditorProps {
    plugins: EditorPlugin[];
    initState: BuildInPluginState;
    snapshotService: UndoSnapshotsService;
    scale: number;
    className?: string;
}

export default function Editor(props: EditorProps) {
    const contentDiv = React.useRef<HTMLDivElement>();
    const editor = React.useRef<IEditor>();
    const { scale, initState } = props;
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

    React.useEffect(() => {
        const editorInstanceToggleablePlugins: EditorInstanceToggleablePlugins = {
            contentEdit: pluginList.contentEdit ? new ContentEdit(contentEditFeatures) : null,
            hyperlink: pluginList.hyperlink ? new HyperLink(getLinkCallback()) : null,
            paste: pluginList.paste ? new Paste() : null,
            watermark: pluginList.watermark ? new Watermark(watermarkText) : null,
            imageEdit: pluginList.imageEdit
                ? new ImageEditPlugin({
                      preserveRatio: forcePreserveRatio,
                      sizeTransformer: (x, y) => ({
                          deltaX: x / scale,
                          deltaY: y / scale,
                      }),
                  })
                : null,
            cutPasteListChain: pluginList.cutPasteListChain ? new CutPasteListChain() : null,
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
            contextMenu: pluginList.contextMenu
                ? new ContextMenu(CONTEXT_MENU_DATA_PROVIDER)
                : null,
        };
        const plugins = [
            ...Object.keys(editorInstanceToggleablePlugins).map(
                (k: keyof EditorInstanceToggleablePlugins) => editorInstanceToggleablePlugins[k]
            ),
            ...props.plugins,
        ];
        const options: EditorOptions = {
            plugins,
            defaultFormat,
            getDarkColor,
            experimentalFeatures: experimentalFeatures,
            undoSnapshotService: props.snapshotService,
            trustedHTMLHandler: trustedHTMLHandler,
        };
        editor.current = new RoosterJsEditor(contentDiv.current, options);
        return () => {
            editor.current.dispose();
            editor.current = null;
        };
    }, [
        pluginList,
        contentEditFeatures,
        watermarkText,
        forcePreserveRatio,
        props.plugins,
        defaultFormat,
        experimentalFeatures,
        props.snapshotService,
    ]);

    const editorStyles = {
        transform: `scale(${scale})`,
        transformOrigin: 'left top',
        height: `calc(${100 / scale}%)`,
        width: `calc(${100 / scale}%)`,
    };

    return (
        <div className={props.className} style={{ width: '100%' }}>
            <div style={editorStyles}>
                <div className={styles.editor} ref={contentDiv} />
            </div>
        </div>
    );
}
