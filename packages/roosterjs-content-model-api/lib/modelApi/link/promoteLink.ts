import { getLinkUrl } from './getLinkUrl';
import { splitTextSegment } from '../../publicApi/segment/splitTextSegment';
import type {
    AutoLinkOptions,
    ContentModelText,
    PromotedLink,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * Promote the given text segment to a hyper link when the segment text is ending with a valid link format.
 * When the whole text segment if of a link, promote the whole segment.
 * When the text segment ends with a link format, split the segment and promote the second part
 * When link is in middle of the text segment, no action.
 * This is mainly used for doing auto link when there is a link before cursor
 * @param segment The text segment to search link text from
 * @param paragraph Parent paragraph of the segment
 * @param options Options of auto link
 * @returns If a link is promoted, return this segment. Otherwise return null
 */
export function promoteLink(
    segment: ContentModelText,
    paragraph: ShallowMutableContentModelParagraph,
    autoLinkOptions: AutoLinkOptions
): ContentModelText | null {
    if (segment.link) {
        return null;
    }

    const promotedLink = getPromoteLink(segment, autoLinkOptions);

    if (promotedLink) {
        const linkSegment = splitTextSegment(
            segment,
            paragraph,
            segment.text.length - promotedLink.label.trimLeft().length,
            segment.text.trimRight().length
        );
        linkSegment.link = {
            format: {
                href: promotedLink.href,
                underline: true,
            },
            dataset: {},
        };

        return linkSegment;
    }

    return null;
}

/**
 * Verify if the link can be promoted
 * @param segment The text segment to search link text from
 * @param options Options of auto link
 * @returns if a link can be promoted
 */
export function getPromoteLink(
    segment: ContentModelText,
    autoLinkOptions: AutoLinkOptions
): PromotedLink | undefined {
    const link = segment.text.split(' ').pop();
    const url = link?.trim();
    let linkUrl: string | undefined = undefined;
    if (url && link && (linkUrl = getLinkUrl(url, autoLinkOptions))) {
        return {
            label: link,
            href: linkUrl,
        };
    }
    return undefined;
}
