import attachDomEvent from '../coreAPI/attachDomEvent';
import EditorCore, { CoreApiMap, CorePlugins } from '../interfaces/EditorCore';
import EditorOptions from '../interfaces/EditorOptions';
import EditorPlugin from '../interfaces/EditorPlugin';
import EditPlugin from '../corePlugins/EditPlugin';
import editWithUndo from '../coreAPI/editWithUndo';
import focus from '../coreAPI/focus';
import getCustomData from '../coreAPI/getCustomData';
import getSelectionRange from '../coreAPI/getSelectionRange';
import hasFocus from '../coreAPI/hasFocus';
import IMEPlugin from '../corePlugins/IMEPlugin';
import insertNode from '../coreAPI/insertNode';
import MouseUpPlugin from '../corePlugins/MouseUpPlugin';
import select from '../coreAPI/select';
import SelectionPlugin from '../corePlugins/SelectionPlugin';
import triggerEvent from '../coreAPI/triggerEvent';
import TypeInContainerPlugin from '../corePlugins/TypeInContainerPlugin';
import Undo from '../undo/Undo';
import { DefaultFormat } from 'roosterjs-editor-types';
import { getComputedStyles } from 'roosterjs-editor-dom';

export default function createEditorCore(
    contentDiv: HTMLDivElement,
    options: EditorOptions
): EditorCore {
    let corePlugins: CorePlugins = {
        undo: options.undo || new Undo(),
        edit: new EditPlugin(),
        ime: new IMEPlugin(),
        typeInContainer: new TypeInContainerPlugin(),
        mouseUp: new MouseUpPlugin(),
        selection: new SelectionPlugin(options.disableRestoreSelectionOnFocus),
    };
    let allPlugins: EditorPlugin[] = [
        corePlugins.typeInContainer,
        corePlugins.edit,
        corePlugins.mouseUp,
        corePlugins.ime,
        ...(options.plugins || []),
        corePlugins.undo,
        corePlugins.selection,
    ].filter(plugin => !!plugin);
    let eventHandlerPlugins = allPlugins.filter(
        plugin => plugin.onPluginEvent || plugin.willHandleEventExclusively
    );
    return {
        contentDiv,
        document: contentDiv.ownerDocument,
        defaultFormat: calcDefaultFormat(contentDiv, options.defaultFormat),
        corePlugins,
        currentUndoSnapshot: null,
        customData: {},
        cachedSelectionRange: null,
        plugins: allPlugins,
        eventHandlerPlugins: eventHandlerPlugins,
        api: createCoreApiMap(options.coreApiOverride),
        defaultApi: createCoreApiMap(),
    };
}

function calcDefaultFormat(node: Node, baseFormat: DefaultFormat): DefaultFormat {
    if (baseFormat && Object.keys(baseFormat).length === 0) {
        return {};
    }

    baseFormat = baseFormat || <DefaultFormat>{};
    let styles = getComputedStyles(node);
    return {
        fontFamily: baseFormat.fontFamily || styles[0],
        fontSize: baseFormat.fontSize || styles[1],
        textColor: baseFormat.textColor || styles[2],
        backgroundColor: baseFormat.backgroundColor || '',
        bold: baseFormat.bold,
        italic: baseFormat.italic,
        underline: baseFormat.underline,
    };
}

function createCoreApiMap(map?: Partial<CoreApiMap>): CoreApiMap {
    map = map || {};
    return {
        attachDomEvent: map.attachDomEvent || attachDomEvent,
        editWithUndo: map.editWithUndo || editWithUndo,
        focus: map.focus || focus,
        getCustomData: map.getCustomData || getCustomData,
        getSelectionRange: map.getSelectionRange || getSelectionRange,
        hasFocus: map.hasFocus || hasFocus,
        insertNode: map.insertNode || insertNode,
        select: map.select || select,
        triggerEvent: map.triggerEvent || triggerEvent,
    };
}
