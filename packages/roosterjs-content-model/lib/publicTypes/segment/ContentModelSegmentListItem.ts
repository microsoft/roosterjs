import { ContentModelListItemFormat } from '../format/ContentModelListItemFormat';
import { ContentModelSegmentBase } from './ContentModelSegmentBase';

/**
 * Content Model of horizontal divider
 */
export interface ContentModelSegmentListItem
    extends ContentModelListItemFormat,
        ContentModelSegmentBase<'Li'> {}
