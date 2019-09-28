import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { act } from 'react-dom/test-utils'; // ES6import * as TestHelper from 'roosterjs-editor-api/lib/test/TestHelper';
import * as TestHelper from 'roosterjs-editor-api/lib/test/TestHelper';
import { Editor } from 'roosterjs-editor-core';
import { default as ReactPlugin, ReactPluginComponentProps } from '../ReactPlugin';

interface ExampleComponentRef {
    updateCounter: (newVal: number) => void;
    counterVal: number;
}

const activeRefs: React.MutableRefObject<ExampleComponentRef | undefined>[] = [];

const ExampleComponentWithState = (props: Partial<ReactPluginComponentProps>) => {
    const [counter, setCounter] = React.useState(() =>
        props.initialSerializedSharableState
            ? JSON.parse(props.initialSerializedSharableState).counter
            : 0
    );

    // Trigger serializable state callback
    React.useLayoutEffect(() => {
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

    return <div>Counter: {counter}</div>;
};

describe('ReactPlugin test harness', () => {
    let container: HTMLElement;
    beforeEach(() => {
        container = document.createElement('section');
        document.body.appendChild(container);
    });

    afterEach(() => {
        ReactDOM.unmountComponentAtNode(container);
        container.remove();
    });
    it('Sets a ref in the list when an example component renders', () => {
        ReactDOM.render(<ExampleComponentWithState />, container);

        expect(activeRefs.length).toBe(1);
        expect(activeRefs[0].current).not.toBeFalsy();
        expect(activeRefs[0].current && activeRefs[0].current.counterVal).toBe(0);
    });

    it('Removes that ref from the list when the component unmounts', () => {
        ReactDOM.render(<ExampleComponentWithState />, container);

        ReactDOM.unmountComponentAtNode(container);

        expect(activeRefs.length).toBe(0);
    });

    it('updates the component state and ref on externally triggered state change', () => {
        ReactDOM.render(<ExampleComponentWithState />, container);

        act(() => {
            activeRefs[0].current!.updateCounter(2);
        });

        expect(activeRefs[0].current).not.toBeFalsy();
        expect(activeRefs[0].current!.counterVal).toBe(2);
    });

    it('Calls the update callback again on externally triggered state change', () => {
        let updateCount = 0;
        let updateCountCallback = () => {
            console.log('trigger');
            updateCount++;
        };

        ReactDOM.render(
            <ExampleComponentWithState updateDomInEditor={updateCountCallback} />,
            container
        );

        expect(updateCount).toBe(1);

        console.log('updatin');
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
        console.log(
            'init editor!',
            document.getSelection,
            document.defaultView == null,
            document.defaultView && document.defaultView.getSelection
        );
        // console.log(document)
        editor = TestHelper.initEditor('ReactPlugin', [
            new ReactPlugin('example-component', ExampleComponentWithState),
        ]);
    });

    afterEach(() => {
        editor.dispose();
    });

    fit('Does nothing when there is no mountpoint in the DOM', () => {
        editor.insertContent('<div></div>');
        expect(activeRefs.length).toBe(0);
    });

    describe('when a new mountpoint is added to the document', () => {
        it('renders the component into the mountpoint', () => {
            editor.insertContent('<div data-rcp-compid="example-component"></div>');
            expect(activeRefs.length).toBe(1);
        });
        it('renders updates from the component into the mountpoint');
    });

    describe('when a mountpoint is moved from one part of the document to another', () => {
        it('renders the component into the new mountpoint');
        it('Uses the same component instance, preserving state');
    });

    describe('when a duplicate mountpoint is copied and pasted into the document', () => {
        it('creates a new ID for the mountpoint and sets it on the document');
        it('recognizes the original mountpoint, even if it is 2nd in document order');
        it('maintains component state on the original mountpoint');
        it('initializes a new component with fresh state');
        describe('when the copied component has sharable state', () => {
            it('initializes the copy of the component with the sharable state of the original');
        });
    });

    describe('when a component has sharable state', () => {
        it('initializes the component with that sharable state');
        it(
            'updates the serialzied sharable state on the mountpoint when the component asks it to update'
        );
    });

    describe('when a mountpoint is removed entirely from the document', () => {
        it('unmounts the react component from the shadow root');
    });

    describe('in darkmode', () => {
        it('transforms elements into their darkmode colours');
        it('transforms updates to elements into their darkmode colours');
    });
});
