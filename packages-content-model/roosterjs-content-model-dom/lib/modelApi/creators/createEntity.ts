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
    isReadonly: boolean,
    type?: string,
    segmentFormat?: ContentModelSegmentFormat,
    id?: string
): ContentModelEntity {
    return {
        segmentType: 'Entity',
        blockType: 'Entity',
        format: { ...segmentFormat },
        id,
        type,
        isReadonly,
        wrapper,
    };
}
