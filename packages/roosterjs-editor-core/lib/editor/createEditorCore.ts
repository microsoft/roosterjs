import EditorCore, { CoreApiMap } from './EditorCore';
import EditorOptions from './EditorOptions';
import Undo from '../undo/Undo';
import attachDomEvent from '../coreAPI/attachDomEvent';
import focus from '../coreAPI/focus';
import getCustomData from '../coreAPI/getCustomData';
import getFocusPosition from '../coreAPI/getFocusPosition';
import getLiveRange from '../coreAPI/getLiveRange';
import hasFocus from '../coreAPI/hasFocus';
import insertNode from '../coreAPI/insertNode';
import keepSelection from '../coreAPI/keepSelection';
import runWithUndo from '../coreAPI/runWithUndo';
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
        customData: {},
        cachedRange: null,
        undo: options.undo || new Undo(),
        suspendAddingUndoSnapshot: false,
        plugins: (options.plugins || []).filter(plugin => !!plugin),
        idleLoopHandle: 0,
        ignoreIdleEvent: false,
        api: createCoreApiMap(options.coreApiOverride),
    };
}

function calcDefaultFormat(node: Node, baseFormat: DefaultFormat): DefaultFormat {
    baseFormat = baseFormat || <DefaultFormat>{};
    let computedStyle = getComputedStyles(node);
    return {
        fontFamily: baseFormat.fontFamily || computedStyle[0],
        fontSize: baseFormat.fontSize || computedStyle[1],
        textColor: baseFormat.textColor || computedStyle[2],
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
        focus: map.focus || focus,
        runWithUndo: map.runWithUndo || runWithUndo,
        getCustomData: map.getCustomData || getCustomData,
        getFocusPosition: map.getFocusPosition || getFocusPosition,
        getLiveRange: map.getLiveRange || getLiveRange,
        hasFocus: map.hasFocus || hasFocus,
        insertNode: map.insertNode || insertNode,
        keepSelection: map.keepSelection || keepSelection,
        select: map.select || select,
        triggerEvent: map.triggerEvent || triggerEvent,
    };
}
