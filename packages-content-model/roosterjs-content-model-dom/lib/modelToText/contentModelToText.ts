import type { ContentModelBlockGroup, ContentModelDocument } from 'roosterjs-content-model-types';

/**
 * Convert Content Model to plain text
 * @param model The source Content Model
 * @param [separator='\r\n'] The separator string used for connect lines
 */
export function contentModelToText(
    model: ContentModelDocument,
    separator: string = '\r\n'
): string {
    const textArray: string[] = [];

    contentModelToTextArray(model, textArray);

    return textArray.join(separator);
}

function contentModelToTextArray(group: ContentModelBlockGroup, textArray: string[]) {
    group.blocks.forEach(block => {
        switch (block.blockType) {
            case 'Paragraph':
                let text = '';

                block.segments.forEach(segment => {
                    switch (segment.segmentType) {
                        case 'Br':
                            textArray.push(text);
                            text = '';
                            break;

                        case 'Entity':
                            text += segment.wrapper.textContent || '';
                            break;

                        case 'General':
                            text += segment.element.textContent || '';
                            break;

                        case 'Text':
                            text += segment.text;
                            break;

                        case 'Image':
                            text += ' ';
                            break;
                    }
                });
                textArray.push(text);
                break;

            case 'Divider':
            case 'Entity':
                textArray.push('');
                break;

            case 'Table':
                block.rows.forEach(row =>
                    row.cells.forEach(cell => {
                        contentModelToTextArray(cell, textArray);
                    })
                );
                break;

            case 'BlockGroup':
                contentModelToTextArray(block, textArray);
                break;
        }
    });
}
