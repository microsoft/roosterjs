import type { ContentModelEntity, ContentModelSegmentFormat } from 'roosterjs-content-model-types';

/**
 * Create a ContentModelEntity model
 * @param wrapper Wrapper element of this entity
 * @param isReadonly Whether this is a readonly entity
 * @param type @optional Type of this entity
 * @param segmentFormat @optional Segment format of this entity
 * @param id @optional Id of this entity
 */
export function createEntity(
    wrapper: HTMLElement,
    segmentFormat?: ContentModelSegmentFormat,
    isReadonly?: boolean,
    type?: string,
    id?: string
): ContentModelEntity {
    return {
        segmentType: 'Entity',
        blockType: 'Entity',
        format: { ...segmentFormat },
        entityFormat: {
            id,
            type,
            isReadonly,
        },
        wrapper,
    };
}
