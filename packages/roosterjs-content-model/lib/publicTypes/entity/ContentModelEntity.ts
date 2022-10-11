import { ContentModelBlockBase } from '../block/ContentModelBlockBase';
import { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import { ContentModelSegmentBase } from '../segment/ContentModelSegmentBase';
import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import { Entity } from 'roosterjs-editor-types';

/**
 * Content Model of Entity
 */
export interface ContentModelEntity
    extends ContentModelBlockBase<'Entity', ContentModelBlockFormat & ContentModelSegmentFormat>,
        ContentModelSegmentBase<'Entity', ContentModelBlockFormat & ContentModelSegmentFormat>,
        Entity {}
