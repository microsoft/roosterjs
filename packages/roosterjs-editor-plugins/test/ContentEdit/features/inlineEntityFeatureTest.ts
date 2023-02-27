import * as getComputedStyles from 'roosterjs-editor-dom/lib/utils/getComputedStyles';
import { Entity, IEditor, Keys, PluginKeyDownEvent } from 'roosterjs-editor-types';
import { EntityFeatures } from '../../../lib/plugins/ContentEdit/features/entityFeatures';
import {
    addDelimiters,
    commitEntity,
    findClosestElementAncestor,
    Position,
} from 'roosterjs-editor-dom';

describe('Content Edit Features |', () => {
    const { MoveBetweenDelimitersFeature, removeEntityBetweenDelimiters } = EntityFeatures;
    let entity: Entity;
    let delimiterAfter: Element | null;
    let delimiterBefore: Element | null;
    let wrapper: HTMLElement;
    let editor: IEditor;
    let select: jasmine.Spy;
    let triggerContentChangedEvent: jasmine.Spy;
    let testContainer: HTMLDivElement;

    let defaultEvent = <PluginKeyDownEvent>{};
    let extendSpy: jasmine.Spy;
    let event: PluginKeyDownEvent;
    let preventDefaultSpy: jasmine.Spy;

    beforeAll(() => {
        cleanUp();
    });

    beforeEach(() => {
        preventDefaultSpy = jasmine.createSpy('preventDefault');
        extendSpy = jasmine.createSpy('expand');
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

            const result = MoveBetweenDelimitersFeature.shouldHandleEvent(
                event,
                editor,
                false /* ctrlOrMeta */
            );

            expect(result).toBe(expected);
            return event;
        }
        function runTests() {
            it('DelimiterAfter, shouldHandle and Handle, no shiftKey', () => {
                event = runTest(delimiterAfter, true /* expected */, event);

                spyOnSelection();

                MoveBetweenDelimitersFeature.handleEvent(event, editor);

                expect(select).toHaveBeenCalledWith(new Position(testContainer, 0));
                expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
                expect(extendSpy).toHaveBeenCalledTimes(0);

                restoreSelection();
            });

            it('DelimiterAfter, shouldHandle and Handle, with shiftKey', () => {
                event = {
                    ...event,
                    rawEvent: <KeyboardEvent>{
                        ...event.rawEvent,
                        shiftKey: true,
                    },
                };

                event = runTest(delimiterAfter, true /* expected */, event);

                spyOnSelection();

                MoveBetweenDelimitersFeature.handleEvent(event, editor);

                expect(extendSpy).toHaveBeenCalledWith(testContainer, 0);
                expect(preventDefaultSpy).toHaveBeenCalledTimes(1);

                restoreSelection();
            });

            it('DelimiterAfter, should not Handle, no shiftKey', () => {
                event = {
                    ...event,
                    rawEvent: <KeyboardEvent>{
                        ...event.rawEvent,
                        shiftKey: true,
                        which: event.rawEvent.which === Keys.RIGHT ? Keys.LEFT : Keys.RIGHT,
                    },
                };

                event = runTest(delimiterAfter, false /* expected */, event);
            });

            it('DelimiterAfter, should not Handle, with shiftKey', () => {
                event = {
                    ...event,
                    rawEvent: <KeyboardEvent>{
                        ...event.rawEvent,
                        shiftKey: true,
                        which: event.rawEvent.which === Keys.RIGHT ? Keys.LEFT : Keys.RIGHT,
                    },
                };

                event = runTest(delimiterAfter, false /* expected */, event);
            });

            it('DelimiterAfter, shouldHandle and Handle, with shiftKey', () => {
                event = {
                    ...event,
                    rawEvent: <KeyboardEvent>{
                        ...event.rawEvent,
                        shiftKey: true,
                    },
                };

                event = runTest(delimiterAfter, true /* expected */, event);

                spyOnSelection();

                MoveBetweenDelimitersFeature.handleEvent(event, editor);

                expect(extendSpy).toHaveBeenCalledWith(testContainer, 0);
                expect(preventDefaultSpy).toHaveBeenCalledTimes(1);

                restoreSelection();
            });

            it('Element not an delimiter', () => {
                delimiterAfter!.setAttribute('class', '');

                runTest(delimiterAfter, false /* expected */, event);
            });

            it('Handle Event without cache', () => {
                MoveBetweenDelimitersFeature.handleEvent(event, editor);

                expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
                expect(extendSpy).toHaveBeenCalledTimes(0);
            });

            it('Null', () => {
                runTest(null, false /* expected */, event);
            });
        }

        describe('LTR |', () => {
            beforeEach(() => {
                event = <PluginKeyDownEvent>{
                    rawEvent: <KeyboardEvent>{
                        preventDefault() {
                            preventDefaultSpy();
                        },
                        which: Keys.LEFT,
                    },
                };
            });
            runTests();
        });

        describe('RTL |', () => {
            beforeEach(() => {
                event = <PluginKeyDownEvent>{
                    rawEvent: <KeyboardEvent>{
                        preventDefault() {
                            preventDefaultSpy();
                        },
                        which: Keys.RIGHT,
                    },
                };
                spyOn(getComputedStyles, 'getComputedStyle').and.returnValue('rtl');
            });
            runTests();
        });
    });

    describe('Move After |', () => {
        let event: PluginKeyDownEvent;

        function runTest(element: Element | null, expected: boolean, event: PluginKeyDownEvent) {
            editor.getFocusedPosition = () => (element ? new Position(element, 0) : null)!;

            const result = MoveBetweenDelimitersFeature.shouldHandleEvent(
                event,
                editor,
                false /* ctrlOrMeta */
            );

            expect(result).toBe(expected);
            return event;
        }

        function runTests() {
            it('DelimiterAfter', () => {
                runTest(delimiterAfter, false /* expected */, event);
            });

            it('DelimiterBefore, should handle and handle,  no shiftKey', () => {
                event = runTest(delimiterBefore, true /* expected */, event);

                spyOnSelection();
                MoveBetweenDelimitersFeature.handleEvent(event, editor);

                expect(select).toHaveBeenCalledWith(new Position(delimiterAfter!, 1));
                expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
                expect(extendSpy).toHaveBeenCalledTimes(0);

                restoreSelection();
            });

            it('DelimiterBefore, should handle and handle, with shiftKey', () => {
                event = {
                    ...event,
                    rawEvent: <KeyboardEvent>{
                        ...event.rawEvent,
                        shiftKey: true,
                    },
                };
                event = runTest(delimiterBefore, true /* expected */, event);

                spyOnSelection();

                MoveBetweenDelimitersFeature.handleEvent(event, editor);

                expect(extendSpy).toHaveBeenCalledWith(delimiterAfter, 1);
                expect(preventDefaultSpy).toHaveBeenCalledTimes(1);

                restoreSelection();
            });

            it('DelimiterBefore, should not handle, no shiftKey', () => {
                event = {
                    ...event,
                    rawEvent: <KeyboardEvent>{
                        ...event.rawEvent,
                        which: event.rawEvent.which === Keys.RIGHT ? Keys.LEFT : Keys.RIGHT,
                    },
                };
                event = runTest(delimiterBefore, false /* expected */, event);
            });

            it('DelimiterBefore, should not handle, with shiftKey', () => {
                event = {
                    ...event,
                    rawEvent: <KeyboardEvent>{
                        ...event.rawEvent,
                        shiftKey: true,
                        which: event.rawEvent.which === Keys.RIGHT ? Keys.LEFT : Keys.RIGHT,
                    },
                };
                event = runTest(delimiterBefore, false /* expected */, event);
            });

            it('Element not an delimiter', () => {
                delimiterAfter!.setAttribute('class', '');
                runTest(delimiterAfter, false /* expected */, event);
            });

            it('Handle Event without cache', () => {
                MoveBetweenDelimitersFeature.handleEvent(defaultEvent, editor);

                expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
                expect(extendSpy).toHaveBeenCalledTimes(0);
            });

            it('Null', () => {
                runTest(null, false /* expected */, event);
            });
        }

        describe('LTR |', () => {
            beforeEach(() => {
                preventDefaultSpy = jasmine.createSpy('preventDefault');
                event = <PluginKeyDownEvent>{
                    rawEvent: <KeyboardEvent>{
                        preventDefault() {
                            preventDefaultSpy();
                        },
                        which: Keys.RIGHT,
                    },
                };
            });
            runTests();
        });

        describe('RTL |', () => {
            beforeEach(() => {
                preventDefaultSpy = jasmine.createSpy('preventDefault');
                event = <PluginKeyDownEvent>{
                    rawEvent: <KeyboardEvent>{
                        preventDefault() {
                            preventDefaultSpy();
                        },
                        which: Keys.LEFT,
                    },
                };
                spyOn(getComputedStyles, 'getComputedStyle').and.returnValue('rtl');
            });
            runTests();
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

    let selectionTemp: any;
    function spyOnSelection() {
        selectionTemp = document.getSelection;
        document.getSelection = () =>
            <Selection>{
                extend(node: Node, offset: number) {
                    extendSpy(node, offset);
                },
            };
    }

    function restoreSelection() {
        document.getSelection = selectionTemp;
    }
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
