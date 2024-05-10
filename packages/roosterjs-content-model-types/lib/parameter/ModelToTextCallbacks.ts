import type { ReadonlyContentModelBlockGroup } from '../contentModel/blockGroup/ContentModelBlockGroup';
import type { ReadonlyContentModelDivider } from '../contentModel/block/ContentModelDivider';
import type { ReadonlyContentModelEntity } from '../contentModel/entity/ContentModelEntity';
import type { ReadonlyContentModelGeneralSegment } from '../contentModel/segment/ContentModelGeneralSegment';
import type { ReadonlyContentModelImage } from '../contentModel/segment/ContentModelImage';
import type { ReadonlyContentModelParagraph } from '../contentModel/block/ContentModelParagraph';
import type { ReadonlyContentModelTable } from '../contentModel/block/ContentModelTable';
import type { ReadonlyContentModelText } from '../contentModel/segment/ContentModelText';

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
    onEntitySegment?: ModelToTextCallback<ReadonlyContentModelEntity>;

    /**
     * Customize the behavior of converting entity block to plain text
     */
    onEntityBlock?: ModelToTextCallback<ReadonlyContentModelEntity>;

    /**
     * Customize the behavior of converting general segment to plain text
     */
    onGeneralSegment?: ModelToTextCallback<ReadonlyContentModelGeneralSegment>;

    /**
     * Customize the behavior of converting text model to plain text
     */
    onText?: ModelToTextCallback<ReadonlyContentModelText>;

    /**
     * Customize the behavior of converting image model to plain text
     */
    onImage?: ModelToTextCallback<ReadonlyContentModelImage>;

    /**
     * Customize the behavior of converting divider model to plain text
     */
    onDivider?: ModelToTextCallback<ReadonlyContentModelDivider>;

    /**
     * Customize the check if we should convert a paragraph model to plain text
     */
    onParagraph?: ModelToTextChecker<ReadonlyContentModelParagraph>;

    /**
     * Customize the check if we should convert a table model to plain text
     */
    onTable?: ModelToTextChecker<ReadonlyContentModelTable>;

    /**
     * Customize the check if we should convert a block group model to plain text
     */
    onBlockGroup?: ModelToTextChecker<ReadonlyContentModelBlockGroup>;
}
