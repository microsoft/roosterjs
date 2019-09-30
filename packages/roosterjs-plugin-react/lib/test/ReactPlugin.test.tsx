import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { act } from 'react-dom/test-utils'; // ES6import * as TestHelper from 'roosterjs-editor-api/lib/test/TestHelper';
import * as TestHelper from 'roosterjs-editor-api/lib/test/TestHelper';
import { Editor } from 'roosterjs-editor-core';
import { default as ReactPlugin, ReactPluginComponentProps } from '../ReactPlugin';
import { ChangeSource } from 'roosterjs-editor-types/lib';

interface ExampleComponentRef {
    updateCounter: (newVal: number) => void;
    counterVal: number;
}

const activeRefs: React.MutableRefObject<ExampleComponentRef | undefined>[] = [];
let globalShouldUpdateState: boolean = false;

const ExampleComponent = (props: Partial<ReactPluginComponentProps>) => {
    const [counter, setCounter] = React.useState(() =>
        props.initialSerializedSharableState
            ? JSON.parse(props.initialSerializedSharableState).counter
            : 0
    );

    // Trigger serializable state callback
    React.useLayoutEffect(() => {
        globalShouldUpdateState &&
            props.updateSerialziedSharableState &&
            props.updateSerialziedSharableState(
                JSON.stringify({
                    counter,
                })
            );
    }, [counter]);

    // Create and store a ref in the test list + bind it to this component's state
    const meRef = React.useRef<ExampleComponentRef>();
    React.useLayoutEffect(() => {
        activeRefs.push(meRef);

        return () => {
            const index = activeRefs.indexOf(meRef);
            if (index !== -1) {
                activeRefs.splice(index, 1);
            }
        };
    });
    React.useImperativeHandle(
        meRef,
        () => ({
            updateCounter: (newVal: number) => setCounter(newVal),
            counterVal: counter,
        }),
        [setCounter, counter]
    );

    // Trigger callback after render
    React.useLayoutEffect(() => {
        props.updateDomInEditor && props.updateDomInEditor();
    });

    return <div className="example-component">Counter: {counter}</div>;
};

describe('ReactPlugin test harness', () => {
    let container: HTMLElement;
    beforeEach(() => {
        container = document.createElement('section');
        document.body.appendChild(container);
        globalShouldUpdateState = false;
    });

    afterEach(() => {
        ReactDOM.unmountComponentAtNode(container);
        container.remove();
    });
    it('Sets a ref in the list when an example component renders', () => {
        ReactDOM.render(<ExampleComponent />, container);

        expect(activeRefs.length).toBe(1);
        expect(activeRefs[0].current).not.toBeFalsy();
        expect(activeRefs[0].current && activeRefs[0].current.counterVal).toBe(0);
    });

    it('Removes that ref from the list when the component unmounts', () => {
        ReactDOM.render(<ExampleComponent />, container);

        ReactDOM.unmountComponentAtNode(container);

        expect(activeRefs.length).toBe(0);
    });

    it('updates the component state and ref on externally triggered state change', () => {
        ReactDOM.render(<ExampleComponent />, container);

        act(() => {
            activeRefs[0].current!.updateCounter(2);
        });

        expect(activeRefs[0].current).not.toBeFalsy();
        expect(activeRefs[0].current!.counterVal).toBe(2);
    });

    it('Calls the update callback again on externally triggered state change', () => {
        let updateCount = 0;
        let updateCountCallback = () => {
            updateCount++;
        };

        ReactDOM.render(<ExampleComponent updateDomInEditor={updateCountCallback} />, container);

        expect(updateCount).toBe(1);

        act(() => {
            activeRefs[0].current!.updateCounter(2);
        });

        expect(activeRefs[0].current).not.toBeFalsy();
        expect(activeRefs[0].current!.counterVal).toBe(2);
        expect(updateCount).toBe(2);
    });
});

describe('ReactPlugin', () => {
    let editor: Editor;

    beforeEach(() => {
        globalShouldUpdateState = false;
    });

    afterEach(() => {
        editor && editor.dispose();
    });

    it('initializes a react element if the initial content had a trigger node in it.', () => {
        let node = document.createElement('div');
        node.innerHTML = '<div data-rcp-compid="example-component"></div>';
        document.body.insertBefore(node, document.body.childNodes[0]);

        let options = {
            plugins: [new ReactPlugin('example-component', ExampleComponent)],
            defaultFormat: {
                fontFamily: 'Calibri,Arial,Helvetica,sans-serif',
                fontSize: '11pt',
                textColor: '#000000',
            },
        };
        editor = new Editor(node as HTMLDivElement, options);

        expect(activeRefs.length).toBe(1);
    });
});

