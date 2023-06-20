import { ContentModelEntity, ContentModelSegmentFormat } from 'roosterjs-content-model-types';

/**
 * @internal
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
