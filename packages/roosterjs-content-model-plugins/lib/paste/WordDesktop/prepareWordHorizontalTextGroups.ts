import { getStyles } from '../utils/getStyles';
import { isNodeOfType } from 'roosterjs-content-model-dom';

const InlineTags = new Set(['SPAN', 'B', 'I', 'U', 'S', 'STRIKE', 'EM', 'STRONG', 'A', 'FONT']);

/** @internal */
export const WORD_HORIZONTAL_TEXT_GROUP_TAG = 'word-horizontal-text';

/**
 * @internal
 * Keep native uncompressed TNY runs together in one editable horizontal group.
 */
export function prepareWordHorizontalTextGroups(fragment?: ParentNode): WeakSet<HTMLElement> {
    const wrappers = new WeakSet<HTMLElement>();
    const visited = new WeakSet<HTMLElement>();
    fragment?.querySelectorAll<HTMLElement>('[style]').forEach(element => {
        const id = getGroup(element)?.id;
        if (!id || visited.has(element) || !element.parentNode) {
            return;
        }
        const members: HTMLElement[] = [];
        let compressed = false;
        for (
            let next = getGroup(element);
            next && next.id == id;
            next = getGroup(next.element.nextSibling)
        ) {
            const member = next.element;
            members.push(member);
            visited.add(member);
            compressed =
                compressed || getStyles(member)['mso-tny-compress']?.toLowerCase() == 'yes';
            member.querySelectorAll<HTMLElement>('[style]').forEach(descendant => {
                if (getGroup(descendant)?.id == id) {
                    visited.add(descendant);
                    compressed =
                        compressed ||
                        getStyles(descendant)['mso-tny-compress']?.toLowerCase() == 'yes';
                }
            });
        }
        if (!compressed) {
            const wrapper = element.ownerDocument.createElement(WORD_HORIZONTAL_TEXT_GROUP_TAG);
            wrapper.style.writingMode = 'horizontal-tb';
            wrapper.style.display = 'inline-block';
            element.parentNode.insertBefore(wrapper, element);
            members.forEach(member => wrapper.appendChild(member));
            wrappers.add(wrapper);
        }
    });
    return wrappers;
}

function getGroup(node: Node | null): { element: HTMLElement; id: string } | undefined {
    if (!isNodeOfType(node, 'ELEMENT_NODE') || !InlineTags.has(node.tagName)) {
        return undefined;
    }
    const styles = getStyles(node);
    const id = styles['mso-text-combine-id'];
    return styles['layout-flow']?.toLowerCase() == 'horizontal' && id && /^[1-9]\d*$/.test(id)
        ? { element: node, id }
        : undefined;
}
