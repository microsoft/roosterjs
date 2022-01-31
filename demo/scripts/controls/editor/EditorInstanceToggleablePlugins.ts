import ImageEditPlugin from '../contextMenu/ImageEditPlugin';
import ResetListPlugin from '../contextMenu/ResetListPlugin';
import { ContentEdit } from 'roosterjs-editor-plugins/lib/ContentEdit';
import { ContextMenu } from 'roosterjs-editor-plugins/lib/ContextMenu';
import { ContextMenuItem } from '../contextMenu/ContextMenuProvider';
import { CustomReplace } from 'roosterjs-editor-plugins/lib/CustomReplace';
import { CutPasteListChain } from 'roosterjs-editor-plugins/lib/CutPasteListChain';
import { HyperLink } from 'roosterjs-editor-plugins/lib/HyperLink';
import { Paste } from 'roosterjs-editor-plugins/lib/Paste';
import { PickerPlugin } from 'roosterjs-editor-plugins/lib/Picker';
import { TableCellSelection } from 'roosterjs-editor-plugins/lib/TableCellSelection';
import { TableResize } from 'roosterjs-editor-plugins/lib/TableResize';
import { Watermark } from 'roosterjs-editor-plugins/lib/Watermark';

export type EditorInstanceToggleablePlugins = {
    contentEdit: ContentEdit;
    hyperlink: HyperLink;
    paste: Paste;
    watermark: Watermark;
    imageEdit: ImageEditPlugin;
    cutPasteListChain: CutPasteListChain;
    tableResize: TableResize;
    customReplace: CustomReplace;
    pickerPlugin: PickerPlugin;
    contextMenu: ContextMenu<ContextMenuItem>;
    resetList: ResetListPlugin;
    tableCellSelection: TableCellSelection;
};
