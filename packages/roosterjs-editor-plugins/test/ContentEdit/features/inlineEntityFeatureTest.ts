import { Entity, IEditor, Keys, PluginKeyDownEvent } from 'roosterjs-editor-types';
import { EntityFeatures } from '../../../lib/plugins/ContentEdit/features/entityFeatures';
import {
    addDelimiters,
    commitEntity,
    findClosestElementAncestor,
    Position,
} from 'roosterjs-editor-dom';

describe('Content Edit Features |', () => {
    const {
        moveToDelimiterBefore,
        moveToDelimiterAfter,
        removeEntityBetweenDelimiters,
    } = EntityFeatures;
    let entity: Entity;
    let delimiterAfter: Element | null;
    let delimiterBefore: Element | null;
    let wrapper: HTMLElement;
    let editor: IEditor;
    let select: jasmine.Spy;
    let triggerContentChangedEvent: jasmine.Spy;
    let testContainer: HTMLDivElement;

    let defaultEvent = <PluginKeyDownEvent>{};

    beforeAll(() => {
        cleanUp();
    });

    beforeEach(() => {
        cleanUp();
        defaultEvent = <PluginKeyDownEvent>{};
        testContainer = document.createElement('div');
        document.body.appendChild(testContainer);

        wrapper = document.createElement('span');
        wrapper.innerHTML = 'Test';

        testContainer.appendChild(wrapper);
        select = jasmine.createSpy('select');
        triggerContentChangedEvent = jasmine.createSpy('triggerContentChangedEvent');

        editor = <IEditor>(<any>{
            getDocument: () => document,
            getElementAtCursor: (selector: string, node: Node) =>
                findClosestElementAncestor(node, document.body, selector),
            addContentEditFeature: () => {},
            queryElements: (selector: string) => {
                return document.querySelectorAll(selector);
            },
            triggerPluginEvent: (arg0: any, arg1: any) => {
                triggerContentChangedEvent(arg0, arg1);
            },
            runAsync: (callback: () => void) => callback(),
            getSelectionRange: () =>
                <Range>{
                    collapsed: true,
                },
            select,
        });

        ({ entity, delimiterAfter, delimiterBefore } = addEntityBeforeEach(entity, wrapper));
    });

    afterAll(() => {
        cleanUp();
    });

    describe('Move Before |', () => {
        function runTest(element: Element | null, expected: boolean, event: PluginKeyDownEvent) {
            editor.getFocusedPosition = () => (element ? new Position(element, 0) : null)!;

            const result = moveToDelimiterBefore.shouldHandleEvent(
                event,
                editor,
                false /* ctrlOrMeta */
            );

            expect(result).toBe(expected);
            return event;
        }

        it('DelimiterAfter, no shiftKey', () => {
            let preventDefaultSpy = jasmine.createSpy('preventDefault');
            let extendSpy = jasmine.createSpy('expand');
            let setPositionSpy = jasmine.createSpy('setPosition');
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    preventDefault() {
                        preventDefaultSpy();
                    },
                },
            };

            event = runTest(delimiterAfter, true /* expected */, event);
            const getSelectionProto = document.getSelection;
            document.getSelection = () =>
                <Selection>{
                    extend(node: Node, offset: number) {
                        extendSpy(node, offset);
                    },
                    setPosition(node: Node, offset: number) {
                        setPositionSpy(node, offset);
                    },
                };
            moveToDelimiterBefore.handleEvent(event, editor);

            expect(setPositionSpy).toHaveBeenCalledWith(testContainer, 0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(extendSpy).toHaveBeenCalledTimes(0);

            document.getSelection = getSelectionProto;
        });

        it('DelimiterAfter, with shiftKey', () => {
            let preventDefaultSpy = jasmine.createSpy('preventDefault');
            let extendSpy = jasmine.createSpy('expand');
            let setPositionSpy = jasmine.createSpy('setPosition');
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    shiftKey: true,
                    preventDefault() {
                        preventDefaultSpy();
                    },
                },
            };

            event = runTest(delimiterAfter, true /* expected */, event);

            const getSelectionProto = document.getSelection;
            document.getSelection = () =>
                <Selection>{
                    extend(node: Node, offset: number) {
                        extendSpy(node, offset);
                    },
                    setPosition(node: Node, offset: number) {
                        setPositionSpy(node, offset);
                    },
                };
            moveToDelimiterBefore.handleEvent(event, editor);

            expect(extendSpy).toHaveBeenCalledWith(testContainer, 0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(setPositionSpy).toHaveBeenCalledTimes(0);

            document.getSelection = getSelectionProto;
        });

        it('Element not an delimiter', () => {
            delimiterAfter!.setAttribute('class', '');
            runTest(delimiterAfter, false /* expected */, defaultEvent);
        });

        it('Handle Event without cache', () => {
            let preventDefaultSpy = jasmine.createSpy('preventDefault');
            let extendSpy = jasmine.createSpy('expand');
            let setPositionSpy = jasmine.createSpy('setPosition');

            moveToDelimiterBefore.handleEvent(defaultEvent, editor);

            expect(setPositionSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(extendSpy).toHaveBeenCalledTimes(0);
        });

        it('Null', () => {
            runTest(null, false /* expected */, defaultEvent);
        });
    });

    describe('Move After |', () => {
        function runTest(element: Element | null, expected: boolean, event: PluginKeyDownEvent) {
            editor.getFocusedPosition = () => (element ? new Position(element, 0) : null)!;

            const result = moveToDelimiterAfter.shouldHandleEvent(
                event,
                editor,
                false /* ctrlOrMeta */
            );

            expect(result).toBe(expected);
            return event;
        }

        it('DelimiterAfter', () => {
            runTest(delimiterAfter, false /* expected */, defaultEvent);
        });

        it('DelimiterBefore, no shiftKey', () => {
            let preventDefaultSpy = jasmine.createSpy('preventDefault');
            let extendSpy = jasmine.createSpy('expand');
            let setPositionSpy = jasmine.createSpy('setPosition');
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    preventDefault() {
                        preventDefaultSpy();
                    },
                },
            };

            event = runTest(delimiterBefore, true /* expected */, event);

            const getSelectionProto = document.getSelection;
            document.getSelection = () =>
                <Selection>{
                    extend(node: Node, offset: number) {
                        extendSpy(node, offset);
                    },
                    setPosition(node: Node, offset: number) {
                        setPositionSpy(node, offset);
                    },
                };
            moveToDelimiterAfter.handleEvent(event, editor);

            expect(select).toHaveBeenCalledWith(delimiterAfter!, 1);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(extendSpy).toHaveBeenCalledTimes(0);
            document.getSelection = getSelectionProto;
        });

        it('DelimiterBefore, with shiftKey', () => {
            let preventDefaultSpy = jasmine.createSpy('preventDefault');
            let extendSpy = jasmine.createSpy('expand');
            let setPositionSpy = jasmine.createSpy('setPosition');
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    shiftKey: true,
                    preventDefault() {
                        preventDefaultSpy();
                    },
                },
            };

            event = runTest(delimiterBefore, true /* expected */, event);

            const getSelectionProto = document.getSelection;
            document.getSelection = () =>
                <Selection>{
                    extend(node: Node, offset: number) {
                        extendSpy(node, offset);
                    },
                    setPosition(node: Node, offset: number) {
                        setPositionSpy(node, offset);
                    },
                };
            moveToDelimiterAfter.handleEvent(event, editor);

            expect(extendSpy).toHaveBeenCalledWith(delimiterAfter, 1);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
            expect(setPositionSpy).toHaveBeenCalledTimes(0);
            document.getSelection = getSelectionProto;
        });

        it('Element not an delimiter', () => {
            delimiterAfter!.setAttribute('class', '');
            runTest(delimiterAfter, false /* expected */, defaultEvent);
        });

        it('Handle Event without cache', () => {
            let preventDefaultSpy = jasmine.createSpy('preventDefault');
            let extendSpy = jasmine.createSpy('expand');
            let setPositionSpy = jasmine.createSpy('setPosition');

            moveToDelimiterAfter.handleEvent(defaultEvent, editor);

            expect(setPositionSpy).toHaveBeenCalledTimes(0);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
            expect(extendSpy).toHaveBeenCalledTimes(0);
        });

        it('Null', () => {
            runTest(null, false /* expected */, defaultEvent);
        });
    });

    describe('Remove Entity Between delimiters', () => {
        function runTest(element: Element | null, expected: boolean, event: PluginKeyDownEvent) {
            editor.getFocusedPosition = () => (element ? new Position(element, 0) : null)!;

            const result = removeEntityBetweenDelimiters.shouldHandleEvent(
                event,
                editor,
                false /* ctrlOrMeta */
            );

            expect(result).toBe(expected);
            return event;
        }

        it('DelimiterAfter, Backspace', () => {
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    which: Keys.BACKSPACE,
                },
            };

            runTest(delimiterAfter, true /* expected */, event);

            removeEntityBetweenDelimiters.handleEvent(event, editor);

            expect(triggerContentChangedEvent).toHaveBeenCalledTimes(1);
        });

        it('DelimiterAfter, DELETE', () => {
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    which: Keys.DELETE,
                },
            };

            runTest(delimiterAfter, false /* expected */, event);
        });

        it('DelimiterBefore, BACKSPACE', () => {
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    which: Keys.BACKSPACE,
                },
            };

            runTest(delimiterBefore, false /* expected */, event);
        });

        it('DelimiterBefore, DELETE', () => {
            let event = <PluginKeyDownEvent>{
                rawEvent: <KeyboardEvent>{
                    which: Keys.DELETE,
                },
            };

            runTest(delimiterBefore, true /* expected */, event);

            removeEntityBetweenDelimiters.handleEvent(event, editor);

            expect(triggerContentChangedEvent).toHaveBeenCalledTimes(1);
        });
    });
});

function cleanUp() {
    document.body.childNodes.forEach(cn => {
        document.body.removeChild(cn);
    });
}

function addEntityBeforeEach(entity: Entity, wrapper: HTMLElement) {
    entity = <Entity>{
        id: 'test',
        isReadonly: true,
        type: 'Test',
        wrapper,
    };

    commitEntity(wrapper, 'test', true, 'test');
    addDelimiters(wrapper);

    return {
        entity,
        delimiterAfter: wrapper.nextElementSibling,
        delimiterBefore: wrapper.previousElementSibling,
    };
}
