import { DragAndDropHelper } from '../../lib/pluginUtils/DragAndDrop/DragAndDropHelper';
import type { DragAndDropEvent } from '../../lib/pluginUtils/DragAndDrop/DragAndDropHandler';

interface DragAndDropContext {
    node: HTMLElement;
}

interface DragAndDropInitValue {
    originalRect: DOMRect;
}

describe('DragAndDropHelper |', () => {
    let id = 'DragAndDropHelperId';
    let dndHelper: DragAndDropHelper<DragAndDropContext, DragAndDropInitValue>;
    let dragStartEvent: DragAndDropEvent | undefined;
    let draggingEvent: DragAndDropEvent | undefined;
    let dragEndEvent: DragAndDropEvent | undefined;

    beforeEach(() => {
        //Empty Div for dragging
        let node = document.createElement('div');
        node.id = id;
        //Start as black square
        node.style.width = '50px';
        node.style.height = '50px';
        node.style.backgroundColor = 'black';
        node.style.position = 'fixed';
        node.style.top = '0px';
        node.style.left = '0px';

        //Put node on top of body
        document.body.insertBefore(node, document.body.childNodes[0]);
    });

    //Creates the DragAndDropHelper for testing
    function createDnD(node: HTMLElement, mobile: boolean) {
        dndHelper = new DragAndDropHelper<DragAndDropContext, DragAndDropInitValue>(
            node,
            { node },
            () => {},
            {
                onDragEnd(context: DragAndDropContext, event: DragAndDropEvent) {
                    //Red indicates dragging stopped
                    context.node.style.backgroundColor = 'red';
                    dragEndEvent = event;
                    return true;
                },
                onDragStart(context: DragAndDropContext, event: DragAndDropEvent) {
                    //Green indicates dragging started
                    context.node.style.backgroundColor = 'green';
                    dragStartEvent = event;
                    return { originalRect: context.node.getBoundingClientRect() };
                },
                onDragging(context: DragAndDropContext, event: DragAndDropEvent) {
                    //Yellow indicates dragging is happening
                    context.node.style.backgroundColor = 'yellow';
                    context.node.style.left = event.pageX + 'px';
                    context.node.style.top = event.pageY + 'px';
                    draggingEvent = event;
                    return true;
                },
            },
            1,
            mobile
        );
    }

    afterEach(() => {
        dndHelper.dispose();
    });

    it('mouse movement', () => {
        // Arrange
        const target = document.getElementById(id);
        createDnD(target, false);
        let targetEnd = target;
        targetEnd.style.top = 50 + 'px';

        // Assert
        expect(dndHelper.mouseType).toBe('mouse');

        // Act
        simulateMouseEvent('mousedown', target);

        // Assert
        expect(target?.style.backgroundColor).toBe('green');

        // Act
        simulateMouseEvent('mousemove', targetEnd);

        // Assert
        expect(target?.style.backgroundColor).toBe('yellow');

        // Act
        simulateMouseEvent('mouseup', targetEnd);

        // Assert
        expect(target?.style.backgroundColor).toBe('red');
    });

    it('touch movement', () => {
        // Arrange
        const target = document.getElementById(id);
        const dropTarget = document.createElement('div');
        document.body.appendChild(dropTarget);
        createDnD(target, true);
        spyOn(document, 'elementFromPoint').and.returnValue(dropTarget);

        // Assert
        expect(dndHelper.mouseType).toBe('touch');
        expect(target.style.touchAction).toBe('none');

        // Act
        const startEvent = simulateTouchEvent('touchstart', target, 10, 20);

        // Assert
        expect(startEvent.defaultPrevented).toBe(true);
        expect(target?.style.backgroundColor).toBe('green');
        expect(dragStartEvent).toEqual(
            jasmine.objectContaining({ clientX: 10, clientY: 20, pageX: 10, pageY: 20 })
        );

        // Act
        const moveEvent = simulateTouchEvent('touchmove', target, 30, 40);

        // Assert
        expect(moveEvent.defaultPrevented).toBe(true);
        expect(target?.style.backgroundColor).toBe('yellow');
        expect(draggingEvent).toEqual(
            jasmine.objectContaining({ clientX: 30, clientY: 40, pageX: 30, pageY: 40 })
        );

        // Act
        simulateTouchEvent('touchend', target, 50, 60);

        // Assert
        expect(target?.style.backgroundColor).toBe('red');
        expect(dragEndEvent).toEqual(
            jasmine.objectContaining({
                clientX: 50,
                clientY: 60,
                pageX: 50,
                pageY: 60,
                target: dropTarget,
            })
        );
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

function simulateTouchEvent(type: string, target: HTMLElement, clientX: number, clientY: number) {
    const event = new Event(type, { bubbles: true, cancelable: true }) as TouchEvent;
    const touch = { clientX, clientY, pageX: clientX, pageY: clientY } as Touch;

    Object.defineProperties(event, {
        targetTouches: { value: type == 'touchend' ? [] : [touch] },
        changedTouches: { value: [touch] },
    });

    target.dispatchEvent(event);
    return event;
}
