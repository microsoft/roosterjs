import { ContentModelBlockBase } from '../block/ContentModelBlockBase';
import { ContentModelSegmentBase } from '../segment/ContentModelSegmentBase';
import { Entity } from 'roosterjs-editor-types';

/**
 * Content Model of Entity
 */
export interface ContentModelEntity
    extends ContentModelBlockBase<'Entity'>,
        ContentModelSegmentBase<'Entity'>,
        Entity {}
