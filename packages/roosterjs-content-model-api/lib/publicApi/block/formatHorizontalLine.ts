import { iterateSelections, mutateBlock } from 'roosterjs-content-model-dom';
import type { ContentModelDividerFormat, IEditor } from 'roosterjs-content-model-types';

/**
 * Apply a partial format to selected horizontal lines, preserving unspecified properties.
 * Only HR dividers are formatted; other selected content is unchanged.
 * @param editor The editor instance
 * @param format The divider format to apply. Use width and height for CSS dimensions,
 * borderTop/borderRight/borderBottom/borderLeft and backgroundColor for color,
 * and marginLeft/marginRight for alignment (0/auto for left, auto/auto for center,
 * auto/0 for right).
 */
export function formatHorizontalLine(editor: IEditor, format: ContentModelDividerFormat) {
    editor.focus();

    editor.formatContentModel(
        model => {
            let changed = false;

            iterateSelections(model, (path, table, block) => {
                if (block?.blockType == 'Divider' && block.tagName == 'hr') {
                    const divider = mutateBlock(block);
                    divider.format = { ...divider.format, ...format };
                    changed = true;
                }
            });

            return changed;
        },
        {
            apiName: 'formatHorizontalLine',
        }
    );
}
