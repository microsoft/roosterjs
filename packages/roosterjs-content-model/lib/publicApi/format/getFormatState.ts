import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelQuote } from '../../publicTypes/group/ContentModelQuote';
import { ContentModelTableCell } from '../../publicTypes/group/ContentModelTableCell';
import { FormatState } from 'roosterjs-editor-types';
import { getSelections } from '../../modelApi/selection/getSelections';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { isBold } from '../segment/toggleBold';
import { getClosestAncestorBlockGroupWithType } from '../../modelApi/common/getOperationalBlocks';

/**
 * Get current format state
 * @param editor The editor to get format from
 */
export default function getFormatState(
    editor: IExperimentalContentModelEditor
): FormatState | null {
    const model = editor.getCurrentContentModel();

    if (model) {
        const selections = getSelections(model);

        if (selections[0]?.segments[0] && selections[0].paragraph) {
            const selection = selections[0];
            const segment = selection.segments[0];
            const paragraph = selection.paragraph;
            const format = segment.format;
            const superOrSubscript = format.superOrSubScriptSequence?.split(' ')?.pop();
            const listItem = getClosestAncestorBlockGroupWithType<ContentModelListItem>(
                selection,
                ['ListItem'],
                []
            );
            const listType =
                listItem?.blockType == 'BlockGroup'
                    ? listItem.levels[listItem.levels.length - 1]?.listType
                    : undefined;
            const quote = getClosestAncestorBlockGroupWithType<ContentModelQuote>(
                selection,
                ['Quote'],
                []
            );
            const headerLevel = parseInt((paragraph?.decorator?.tagName || '').substring(1));
            const tableCell = getClosestAncestorBlockGroupWithType<ContentModelTableCell>(
                selection,
                ['TableCell'],
                []
            );

            return {
                isBold: isBold(format.fontWeight),
                isItalic: format.italic,
                isUnderline: format.underline,
                isStrikeThrough: format.strikethrough,
                isSuperscript: superOrSubscript == 'super',
                isSubscript: superOrSubscript == 'sub',

                isBullet: listType == 'UL',
                isNumbering: listType == 'OL',
                isBlockQuote: quote?.blockType == 'BlockGroup',
                canUnlink: !!segment.link,
                isMultilineSelection: selections.length > 1,
                canAddImageAltText: segment.segmentType == 'Image',
                headerLevel: headerLevel >= 1 && headerLevel <= 6 ? headerLevel : undefined,
                isInTable: !!tableCell,
                tableFormat: undefined, // TODO
                tableHasHeader: tableCell?.isHeader,

                fontName: format.fontFamily,
                fontSize: format.fontSize,
                backgroundColor: format.backgroundColor,
                textColor: format.textColor,

                ...editor.getUndoState(),

                isDarkMode: editor.isDarkMode(),
                zoomScale: editor.getZoomScale(),
            };
        }
    }

    return null; // TODO: Get format state using content model even there is no cached model, need to consider perf impact
}
