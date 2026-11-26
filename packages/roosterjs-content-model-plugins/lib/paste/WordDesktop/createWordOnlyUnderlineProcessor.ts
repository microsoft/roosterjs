import { createWordCssLookup } from './createWordCssLookup';
import type { FormatParser, UnderlineFormat, ValueSanitizer } from 'roosterjs-content-model-types';

type UnderlineMode = 'none' | 'single' | 'words';

/**
 * @internal
 * Resolve Word's word-only underline into standard, editable text runs.
 */
export function createWordOnlyUnderlineProcessor(
    html: string,
    styleSanitizers?: Readonly<Record<string, ValueSanitizer>>
) {
    const getNativeStyles = createWordCssLookup(html, ['text-underline']);
    const processed = new WeakSet<HTMLElement>();
    const resolved = new WeakMap<HTMLElement, boolean>();
    const nativeMode = (element: HTMLElement) =>
        getNativeStyles(element)['text-underline']?.trim().toLowerCase();

    const processElement = (element: HTMLElement, inheritedUnderline: boolean) => {
        if (
            processed.has(element) ||
            !/^(P|H[1-6]|SPAN|U|B|I|A|S|STRIKE|STRONG|EM|FONT|SUP|SUB)$/.test(element.tagName)
        ) {
            return;
        }
        if (
            nativeMode(element) != 'words' &&
            !Array.from(element.querySelectorAll<HTMLElement>('*')).some(
                child => nativeMode(child) == 'words'
            )
        ) {
            return;
        }

        const visit = (current: HTMLElement, inheritedMode: UnderlineMode) => {
            if (
                current.namespaceURI != 'http://www.w3.org/1999/xhtml' ||
                current.contentEditable == 'false'
            ) {
                return;
            }
            processed.add(current);
            const native = nativeMode(current);
            const decoration = current.style.textDecorationLine;
            let mode = inheritedMode;
            if (
                decoration.includes('underline') ||
                current.tagName == 'U' ||
                current.tagName == 'A'
            ) {
                mode = 'single';
            }
            if (native == 'words') {
                mode = 'words';
            } else if (native == 'none' || native == 'initial') {
                mode = 'none';
            } else if (
                native &&
                native != 'inherit' &&
                native != 'unset' &&
                /^(single|double|wave|dash|dotted|thick)$/.test(native)
            ) {
                mode = 'single';
            }
            if (decoration == 'none') {
                mode = 'none';
            }

            // Keep native declarations intact; CSSStyleDeclaration mutation can erase them.
            if (
                decoration.includes('underline') ||
                current.tagName == 'U' ||
                current.tagName == 'A'
            ) {
                const remaining = decoration
                    .split(/\s+/)
                    .filter(value => value && value != 'underline')
                    .join(' ');
                current.setAttribute(
                    'style',
                    (current.getAttribute('style') || '') +
                        ';text-decoration-line:' +
                        (remaining || 'none')
                );
            }
            resolved.set(current, false);
            for (const child of Array.from(current.childNodes)) {
                if (child.nodeType == 1) {
                    visit(child as HTMLElement, mode);
                } else if (child.nodeType == 3 && child.nodeValue) {
                    const text = child.nodeValue;
                    const parts = mode == 'words' ? text.match(/\s+|\S+/gu)! : [text];
                    for (const part of parts) {
                        const span = current.ownerDocument.createElement('span');
                        if (mode == 'words' && !/\S/u.test(part) && part.includes('\u00a0')) {
                            span.dataset.roosterPreserveNbsp = 'true';
                        }
                        const underline = mode == 'single' || (mode == 'words' && /\S/u.test(part));
                        const value = underline ? 'underline' : 'none';
                        let sanitized: string | null = value;
                        for (const name of ['text-decoration', 'text-decoration-line']) {
                            const sanitizer = styleSanitizers?.[name];
                            if (sanitized !== null) {
                                sanitized =
                                    typeof sanitizer == 'function'
                                        ? sanitizer(sanitized, 'SPAN')
                                        : sanitizer === false
                                        ? null
                                        : sanitized;
                            }
                        }
                        span.style.textDecoration = sanitized || 'none';
                        resolved.set(span, span.style.textDecorationLine.includes('underline'));
                        processed.add(span);
                        span.appendChild(current.ownerDocument.createTextNode(part));
                        current.insertBefore(span, child);
                    }
                    current.removeChild(child);
                }
            }
        };
        visit(element, inheritedUnderline ? 'single' : 'none');
    };

    const parseUnderline: FormatParser<UnderlineFormat> = (format, element) => {
        const underline = resolved.get(element);
        if (underline !== undefined) {
            format.underline = underline;
        }
    };
    return { processElement, parseUnderline };
}
