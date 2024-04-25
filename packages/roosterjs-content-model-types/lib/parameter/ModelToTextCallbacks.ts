import type { ContentModelBlockGroup } from '../group/ContentModelBlockGroup';
import type { ContentModelDivider } from '../block/ContentModelDivider';
import type { ContentModelEntity } from '../entity/ContentModelEntity';
import type { ContentModelGeneralSegment } from '../segment/ContentModelGeneralSegment';
import type { ContentModelImage } from '../segment/ContentModelImage';
import type { ContentModelParagraph } from '../block/ContentModelParagraph';
import type { ContentModelTable } from '../block/ContentModelTable';
import type { ContentModelText } from '../segment/ContentModelText';

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
