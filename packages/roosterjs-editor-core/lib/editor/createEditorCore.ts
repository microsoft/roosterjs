import AutoCompletePlugin from '../corePlugins/AutoCompletePlugin';
import CorePastePlugin from '../corePlugins/CorePastePlugin';
import CorePlugins from '../interfaces/CorePlugins';
import CorePluginState from '../interfaces/CorePluginState';
import DarkModePlugin from '../corePlugins/DarkModePlugin';
import DOMEventPlugin from '../corePlugins/DOMEventPlugin';
import EditorCore, { CoreApiMap } from '../interfaces/EditorCore';
import EditorOptions from '../interfaces/EditorOptions';
import EditorPlugin from '../interfaces/EditorPlugin';
import EditPlugin from '../corePlugins/EditPlugin';
import MouseUpPlugin from '../corePlugins/MouseUpPlugin';
import TypeAfterLinkPlugin from '../corePlugins/TypeAfterLinkPlugin';
import TypeInContainerPlugin from '../corePlugins/TypeInContainerPlugin';
import Undo from '../undo/Undo';
import { attachDomEvent } from '../coreAPI/attachDomEvent';
import { Browser } from 'roosterjs-editor-dom';
import { calculateDefaultFormat } from '../coreAPI/calculateDefaultFormat';
import { createPasteFragment } from '../coreAPI/createPasteFragment';
import { editWithUndo } from '../coreAPI/editWithUndo';
import { focus } from '../coreAPI/focus';
import { getCustomData } from '../coreAPI/getCustomData';
import { getSelectionRange } from '../coreAPI/getSelectionRange';
import { getStyleBasedFormatState } from '../coreAPI/getStyleBasedFormatState';
import { hasFocus } from '../coreAPI/hasFocus';
import { insertNode } from '../coreAPI/insertNode';
import { selectRange } from '../coreAPI/selectRange';
import { triggerEvent } from '../coreAPI/triggerEvent';

/**
 * Create core object for editor
 * @param contentDiv The DIV element used for editor
 * @param options Options to create an editor
 */
export default function createEditorCore(
    contentDiv: HTMLDivElement,
    options: EditorOptions
): EditorCore {
    const pluginState: CorePluginState = {
        autoComplete: {
            value: null,
        },
        domEvent: {
            value: {
                isInIME: false,
                pendableFormatPosition: null,
                pendableFormatState: null,
            },
        },
        edit: {
            value: {},
        },
    };

    const corePlugins: CorePlugins = {
        undo: options.undo || new Undo(),
        edit: new EditPlugin(pluginState.edit, options.editFeatures),
        autoComplete: new AutoCompletePlugin(pluginState.autoComplete),
        typeInContainer: new TypeInContainerPlugin(),
        mouseUp: new MouseUpPlugin(),
        domEvent: new DOMEventPlugin(pluginState.domEvent),
        typeAfterLink: new TypeAfterLinkPlugin(),
        darkMode: !Browser.isIE && new DarkModePlugin(),
        pastePlugin: new CorePastePlugin(),
    };

    let allPlugins = buildPluginList(corePlugins, options.plugins);

    return {
        ...pluginState,
        contentDiv,
        scrollContainer: options.scrollContainer || contentDiv,
        document: contentDiv.ownerDocument,
        defaultFormat: calculateDefaultFormat(
            contentDiv,
            options.defaultFormat,
            options.inDarkMode
        ),
        corePlugins,
        currentUndoSnapshot: null,
        customData: {},
        cachedSelectionRange: null,
        plugins: allPlugins,
        api: createCoreApiMap(options.coreApiOverride),
        defaultApi: createCoreApiMap(),
        inDarkMode: options.inDarkMode,
        darkModeOptions: options.darkModeOptions,
    };
}

function buildPluginList(corePlugins: CorePlugins, plugins: EditorPlugin[]): EditorPlugin[] {
    return [
        corePlugins.typeInContainer,
        corePlugins.edit,
        corePlugins.autoComplete,
        corePlugins.mouseUp,
        ...(plugins || []),
        corePlugins.typeAfterLink,
        corePlugins.undo,
        corePlugins.domEvent,
        corePlugins.darkMode,
        corePlugins.pastePlugin,
    ].filter(plugin => !!plugin);
}

function createCoreApiMap(map?: Partial<CoreApiMap>): CoreApiMap {
    map = map || {};
    return {
        attachDomEvent: map.attachDomEvent || attachDomEvent,
        editWithUndo: map.editWithUndo || editWithUndo,
        focus: map.focus || focus,
        getCustomData: map.getCustomData || getCustomData,
        getSelectionRange: map.getSelectionRange || getSelectionRange,
        getStyleBasedFormatState: map.getStyleBasedFormatState || getStyleBasedFormatState,
        hasFocus: map.hasFocus || hasFocus,
        insertNode: map.insertNode || insertNode,
        createPasteFragment: map.createPasteFragment || createPasteFragment,
        selectRange: map.selectRange || selectRange,
        triggerEvent: map.triggerEvent || triggerEvent,
    };
}
