import getNodeAtCursor from '../cursor/getNodeAtCursor';
import { ContentScope, FormatState, ListState, NodeType, PluginEvent } from 'roosterjs-types';
import {
    ImageInlineElement,
    LinkInlineElement,
    PartialInlineElement,
    getComputedStyle,
} from 'roosterjs-dom';
import { Editor } from 'roosterjs-core';
import { getListStateAtNode } from './cacheGetListState';

// Get certain style of a node
// useComputed controls from where to get the style, from computed style or crawl DOM tree to find inline style
// attached to a node. Use case:
// font-family, can use the computed style. Suppose that is more efficient
// font-size, the browser computed style use px, i.e. even though you set font-size to be 12pt, the computed style will
// be something like 14.399px. So for font-size, we should do the DOM tree crawl (useComputed = false)
function getStyleAtNode(
    editor: Editor,
    node: Node,
    styleName: string,
    useComputed: boolean = true
): string {
    let styleValue = '';
    let startNode = node && node.nodeType == NodeType.Text ? node.parentNode : node;
    if (useComputed) {
        styleValue = getComputedStyle(node, styleName);
    } else {
        while (startNode && editor.contains(startNode)) {
            let styles = (startNode as HTMLElement).style;
            let style = styles ? styles.getPropertyValue(styleName) : '';
            if (style && style.trim()) {
                styleValue = style;
                break;
            }
            startNode = startNode.parentNode;
        }
    }

    return styleValue;
}

// Query command state, used for query Bold, Italic, Underline state
function queryCommandState(editor: Editor, command: string): boolean {
    return editor.getDocument().queryCommandState(command);
}

// Get format state
export default function getFormatState(editor: Editor, event?: PluginEvent): FormatState {
    // TODO: ideally format status, together with its formatter (i.e. addImageAltText) in FormatUtils.ts should be moved out of RoosterJS
    // and implemented as an extension API outside RoosterJS. For the moment, let's let it sit here
    let canUnlink = false;
    let canAddImageAltText = false;
    let range = editor.getSelectionRange();
    if (range) {
        if (range.collapsed) {
            // Check if startContainer points at a link
            // No need to check canAddImageAltText as image alt text can be added for non-collapsed selection
            let node = range.startContainer;
            if (node.nodeType == NodeType.Text) {
                node = node.parentNode;
            }
            let inline = editor.getInlineElementAtNode(node);
            canUnlink = inline && inline instanceof LinkInlineElement ? true : false;
        } else {
            // Check if selection contains any link or image and set canUnlink and canAddImageAltText correspondingly
            let contentTraverser = editor.getContentTraverser(ContentScope.Selection);
            let startInline = contentTraverser.currentInlineElement;
            while (startInline) {
                if (
                    !canUnlink &&
                    (startInline instanceof LinkInlineElement ||
                        (startInline instanceof PartialInlineElement &&
                            (startInline as PartialInlineElement).getDecoratedInline() instanceof
                                LinkInlineElement))
                ) {
                    canUnlink = true;
                } else if (!canAddImageAltText && startInline instanceof ImageInlineElement) {
                    canAddImageAltText = true;
                }

                if (canUnlink && canAddImageAltText) {
                    break;
                }
                startInline = contentTraverser.getNextInlineElement();
            }
        }
    }

    // TODO: for background and color, shall we also use computed style?
    // TODO: for font size, we're not using computed style since it will size in PX while we want PT
    // We could possibly introduce some convertion from PX to PT so we can also use computed style
    // TODO: for BIU etc., we're using queryCommandState. Reason is users may do a Bold without first selecting anything
    // in that case, the change is not DOM and querying DOM won't give us anything. queryCommandState can read into browser
    // to figure out the state. It can be discussed if there is a better way since it has been seen that queryCommandState may throw error
    let nodeAtCursor = getNodeAtCursor(editor);
    let listState = nodeAtCursor ? getListStateAtNode(editor, nodeAtCursor) : null;
    let isBullet = listState && listState == ListState.Bullets ? true : false;
    let isNumbering = listState && listState == ListState.Numbering ? true : false;
    return nodeAtCursor
        ? {
              fontName: getStyleAtNode(editor, nodeAtCursor, 'font-family', true /* useComputed*/),
              fontSize: getStyleAtNode(editor, nodeAtCursor, 'font-size', false /* useComputed*/),
              isBold: queryCommandState(editor, 'bold'),
              isItalic: queryCommandState(editor, 'italic'),
              isUnderline: queryCommandState(editor, 'underline'),
              isStrikeThrough: queryCommandState(editor, 'strikeThrough'),
              isSubscript: queryCommandState(editor, 'subscript'),
              isSuperscript: queryCommandState(editor, 'superscript'),
              backgroundColor: getStyleAtNode(
                  editor,
                  nodeAtCursor,
                  'background-color',
                  true /* useComputed*/
              ),
              textColor: getStyleAtNode(editor, nodeAtCursor, 'color', true /* useComputed*/),
              isBullet: isBullet,
              isNumbering: isNumbering,
              canUnlink: canUnlink,
              canAddImageAltText: canAddImageAltText,
              canUndo: editor.canUndo(),
              canRedo: editor.canRedo(),
          }
        : null;
}
