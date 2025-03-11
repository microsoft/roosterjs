import { createMarkdownBlockGroup } from '../creators/createMarkdownBlockGroup';
import { createMarkdownParagraph } from '../creators/createMarkdownParagraph';
import { createMarkdownTable } from '../creators/createMarkdownTable';
import type { ListCounter } from '../creators/createMarkdownBlockGroup';
import type { ContentModelDocument } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function modelProcessor(model: ContentModelDocument) {
    let markdown = '';
    const listCounter: ListCounter = {
        listItemCount: 0,
        subListItemCount: 0,
    };
    for (const block of model.blocks) {
        const isListItem = block.blockType === 'BlockGroup' && block.blockGroupType === 'ListItem';
        if (!isListItem && (listCounter.listItemCount > 0 || listCounter.subListItemCount > 0)) {
            listCounter.listItemCount = 0;
            listCounter.subListItemCount = 0;
            markdown += '\n';
        }

        switch (block.blockType) {
            case 'Paragraph':
                markdown += createMarkdownParagraph(block) + '\n\n';
                break;
            case 'BlockGroup':
                markdown += createMarkdownBlockGroup(block, listCounter);
                break;
            case 'Table':
                markdown += createMarkdownTable(block, listCounter) + '\n';
                break;
            case 'Divider':
                markdown += '---\n\n';
                break;
            default:
                // Ignore other block types
                break;
        }
    }

    return markdown;
}
