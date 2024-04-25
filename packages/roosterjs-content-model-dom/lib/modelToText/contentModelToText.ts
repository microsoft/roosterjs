import type {
    ContentModelBlockGroup,
    ContentModelDocument,
    ModelToTextCallbacks,
} from 'roosterjs-content-model-types';

const TextForHR = '________________________________________';
const defaultCallbacks: Required<ModelToTextCallbacks> = {
    onDivider: divider => (divider.tagName == 'hr' ? TextForHR : ''),
    onEntityBlock: () => '',
    onEntitySegment: entity => entity.wrapper.textContent ?? '',
    onGeneralSegment: segment => segment.element.textContent ?? '',
    onImage: () => ' ',
    onText: text => text.text,
    onParagraph: () => true,
    onTable: () => true,
    onBlockGroup: () => true,
};

/**
 * Convert Content Model to plain text
 * @param model The source Content Model
 * @param [separator='\r\n'] The separator string used for connect lines
 * @param callbacks  Callbacks to customize the behavior of contentModelToText function
 */
export function contentModelToText(
    model: ContentModelDocument,
    separator: string = '\r\n',
    callbacks?: ModelToTextCallbacks
): string {
    const textArray: string[] = [];
    const fullCallbacks = Object.assign({}, defaultCallbacks, callbacks);

    contentModelToTextArray(model, textArray, fullCallbacks);

    return textArray.join(separator);
}

function contentModelToTextArray(
    group: ContentModelBlockGroup,
    textArray: string[],
    callbacks: Required<ModelToTextCallbacks>
) {
    if (callbacks.onBlockGroup(group)) {
        group.blocks.forEach(block => {
            switch (block.blockType) {
                case 'Paragraph':
                    if (callbacks.onParagraph(block)) {
                        let text = '';

                        block.segments.forEach(segment => {
                            switch (segment.segmentType) {
                                case 'Br':
                                    textArray.push(text);
                                    text = '';
                                    break;

                                case 'Entity':
                                    text += callbacks.onEntitySegment(segment);
                                    break;

                                case 'General':
                                    text += callbacks.onGeneralSegment(segment);
                                    break;

                                case 'Text':
                                    text += callbacks.onText(segment);
                                    break;

                                case 'Image':
                                    text += callbacks.onImage(segment);
                                    break;
                            }
                        });

                        if (text) {
                            textArray.push(text);
                        }
                    }

                    break;

                case 'Divider':
                    textArray.push(callbacks.onDivider(block));
                    break;
                case 'Entity':
                    textArray.push(callbacks.onEntityBlock(block));
                    break;

                case 'Table':
                    if (callbacks.onTable(block)) {
                        block.rows.forEach(row =>
                            row.cells.forEach(cell => {
                                contentModelToTextArray(cell, textArray, callbacks);
                            })
                        );
                    }
                    break;

                case 'BlockGroup':
                    contentModelToTextArray(block, textArray, callbacks);
                    break;
            }
        });
    }
}
