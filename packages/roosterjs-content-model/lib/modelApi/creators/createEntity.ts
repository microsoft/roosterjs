import { ContentModelEntity } from '../../publicTypes/entity/ContentModelEntity';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';

/**
 * @internal
 */
export function createEntity(
    wrapper: HTMLElement,
    segmentFormat?: ContentModelSegmentFormat,
    id?: string,
    type?: string,
    isReadonly?: boolean
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
