import type { ContentModelEntity, ContentModelSegmentFormat } from 'roosterjs-content-model-types';

/**
 * Create a ContentModelEntity model
 * @param wrapper Wrapper element of this entity
 * @param isReadonly Whether this is a readonly entity @default true
 * @param segmentFormat @optional Segment format of this entity
 * @param type @optional Type of this entity
 * @param id @optional Id of this entity
 * @param isBlock @optional Whether the entity will be a block
 */
export function createEntity(
    wrapper: HTMLElement,
    isReadonly: boolean = true,
    segmentFormat?: ContentModelSegmentFormat,
    type?: string,
    id?: string,
    isBlock?: boolean
): ContentModelEntity {
    return {
        segmentType: 'Entity',
        blockType: 'Entity',
        format: { ...segmentFormat },
        entityFormat: {
            id,
            entityType: type,
            isReadonly,
            ...(isBlock ? { isBlock } : {}),
        },

        wrapper,
    };
}
