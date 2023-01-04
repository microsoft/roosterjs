import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelListItemLevelFormat } from '../../publicTypes/format/ContentModelListItemLevelFormat';
import { getOperationalBlocks } from '../common/getOperationalBlocks';
import { getSelections } from '../selection/getSelections';
import { isBlockGroupOfType } from '../common/isBlockGroupOfType';
import { parseValueWithUnit } from '../../formatHandlers/utils/parseValueWithUnit';

const IndentStepInPixel = 40;

/**
 * @internal
 */
export function setModelIndentation(
    model: ContentModelDocument,
    indentation: 'indent' | 'outdent',
    length: number = IndentStepInPixel
) {
    const paragraphs = getSelections(model);
    const paragraphOrListItem = getOperationalBlocks<ContentModelListItem>(paragraphs, [
        'ListItem',
    ]);
    const isIndent = indentation == 'indent';

    paragraphOrListItem.forEach(item => {
        if (isBlockGroupOfType(item, 'ListItem')) {
            if (isIndent) {
                const newLevel: ContentModelListItemLevelFormat = {
                    ...item.levels[item.levels.length - 1],
                };

                // New level is totally new, no need to have these attributes for now
                delete newLevel.startNumberOverride;
                delete newLevel.orderedStyleType;
                delete newLevel.unorderedStyleType;

                item.levels.push(newLevel);
            } else {
                item.levels.pop();
            }
        } else if (item.paragraph) {
            const { format } = item.paragraph;
            const { marginLeft, marginRight, direction } = format;
            const originalValue = parseValueWithUnit(direction == 'rtl' ? marginRight : marginLeft);
            let newValue = (isIndent ? Math.ceil : Math.floor)(originalValue / length) * length;

            if (newValue == originalValue) {
                newValue = Math.max(newValue + length * (isIndent ? 1 : -1), 0);
            }

            format.marginLeft = newValue + 'px';
            format.marginRight = newValue + 'px';
        }
    });

    return paragraphOrListItem.length > 0;
}
