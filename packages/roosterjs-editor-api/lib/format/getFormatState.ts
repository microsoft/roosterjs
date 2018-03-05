import { FormatState, ListState, NodeType, PluginEvent } from 'roosterjs-editor-types';
import { getComputedStyle, normalizeEditorPoint } from 'roosterjs-editor-dom';
import { Editor } from 'roosterjs-editor-core';
import cacheGetListState from './cacheGetListState';
import cacheGetHeaderLevel from './cacheGetHeaderLevel';
import queryNodesWithSelection from '../cursor/queryNodesWithSelection';

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

/**
 * Get format state at cursor
 * A format state is a collection of all format related states, e.g.,
 * bold, italic, underline, font name, font size, etc.
 * @param editor The editor
 * @param (Optional) The plugin event, it stores the event cached data for looking up.
 * In this function the event cache is used to get list state and header level. If not passed,
 * it will query the node within selection to get the info
 * @returns The format state at cursor
 */
export default function getFormatState(editor: Editor, event?: PluginEvent): FormatState {
    // TODO: for background and color, shall we also use computed style?
    // TODO: for font size, we're not using computed style since it will size in PX while we want PT
    // We could possibly introduce some convertion from PX to PT so we can also use computed style
    // TODO: for BIU etc., we're using queryCommandState. Reason is users may do a Bold without first selecting anything
    // in that case, the change is not DOM and querying DOM won't give us anything. queryCommandState can read into browser
    // to figure out the state. It can be discussed if there is a better way since it has been seen that queryCommandState may throw error
    let range = editor.getSelectionRange();
    let nodeAtCursor = range ? normalizeEditorPoint(range.startContainer, range.startOffset).containerNode : null;

    if (!nodeAtCursor) {
        return null;
    }

    if (nodeAtCursor.nodeType == NodeType.Text) {
        nodeAtCursor = nodeAtCursor.parentNode;
    }

    let listState = cacheGetListState(editor, event);
    let headerLevel = cacheGetHeaderLevel(editor, event);
    return {
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
        isBullet: listState == ListState.Bullets,
        isNumbering: listState == ListState.Numbering,
        canUnlink: queryNodesWithSelection(editor, 'a[href]').length > 0,
        canAddImageAltText: queryNodesWithSelection(editor, 'img').length > 0,
        canUndo: editor.canUndo(),
        canRedo: editor.canRedo(),
        isBlockQuote: queryNodesWithSelection(editor, 'blockquote').length > 0,
        headerLevel: headerLevel,
    };
}
