import { createListLevel, parseValueWithUnit } from 'roosterjs-content-model-dom';
import { getOperationalBlocks } from '../selection/collectSelections';
import { isBlockGroupOfType } from '../common/isBlockGroupOfType';
import {
    ContentModelDocument,
    ContentModelListItem,
    ContentModelListLevel,
} from 'roosterjs-content-model-types';

const IndentStepInPixel = 40;

/**
 * @internal
 */
export function setModelIndentation(
    model: ContentModelDocument,
    indentation: 'indent' | 'outdent',
    length: number = IndentStepInPixel
) {
    const paragraphOrListItem = getOperationalBlocks<ContentModelListItem>(
        model,
        ['ListItem'],
        ['TableCell']
    );
    const isIndent = indentation == 'indent';

    paragraphOrListItem.forEach(({ block }) => {
        if (isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
            if (isIndent) {
                const lastLevel = block.levels[block.levels.length - 1];
                const newLevel: ContentModelListLevel = createListLevel(
                    lastLevel?.listType || 'UL',
                    lastLevel?.format
                );

                // New level is totally new, no need to have these attributes for now
                delete newLevel.format.startNumberOverride;

                block.levels.push(newLevel);
            } else {
                block.levels.pop();
            }
        } else if (block) {
            const { format } = block;
            const { marginLeft, marginRight, direction } = format;
            const isRtl = direction == 'rtl';

            const originalValue = parseValueWithUnit(isRtl ? marginRight : marginLeft);
            let newValue = (isIndent ? Math.ceil : Math.floor)(originalValue / length) * length;

            if (newValue == originalValue) {
                newValue = Math.max(newValue + length * (isIndent ? 1 : -1), 0);
            }

            if (isRtl) {
                format.marginRight = newValue + 'px';
            } else {
                format.marginLeft = newValue + 'px';
            }
        }
    });

    return paragraphOrListItem.length > 0;
}
