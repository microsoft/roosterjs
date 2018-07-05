import EditorCore, { CoreApiMap } from './EditorCore';
import EditorOptions from './EditorOptions';
import Undo from '../undo/Undo';
import attachDomEvent from '../coreAPI/attachDomEvent';
import editWithUndo from '../coreAPI/editWithUndo';
import focus from '../coreAPI/focus';
import getSelectionRange from '../coreAPI/getSelectionRange';
import hasFocus from '../coreAPI/hasFocus';
import insertNode from '../coreAPI/insertNode';
import select from '../coreAPI/select';
import triggerEvent from '../coreAPI/triggerEvent';
import { DefaultFormat } from 'roosterjs-editor-types';
import { getComputedStyles } from 'roosterjs-editor-dom';

export default function createEditorCore(
    contentDiv: HTMLDivElement,
    options: EditorOptions
): EditorCore {
    return {
        contentDiv: contentDiv,
        document: contentDiv.ownerDocument,
        defaultFormat: calcDefaultFormat(contentDiv, options.defaultFormat),
        undo: options.undo || new Undo(),
        suspendUndo: false,
        customData: {},
        cachedSelectionRange: null,
        plugins: (options.plugins || []).filter(plugin => !!plugin),
        api: createCoreApiMap(options.coreApiOverride),
        snapshotBeforeAutoComplete: null,
        disableRestoreSelectionOnFocus: options.disableRestoreSelectionOnFocus,
        omitContentEditable: options.omitContentEditableAttributeChanges,
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

function createCoreApiMap(map: Partial<CoreApiMap>): CoreApiMap {
    map = map || {};
    return {
        attachDomEvent: map.attachDomEvent || attachDomEvent,
        editWithUndo: map.editWithUndo || editWithUndo,
        focus: map.focus || focus,
        getSelectionRange: map.getSelectionRange || getSelectionRange,
        hasFocus: map.hasFocus || hasFocus,
        insertNode: map.insertNode || insertNode,
        select: map.select || select,
        triggerEvent: map.triggerEvent || triggerEvent,
    };
}