describe('ReactPlugin', () => {
    let editor: Editor;

    beforeEach(() => {
        globalShouldUpdateState = false;
        editor = TestHelper.initEditor('ReactPlugin', [
            new ReactPlugin('example-component', ExampleComponent),
        ]);
    });

    afterEach(() => {
        editor.dispose();
    });

    it('Does nothing when there is no mountpoint in the DOM', () => {
        editor.insertContent('<div></div>');
        expect(activeRefs.length).toBe(0);
    });

    describe('when a new mountpoint is added to the document', () => {
        it('renders a component', async () => {
            editor.insertContent('<div data-rcp-compid="example-component"></div>');
            editor.triggerContentChangedEvent();
            expect(activeRefs.length).toBe(1);
        });

        it('renders a component into the mountpoint', async () => {
            editor.insertContent('<div data-rcp-compid="example-component"></div>');
            editor.triggerContentChangedEvent();

            const queriedElements = editor.queryElements('[data-rcp-compid="example-component"]');
            expect(queriedElements.length).toBe(1);
            expect(queriedElements[0].innerHTML).toEqual(
                '<div class="example-component">Counter: 0</div>'
            );
        });

        it('renders a component into the mountpoint', async () => {
            editor.insertContent('<div data-rcp-compid="example-component"></div>');
            editor.triggerContentChangedEvent();

            const queriedElements = editor.queryElements('[data-rcp-compid="example-component"]');
            expect(queriedElements.length).toBe(1);
            expect(queriedElements[0].innerHTML).toEqual(
                '<div class="example-component">Counter: 0</div>'
            );
        });

        it('renders updates from the component into the mountpoint', () => {
            editor.insertContent('<div data-rcp-compid="example-component"></div>');
            editor.triggerContentChangedEvent();

            activeRefs[0].current.updateCounter(10);
            const queriedElements = editor.queryElements('[data-rcp-compid="example-component"]');
            expect(queriedElements[0].innerHTML).toEqual(
                '<div class="example-component">Counter: 10</div>'
            );
        });
    });

    describe('when a mountpoint is moved from one part of the document to another', () => {
        it('renders the component into the new mountpoint', () => {
            // Arrange
            editor.insertContent(
                '<div data-rcp-compid="example-component"></div> Hello kids, it is me <div data-select-target="moveto"></div>'
            );
            editor.triggerContentChangedEvent();
            const initialMountPoints = editor.queryElements(
                '[data-rcp-compid="example-component"]'
            );
            expect(initialMountPoints.length).toBe(1);
            const initialMountPoint = initialMountPoints[0];
            const initialInstance = activeRefs[0];

            // Act
            const moveToTarget = editor.queryElements('[data-select-target="moveto"]')[0];
            initialMountPoint.parentElement.removeChild(initialMountPoint);
            moveToTarget.innerHTML = initialMountPoint.outerHTML;
            editor.triggerContentChangedEvent();

            // Assert
            expect(initialInstance.current).not.toBeFalsy();
            // Check the ref still hiuts the initialInstance's HTML.
            initialInstance.current.updateCounter(113);
            expect(moveToTarget.children[0].innerHTML).toEqual(
                '<div class="example-component">Counter: 113</div>'
            );
        });

        it('Uses the same component instance, preserving state', () => {
            // Arrange
            editor.insertContent(
                '<div data-rcp-compid="example-component"></div> Hello kids, it is me <div data-select-target="moveto"></div>'
            );
            editor.triggerContentChangedEvent();
            const initialMountPoints = editor.queryElements(
                '[data-rcp-compid="example-component"]'
            );
            expect(initialMountPoints.length).toBe(1);
            const initialMountPoint = initialMountPoints[0];
            const initialInstance = activeRefs[0];
            initialInstance.current.updateCounter(211);

            // Act
            const moveToTarget = editor.queryElements('[data-select-target="moveto"]')[0];
            initialMountPoint.parentElement.removeChild(initialMountPoint);
            moveToTarget.innerHTML = initialMountPoint.outerHTML;
            editor.triggerContentChangedEvent();

            // Assert
            expect(initialInstance.current).not.toBeFalsy();
            // Check the ref still points to the component mounted at initialInstance's HTML.
            initialInstance.current.updateCounter(123);
            expect(moveToTarget.children[0].innerHTML).toEqual(
                '<div class="example-component">Counter: 123</div>'
            );
        });
    });

    describe('when a duplicate mountpoint is copied and pasted into the document', () => {
        it('creates a new ID for the mountpoint and sets it on the document', () => {
            // Arrange
            editor.insertContent(
                '<div data-rcp-compid="example-component"></div> Hello kids, it is me <div data-select-target="moveto"></div>'
            );
            editor.triggerContentChangedEvent();
            const initialMountPoints = editor.queryElements(
                '[data-rcp-compid="example-component"]'
            );
            expect(initialMountPoints.length).toBe(1);
            const initialMountPoint = initialMountPoints[0];
            const initialInstance = activeRefs[0];

            // Act
            const copyToTarget = editor.queryElements('[data-select-target="moveto"]')[0];
            copyToTarget.innerHTML = initialMountPoint.outerHTML;
            editor.triggerContentChangedEvent(ChangeSource.Paste);
            initialInstance.current.updateCounter(12);

            // Assert
            expect(activeRefs.length).toBe(2);
            expect(initialMountPoint.innerHTML).toEqual(
                '<div class="example-component">Counter: 12</div>'
            );
            // check it has its own target
            expect(copyToTarget.children[0].getAttribute('data-rcp-instid')).not.toBeFalsy();
            expect(copyToTarget.children[0].getAttribute('data-rcp-instid')).not.toEqual(
                initialMountPoint.getAttribute('data-rcp-instid')
            );
            expect(copyToTarget.children[0].innerHTML).toEqual(
                '<div class="example-component">Counter: 0</div>'
            );
        });
        it('recognizes the original mountpoint, even if it is 2nd in document order', () => {
            // Arrange
            editor.insertContent(
                'Hello kids, it is me <div data-select-target="moveto"></div> This is the initial mount point: <div data-rcp-compid="example-component"></div>'
            );
            editor.triggerContentChangedEvent();
            const initialMountPoints = editor.queryElements(
                '[data-rcp-compid="example-component"]'
            );
            expect(initialMountPoints.length).toBe(1);
            const initialMountPoint = initialMountPoints[0];
            const initialInstance = activeRefs[0];

            // Act
            const copyToTarget = editor.queryElements('[data-select-target="moveto"]')[0];
            copyToTarget.innerHTML = initialMountPoint.outerHTML;
            editor.triggerContentChangedEvent(ChangeSource.Paste);
            initialInstance.current.updateCounter(12);

            // Assert
            expect(activeRefs.length).toBe(2);
            expect(initialMountPoint.innerHTML).toEqual(
                '<div class="example-component">Counter: 12</div>'
            );
            // check it has its own target
            expect(copyToTarget.children[0].getAttribute('data-rcp-instid')).not.toBeFalsy();
            expect(copyToTarget.children[0].getAttribute('data-rcp-instid')).not.toEqual(
                initialMountPoint.getAttribute('data-rcp-instid')
            );
            expect(copyToTarget.children[0].innerHTML).toEqual(
                '<div class="example-component">Counter: 0</div>'
            );
        });
        it('maintains component state on the original mountpoint', () => {
            // Arrange
            editor.insertContent(
                'Hello kids, it is me <div data-select-target="moveto"></div> This is the initial mount point: <div data-rcp-compid="example-component"></div>'
            );
            editor.triggerContentChangedEvent();
            const initialMountPoints = editor.queryElements(
                '[data-rcp-compid="example-component"]'
            );
            expect(initialMountPoints.length).toBe(1);
            const initialMountPoint = initialMountPoints[0];
            const initialComponentRef = activeRefs[0];
            initialComponentRef.current.updateCounter(400);

            // Act
            const copyToTarget = editor.queryElements('[data-select-target="moveto"]')[0];
            copyToTarget.innerHTML = initialMountPoint.outerHTML;
            editor.triggerContentChangedEvent(ChangeSource.Paste);

            // Assert
            expect(initialComponentRef.current.counterVal).toEqual(400);
        });
        it('initializes a new component with fresh state', () => {
            // Arrange
            editor.insertContent(
                'Hello kids, it is me <div data-select-target="moveto"></div> This is the initial mount point: <div data-rcp-compid="example-component"></div>'
            );
            editor.triggerContentChangedEvent();
            const initialMountPoints = editor.queryElements(
                '[data-rcp-compid="example-component"]'
            );
            expect(initialMountPoints.length).toBe(1);
            const initialMountPoint = initialMountPoints[0];
            const initialComponentRef = activeRefs[0];
            initialComponentRef.current.updateCounter(400);

            // Act
            const copyToTarget = editor.queryElements('[data-select-target="moveto"]')[0];
            copyToTarget.innerHTML = initialMountPoint.outerHTML;
            editor.triggerContentChangedEvent(ChangeSource.Paste);

            // Assert
            expect(activeRefs[0]).toBe(initialComponentRef);
            expect(activeRefs[1]).not.toBe(initialComponentRef);
            expect(activeRefs[1].current.counterVal).toEqual(0);
        });
        describe('when the copied component has sharable state', () => {
            it('initializes the copy of the component with the sharable state of the original', () => {
                // Arrange
                globalShouldUpdateState = true;
                editor.insertContent(
                    'Hello kids, it is me <div data-select-target="moveto"></div> This is the initial mount point: <div data-rcp-compid="example-component"></div>'
                );
                editor.triggerContentChangedEvent();
                const initialMountPoints = editor.queryElements(
                    '[data-rcp-compid="example-component"]'
                );
                expect(initialMountPoints.length).toBe(1);
                const initialMountPoint = initialMountPoints[0];
                const initialComponentRef = activeRefs[0];
                initialComponentRef.current.updateCounter(400);

                // Act
                const copyToTarget = editor.queryElements('[data-select-target="moveto"]')[0];
                copyToTarget.innerHTML = initialMountPoint.outerHTML;
                editor.triggerContentChangedEvent(ChangeSource.Paste);

                // Assert
                expect(activeRefs[0]).toBe(initialComponentRef);
                expect(activeRefs[1]).not.toBe(initialComponentRef);
                expect(activeRefs[1].current.counterVal).toEqual(400);
            });
        });
    });

    describe('when a component has sharable state', () => {
        it('initializes the component with that sharable state', () => {
            // Act
            editor.insertContent(
                '<div data-rcp-compid="example-component" data-rcp-st="{&quot;counter&quot;: 888}"></div>'
            );
            editor.triggerContentChangedEvent();

            // Asssert
            expect(activeRefs[0].current.counterVal).toBe(888);
        });
        it('updates the serialized sharable state on the mountpoint when the component asks it to update', () => {
            // Act
            globalShouldUpdateState = true;
            editor.insertContent(
                '<div data-rcp-compid="example-component" data-rcp-st="{&quot;counter&quot;: 888}"></div>'
            );
            editor.triggerContentChangedEvent();
            activeRefs[0].current.updateCounter(777);

            // Asssert
            const mounted = editor.queryElements('[data-rcp-compid="example-component"]')[0];
            expect(JSON.parse(mounted.getAttribute('data-rcp-st'))).toEqual({
                counter: 777,
            });
        });
    });

    describe('when a mountpoint is removed entirely from the document', () => {
        it('unmounts the react component from the shadow root', () => {
            // Arrange
            globalShouldUpdateState = true;
            editor.insertContent(
                '<div data-rcp-compid="example-component" data-rcp-st="{&quot;counter&quot;: 888}"></div>'
            );
            editor.triggerContentChangedEvent();
            const elementRef = activeRefs[0];
            expect(elementRef.current).not.toBe(null);

            // Act
            const mounted = editor.queryElements('[data-rcp-compid="example-component"]')[0];
            mounted.parentElement.removeChild(mounted);
            editor.triggerContentChangedEvent();

            // Asssert
            expect(elementRef.current).toBe(null);
        });
    });
});

