import { isElementOfType } from '../../domUtils/isElementOfType';
import type { FormatHandler } from '../FormatHandler';
import type { LinkFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const linkFormatHandler: FormatHandler<LinkFormat> = {
    parse: (format, element) => {
        if (isElementOfType(element, 'a')) {
            const name = element.name;
            const href = element.getAttribute('href'); // Use getAttribute to get original HREF but not the resolved absolute url
            const target = element.target;
            const rel = element.rel;
            const id = element.id;
            const className = element.className;
            const title = element.title;

            if (name) {
                format.name = name;
            }

            if (href) {
                format.href = href;
            }

            if (target) {
                format.target = target;
            }

            if (id) {
                format.anchorId = id;
            }

            if (rel) {
                format.relationship = rel;
            }

            if (title) {
                format.anchorTitle = title;
            }

            if (className) {
                format.anchorClass = className;
            }
        }
    },
    apply: (format, element) => {
        if (isElementOfType(element, 'a') && format.href) {
            element.href = format.href;

            if (format.name) {
                element.name = format.name;
            }

            if (format.target) {
                element.target = format.target;
            }

            if (format.anchorId) {
                element.id = format.anchorId;
            }

            if (format.anchorClass) {
                element.className = format.anchorClass;
            }

            if (format.anchorTitle) {
                element.title = format.anchorTitle;
            }

            if (format.relationship) {
                element.rel = format.relationship;
            }
        }
    },
};
