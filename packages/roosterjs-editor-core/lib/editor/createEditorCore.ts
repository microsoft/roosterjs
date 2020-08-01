import addContentEditFeatures from './addContentEditFeatures';
import AutoCompletePlugin from '../corePlugins/AutoCompletePlugin';
import CorePastePlugin from '../corePlugins/CorePastePlugin';
import CorePlugins, { PluginKey, PluginState } from '../interfaces/CorePlugins';
import DarkModePlugin from '../corePlugins/DarkModePlugin';
import DOMEventPlugin from '../corePlugins/DOMEventPlugin';
import EditorCore, { CoreApiMap } from '../interfaces/EditorCore';
import EditorOptions from '../interfaces/EditorOptions';
import EditorPlugin from '../interfaces/EditorPlugin';
import EditPlugin from '../corePlugins/EditPlugin';
import EntityPlugin from '../corePlugins/EntityPlugin';
import TypeAfterLinkPlugin from '../corePlugins/TypeAfterLinkPlugin';
import TypeInContainerPlugin from '../corePlugins/TypeInContainerPlugin';
import UndoPlugin from '../corePlugins/UndoPlugin';
import UndoSnapshotsService from '../interfaces/UndoSnapshotsService';
import { attachDomEvent } from '../coreAPI/attachDomEvent';
import { createPasteFragment } from '../coreAPI/createPasteFragment';
import { editWithUndo } from '../coreAPI/editWithUndo';
import { focus } from '../coreAPI/focus';
import { getContent } from '../coreAPI/getContent';
import { GetContentMode } from 'roosterjs-editor-types';
import { getCustomData } from '../coreAPI/getCustomData';
import { getSelectionRange } from '../coreAPI/getSelectionRange';
import { getStyleBasedFormatState } from '../coreAPI/getStyleBasedFormatState';
import { hasFocus } from '../coreAPI/hasFocus';
import { insertNode } from '../coreAPI/insertNode';
import { selectRange } from '../coreAPI/selectRange';
import { setContent } from '../coreAPI/setContent';
import { triggerEvent } from '../coreAPI/triggerEvent';
import { updateDefaultFormat } from '../coreAPI/updateDefaultFormat';
import {
    addSnapshot,
    canMoveCurrentSnapshot,
    moveCurrentSnapsnot,
    clearProceedingSnapshots,
    createSnapshots,
} from 'roosterjs-editor-dom';

// Max stack size that cannot be exceeded. When exceeded, old undo history will be dropped
// to keep size under limit. This is kept at 10MB
const MAXSIZELIMIT = 1e7;

/**
 * Create core object for editor
 * @param contentDiv The DIV element used for editor
 * @param options Options to create an editor
 */
export default function createEditorCore(
    contentDiv: HTMLDivElement,
    options: EditorOptions
): EditorCore {
    let core: EditorCore;
    const api = createCoreApiMap(options.coreApiOverride);
    const pluginState: PluginState<PluginKey> = {
        autoComplete: {
            value: null,
        },
        darkMode: {
            value: {
                isDarkMode: options.inDarkMode,
                onExternalContentTransform: options.onExternalContentTransform,
            },
        },
        domEvent: {
            value: {
                isInIME: false,
                pendableFormatPosition: null,
                pendableFormatState: null,
                scrollContainer: options.scrollContainer || contentDiv,
                selectionRange: null,
            },
        },
        edit: {
            value: addContentEditFeatures({}, options.editFeatures),
        },
        undo: {
            value: {
                snapshotsService: options.undoSnapshotService || createUndoSnapshots(),
                isRestoring: false,
                hasNewContent: false,
                getContent: () => api.getContent(core, GetContentMode.RawHTMLWithSelection),
                setContent: (content: string) =>
                    api.setContent(core, content, true /*triggerContentChangedEvent*/),
            },
        },
    };
    const corePlugins = createCorePlugins(pluginState, options.corePluginOverride);
    const plugins = buildPluginList(corePlugins, options.plugins);

    core = {
        ...pluginState,
        contentDiv,
        defaultFormat: options.defaultFormat,
        currentUndoSnapshot: null,
        customData: {},
        plugins,
        api,
        allowKeyboardEventPropagation: options.allowKeyboardEventPropagation,
    };

    return core;
}

function buildPluginList(corePlugins: CorePlugins, plugins: EditorPlugin[]): EditorPlugin[] {
    return [
        corePlugins.typeInContainer,
        corePlugins.edit,
        corePlugins.autoComplete,
        ...(plugins || []),
        corePlugins.typeAfterLink,
        corePlugins.undo,
        corePlugins.domEvent,
        corePlugins.darkMode,
        corePlugins.paste,
        corePlugins.entity,
    ].filter(plugin => !!plugin);
}

function createCoreApiMap(map?: Partial<CoreApiMap>): CoreApiMap {
    map = map || {};
    return {
        attachDomEvent: map.attachDomEvent || attachDomEvent,
        updateDefaultFormat: map.updateDefaultFormat || updateDefaultFormat,
        editWithUndo: map.editWithUndo || editWithUndo,
        focus: map.focus || focus,
        getContent: map.getContent || getContent,
        getCustomData: map.getCustomData || getCustomData,
        getSelectionRange: map.getSelectionRange || getSelectionRange,
        getStyleBasedFormatState: map.getStyleBasedFormatState || getStyleBasedFormatState,
        hasFocus: map.hasFocus || hasFocus,
        insertNode: map.insertNode || insertNode,
        createPasteFragment: map.createPasteFragment || createPasteFragment,
        selectRange: map.selectRange || selectRange,
        setContent: map.setContent || setContent,
        triggerEvent: map.triggerEvent || triggerEvent,
    };
}

function createCorePlugins(
    pluginState: PluginState<PluginKey>,
    map: Partial<CorePlugins>
): CorePlugins {
    map = map || {};
    return {
        typeInContainer: map.typeInContainer || new TypeInContainerPlugin(),
        edit: map.edit || new EditPlugin(pluginState.edit),
        autoComplete: map.autoComplete || new AutoCompletePlugin(pluginState.autoComplete),
        typeAfterLink: map.typeAfterLink || new TypeAfterLinkPlugin(),
        undo: map.undo || new UndoPlugin(pluginState.undo),
        domEvent: map.domEvent || new DOMEventPlugin(pluginState.domEvent),
        darkMode: map.darkMode || new DarkModePlugin(pluginState.darkMode),
        paste: map.paste || new CorePastePlugin(),
        entity: map.entity || new EntityPlugin(),
    };
}

function createUndoSnapshots(): UndoSnapshotsService {
    const snapshots = createSnapshots(MAXSIZELIMIT);

    return {
        canMove: (delta: number): boolean => canMoveCurrentSnapshot(snapshots, delta),
        move: (delta: number): string => moveCurrentSnapsnot(snapshots, delta),
        addSnapshot: (snapshot: string) => addSnapshot(snapshots, snapshot),
        clearRedo: () => clearProceedingSnapshots(snapshots),
    };
}
