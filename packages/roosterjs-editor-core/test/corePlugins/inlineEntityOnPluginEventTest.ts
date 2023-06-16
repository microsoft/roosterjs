import * as splitTextNode from 'roosterjs-editor-dom/lib/utils/splitTextNode';
import { inlineEntityOnPluginEvent } from '../../lib/corePlugins/utils/inlineEntityOnPluginEvent';
import {
    BeforeCutCopyEvent,
    BeforePasteEvent,
    ChangeSource,
    ContentChangedEvent,
    DelimiterClasses,
    EditorReadyEvent,
    Entity,
    ExtractContentWithDomEvent,
    IEditor,
    NormalSelectionRange,
    PluginEvent,
    PluginEventType,
    PluginKeyDownEvent,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';
import {
    addDelimiters,
    commitEntity,
    findClosestElementAncestor,
    getBlockElementAtNode,
    Position,
} from 'roosterjs-editor-dom';

const ZERO_WIDTH_SPACE = '\u200B';
const DELIMITER_SELECTOR =
    '.' + DelimiterClasses.DELIMITER_AFTER + ',.' + DelimiterClasses.DELIMITER_BEFORE;

describe('Inline Entity On Plugin Event |', () => {
    let wrapper: HTMLElement;
    let editor: IEditor;
    let testContainer: HTMLElement;
    let selectSpy: jasmine.Spy;

    beforeEach(() => {
        wrapper = document.createElement('span');
        wrapper.innerHTML = 'Test';

        testContainer = document.createElement('div');
        testContainer.appendChild(wrapper);
        document.body.appendChild(testContainer);
        spyOn(splitTextNode, 'default').and.callThrough();

        editor = <IEditor>(<any>{
            getDocument: () => document,
            getElementAtCursor: (selector: string, node: Node) => node,
            addContentEditFeature: () => {},
            queryElements: (selector: string) => {
                return document.querySelectorAll(selector);
            },
            runAsync: (callback: () => void) => callback(),
            getSelectionRange: () =>
                <Range>{
                    collapsed: true,
                },
            getSelectionRangeEx: () => {
                return <NormalSelectionRange>{
                    areAllCollapsed: true,
                    type: SelectionRangeTypes.Normal,
                };
            },
            select: selectSpy = jasmine.createSpy('select'),
            getBlockElementAtNode: (node: Node) => getBlockElementAtNode(document.body, node),
        });
    });

    afterEach(() => {
        wrapper.parentElement?.removeChild(wrapper);
        document.body.childNodes.forEach(cn => {
            document.body.removeChild(cn);
        });
    });

    describe('Handle Key Up & Down |', () => {
        let entity: Entity;
        let delimiterAfter: Element | null;
        let delimiterBefore: Element | null;
        let textToAdd: Node;

        beforeEach(() => {
            ({ entity, delimiterAfter, delimiterBefore } = addEntityBeforeEach(entity, wrapper));

            textToAdd = document.createTextNode('Text');

            editor.getElementAtCursor = (selector: string, selectFrom: Node) =>
                findClosestElementAncestor(selectFrom, document.body, selector);
        });

        describe('Element Before |', () => {
            afterEach(() => {
                document.body.childNodes.forEach(cn => {
                    document.body.removeChild(cn);
                });
            });
            function arrangeAndAct(
                which: number = 66 /* B */,
                addElementOnRunAsync: boolean = true
            ) {
                editor.getFocusedPosition = () => new Position(delimiterBefore!, 0);

                editor.runAsync = (callback: (editor: IEditor) => void) => {
                    if (addElementOnRunAsync) {
                        delimiterBefore?.insertBefore(textToAdd, delimiterBefore.firstChild);
                    }

                    callback(editor);
                    return () => {};
                };
                inlineEntityOnPluginEvent(
                    <PluginKeyDownEvent>{
                        eventType: PluginEventType.KeyDown,
                        rawEvent: <KeyboardEvent>{
                            which,
                            key: 'B',
                        },
                    },
                    editor
                );
            }

            it('Is Delimiter', () => {
                arrangeAndAct();

                expect(delimiterBefore?.textContent).toEqual(ZERO_WIDTH_SPACE);
                expect(delimiterBefore?.textContent?.length).toEqual(1);
                expect(delimiterBefore?.childNodes.length).toEqual(1);
                expect(splitTextNode.default).toHaveBeenCalled();
            });

            it('Is not Delimiter', () => {
                delimiterBefore?.removeAttribute('class');
                delimiterBefore?.insertBefore(textToAdd, delimiterBefore.firstChild);

                arrangeAndAct();

                expect(delimiterBefore?.textContent).not.toEqual(ZERO_WIDTH_SPACE);
                expect(delimiterBefore?.textContent?.length).toEqual(5);
                expect(delimiterBefore?.childNodes.length).toEqual(2);
                expect(splitTextNode.default).not.toHaveBeenCalled();
            });

            it('Selection collapsed and not Normal Selection', () => {
                editor.getSelectionRangeEx = () => {
                    return <NormalSelectionRange>(<any>{
                        areAllCollapsed: true,
                        type: SelectionRangeTypes.TableSelection,
                    });
                };
                spyOn(editor, 'getElementAtCursor').and.returnValue(delimiterAfter as HTMLElement);

                arrangeAndAct();

                expect(editor.getElementAtCursor).not.toHaveBeenCalled();
                expect(splitTextNode.default).not.toHaveBeenCalled();
            });

            it('Selection not collapsed and not Normal Selection', () => {
                editor.getSelectionRangeEx = () => {
                    return <NormalSelectionRange>(<any>{
                        areAllCollapsed: false,
                        type: SelectionRangeTypes.TableSelection,
                    });
                };
                spyOn(editor, 'getElementAtCursor').and.returnValue(delimiterAfter as HTMLElement);

                arrangeAndAct();

                expect(editor.getElementAtCursor).not.toHaveBeenCalled();
                expect(splitTextNode.default).not.toHaveBeenCalled();
            });

            it('Enter on delimiter before, clear previous block delimiter', () => {
                const div = document.createElement('div');
                testContainer.insertAdjacentElement('beforebegin', div);
                div.appendChild(delimiterBefore!.cloneNode(true /* deep */));

                arrangeAndAct(13 /* ENTER */, false /* addElementOnRunAsync */);

                expect(div.firstElementChild?.className).toEqual('');
                expect(div.firstElementChild?.textContent).not.toEqual(ZERO_WIDTH_SPACE);
                expect(delimiterBefore!.className).toEqual(DelimiterClasses.DELIMITER_BEFORE);
            });

            it('Key press when selection is not collapsed, delimiter before is the endContainer', () => {
                const testElement = document.createElement('span');
                testElement.appendChild(document.createTextNode('Test'));
                delimiterBefore?.parentElement?.insertBefore(testElement, delimiterBefore);

                const range = new Range();
                range.setStart(testElement, 0);
                range.setEnd(delimiterBefore!, 0);

                editor.getSelectionRangeEx = () => {
                    return <NormalSelectionRange>{
                        areAllCollapsed: false,
                        type: SelectionRangeTypes.Normal,
                        ranges: [range],
                    };
                };
                arrangeAndAct(13 /* ENTER */, false /* addElementOnRunAsync */);

                expect(selectSpy).toHaveBeenCalledWith(
                    new Position(testElement, 0),
                    new Position(testContainer, 1)
                );
            });

            it('Key press when selection is not collapsed, delimiter before is the startContainer', () => {
                const testElement = document.createElement('span');
                testElement.appendChild(document.createTextNode('Test'));
                delimiterBefore?.parentElement?.insertBefore(testElement, null);

                const range = new Range();
                range.setStart(delimiterBefore!, 0);
                range.setEnd(testElement, 0);

                editor.getSelectionRangeEx = () => {
                    return <NormalSelectionRange>{
                        areAllCollapsed: false,
                        type: SelectionRangeTypes.Normal,
                        ranges: [range],
                    };
                };
                arrangeAndAct(13 /* ENTER */, false /* addElementOnRunAsync */);

                expect(selectSpy).toHaveBeenCalledWith(
                    new Position(testContainer, 0),
                    new Position(testElement, 0)
                );
            });

            it('Key press when selection is not collapsed, delimiter after is not part of the selection', () => {
                const testElement = document.createElement('span');
                testElement.appendChild(document.createTextNode('Test'));
                delimiterBefore?.parentElement?.insertBefore(testElement, null);

                const range = new Range();
                range.setStart(testElement, 0);
                range.setEnd(testElement, 1);

                editor.getSelectionRangeEx = () => {
                    return <NormalSelectionRange>{
                        areAllCollapsed: false,
                        type: SelectionRangeTypes.Normal,
                        ranges: [range],
                    };
                };
                arrangeAndAct(13 /* ENTER */, false /* addElementOnRunAsync */);

                expect(selectSpy).not.toHaveBeenCalled();
            });
        });

        describe('Element After |', () => {
            afterEach(() => {
                document.body.childNodes.forEach(cn => {
                    document.body.removeChild(cn);
                });
            });
            function arrangeAndAct(
                which: number = 66 /* B */,
                addElementOnRunAsync: boolean = true
            ) {
                editor.getFocusedPosition = () => new Position(delimiterAfter!, 0);

                editor.runAsync = (callback: (editor: IEditor) => void) => {
                    if (addElementOnRunAsync) {
                        delimiterAfter?.appendChild(textToAdd);
                    }

                    callback(editor);
                    return () => {};
                };

                inlineEntityOnPluginEvent(
                    <PluginKeyDownEvent>{
                        eventType: PluginEventType.KeyDown,
                        rawEvent: <KeyboardEvent>{
                            which,
                            key: 'B',
                        },
                    },
                    editor
                );
            }

            it('Is Delimiter', () => {
                arrangeAndAct();

                delimiterAfter = getDelimiter(entity, true);

                expect(delimiterAfter.textContent).toEqual(ZERO_WIDTH_SPACE);
                expect(delimiterAfter.textContent?.length).toEqual(1);
                expect(delimiterAfter.childNodes.length).toEqual(1);
                expect(delimiterAfter.id).toBeDefined();
                expect(splitTextNode.default).toHaveBeenCalled();
            });

            it('Is not Delimiter', () => {
                delimiterAfter?.removeAttribute('class');
                delimiterAfter?.insertBefore(textToAdd, delimiterAfter.firstChild);

                arrangeAndAct();

                expect(delimiterAfter?.textContent).not.toEqual(ZERO_WIDTH_SPACE);
                expect(delimiterAfter?.textContent?.length).toEqual(5);
                expect(delimiterAfter?.childNodes.length).toEqual(2);
                expect(splitTextNode.default).not.toHaveBeenCalled();
            });

            it('Selection collapsed and not Normal Selection', () => {
                editor.getSelectionRangeEx = () => {
                    return <NormalSelectionRange>(<any>{
                        areAllCollapsed: true,
                        type: SelectionRangeTypes.TableSelection,
                    });
                };
                spyOn(editor, 'getElementAtCursor').and.returnValue(delimiterAfter as HTMLElement);

                arrangeAndAct();

                expect(editor.getElementAtCursor).not.toHaveBeenCalled();
                expect(splitTextNode.default).not.toHaveBeenCalled();
            });

            it('Selection not collapsed and not Normal Selection', () => {
                editor.getSelectionRangeEx = () => {
                    return <NormalSelectionRange>(<any>{
                        areAllCollapsed: false,
                        type: SelectionRangeTypes.TableSelection,
                    });
                };
                spyOn(editor, 'getElementAtCursor').and.returnValue(delimiterAfter as HTMLElement);

                arrangeAndAct();

                expect(editor.getElementAtCursor).not.toHaveBeenCalled();
                expect(splitTextNode.default).not.toHaveBeenCalled();
            });

            it('Enter on delimiter after, clear the previous sibling class', () => {
                const div = document.createElement('div');
                testContainer.insertAdjacentElement('afterend', div);
                div.appendChild(delimiterAfter!.cloneNode(true /* deep */));
                arrangeAndAct(13 /* ENTER */, false /* addElementOnRunAsync */);

                expect(div.firstElementChild?.className).toEqual('');
                expect(div.firstElementChild?.textContent).not.toEqual(ZERO_WIDTH_SPACE);
                expect(delimiterAfter!.className).toEqual(DelimiterClasses.DELIMITER_AFTER);
            });

            it('Key press when selection is not collapsed, delimiter after is the endContainer', () => {
                const testElement = document.createElement('span');
                testElement.appendChild(document.createTextNode('Test'));
                delimiterBefore?.parentElement?.insertBefore(testElement, delimiterBefore);

                const range = new Range();
                range.setStart(testElement, 0);
                range.setEnd(delimiterAfter!, 0);

                editor.getSelectionRangeEx = () => {
                    return <NormalSelectionRange>{
                        areAllCollapsed: false,
                        type: SelectionRangeTypes.Normal,
                        ranges: [range],
                    };
                };
                arrangeAndAct(13 /* ENTER */, false /* addElementOnRunAsync */);

                expect(selectSpy).toHaveBeenCalledWith(
                    new Position(testElement, 0),
                    new Position(testContainer, 4)
                );
            });

            it('Key press when selection is not collapsed, delimiter after is the startContainer', () => {
                const testElement = document.createElement('span');
                testElement.appendChild(document.createTextNode('Test'));
                delimiterBefore?.parentElement?.insertBefore(testElement, null);

                const range = new Range();
                range.setStart(delimiterAfter!, 0);
                range.setEnd(testElement, 0);

                editor.getSelectionRangeEx = () => {
                    return <NormalSelectionRange>{
                        areAllCollapsed: false,
                        type: SelectionRangeTypes.Normal,
                        ranges: [range],
                    };
                };
                arrangeAndAct(13 /* ENTER */, false /* addElementOnRunAsync */);

                expect(selectSpy).toHaveBeenCalledWith(
                    new Position(testContainer, 3),
                    new Position(testElement, 0)
                );
            });

            it('Key press when selection is not collapsed, delimiter after is not part of the selection', () => {
                const testElement = document.createElement('span');
                testElement.appendChild(document.createTextNode('Test'));
                delimiterBefore?.parentElement?.insertBefore(testElement, null);

                const range = new Range();
                range.setStart(testElement, 0);
                range.setEnd(testElement, 1);

                editor.getSelectionRangeEx = () => {
                    return <NormalSelectionRange>{
                        areAllCollapsed: false,
                        type: SelectionRangeTypes.Normal,
                        ranges: [range],
                    };
                };
                arrangeAndAct(13 /* ENTER */, false /* addElementOnRunAsync */);

                expect(selectSpy).not.toHaveBeenCalled();
            });
        });
    });

    describe('ExtractDOM and Before Cut Copy', () => {
        it('Before CutCopyEvent', () => {
            const rootDiv = document.createElement('div');
            const element1 = document.createElement('span');
            rootDiv.appendChild(element1);
            addDelimiters(element1);

            inlineEntityOnPluginEvent(
                <BeforeCutCopyEvent>{
                    eventType: PluginEventType.BeforeCutCopy,
                    clonedRoot: rootDiv,
                },
                editor
            );

            expect(rootDiv.querySelectorAll(DELIMITER_SELECTOR).length).toBe(0);
        });

        it('Before CutCopyEvent, dont remove delimiter with additional content', () => {
            const rootDiv = document.createElement('div');
            const element1 = document.createElement('span');
            rootDiv.appendChild(element1);
            const [after, before]: Element[] = addDelimiters(element1);

            after.appendChild(document.createTextNode('testAfter'));
            before.appendChild(document.createTextNode('testBefore'));

            inlineEntityOnPluginEvent(
                <BeforeCutCopyEvent>{
                    eventType: PluginEventType.BeforeCutCopy,
                    clonedRoot: rootDiv,
                },
                editor
            );

            expect(rootDiv.querySelectorAll(DELIMITER_SELECTOR).length).toBe(0);
            expect(after).toBeDefined();
            expect(before).toBeDefined();
            expect(after.innerHTML).toEqual('testAfter');
            expect(before.innerHTML).toEqual('testBefore');
        });

        it('ExtractContentWithDOM', () => {
            const rootDiv = document.createElement('div');
            const element1 = document.createElement('span');
            rootDiv.appendChild(element1);
            addDelimiters(element1);

            inlineEntityOnPluginEvent(
                <ExtractContentWithDomEvent>{
                    eventType: PluginEventType.ExtractContentWithDom,
                    clonedRoot: rootDiv,
                },
                editor
            );

            expect(rootDiv.querySelectorAll(DELIMITER_SELECTOR).length).toBe(0);
        });

        it('ExtractContentWithDOM, dont remove delimiter with additional content', () => {
            const rootDiv = document.createElement('div');
            const element1 = document.createElement('span');
            rootDiv.appendChild(element1);
            const [after, before]: Element[] = addDelimiters(element1);

            after.appendChild(document.createTextNode('testAfter'));
            before.appendChild(document.createTextNode('testBefore'));

            inlineEntityOnPluginEvent(
                <ExtractContentWithDomEvent>{
                    eventType: PluginEventType.ExtractContentWithDom,
                    clonedRoot: rootDiv,
                },
                editor
            );

            expect(rootDiv.querySelectorAll(DELIMITER_SELECTOR).length).toBe(0);
            expect(after).toBeDefined();
            expect(before).toBeDefined();
            expect(after.innerHTML).toEqual('testAfter');
            expect(before.innerHTML).toEqual('testBefore');
        });
    });

    function runEditorReadyContentChangedTest(
        expectedDelimiters: number,
        elementToUse: Node,
        eventParam: PluginEvent,
        updateCallback?: (node: Node) => void
    ) {
        const rootDiv = document.createElement('div');

        spyOn(editor, 'queryElements').and.callFake((selector: string) =>
            Array.from(rootDiv.querySelectorAll(selector))
        );

        if (elementToUse) {
            rootDiv.appendChild(elementToUse);
        }
        updateCallback?.(elementToUse);

        inlineEntityOnPluginEvent(eventParam, editor);

        expect(rootDiv.querySelectorAll(DELIMITER_SELECTOR).length).toBe(expectedDelimiters);
    }

    describe('Editor Ready |', () => {
        let event: EditorReadyEvent;

        beforeEach(() => {
            event = <EditorReadyEvent>{
                eventType: PluginEventType.EditorReady,
            };
        });

        it('New Editor with Read only Inline Entity in content', () => {
            const element = document.createElement('span');
            commitEntity(element, '123', true /* ReadOnly */, '1');

            runEditorReadyContentChangedTest(2, element, event);
        });

        it('New Editor with Read only Block Entity in content', () => {
            const element = document.createElement('div');
            commitEntity(element, '123', true /* ReadOnly */, '1');

            runEditorReadyContentChangedTest(0, element, event);
        });

        it('New Editor with Editable Inline Entity in content', () => {
            const element = document.createElement('span');
            commitEntity(element, '123', false /* ReadOnly */, '1');

            runEditorReadyContentChangedTest(0, element, event);
        });

        it('New Editor with Editable Block Entity in content', () => {
            const element = document.createElement('div');
            commitEntity(element, '123', false /* ReadOnly */, '1');

            runEditorReadyContentChangedTest(0, element, event);
        });

        it('New Editor with Normal Element', () => {
            const element = document.createElement('div');
            runEditorReadyContentChangedTest(0, element, event);
        });

        it('New Editor with no elements', () => {
            const element = document.createElement('div');
            runEditorReadyContentChangedTest(0, element, event);
        });

        it('New Editor with invalid delimiters', () => {
            const element = document.createElement('div');
            runEditorReadyContentChangedTest(0, element, event, node => {
                addDelimiters(node as HTMLElement);
                node.parentElement?.removeChild(node);
            });
        });
    });

    describe('Content Changed |', () => {
        let event: ContentChangedEvent;

        beforeEach(() => {
            event = <ContentChangedEvent>{
                eventType: PluginEventType.ContentChanged,
                source: ChangeSource.SetContent,
            };
        });

        it('ContentChanged with Read only Inline Entity in content', () => {
            const element = document.createElement('span');
            commitEntity(element, '123', true /* ReadOnly */, '1');

            runEditorReadyContentChangedTest(2, element, event);
        });

        it('ContentChanged source not SetContent', () => {
            const element = document.createElement('span');
            commitEntity(element, '123', true /* ReadOnly */, '1');

            event.source = ChangeSource.AutoLink;

            runEditorReadyContentChangedTest(0, element, event);
        });

        it('ContentChanged with Read only Block Entity in content', () => {
            const element = document.createElement('div');
            commitEntity(element, '123', true /* ReadOnly */, '1');

            runEditorReadyContentChangedTest(0, element, event);
        });

        it('ContentChanged with Editable Inline Entity in content', () => {
            const element = document.createElement('span');
            commitEntity(element, '123', false /* ReadOnly */, '1');

            runEditorReadyContentChangedTest(0, element, event);
        });

        it('ContentChanged with Editable Block Entity in content', () => {
            const element = document.createElement('div');
            commitEntity(element, '123', false /* ReadOnly */, '1');

            runEditorReadyContentChangedTest(0, element, event);
        });

        it('ContentChanged with Normal Element', () => {
            const element = document.createElement('div');
            runEditorReadyContentChangedTest(0, element, event);
        });

        it('ContentChanged with no elements', () => {
            const element = document.createElement('div');
            runEditorReadyContentChangedTest(0, element, event);
        });

        it('ContentChanged with invalid delimiters', () => {
            const element = document.createElement('div');
            runEditorReadyContentChangedTest(0, element, event, node => {
                addDelimiters(node as HTMLElement);
                node.parentElement?.removeChild(node);
            });
        });
    });

    describe('Before Paste |', () => {
        function runTest(expectedDelimiters: number, elementToUse?: Node) {
            const rootDiv = document.createElement('div');
            if (elementToUse) {
                rootDiv.appendChild(elementToUse);
            }
            const additionalAllowedCssClasses: string[] = [];
            inlineEntityOnPluginEvent(
                <BeforePasteEvent>(<any>{
                    eventType: PluginEventType.BeforePaste,
                    clipboardData: {},
                    fragment: rootDiv,
                    sanitizingOption: {
                        additionalAllowedCssClasses,
                    },
                }),
                editor
            );
            expect(rootDiv.querySelectorAll(DELIMITER_SELECTOR).length).toBe(expectedDelimiters);
            expect(additionalAllowedCssClasses).toContain(DelimiterClasses.DELIMITER_AFTER);
            expect(additionalAllowedCssClasses).toContain(DelimiterClasses.DELIMITER_BEFORE);
        }

        it('Before Paste with Read only Inline Entity in content', () => {
            const element = document.createElement('span');
            commitEntity(element, '123', true /* ReadOnly */, '1');

            runTest(2, element);
        });

        it('Before Paste with Read only Block Entity in content', () => {
            const element = document.createElement('div');
            commitEntity(element, '123', true /* ReadOnly */, '1');

            runTest(0, element);
        });

        it('Before Paste with Editable Inline Entity in content', () => {
            const element = document.createElement('span');
            commitEntity(element, '123', false /* ReadOnly */, '1');

            runTest(0, element);
        });

        it('Before Paste with Editable Block Entity in content', () => {
            const element = document.createElement('div');
            commitEntity(element, '123', false /* ReadOnly */, '1');

            runTest(0, element);
        });

        it('Before Paste with Normal Element', () => {
            const element = document.createElement('div');
            runTest(0, element);
        });

        it('Before Paste with no elements', () => {
            const element = document.createElement('div');
            runTest(0, element);
        });
    });
});

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

function getDelimiter(entity: Entity, after: boolean) {
    return (after
        ? entity.wrapper.nextElementSibling!
        : entity.wrapper.previousElementSibling!) as HTMLElement;
}
