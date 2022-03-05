import { createRange, getTagOfNode, queryElements } from 'roosterjs-editor-dom';
import { setIndentation } from 'roosterjs-editor-api';
import {
    BuildInEditFeature,
    IEditor,
    Indentation,
    TextFeatureSettings,
    Keys,
    PluginKeyboardEvent,
    SelectionRangeTypes,
    ContentPosition,
    PositionType,
} from 'roosterjs-editor-types';

let IGNORE_TAB = false;
/**
 * IndentWhenTab edit feature, provides the ability to indent current list when user press TAB
 */
const IndentWhenTab: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.TAB + 52],
    shouldHandleEvent: event => !IGNORE_TAB && !event.rawEvent.shiftKey,
    handleEvent: (event, editor) => {
        const selection = editor.getSelectionRangeEx();
        if (selection.type == SelectionRangeTypes.Normal) {
            if (selection.areAllCollapsed) {
                insertTab(editor, event);
            } else {
                const regions = editor.getSelectedRegions();
                let isAtEnd: boolean = false;
                let isAtStart: boolean = null;
                regions.forEach(r => {
                    isAtEnd = r.fullSelectionEnd.isAtEnd;
                    isAtStart = isAtStart || r.fullSelectionStart.offset == 0;
                });

                if (isAtEnd && isAtStart) {
                    setIndentation(editor, Indentation.Increase);
                } else {
                    selection.ranges.forEach(range => range.deleteContents());
                    insertTab(editor, event);
                }
            }
            event.rawEvent.preventDefault();
        }
    },
};

/**
 * OutdentWhenShiftTab edit feature, provides the ability to outdent current list when user press Shift+TAB
 */
const OutdentWhenShiftTab: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.TAB],
    shouldHandleEvent: (event, editor) =>
        event.rawEvent.shiftKey && cacheGetListElement(event, editor),
    handleEvent: (event, editor) => {
        setIndentation(editor, Indentation.Decrease);
        event.rawEvent.preventDefault();
    },
};

/**
 * OutdentWhenShiftTab edit feature, provides the ability to outdent current list when user press Shift+TAB
 */
const MoveToNextElement: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [121 /* F10 */],
    shouldHandleEvent: event => event.rawEvent.altKey,
    handleEvent: (event, editor) => {
        debugger;
        IGNORE_TAB = true;
        const doc = editor.getDocument();
        // const activeElement = doc.activeElement;
        // (activeElement as HTMLElement).blur();
        // (activeElement as HTMLElement).focus();
        focusNextElement(doc);
        doc.dispatchEvent(simulateKeyDownEvent(Keys.TAB, true));
        setTimeout(() => {
            IGNORE_TAB = false;
        }, 2000);
    },
    allowFunctionKeys: true,
};

function simulateKeyDownEvent(
    whichInput: number,
    shiftKey: boolean = false,
    ctrlKey: boolean = false
) {
    const evt = new KeyboardEvent('keyup', {
        shiftKey,
        altKey: false,
        ctrlKey,
        cancelable: false,
        which: whichInput,
        bubbles: true,
    });

    //Chromium hack to add which to the event as there is a bug in Webkit
    //https://stackoverflow.com/questions/10455626/keydown-simulation-in-chrome-fires-normally-but-not-the-correct-key/10520017#10520017
    Object.defineProperty(evt, 'which', {
        get: function () {
            return whichInput;
        },
    });
    return evt;
}

function insertTab(editor: IEditor, event: PluginKeyboardEvent) {
    const span = editor.getDocument().createElement('span');
    // span.style.display = 'inline-block';
    // span.style.margin = '0em';
    // span.style.whiteSpace = 'pre-wrap';
    let searcher = editor.getContentSearcherOfCursor(event);
    const charsBefore = searcher.getSubStringBefore(Number.MAX_SAFE_INTEGER);

    const numberOfChars = 6 - (charsBefore.length % 6);

    let textContent = '';
    for (let index = 0; index < numberOfChars; index++) {
        textContent += '&ensp;';
    }
    editor.insertNode(span);
    editor.insertContent(textContent, {
        position: ContentPosition.Range,
        range: createRange(span, PositionType.Begin),
        updateCursor: false,
    });
    editor.select(createRange(span, PositionType.After));
}

function cacheGetListElement(event: PluginKeyboardEvent, editor: IEditor) {
    let li = editor.getElementAtCursor('LI,TABLE', null /*startFrom*/, event);
    let listElement = li && getTagOfNode(li) == 'LI' && editor.getElementAtCursor('UL,OL', li);
    return listElement ? [listElement, li] : null;
}

/**
 * @internal
 */
export const TextFeatures: Record<
    keyof TextFeatureSettings,
    BuildInEditFeature<PluginKeyboardEvent>
> = {
    indentWhenTab: IndentWhenTab,
    outdentWhenShiftTab: OutdentWhenShiftTab,
    moveToNextElement: MoveToNextElement,
};

function focusNextElement(document: Document) {
    var focussableElements =
        'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
    if (document.activeElement && document.activeElement.parentElement) {
        const getElements = (element: Element) => {
            return queryElements(element, focussableElements).filter(element => {
                return (
                    element.clientWidth > 0 ||
                    element.clientHeight > 0 ||
                    element === document.activeElement
                );
            });
        };

        let currentElement = document.activeElement;
        let currentParentElement = currentElement.parentElement;
        let elements = getElements(currentParentElement);

        let index = elements.indexOf(currentElement as HTMLElement);
        while (!elements[index + 1]) {
            currentElement = currentElement.parentElement;
            currentParentElement = currentElement.parentElement;
            elements = getElements(currentParentElement);
            index = elements.indexOf(document.activeElement as HTMLElement);
        }

        elements[index + 1].focus();
    }
}
