import DragAndDropHelper from '../../lib/pluginUtils/DragAndDropHelper';

interface DragAndDropContext {
    node: HTMLElement;
}

interface DragAndDropInitValue {
    originalRect: DOMRect;
}

describe('DragAndDropHelper |', () => {
    let id = 'DragAndDropHelperId';
    let dndHelper: DragAndDropHelper<DragAndDropContext, DragAndDropInitValue>;

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
                onDragEnd(context: DragAndDropContext) {
                    //Red indicates dragging stopped
                    context.node.style.backgroundColor = 'red';
                    return true;
                },
                onDragStart(context: DragAndDropContext) {
                    //Green indicates dragging started
                    context.node.style.backgroundColor = 'green';
                    return { originalRect: context.node.getBoundingClientRect() };
                },
                onDragging(context: DragAndDropContext, event: MouseEvent) {
                    //Yellow indicates dragging is happening
                    context.node.style.backgroundColor = 'yellow';
                    context.node.style.left = event.pageX + 'px';
                    context.node.style.top = event.pageY + 'px';
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
        createDnD(target, true);
        let targetEnd = target;
        targetEnd.style.left = 50 + 'px';

        // Assert
        expect(dndHelper.mouseType).toBe('touch');

        // Act
        simulateTouchEvent('touchstart', target);

        // Assert
        expect(target?.style.backgroundColor).toBe('green');

        // Act
        simulateTouchEvent('touchmove', targetEnd);

        // Assert
        expect(target?.style.backgroundColor).toBe('yellow');

        // Act
        simulateTouchEvent('touchend', targetEnd);

        // Assert
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
    var event = (new Event(type) as any) as TouchEvent;

    target.dispatchEvent(event);
}
