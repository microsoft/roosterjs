import { ContentModelEntity } from '../../publicTypes/entity/ContentModelEntity';
import { Entity } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function createEntity(entity: Entity): ContentModelEntity {
    const { id, type, isReadonly, wrapper } = entity;

    return {
        segmentType: 'Entity',
        blockType: 'Entity',
        format: {},
        id,
        type,
        isReadonly,
        wrapper,
    };
}
