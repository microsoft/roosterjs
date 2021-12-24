import Editor from '../../lib/editor/Editor';
import { addUndoSnapshot } from '../../lib/coreApi/addUndoSnapshot';
import { attachDomEvent } from '../../lib/coreApi/attachDomEvent';
import { Browser } from 'roosterjs-editor-dom/lib';
import { createPasteFragment } from '../../lib/coreApi/createPasteFragment';
import { EditorCore } from 'roosterjs-editor-types';
import { ensureTypeInContainer } from '../../lib/coreApi/ensureTypeInContainer';
import { focus } from '../../lib/coreApi/focus';
import { getContent } from '../../lib/coreApi/getContent';
import { getSelectionRange } from '../../lib/coreApi/getSelectionRange';
import { getStyleBasedFormatState } from '../../lib/coreApi/getStyleBasedFormatState';
import { hasFocus } from '../../lib/coreApi/hasFocus';
import { insertNode } from '../../lib/coreApi/insertNode';
import { restoreUndoSnapshot } from '../../lib/coreApi/restoreUndoSnapshot';
import { selectRange } from '../../lib/coreApi/selectRange';
import { setContent } from '../../lib/coreApi/setContent';
import { transformColor } from '../../lib/coreApi/transformColor';
import { triggerEvent } from '../../lib/coreApi/triggerEvent';

