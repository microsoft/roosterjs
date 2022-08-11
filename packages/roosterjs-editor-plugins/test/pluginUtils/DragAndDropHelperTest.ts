import DragAndDropContext from 'roosterjs-editor-types';
import DragAndDropHelper from '../../lib/pluginUtils/DragAndDropHelper';
import { Browser } from 'roosterjs-editor-dom';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions } from 'roosterjs-editor-types';
import { IEditor } from 'roosterjs-editor-types';
//import * as TestHelper from '../TestHelper';

interface DragAndDropContext {
    node: HTMLDivElement;
}

interface DragAndDropInitValue {
    originalRect: DOMRect;
}

describe('DragAndDropHelper |', () => {
    let editor: IEditor;
    let id = 'DragAndDropHelperId';
    let dndHelper: DragAndDropHelper<DragAndDropContext, DragAndDropInitValue>;

    beforeEach(() => {
        let s = Browser;
        spyOn(s, 'isMobileOrTablet').and.returnValue(true);
        let node = document.createElement('div');
        node.id = id;
        node.style.width = '50px';
        node.style.height = '50px';
        node.style.backgroundColor = 'black';
        node.style.position = 'fixed';

        document.body.insertBefore(node, document.body.childNodes[0]);

        dndHelper = new DragAndDropHelper<DragAndDropContext, DragAndDropInitValue>(
            node,
            { node },
            () => {},
            {
                onDragEnd(context, event, initValue) {
                    context.node.style.backgroundColor = 'red';
                    return true;
                },
                onDragStart(context, event) {
                    console.log(event.type);
                    context.node.style.backgroundColor = 'green';
                    return { originalRect: context.node.getBoundingClientRect() };
                },
                onDragging(context, event, initValue, deltaX, deltaY) {
                    context.node.style.backgroundColor = 'yellow';
                    context.node.style.left = event.pageX + 'px';
                    context.node.style.top = event.pageY + 'px';
                    return true;
                },
            },
            1
        );

        console.log(dndHelper);
    });

    afterEach(() => {});

    function runTest() {
        //debugger;
    }

    it('mouse movement', () => {
        const target = document.getElementById(id);
        //1 Mouse DOwn Div
        simulateMouseEvent('mousedown', target);
        debugger;
        expect(target?.style.backgroundColor).toBe('green');
        //2 Mouse Move Move
        let targetEnd = target;
        targetEnd.style.top = 50 + 'px';
        simulateMouseEvent('mousemove', targetEnd);
        debugger;
        expect(target?.style.backgroundColor).toBe('yellow');
        simulateMouseEvent('mouseup', targetEnd);
        debugger;
        //3 Mouse Up Event
        expect(target?.style.top).toBe('50px');
        expect(target?.style.backgroundColor).toBe('red');
    });

    it('touch movement', () => {
        const target = document.getElementById(id);
        //1 Mouse DOwn Div
        simulateTouchEvent('touchstart', target);
        debugger;
        expect(target?.style.backgroundColor).toBe('green');
        //2 Mouse Move Move
        let targetEnd = target;
        targetEnd.style.left = 50 + 'px';
        simulateTouchEvent('touchmove', targetEnd);
        debugger;
        expect(target?.style.backgroundColor).toBe('yellow');
        simulateTouchEvent('touchend', targetEnd);
        debugger;
        //3 Mouse Up Event
        expect(target?.style.left).toBe('50px');
        expect(target?.style.backgroundColor).toBe('red');
    });
});

function simulateMouseEvent(type: string, target: HTMLElement, shiftKey: boolean = false) {
    const rect = target.getBoundingClientRect();
    var event = new MouseEvent(type, {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: rect.left,
        clientY: rect.top,
        shiftKey,
    });
    target.dispatchEvent(event);
}

function simulateTouchEvent(type: string, target: HTMLElement) {
    const rect = target.getBoundingClientRect();
    let touchList: Touch[] = [
        new Touch({ identifier: 0, target: target, clientX: rect.left, clientY: rect.top }),
    ];
    var event = new TouchEvent(type, {
        view: window,
        bubbles: true,
        cancelable: true,
        targetTouches: touchList,
    });
    target.dispatchEvent(event);
}

function simulateKeyDownEvent(
    whichInput: number,
    shiftKey: boolean = true,
    ctrlKey: boolean = false
) {
    const evt = new KeyboardEvent('keydown', {
        shiftKey,
        altKey: false,
        ctrlKey,
        cancelable: true,
        which: whichInput,
    });

    if (!Browser.isFirefox) {
        //Chromium hack to add which to the event as there is a bug in Webkit
        //https://stackoverflow.com/questions/10455626/keydown-simulation-in-chrome-fires-normally-but-not-the-correct-key/10520017#10520017
        Object.defineProperty(evt, 'which', {
            get: function () {
                return whichInput;
            },
        });
    }
    return evt;
}
