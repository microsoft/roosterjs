import { mutateBlock } from 'roosterjs-content-model-dom';
import type { ContentModelText, ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const wordContextualAlternatesTextProcessor: ElementProcessor<Text> = (
    group,
    textNode,
    context
) => {
    const previous = group.blocks[group.blocks.length - 1];
    const start = previous?.blockType == 'Paragraph' ? previous.segments.length : 0;
    context.defaultElementProcessors.textWithSelection(group, textNode, context);
    const lastBlock = group.blocks[group.blocks.length - 1];
    if (lastBlock?.blockType != 'Paragraph') {
        return;
    }
    const paragraph = mutateBlock(lastBlock);
    const added = paragraph.segments.slice(start);
    added.forEach(segment => {
        if (
            segment.segmentType == 'Text' &&
            segment.format.wordContextualAlternates == '"calt" 0'
        ) {
            // Word forces calt for Ethiopic, independently of the exported run setting.
            const script = new RegExp('(?:\\p{Script=Ethiopic}\\p{Mark}*)+', 'gu');
            const replacements: ContentModelText[] = [];
            let match: RegExpExecArray | null;
            let offset = 0;
            while ((match = script.exec(segment.text))) {
                if (match.index > offset) {
                    replacements.push({
                        ...segment,
                        text: segment.text.slice(offset, match.index),
                    });
                }
                replacements.push({
                    ...segment,
                    text: match[0],
                    format: { ...segment.format, wordContextualAlternates: '"calt" 1' },
                });
                offset = match.index + match[0].length;
            }
            if (replacements.length) {
                if (offset < segment.text.length) {
                    replacements.push({ ...segment, text: segment.text.slice(offset) });
                }
                const index = paragraph.segments.indexOf(segment);
                paragraph.segments.splice(index, 1, ...replacements);
            }
        }
    });
};
