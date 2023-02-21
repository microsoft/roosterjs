import { ContentModelSegmentBase } from './ContentModelSegmentBase';

/**
 * Content Model for Text
 */
export interface ContentModelStyledText extends ContentModelSegmentBase<'StyledText'> {
    styleName: string;

    /**
     * Text content of this segment
     */
    text: string;
}
