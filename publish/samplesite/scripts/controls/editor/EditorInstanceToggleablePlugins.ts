import {
    ContentEdit,
    HyperLink,
    Paste,
    TableResize,
    Watermark,
    CustomReplace,
    ImageResize,
    PickerPlugin,
    EntityPlugin,
} from 'roosterjs-editor-plugins';

export type EditorInstanceToggleablePlugins = {
    hyperlink: HyperLink;
    paste: Paste;
    contentEdit: ContentEdit;
    watermark: Watermark;
    imageResize: ImageResize;
    tableResize: TableResize;
    customReplace: CustomReplace;
    pickerPlugin: PickerPlugin;
    entityPlugin: EntityPlugin;
};
