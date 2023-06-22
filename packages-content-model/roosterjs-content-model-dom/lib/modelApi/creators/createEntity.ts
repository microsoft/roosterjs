import { ContentModelEntity, ContentModelSegmentFormat } from 'roosterjs-content-model-types';

/**
 * Create a ContentModelEntity model
 * @param wrapper Wrapper element of this entity
 * @param isReadonly Whether this is a readonly entity
 * @param segmentFormat Segment format of this entity
 * @param id @optional Id of this entity
 * @param type @optional Type of this entity
 */
export function createEntity(
    wrapper: HTMLElement,
    isReadonly: boolean,
    segmentFormat?: ContentModelSegmentFormat,
    id?: string,
    type?: string
): ContentModelEntity {
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
