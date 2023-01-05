import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { FormatState } from 'roosterjs-editor-types';
import { getClosestAncestorBlockGroupIndex } from '../../modelApi/common/getClosestAncestorBlockGroupIndex';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { isBold } from '../segment/toggleBold';
import { iterateSelections } from '../../modelApi/selection/iterateSelections';
import { updateTableMetadata } from 'roosterjs-content-model/lib/modelApi/metadata/updateTableMetadata';

/**
 * Get current format state
 * @param editor The editor to get format from
 */
export default function getFormatState(
    editor: IExperimentalContentModelEditor
): FormatState | null {
    const model = editor.getCurrentContentModel();
    let result: FormatState | null = null;

    if (model) {
        iterateSelections([model], (path, tableContext, block, segments) => {
            if (block?.blockType == 'Paragraph' && segments?.[0]) {
                if (!result) {
                    const segment = segments[0];
                    const format = segment.format;
                    const superOrSubscript = format.superOrSubScriptSequence?.split(' ')?.pop();
                    const listItemIndex = getClosestAncestorBlockGroupIndex(path, ['ListItem'], []);
                    const listItem =
                        listItemIndex >= 0 ? (path[listItemIndex] as ContentModelListItem) : null;
                    const listType = listItem?.levels[listItem.levels.length - 1]?.listType;
                    const quoteIndex = getClosestAncestorBlockGroupIndex(path, ['Quote'], []);
                    const quote = quoteIndex >= 0 ? path[quoteIndex] : null;
                    const headerLevel = parseInt((block.decorator?.tagName || '').substring(1));
                    const tableFormat = tableContext
                        ? updateTableMetadata(tableContext.table)
                        : null;
                    const tableCell = tableContext
                        ? tableContext.table.cells[tableContext.rowIndex][tableContext.colIndex]
                        : null;

                    result = {
                        isBold: isBold(format.fontWeight),
                        isItalic: format.italic,
                        isUnderline: format.underline,
                        isStrikeThrough: format.strikethrough,
                        isSuperscript: superOrSubscript == 'super',
                        isSubscript: superOrSubscript == 'sub',

                        isBullet: listType == 'UL',
                        isNumbering: listType == 'OL',
                        isBlockQuote: !!quote,
                        canUnlink: !!segment.link,
                        isMultilineSelection: false,
                        canAddImageAltText: segment.segmentType == 'Image',
                        headerLevel: headerLevel >= 1 && headerLevel <= 6 ? headerLevel : undefined,
                        isInTable: !!tableContext,
                        tableFormat: tableFormat || undefined,
                        tableHasHeader: tableCell?.isSelected,

                        fontName: format.fontFamily,
                        fontSize: format.fontSize,
                        backgroundColor: format.backgroundColor,
                        textColor: format.textColor,

                        ...editor.getUndoState(),

                        isDarkMode: editor.isDarkMode(),
                        zoomScale: editor.getZoomScale(),
                    };
                } else {
                    result.isMultilineSelection = true;

                    // Return true to stop iteration since we have already got everything we need
                    return true;
                }
            }
        });
    }

    return result; // TODO: Get format state using content model even there is no cached model, need to consider perf impact
}
