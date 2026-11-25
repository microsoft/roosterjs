import type { IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 * Keep pasted destinations unique without changing references to destinations outside the paste.
 */
export function reconcilePasteBookmarks(
    editor: IEditor,
    fragment: DocumentFragment,
    isSelectionReplaced: boolean = true
) {
    const targets = Array.from(fragment.querySelectorAll('[id],a[name]'));

    if (targets.length == 0) {
        return;
    }

    const helper = editor.getDOMHelper();
    const selection = editor.getDOMSelection();
    const range = isSelectionReplaced && selection?.type == 'range' ? selection.range : undefined;
    const used = new Set<string>();
    const existing = new Set([
        ...Array.from(editor.getDocument().querySelectorAll('[id],a[name]')),
        ...helper.queryElements('[id],a[name]'),
    ]);

    existing.forEach(element => {
        let isReplaced = false;

        if (range && !range.collapsed && helper.isNodeInEditor(element, true)) {
            const elementRange = editor.getDocument().createRange();

            elementRange.selectNode(element);
            isReplaced =
                range.compareBoundaryPoints(Range.START_TO_START, elementRange) <= 0 &&
                range.compareBoundaryPoints(Range.END_TO_END, elementRange) >= 0;
        }

        if (!isReplaced) {
            getKeys(element).forEach(key => used.add(key));
        }
    });

    const rootId = helper.getDomAttribute('id');

    if (rootId) {
        used.add(rootId);
    }

    const reserved = new Set(used);

    targets.forEach(element => getKeys(element).forEach(key => reserved.add(key)));
    const firstTargets = new Map<string, Element>();
    const replacements = new Map<string, string>();

    // Browser fragment lookup prefers the first ID, then the first named anchor.
    ['id', 'name'].forEach(attribute => {
        targets.forEach(element => {
            const key =
                attribute == 'name' && element.tagName != 'A'
                    ? null
                    : element.getAttribute(attribute);

            if (key && !firstTargets.has(key)) {
                firstTargets.set(key, element);
            }
        });
    });

    targets.forEach(element => {
        const aliases = new Map<string, string>();

        ['id', 'name'].forEach(attribute => {
            const key =
                attribute == 'name' && element.tagName != 'A'
                    ? null
                    : element.getAttribute(attribute);

            if (key) {
                let replacement = aliases.get(key);

                if (!replacement) {
                    replacement = key;
                    let suffix = 0;

                    if (used.has(replacement)) {
                        do {
                            replacement = key + '_' + suffix++;
                        } while (reserved.has(replacement));
                    }

                    aliases.set(key, replacement);
                    used.add(replacement);
                    reserved.add(replacement);
                }

                if (firstTargets.get(key) == element) {
                    replacements.set(key, replacement);
                }

                if (replacement != key) {
                    element.setAttribute(attribute, replacement);
                }
            }
        });
    });

    fragment.querySelectorAll('a[href]').forEach(anchor => {
        const href = anchor.getAttribute('href')!;

        if (href[0] == '#') {
            const key = decodeFragment(href.substring(1));
            const replacement = key === null ? undefined : replacements.get(key);

            if (replacement && replacement != key) {
                anchor.setAttribute('href', '#' + encodeURIComponent(replacement));
            }
        }
    });
}

function getKeys(element: Element): string[] {
    return [element.id, element.tagName == 'A' ? element.getAttribute('name') : null].filter(
        (value): value is string => !!value
    );
}

function decodeFragment(value: string): string | null {
    try {
        return decodeURIComponent(value);
    } catch (error) {
        if (error instanceof URIError) {
            // A malformed encoded fragment has no safely identifiable destination to remap.
            return null;
        }

        throw error;
    }
}
