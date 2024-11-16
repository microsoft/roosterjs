import { ContentModelSegmentFormat } from 'roosterjs/lib';
import type { ShallowMutableContentModelParagraph } from '../contentModel/block/ContentModelParagraph';
import type { ReadonlyContentModelBlockGroup } from '../contentModel/blockGroup/ContentModelBlockGroup';
import type { ContentModelText } from '../contentModel/segment/ContentModelText';
import type { BasePluginEvent } from './BasePluginEvent';

/**
 * Provides a chance for plugin to apply additional format when we apply pending format
 */
export interface ApplyPendingFormatEvent extends BasePluginEvent<'applyPendingFormat'> {
    /**
     * The text segment that we are applying default format to
     */
    text: ContentModelText;

    /**
     * The parent paragraph of the given text segment
     */
    paragraph: ShallowMutableContentModelParagraph;

    /**
     * Block group path of the given paragraph
     */
    path: ReadonlyContentModelBlockGroup[];

    /**
     * The segment format that we just applied
     */
    format: Readonly<ContentModelSegmentFormat>;
}
