import Editor from '../../lib/editor/Editor';
import { addUndoSnapshot } from '../../lib/coreApi/addUndoSnapshot';
import { attachDomEvent } from '../../lib/coreApi/attachDomEvent';
import { Browser } from 'roosterjs-editor-dom';
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
            'PendingFormatState',
            'Undo',
            'DOMEvent',
            'MouseUp',
            'CopyPaste',
            'Entity',
            'ImageSelection',
            'NormalizeTable',
            'Lifecycle',
        ]);

        expect(core.domEvent).toEqual({
            isInIME: false,
            scrollContainer: div,
            selectionRange: null,
            stopPrintableKeyboardEventPropagation: true,
            contextMenuProviders: [],
            tableSelectionRange: null,
            imageSelectionRange: null,
        });
        if (!Browser.isChrome) {
            expect(core.edit).toEqual({
                features: {},
            });
        }
        expect(core.entity).toEqual({
            entityMap: {},
        });
        expect(core.lifecycle.customData).toEqual({});
        expect(core.lifecycle.isDarkMode).toBeFalse();
        expect(core.lifecycle.onExternalContentTransform).toBeNull();
        expect(core.lifecycle.defaultFormat).toBeDefined();
        expect(core.pendingFormatState).toEqual({
            pendableFormatPosition: null,
            pendableFormatState: null,
            pendableFormatSpan: null,
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

        expect(core).toBeDefined('Core');

        expect(core.contentDiv).toBe(div, 'Content Div');

        expect(div.innerHTML).toBe('<div>test content</div>', 'InnerHTML');

        expect(core.api.addUndoSnapshot).toBe(addUndoSnapshot, 'addUndoSnapshot');
        expect(core.api.attachDomEvent).toBe(attachDomEvent, 'attachDomEvent');
        expect(core.api.createPasteFragment).toBe(createPasteFragment, 'createPasteFragment');
        expect(core.api.ensureTypeInContainer).toBe(ensureTypeInContainer, 'ensureTypeInContainer');
        expect(core.api.focus).toBe(myFocus, 'myFocus');
        expect(core.api.getContent).toBe(getContent, 'getContent');
        expect(core.api.getSelectionRange).toBe(getSelectionRange, 'getSelectionRange');
        expect(core.api.getStyleBasedFormatState).toBe(
            getStyleBasedFormatState,
            'getStyleBasedFormatState'
        );
        expect(core.api.hasFocus).toBe(hasFocus, 'hasFocus');
        expect(core.api.insertNode).toBe(insertNode, 'insertNode');
        expect(core.api.restoreUndoSnapshot).toBe(restoreUndoSnapshot, 'resotreUndoSnapshot');
        expect(core.api.selectRange).toBe(selectRange, 'selectRange');
        expect(core.api.setContent).toBe(setContent, 'setContent');
        expect(core.api.transformColor).toBe(transformColor, 'transformColor');
        expect(core.api.triggerEvent).toBe(triggerEvent, 'triggerEvent');

        expect(core.plugins.map(p => p.getName())).toEqual(
            [
                'TypeInContainer',
                'Edit',
                'PendingFormatState',
                'test plugin',
                'Undo',
                'DOMEvent',
                'test mouse up',
                'CopyPaste',
                'Entity',
                'ImageSelection',
                'NormalizeTable',
                'Lifecycle',
            ],
            'plugins'
        );

        expect(core.domEvent).toEqual(
            {
                isInIME: false,
                scrollContainer: scrollContaner,
                selectionRange: null,
                stopPrintableKeyboardEventPropagation: false,
                contextMenuProviders: [],
                tableSelectionRange: null,
                imageSelectionRange: null,
            },
            'domEvent'
        );
        if (!Browser.isChrome) {
            expect(core.edit).toEqual(
                {
                    features: {},
                },
                'edit'
            );
        }
        expect(core.entity).toEqual(
            {
                entityMap: {},
            },
            'entity'
        );
        expect(core.lifecycle.customData).toEqual({}, 'customData');
        expect(core.lifecycle.isDarkMode).toBeTrue();
        expect(core.lifecycle.defaultFormat).toBeDefined('defaultFormat');
        expect(core.lifecycle.defaultFormat.bold).toBeTrue();
        expect(core.pendingFormatState).toEqual(
            {
                pendableFormatPosition: null,
                pendableFormatState: null,
                pendableFormatSpan: null,
            },
            'pendingFormatState'
        );
        expect(core.undo.isRestoring).toBeFalse();
        expect(core.undo.hasNewContent).toBeFalse();
        expect(core.undo.isNested).toBeFalse();
        expect(core.undo.autoCompletePosition).toBeNull();
        expect(core.undo.snapshotsService.addSnapshot).toBeDefined('addSnapshot');
        expect(core.undo.snapshotsService.canMove).toBeDefined('canMove');
        expect(core.undo.snapshotsService.canUndoAutoComplete).toBeDefined('canUndoAutoComplete');
        expect(core.undo.snapshotsService.clearRedo).toBeDefined('clearRedo');
        expect(core.undo.snapshotsService.move).toBeDefined('move');
    });

    it('create Editor with initial content as a table with colgroup', () => {
        const div = document.createElement('div');
        const editor = new Editor(div, {
            initialContent:
                '<table><thead><colgroup><col width="100" ><col width="100" ></thead><tbody><tr><td>col 1</td><td>col 2</td></tr><tr><td>col 1</td><td>col 2</td></tr></tbody></table>',
        });

        expect(editor.getContent()).toEqual(
            '<table><thead><colgroup><col width="100"><col width="100"></colgroup></thead><tbody><tr><td>col 1</td><td>col 2</td></tr><tr><td>col 1</td><td>col 2</td></tr></tbody></table>'
        );
    });
});
