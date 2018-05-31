import EditorCore, { CoreApiMap } from './EditorCore';
import EditorOptions from './EditorOptions';
import applyInlineStyle from '../coreAPI/applyInlineStyle';
import attachDomEvent from '../coreAPI/attachDomEvent';
import focus from '../coreAPI/focus';
import getContentTraverser from '../coreAPI/getContentTraverser';
import getCustomData from '../coreAPI/getCustomData';
import getCursorRect from '../coreAPI/getCursorRect';
import getSelectionRange from '../coreAPI/getSelectionRange';
import hasFocus from '../coreAPI/hasFocus';
import insertNode from '../coreAPI/insertNode';
import triggerEvent from '../coreAPI/triggerEvent';
import updateSelection from '../coreAPI/updateSelection';
import { DefaultFormat } from 'roosterjs-editor-types';
import { getComputedStyle } from 'roosterjs-editor-dom';

export default function createEditorCore(
    contentDiv: HTMLDivElement,
    options: EditorOptions
): EditorCore {
    return {
        contentDiv: contentDiv,
        document: contentDiv.ownerDocument,
        defaultFormat: calcDefaultFormat(contentDiv, options.defaultFormat),
        customData: {},
        cachedSelectionRange: null,
        plugins: (options.plugins || []).filter(plugin => !!plugin),
        idleLoopHandle: 0,
        ignoreIdleEvent: false,
        api: createCoreApiMap(options.coreApiOverride),
    };
}

function calcDefaultFormat(node: Node, baseFormat: DefaultFormat): DefaultFormat {
    if (baseFormat && Object.keys(baseFormat).length === 0) {
        return {};
    }

    baseFormat = baseFormat || <DefaultFormat>{};
    return {
        fontFamily: baseFormat.fontFamily || getComputedStyle(node, 'font-family'),
        fontSize: baseFormat.fontSize || getComputedStyle(node, 'font-size'),
        textColor: baseFormat.textColor || getComputedStyle(node, 'color'),
        backgroundColor: baseFormat.backgroundColor || '',
        bold: baseFormat.bold,
        italic: baseFormat.italic,
        underline: baseFormat.underline,
    };
}

function createCoreApiMap(map: Partial<CoreApiMap>): CoreApiMap {
    map = map || {};
    return {
        applyInlineStyle: map.applyInlineStyle || applyInlineStyle,
        attachDomEvent: map.attachDomEvent || attachDomEvent,
        focus: map.focus || focus,
        getContentTraverser: map.getContentTraverser || getContentTraverser,
        getCustomData: map.getCustomData || getCustomData,
        getCursorRect: map.getCursorRect || getCursorRect,
        getSelectionRange: map.getSelectionRange || getSelectionRange,
        hasFocus: map.hasFocus || hasFocus,
        insertNode: map.insertNode || insertNode,
        triggerEvent: map.triggerEvent || triggerEvent,
        updateSelection: map.updateSelection || updateSelection,
    };
}