describe('Editor', () => {
    it('create Editor without options', () => {
        const div = document.createElement('div');
        const editor = new Editor(div);
        const core: EditorCore = (<any>editor).core;

        expect(core).toBeDefined();

        expect(core.contentDiv).toBe(div);

        expect(core.api.addUndoSnapshot).toBe(addUndoSnapshot);
        expect(core.api.attachDomEvent).toBe(attachDomEvent);
        expect(core.api.createPasteFragment).toBe(createPasteFragment);
        expect(core.api.ensureTypeInContainer).toBe(ensureTypeInContainer);
        expect(core.api.focus).toBe(focus);
        expect(core.api.getContent).toBe(getContent);
        expect(core.api.getSelectionRange).toBe(getSelectionRange);
        expect(core.api.getStyleBasedFormatState).toBe(getStyleBasedFormatState);
        expect(core.api.hasFocus).toBe(hasFocus);
        expect(core.api.insertNode).toBe(insertNode);
        expect(core.api.restoreUndoSnapshot).toBe(restoreUndoSnapshot);
        expect(core.api.selectRange).toBe(selectRange);
        expect(core.api.setContent).toBe(setContent);
        expect(core.api.transformColor).toBe(transformColor);
        expect(core.api.triggerEvent).toBe(triggerEvent);

        expect(core.plugins.map(p => p.getName())).toEqual([
            'TypeInContainer',
            'Edit',
            'Undo',
            'DOMEvent',
            'PendingFormatState',
            'MouseUp',
            'CopyPaste',
            'Entity',
            'Lifecycle',
            'TableSelection',
        ]);

        expect(core.domEvent).toEqual({
            isInIME: false,
            scrollContainer: div,
            selectionRange: null,
            stopPrintableKeyboardEventPropagation: true,
            contextMenuProviders: [],
        });
        if (!Browser.isChrome) {
            expect(core.edit).toEqual({
                features: {},
            });
        }
        expect(core.entity).toEqual({
            knownEntityElements: [],
            shadowEntityCache: {},
        });
        expect(core.lifecycle.customData).toEqual({});
        expect(core.lifecycle.isDarkMode).toBeFalse();
        expect(core.lifecycle.onExternalContentTransform).toBeUndefined();
        expect(core.lifecycle.defaultFormat).toBeDefined();
        expect(core.pendingFormatState).toEqual({
            pendableFormatPosition: null,
            pendableFormatState: null,
        });
        expect(core.undo.isRestoring).toBeFalse();
        expect(core.undo.hasNewContent).toBeFalse();
        expect(core.undo.isNested).toBeFalse();
        expect(core.undo.autoCompletePosition).toBeNull();
        expect(core.undo.snapshotsService.addSnapshot).toBeDefined();
        expect(core.undo.snapshotsService.canMove).toBeDefined();
        expect(core.undo.snapshotsService.canUndoAutoComplete).toBeDefined();
        expect(core.undo.snapshotsService.clearRedo).toBeDefined();
        expect(core.undo.snapshotsService.move).toBeDefined();
    });

    it('create Editor with options', () => {
        const myFocus = () => {};
        const myMouseUp = {
            getName: () => 'test mouse up',
            initialize: () => {},
            dispose: () => {},
        };
        const myTransform = () => {};
        const div = document.createElement('div');
        const scrollContaner = document.createElement('div');
        const editor = new Editor(div, {
            plugins: [
                {
                    getName: () => 'test plugin',
                    initialize: () => {},
                    dispose: () => {},
                },
            ],
            defaultFormat: {
                bold: true,
            },
            initialContent: 'test content',
            coreApiOverride: {
                focus: myFocus,
            },
            corePluginOverride: {
                mouseUp: myMouseUp,
            },
            inDarkMode: true,
            onExternalContentTransform: myTransform,
            scrollContainer: scrollContaner,
            allowKeyboardEventPropagation: true,
        });
        const core: EditorCore = (<any>editor).core;

        expect(core).toBeDefined();

        expect(core.contentDiv).toBe(div);

        expect(div.innerHTML).toBe('<div>test content</div>');

        expect(core.api.addUndoSnapshot).toBe(addUndoSnapshot);
        expect(core.api.attachDomEvent).toBe(attachDomEvent);
        expect(core.api.createPasteFragment).toBe(createPasteFragment);
        expect(core.api.ensureTypeInContainer).toBe(ensureTypeInContainer);
        expect(core.api.focus).toBe(myFocus);
        expect(core.api.getContent).toBe(getContent);
        expect(core.api.getSelectionRange).toBe(getSelectionRange);
        expect(core.api.getStyleBasedFormatState).toBe(getStyleBasedFormatState);
        expect(core.api.hasFocus).toBe(hasFocus);
        expect(core.api.insertNode).toBe(insertNode);
        expect(core.api.restoreUndoSnapshot).toBe(restoreUndoSnapshot);
        expect(core.api.selectRange).toBe(selectRange);
        expect(core.api.setContent).toBe(setContent);
        expect(core.api.transformColor).toBe(transformColor);
        expect(core.api.triggerEvent).toBe(triggerEvent);

        expect(core.plugins.map(p => p.getName())).toEqual([
            'TypeInContainer',
            'Edit',
            'test plugin',
            'Undo',
            'DOMEvent',
            'PendingFormatState',
            'test mouse up',
            'CopyPaste',
            'Entity',
            'Lifecycle',
            'TableSelection',
        ]);

        expect(core.domEvent).toEqual({
            isInIME: false,
            scrollContainer: scrollContaner,
            selectionRange: null,
            stopPrintableKeyboardEventPropagation: false,
            contextMenuProviders: [],
        });
        if (!Browser.isChrome) {
            expect(core.edit).toEqual({
                features: {},
            });
        }
        expect(core.entity).toEqual({
            knownEntityElements: [],
            shadowEntityCache: {},
        });
        expect(core.lifecycle.customData).toEqual({});
        expect(core.lifecycle.isDarkMode).toBeTrue();
        expect(core.lifecycle.onExternalContentTransform).toBe(myTransform);
        expect(core.lifecycle.defaultFormat).toBeDefined();
        expect(core.lifecycle.defaultFormat.bold).toBeTrue();
        expect(core.pendingFormatState).toEqual({
            pendableFormatPosition: null,
            pendableFormatState: null,
        });
        expect(core.undo.isRestoring).toBeFalse();
        expect(core.undo.hasNewContent).toBeFalse();
        expect(core.undo.isNested).toBeFalse();
        expect(core.undo.autoCompletePosition).toBeNull();
        expect(core.undo.snapshotsService.addSnapshot).toBeDefined();
        expect(core.undo.snapshotsService.canMove).toBeDefined();
        expect(core.undo.snapshotsService.canUndoAutoComplete).toBeDefined();
        expect(core.undo.snapshotsService.clearRedo).toBeDefined();
        expect(core.undo.snapshotsService.move).toBeDefined();
    });
});
