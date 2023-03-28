import {
    isNodeEmpty,
    cacheGetEventData,
    safeInstanceOf,
    splitBalancedNodeRange,
    unwrap,
} from 'roosterjs-editor-dom';
import {
    BuildInEditFeature,
    PluginKeyboardEvent,
    Keys,
    IEditor,
    PositionType,
    CodeFeatureSettings,
} from 'roosterjs-editor-types';

const RemoveCodeWhenEnterOnEmptyLine: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.ENTER],
    shouldHandleEvent: (event, editor) => {
        const childOfCode = cacheGetCodeChild(event, editor);
        return childOfCode && isNodeEmpty(childOfCode);
    },
    handleEvent: (event, editor) => {
        event.rawEvent.preventDefault();
        editor.addUndoSnapshot(
            () => {
                splitCode(event, editor);
            },
            null /* changeSource */,
            true /* canUndoByBackspace */
        );
    },
};

const RemoveCodeWhenBackspaceOnEmptyFirstLine: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.BACKSPACE],
    shouldHandleEvent: (event, editor) => {
        const childOfCode = cacheGetCodeChild(event, editor);
        return childOfCode && isNodeEmpty(childOfCode) && !childOfCode.previousSibling;
    },
    handleEvent: (event, editor) => {
        event.rawEvent.preventDefault();
        editor.addUndoSnapshot(() => splitCode(event, editor));
    },
};

function cacheGetCodeChild(event: PluginKeyboardEvent, editor: IEditor): Node | null {
    return cacheGetEventData(event, 'CODE_CHILD', () => {
        const codeElement = editor.getElementAtCursor('code');
        if (codeElement) {
            const pos = editor.getFocusedPosition();
            const block = pos && editor.getBlockElementAtNode(pos.normalize().node);
            if (block) {
                const node =
                    block.getStartNode() == codeElement.parentNode
                        ? block.getStartNode()
                        : block.collapseToSingleElement();
                return isNodeEmpty(node) ? node : null;
            }
        }

        return null;
    });
}

function splitCode(event: PluginKeyboardEvent, editor: IEditor) {
    const currentContainer = cacheGetCodeChild(event, editor);
    if (!safeInstanceOf(currentContainer, 'HTMLElement')) {
        return;
    }
    const codeChild = currentContainer.querySelector('code');
    if (!codeChild) {
        const codeParent = splitBalancedNodeRange(currentContainer);
        unwrap(codeParent);
        const preParent = splitBalancedNodeRange(currentContainer);
        unwrap(preParent);
    } else {
        //Content model
        unwrap(codeChild);
    }
    editor.select(currentContainer, PositionType.Begin);
}

export const CodeFeatures: Record<
    keyof CodeFeatureSettings,
    BuildInEditFeature<PluginKeyboardEvent>
> = {
    removeCodeWhenEnterOnEmptyLine: RemoveCodeWhenEnterOnEmptyLine,
    removeCodeWhenBackspaceOnEmptyFirstLine: RemoveCodeWhenBackspaceOnEmptyFirstLine,
};
