import { ContentModelBlockBase } from '../block/ContentModelBlockBase';
import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';

/**
 * Content Model group for Code element
 */
export interface ContentModelCode
    extends ContentModelBlockGroupBase<'Code'>,
        ContentModelBlockBase<'BlockGroup'> {}
