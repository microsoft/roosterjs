import { ContentEdit } from 'roosterjs-editor-plugins/lib/ContentEdit';
import { CustomReplace } from 'roosterjs-editor-plugins/lib/CustomReplace';
import { HyperLink } from 'roosterjs-editor-plugins/lib/HyperLink';
import { ImageResize } from 'roosterjs-editor-plugins/lib/ImageResize';
import { ImageCrop } from 'roosterjs-editor-plugins/lib/ImageCrop';
import { Paste } from 'roosterjs-editor-plugins/lib/Paste';
import { PickerPlugin } from 'roosterjs-editor-plugins/lib/Picker';
import { TableResize } from 'roosterjs-editor-plugins/lib/TableResize';
import { Watermark } from 'roosterjs-editor-plugins/lib/Watermark';

export type EditorInstanceToggleablePlugins = {
    contentEdit: ContentEdit;
    hyperlink: HyperLink;
    paste: Paste;
    watermark: Watermark;
    imageResize: ImageResize;
    imageCrop: ImageCrop;
    tableResize: TableResize;
    customReplace: CustomReplace;
    pickerPlugin: PickerPlugin;
};
