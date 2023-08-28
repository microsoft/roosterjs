import { ContentModelCachePluginState } from '../../publicTypes/pluginState/ContentModelCachePluginState';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { isNodeOfType } from 'roosterjs-content-model-dom';
import { reconcileCachedSelection } from '../utils/modelCache';
import {
    Coordinates,
    IEditor,
    NodeType,
    PluginEvent,
    PluginEventType,
    PluginWithState,
    SelectionRangeEx,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';

/**
 * @internal
 */
export class ContentModelCachePlugin implements PluginWithState<ContentModelCachePluginState> {
    private state: ContentModelCachePluginState;
    private editor: IContentModelEditor | null = null;

    constructor() {
        this.state = {
            index: {},
            nextSequenceNumber: 0,
            isUpdatingRange: false,
        };
    }

    getState(): ContentModelCachePluginState {
        return this.state;
    }

    getName() {
        return 'ContentModelCache';
    }

    initialize(editor: IEditor) {
        this.editor = editor as IContentModelEditor;
        this.editor.getDocument().addEventListener('selectionchange', this.onSelectionChanged);
    }

    dispose() {
        if (this.editor) {
            this.editor
                .getDocument()
                .removeEventListener('selectionchange', this.onSelectionChanged);
            this.editor = null;
        }
    }

    onPluginEvent(event: PluginEvent) {
        if (this.editor) {
            switch (event.eventType) {
                case PluginEventType.Input:
                    this.syncSelection(this.editor);
                    break;

                case PluginEventType.SelectionChanged:
                    this.syncSelection(this.editor, event.selectionRangeEx);
                    break;
            }
        }
    }

    private onSelectionChanged = () => {
        if (this.editor?.hasFocus()) {
            this.syncSelection(this.editor);
        }
    };

    private syncSelection(editor: IContentModelEditor, newRangeEx?: SelectionRangeEx | null) {
        try {
            this.state.isUpdatingRange = true;
            newRangeEx = newRangeEx || editor.getSelectionRangeEx();

            if (
                (!this.state.cachedRangeEx ||
                    !areSameRangeEx(newRangeEx, this.state.cachedRangeEx)) &&
                !this.internalSyncSelection(newRangeEx)
            ) {
                editor.clearCachedModel();
            }
        } finally {
            this.state.isUpdatingRange = false;
        }
    }

    private internalSyncSelection(newRangeEx: SelectionRangeEx) {
        const rangeEx = this.state.cachedRangeEx;

        if (rangeEx?.type == SelectionRangeTypes.Normal && rangeEx.ranges[0]?.collapsed) {
            const range = rangeEx.ranges[0];
            if (isNodeOfType(range.startContainer, NodeType.Text)) {
                reconcileCachedSelection(this.state, range.startContainer);
            }
        } else {
            return false;
        }

        if (newRangeEx.type == SelectionRangeTypes.Normal && newRangeEx.ranges[0]?.collapsed) {
            this.state.cachedRangeEx = newRangeEx;
            let { startContainer, startOffset } = newRangeEx.ranges[0];

            if (!isNodeOfType(startContainer, NodeType.Text)) {
                startContainer = startContainer.childNodes[startOffset];
                startOffset = 0;
            }

            if (isNodeOfType(startContainer, NodeType.Text)) {
                reconcileCachedSelection(this.state, startContainer, startOffset);

                console.log((this.editor! as any).core.cachedModel);

                return true;
            }
        }

        return false;
    }
}

function areSameRangeEx(r1: SelectionRangeEx, r2: SelectionRangeEx): boolean {
    switch (r1.type) {
        case SelectionRangeTypes.ImageSelection:
            return r2.type == SelectionRangeTypes.ImageSelection && r2.image == r1.image;

        case SelectionRangeTypes.TableSelection:
            return (
                r2.type == SelectionRangeTypes.TableSelection &&
                r2.table == r1.table &&
                areSameCoordinates(r2.coordinates?.firstCell, r1.coordinates?.firstCell) &&
                areSameCoordinates(r2.coordinates?.lastCell, r1.coordinates?.lastCell)
            );

        case SelectionRangeTypes.Normal:
        default:
            return (
                r2.type == SelectionRangeTypes.Normal && areSameRanges(r2.ranges[0], r1.ranges[0])
            );
    }
}

function areSameRanges(r1?: Range, r2?: Range): boolean {
    return !!(
        r1 &&
        r2 &&
        r1.startContainer == r2.startContainer &&
        r1.startOffset == r2.startOffset &&
        r1.endContainer == r2.endContainer &&
        r1.endOffset == r2.endOffset
    );
}

function areSameCoordinates(c1?: Coordinates, c2?: Coordinates): boolean {
    return !!(c1 && c2 && c1.x == c2.x && c1.y == c2.y);
}
