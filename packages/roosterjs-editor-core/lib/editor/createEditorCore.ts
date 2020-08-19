import AutoCompletePlugin from '../corePlugins/autoComplete/AutoCompletePlugin';
import CorePastePlugin from '../corePlugins/corePaste/CorePastePlugin';
import DarkModePlugin from '../corePlugins/darkMode/DarkModePlugin';
import DOMEventPlugin from '../corePlugins/domEvent/DOMEventPlugin';
import EditPlugin from '../corePlugins/edit/EditPlugin';
import EntityPlugin from '../corePlugins/entity/EntityPlugin';
import LifecyclePlugin from '../corePlugins/lifecycle/LifecyclePlugin';
import MouseUpPlugin from '../corePlugins/mouseUp/MouseUpPlugin';
import PendingFormatStatePlugin from '../corePlugins/pendingFormatState/PendingFormatStatePlugin';
import TypeAfterLinkPlugin from '../corePlugins/typeAfterLink/TypeAfterLinkPlugin';
import TypeInContainerPlugin from '../corePlugins/typeInContainer/TypeInContainerPlugin';
import UndoPlugin from '../corePlugins/undo/UndoPlugin';
import { addUndoSnapshot } from '../coreApi/addUndoSnapshot';
import { attachDomEvent } from '../coreApi/attachDomEvent';
import { calcDefaultFormat } from '../coreApi/calcDefaultFormat';
import { createPasteFragment } from '../coreApi/createPasteFragment';
import { focus } from '../coreApi/focus';
import { getContent } from '../coreApi/getContent';
import { getSelectionRange } from '../coreApi/getSelectionRange';
import { getStyleBasedFormatState } from '../coreApi/getStyleBasedFormatState';
import { hasFocus } from '../coreApi/hasFocus';
import { insertNode } from '../coreApi/insertNode';
import { restoreUndoSnapshot } from '../coreApi/restoreUndoSnapshot';
import { selectRange } from '../coreApi/selectRange';
import { setContent } from '../coreApi/setContent';
import { triggerEvent } from '../coreApi/triggerEvent';
import {
    CoreApiMap,
    CorePlugins,
    EditorCore,
    EditorOptions,
    EditorPlugin,
} from 'roosterjs-editor-types';

const PLACEHOLDER_PLUGIN_NAME = '_placeholder';

/**
 * @internal
 * Create core object for editor
 * @param contentDiv The DIV element used for editor
 * @param options Options to create an editor
 */
export default function createEditorCore(
    contentDiv: HTMLDivElement,
    options: EditorOptions
): EditorCore {
    const corePlugins = createCorePlugins(contentDiv, options);
    const api = createCoreApiMap(options.coreApiOverride);
    const plugins: EditorPlugin[] = [];
    Object.keys(corePlugins).forEach((name: typeof PLACEHOLDER_PLUGIN_NAME | keyof CorePlugins) => {
        if (name == PLACEHOLDER_PLUGIN_NAME) {
            Array.prototype.push.apply(plugins, options.plugins);
        } else {
            plugins.push(corePlugins[name]);
        }
    });

    return {
        contentDiv,
        api,
        plugins: plugins.filter(x => !!x),
        autoComplete: corePlugins.autoComplete.getState(),
        darkMode: corePlugins.darkMode.getState(),
        domEvent: corePlugins.domEvent.getState(),
        pendingFormatState: corePlugins.pendingFormatState.getState(),
        edit: corePlugins.edit.getState(),
        lifecycle: corePlugins.lifecycle.getState(),
        undo: corePlugins.undo.getState(),
        entity: corePlugins.entity.getState(),
        typeAfterLink: corePlugins.typeAfterLink.getState(),
    };
}

function createCoreApiMap(map?: Partial<CoreApiMap>): CoreApiMap {
    map = map || {};
    return {
        attachDomEvent: map.attachDomEvent || attachDomEvent,
        calcDefaultFormat: map.calcDefaultFormat || calcDefaultFormat,
        addUndoSnapshot: map.addUndoSnapshot || addUndoSnapshot,
        focus: map.focus || focus,
        getContent: map.getContent || getContent,
        getSelectionRange: map.getSelectionRange || getSelectionRange,
        getStyleBasedFormatState: map.getStyleBasedFormatState || getStyleBasedFormatState,
        hasFocus: map.hasFocus || hasFocus,
        insertNode: map.insertNode || insertNode,
        createPasteFragment: map.createPasteFragment || createPasteFragment,
        restoreUndoSnapshot: map.restoreUndoSnapshot || restoreUndoSnapshot,
        selectRange: map.selectRange || selectRange,
        setContent: map.setContent || setContent,
        triggerEvent: map.triggerEvent || triggerEvent,
    };
}

function createCorePlugins(
    contentDiv: HTMLDivElement,
    options: EditorOptions
): CorePlugins & { [PLACEHOLDER_PLUGIN_NAME]: null } {
    const map = options.corePluginOverride || {};
    // The order matters, some plugin needs to be put before/after others to make sure event
    // can be handled in right order
    return {
        typeInContainer: map.typeInContainer || new TypeInContainerPlugin(),
        edit: map.edit || new EditPlugin(),
        autoComplete: map.autoComplete || new AutoCompletePlugin(),
        _placeholder: null,
        typeAfterLink: map.typeAfterLink || new TypeAfterLinkPlugin(),
        undo: map.undo || new UndoPlugin(options),
        domEvent: map.domEvent || new DOMEventPlugin(options, contentDiv),
        pendingFormatState: map.pendingFormatState || new PendingFormatStatePlugin(),
        mouseUp: map.mouseUp || new MouseUpPlugin(),
        darkMode: map.darkMode || new DarkModePlugin(options),
        paste: map.paste || new CorePastePlugin(),
        entity: map.entity || new EntityPlugin(),
        lifecycle: map.lifecycle || new LifecyclePlugin(options, contentDiv),
    };
}
