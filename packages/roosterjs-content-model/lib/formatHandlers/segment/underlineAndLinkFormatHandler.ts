import { findClosestElementAncestor, moveChildNodes, safeInstanceOf } from 'roosterjs-editor-dom';
import { FormatHandler } from '../FormatHandler';
import { UnderlineAndLinkFormat } from '../../publicTypes/format/formatParts/UnderlineAndLinkFormat';

/**
 * @internal
 */
export const underlineAndLinkFormatHandler: FormatHandler<UnderlineAndLinkFormat> = {
    parse: (format, element, context, defaultStyle) => {
        const textDecoration = element.style.textDecoration || defaultStyle.textDecoration;

        if (textDecoration?.indexOf('underline')! >= 0) {
            format.underline = true;
        }

        if (safeInstanceOf(element, 'HTMLAnchorElement')) {
            const href = element.getAttribute('href'); // Use getAttribute to get original HREF but not the resolved absolute url
            const target = element.target;
            const rel = element.rel;
            const id = element.id;
            const className = element.className;
            const title = element.title;

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
    apply: (format, element, context) => {
        let isLink = false;

        if (format.href && !findClosestElementAncestor(element, undefined /*root*/, 'a')) {
            isLink = true;
            const a = element.ownerDocument.createElement('a');

            a.href = format.href;

            if (format.target) {
                a.target = format.target;
            }

            if (format.anchorId) {
                a.id = format.anchorId;
            }

            if (format.anchorClass) {
                a.className = format.anchorClass;
            }

            if (format.anchorTitle) {
                a.title = format.anchorTitle;
            }

            if (format.relationship) {
                a.rel = format.relationship;
            }

            moveChildNodes(a, element);
            element.appendChild(a);

            element = a;
        }

        if (format.underline && !isLink) {
            const u = element.ownerDocument.createElement('u');
            moveChildNodes(u, element);
            element.appendChild(u);
        } else if (!format.underline && isLink) {
            element.style.textDecoration = 'none';
        }
    },
};
