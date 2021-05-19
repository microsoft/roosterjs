import * as React from 'react';
import BuildInPluginState, { UrlPlaceholder } from '../BuildInPluginState';
import ResetListPlugin from '../contextMenu/ResetListPlugin';
import RotateImagePlugin from '../contextMenu/RotateImagePlugin';
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
import { ImageResize } from 'roosterjs-editor-plugins/lib/ImageResize';
import { Paste } from 'roosterjs-editor-plugins/lib/Paste';
import { PickerPlugin } from 'roosterjs-editor-plugins/lib/Picker';
import { TableResize } from 'roosterjs-editor-plugins/lib/TableResize';
import { Watermark } from 'roosterjs-editor-plugins/lib/Watermark';

const styles = require('./Editor.scss');

export interface EditorProps {
    plugins: EditorPlugin[];
    initState: BuildInPluginState;
    snapshotService: UndoSnapshotsService;
    className?: string;
}

export default function Editor(props: EditorProps) {
    const contentDiv = React.useRef<HTMLDivElement>();
    const editor = React.useRef<IEditor>();

    const {
        pluginList,
        contentEditFeatures,
        linkTitle,
        watermarkText,
        forcePreserveRatio,
        defaultFormat,
        experimentalFeatures,
    } = props.initState;

    const getLinkCallback = React.useCallback(() => {
        let linkCallback: (url: string) => string;

        if (linkTitle) {
            let index = linkTitle.indexOf(UrlPlaceholder);
            if (index >= 0) {
                let left = linkTitle.substr(0, index);
                let right = linkTitle.substr(index + UrlPlaceholder.length);
                linkCallback = url => left + url + right;
            } else {
                linkCallback = () => linkTitle;
            }
        } else {
            linkCallback = null;
        }

        return linkCallback;
    }, [linkTitle]);

    React.useEffect(() => {
        const editorInstanceToggleablePlugins: EditorInstanceToggleablePlugins = {
            contentEdit: pluginList.contentEdit ? new ContentEdit(contentEditFeatures) : null,
            hyperlink: pluginList.hyperlink ? new HyperLink(getLinkCallback()) : null,
            paste: pluginList.paste ? new Paste() : null,
            watermark: pluginList.watermark ? new Watermark(watermarkText) : null,
            imageResize: pluginList.imageResize
                ? new ImageResize(10, 10, undefined, forcePreserveRatio)
                : null,
            cutPasteListChain: pluginList.cutPasteListChain ? new CutPasteListChain() : null,
            tableResize: pluginList.tableResize ? new TableResize() : null,
            pickerPlugin: pluginList.pickerPlugin
                ? new PickerPlugin(new SampleColorPickerPluginDataProvider(), {
                      elementIdPrefix: 'samplepicker-',
                      changeSource: 'SAMPLE_COLOR_PICKER',
                      triggerCharacter: ':',
                      isHorizontal: true,
                  })
                : null,
            customReplace: pluginList.customReplace ? new CustomReplacePlugin() : null,
            resetList: pluginList.contextMenu ? new ResetListPlugin() : null,
            rotateImage: pluginList.contextMenu ? new RotateImagePlugin() : null,
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

    return (
        <div className={props.className}>
            <div className={styles.editor} ref={contentDiv} />
        </div>
    );
}
