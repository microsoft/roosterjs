import { HyperLink, Paste, ContentEdit, Watermark, TableResize } from 'roosterjs-editor-plugins';
import { PickerPlugin } from 'roosterjs-plugin-picker';
import { ReactPlugin } from 'roosterjs-plugin-react';
import { CustomReplace } from 'roosterjs-editor-plugins';
import { ImageResize } from 'roosterjs-plugin-image-resize';

export type EditorInstanceToggleablePlugins = {
    hyperlink: HyperLink;
    paste: Paste;
    contentEdit: ContentEdit;
    watermark: Watermark;
    imageResize: ImageResize;
    tableResize: TableResize;
    customReplace: CustomReplace;
    pickerPlugin: PickerPlugin;
    reactPlugin: ReactPlugin;
};
