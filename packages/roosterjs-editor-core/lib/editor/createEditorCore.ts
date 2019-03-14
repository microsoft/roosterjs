import attachDomEvent from '../coreAPI/attachDomEvent';
import DOMEventPlugin from '../corePlugins/DOMEventPlugin';
import EditorCore, { CoreApiMap, CorePlugins } from '../interfaces/EditorCore';
import EditorOptions from '../interfaces/EditorOptions';
import EditorPlugin from '../interfaces/EditorPlugin';
import EditPlugin from '../corePlugins/EditPlugin';
import editWithUndo from '../coreAPI/editWithUndo';
import FirefoxTypeAfterLink from '../corePlugins/FirefoxTypeAfterLink';
import focus from '../coreAPI/focus';
import getCustomData from '../coreAPI/getCustomData';
import getSelectionRange from '../coreAPI/getSelectionRange';
import hasFocus from '../coreAPI/hasFocus';
import insertNode from '../coreAPI/insertNode';
import MouseUpPlugin from '../corePlugins/MouseUpPlugin';
import selectRange, { select } from '../coreAPI/selectRange';
import triggerEvent from '../coreAPI/triggerEvent';
import TypeInContainerPlugin from '../corePlugins/TypeInContainerPlugin';
import Undo from '../undo/Undo';
import { Browser, getComputedStyles } from 'roosterjs-editor-dom';
import { DARK_MODE_DEFAULT_FORMAT, DefaultFormat } from 'roosterjs-editor-types';

export default function createEditorCore(
    contentDiv: HTMLDivElement,
    options: EditorOptions
): EditorCore {
    let corePlugins: CorePlugins = {
        undo: options.undo || new Undo(),
        edit: new EditPlugin(),
        typeInContainer: new TypeInContainerPlugin(),
        mouseUp: new MouseUpPlugin(),
        domEvent: new DOMEventPlugin(options.disableRestoreSelectionOnFocus),
        firefoxTypeAfterLink: Browser.isFirefox && new FirefoxTypeAfterLink(),
    };
    let allPlugins: EditorPlugin[] = [
        corePlugins.typeInContainer,
        corePlugins.edit,
        corePlugins.mouseUp,
        ...(options.plugins || []),
        corePlugins.firefoxTypeAfterLink,
        corePlugins.undo,
        corePlugins.domEvent,
    ].filter(plugin => !!plugin);
    let eventHandlerPlugins = allPlugins.filter(
        plugin => plugin.onPluginEvent || plugin.willHandleEventExclusively
    );
    return {
        contentDiv,
        document: contentDiv.ownerDocument,
        defaultFormat: calcDefaultFormat(contentDiv, options.defaultFormat, options.inDarkMode),
        corePlugins,
        currentUndoSnapshot: null,
        customData: {},
        cachedSelectionRange: null,
        plugins: allPlugins,
        eventHandlerPlugins: eventHandlerPlugins,
        api: createCoreApiMap(options.coreApiOverride),
        defaultApi: createCoreApiMap(),
        inDarkMode: options.inDarkMode,
        darkModeOptions: options.darkModeOptions,
    };
}

export function calcDefaultFormat(
    node: Node,
    baseFormat: DefaultFormat,
    inDarkMode: boolean
): DefaultFormat {
    if (inDarkMode) {
        if (!baseFormat.backgroundColors) {
            baseFormat.backgroundColors = DARK_MODE_DEFAULT_FORMAT.backgroundColors;
        }
        if (!baseFormat.textColors) {
            baseFormat.textColors = DARK_MODE_DEFAULT_FORMAT.textColors;
        }
    }

    if (baseFormat && Object.keys(baseFormat).length === 0) {
        return {};
    }

    baseFormat = baseFormat || <DefaultFormat>{};
    let {
        fontFamily,
        fontSize,
        textColor,
        textColors,
        backgroundColor,
        backgroundColors,
        bold,
        italic,
        underline,
    } = baseFormat;
    let currentStyles =
        fontFamily && fontSize && (textColor || textColors) ? null : getComputedStyles(node);
    return {
        fontFamily: fontFamily || currentStyles[0],
        fontSize: fontSize || currentStyles[1],
        get textColor() {
            return textColors
                ? inDarkMode
                    ? textColors.darkModeColor
                    : textColors.lightModeColor
                : textColor || currentStyles[2];
        },
        textColors: textColors,
        get backgroundColor() {
            return backgroundColors
                ? inDarkMode
                    ? backgroundColors.darkModeColor
                    : backgroundColors.lightModeColor
                : backgroundColor || '';
        },
        backgroundColors: backgroundColors,
        bold: bold,
        italic: italic,
        underline: underline,
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
        selectRange: map.selectRange || selectRange,
        triggerEvent: map.triggerEvent || triggerEvent,
    };
}
