import {
    ContentModelCode,
    ContentModelLink,
    ContentModelSegment,
    DomToModelDecoratorContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function addLink(segment: ContentModelSegment, link: ContentModelLink) {
    if (link.format.href) {
        segment.link = {
            format: { ...link.format },
            dataset: { ...link.dataset },
        };
    }
}

/**
 * @internal
 */
export function addCode(segment: ContentModelSegment, code: ContentModelCode) {
    if (code.format.fontFamily) {
        segment.code = {
            format: { ...code.format },
        };
    }
}

/**
 * @internal
 */
export function addDecorators(segment: ContentModelSegment, context: DomToModelDecoratorContext) {
    addLink(segment, context.link);
    addCode(segment, context.code);
}