interface ColorComponentRef {
    changeColor: () => void;
}
const activeColorComponentRefs: React.MutableRefObject<ColorComponentRef | undefined>[] = [];
const ExampleColouredComponent = (props: Partial<ReactPluginComponentProps>) => {
    const [useSecondColor, setUseSecondColor] = React.useState(false);

    // Trigger callback after render
    React.useLayoutEffect(() => {
        props.updateDomInEditor && props.updateDomInEditor();
    });

    // Create and store a ref in the test list + bind it to this component's state
    const meRef = React.useRef<ColorComponentRef>();
    React.useLayoutEffect(() => {
        activeColorComponentRefs.push(meRef);

        return () => {
            const index = activeColorComponentRefs.indexOf(meRef);
            if (index !== -1) {
                activeColorComponentRefs.splice(index, 1);
            }
        };
    });
    React.useImperativeHandle(
        meRef,
        () => ({
            changeColor: () => {
                setUseSecondColor(true);
            },
        }),
        []
    );

    if (useSecondColor) {
        return <div style={{ color: 'gray', backgroundColor: 'salmon' }}>Colored Component</div>;
    }

    return <div style={{ color: 'green', backgroundColor: 'goldenrod' }}>Colored Component</div>;
};

describe('interaction with darkmode', () => {
    let editor: Editor;

    const testDarkmodeTransform = (element: HTMLElement) => {
        if (element.style.color) {
            element.style.color = 'dark' + element.style.color;
        }
        if (element.style.backgroundColor) {
            element.style.backgroundColor = 'dark' + element.style.backgroundColor;
        }
        for (let child of Array.from(element.children)) {
            if (child instanceof HTMLElement) {
                testDarkmodeTransform(child);
            }
        }
    };

    describe('in lightmode', () => {
        beforeEach(() => {
            let node = document.createElement('div');
            document.body.insertBefore(node, document.body.childNodes[0]);

            let options = {
                plugins: [new ReactPlugin('example-colour-component', ExampleColouredComponent)],
                defaultFormat: {
                    fontFamily: 'Calibri,Arial,Helvetica,sans-serif',
                    fontSize: '11pt',
                    textColor: '#000000',
                },
                darkModeOptions: {
                    transformOnInitialize: true,
                    onExternalContentTransform: testDarkmodeTransform,
                },
                inDarkMode: false,
            };
            editor = new Editor(node as HTMLDivElement, options);
        });

        afterEach(() => {
            editor.dispose();
        });

        it('renders with normal colors outside of darkmode', () => {
            editor.insertContent('<div data-rcp-compid="example-colour-component"></div>');
            editor.triggerContentChangedEvent();

            const mountPoint = editor.queryElements(
                '[data-rcp-compid="example-colour-component"]'
            )[0];
            const componentElement: HTMLElement = mountPoint.children[0] as HTMLElement;
            expect(componentElement.style.color).toEqual('green');
            expect(componentElement.style.backgroundColor).toEqual('goldenrod');
        });
    });

    describe('in darkmode', () => {
        beforeEach(() => {
            let node = document.createElement('div');
            document.body.insertBefore(node, document.body.childNodes[0]);

            let options = {
                plugins: [new ReactPlugin('example-colour-component', ExampleColouredComponent)],
                defaultFormat: {
                    fontFamily: 'Calibri,Arial,Helvetica,sans-serif',
                    fontSize: '11pt',
                    textColor: '#000000',
                },
                darkModeOptions: {
                    transformOnInitialize: true,
                    onExternalContentTransform: testDarkmodeTransform,
                },
                inDarkMode: true,
            };
            editor = new Editor(node as HTMLDivElement, options);
        });

        afterEach(() => {
            editor.dispose();
        });

        it('transforms elements into their darkmode colours', () => {
            editor.insertContent('<div data-rcp-compid="example-colour-component"></div>');
            editor.triggerContentChangedEvent();

            const mountPoint = editor.queryElements(
                '[data-rcp-compid="example-colour-component"]'
            )[0];
            const componentElement: HTMLElement = mountPoint.children[0] as HTMLElement;
            expect(componentElement.style.color).toEqual('darkgreen');
            expect(componentElement.style.backgroundColor).toEqual('darkgoldenrod');
        });

        it('transforms updates to elements into their darkmode colours', () => {
            // Arrange
            editor.insertContent('<div data-rcp-compid="example-colour-component"></div>');
            editor.triggerContentChangedEvent();
            const mountPoint = editor.queryElements(
                '[data-rcp-compid="example-colour-component"]'
            )[0];

            // Act
            activeColorComponentRefs[0].current.changeColor();

            const componentElement: HTMLElement = mountPoint.children[0] as HTMLElement;
            expect(componentElement.style.color).toEqual('darkgray');
            expect(componentElement.style.backgroundColor).toEqual('darksalmon');
        });
    });
});
