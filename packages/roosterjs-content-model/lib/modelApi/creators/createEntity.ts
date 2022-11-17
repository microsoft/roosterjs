import { ContentModelEntity } from '../../publicTypes/entity/ContentModelEntity';
import { ContentModelSegmentFormat } from 'roosterjs-content-model/lib/publicTypes/format/ContentModelSegmentFormat';
import { Entity } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function createEntity(
    entity: Entity,
    segmentFormat?: ContentModelSegmentFormat
): ContentModelEntity {
    const { id, type, isReadonly, wrapper } = entity;

    return {
        segmentType: 'Entity',
        blockType: 'Entity',
        format: {
            ...(segmentFormat || {}),
        },
        id,
        type,
        isReadonly,
        wrapper,
    };
}
