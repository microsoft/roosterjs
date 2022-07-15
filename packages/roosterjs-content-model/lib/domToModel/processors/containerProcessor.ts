import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { generalBlockProcessor } from './generalBlockProcessor';
import { generalSegmentProcessor } from './generalSegmentProcessor';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { NodeType } from 'roosterjs-editor-types';
import { textProcessor } from './textProcessor';

/**
 * @internal
 * https://www.w3schools.com/cssref/pr_class_display.asp
 */
export const BlockDisplay = ['block', 'flex', 'grid', 'list-item'];

// const InlineDisplay = [
//     'inline',
//     'inline-block',
//     'inline-flex',
//     'inline-grid',
//     'inline-table',
//     'contents',
// ];

// const OtherDisplay = [
//     'table',
//     'table-caption',
//     'table-column-group',
//     'table-header-group',
//     'table-footer-group',
//     'table-row-group',
//     'table-cell',
//     'table-column',
//     'table-row',
//     'run-in',
//     'initial',
//     'none',
// ];

/**
 * @internal
 */
export function containerProcessor(group: ContentModelBlockGroup, parent: Node) {
    for (let child = parent.firstChild; child; child = child.nextSibling) {
        if (isNodeOfType(child, NodeType.Element)) {
            const processor =
                BlockDisplay.indexOf(child.style.display || '') >= 0
                    ? generalBlockProcessor
                    : generalSegmentProcessor;

            processor(group, child, {});
        } else if (isNodeOfType(child, NodeType.Text)) {
            const textNode = child as Text;

            let txt = textNode.nodeValue || '';

            textProcessor(group, txt);
        }
    }
}
