import type {
    ContentModelBlockGroup,
    ContentModelDivider,
    ContentModelDocument,
    ContentModelEntity,
    ContentModelGeneralSegment,
    ContentModelImage,
    ContentModelParagraph,
    ContentModelTable,
    ContentModelText,
} from 'roosterjs-content-model-types';

const TextForHR = '________________________________________';

/**
 * Callback function type for converting a given Content Model object to plain text
 * @param model The source model object to be converted to plain text
 */
export type ModelToTextCallback<T> = (model: T) => string;

/**
 * Callback function type for checking if we should convert to text for the given content model object
 * @param model The source model to check if we should convert it to plain text
 */
export type ModelToTextChecker<T> = (model: T) => boolean;

/**
 * Callbacks to customize the behavior of contentModelToText function
 */
export interface ModelToTextCallbacks {
    /**
     * Customize the behavior of converting entity segment to plain text
     */
    onEntitySegment?: ModelToTextCallback<ContentModelEntity>;

    /**
     * Customize the behavior of converting entity block to plain text
     */
    onEntityBlock?: ModelToTextCallback<ContentModelEntity>;

    /**
     * Customize the behavior of converting general segment to plain text
     */
    onGeneralSegment?: ModelToTextCallback<ContentModelGeneralSegment>;

    /**
     * Customize the behavior of converting text model to plain text
     */
    onText?: ModelToTextCallback<ContentModelText>;

    /**
     * Customize the behavior of converting image model to plain text
     */
    onImage?: ModelToTextCallback<ContentModelImage>;

    /**
     * Customize the behavior of converting divider model to plain text
     */
    onDivider?: ModelToTextCallback<ContentModelDivider>;

    /**
     * Customize the check if we should convert a paragraph model to plain text
     */
    onParagraph?: ModelToTextChecker<ContentModelParagraph>;

    /**
     * Customize the check if we should convert a table model to plain text
     */
    onTable?: ModelToTextChecker<ContentModelTable>;

    /**
     * Customize the check if we should convert a block group model to plain text
     */
    onBlockGroup?: ModelToTextChecker<ContentModelBlockGroup>;
}

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
