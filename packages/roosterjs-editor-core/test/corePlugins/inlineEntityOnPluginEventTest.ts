import { inlineEntityOnPluginEvent } from '../../lib/corePlugins/utils/InlineEntityHandlers/inlineEntityOnPluginEvent';
import {
    BeforeCutCopyEvent,
    EditorReadyEvent,
    DelimiterClasses,
    Entity,
    ExtractContentWithDomEvent,
    IEditor,
    NormalSelectionRange,
    PluginEventType,
    ContentChangedEvent,
    PluginEvent,
    SelectionRangeTypes,
    BeforePasteEvent,
    PluginKeyDownEvent,
    ChangeSource,
} from 'roosterjs-editor-types';
import {
    addDelimiters,
    commitEntity,
    findClosestElementAncestor,
    Position,
} from 'roosterjs-editor-dom';

const DELIMITER_SELECTOR =
    '.' + DelimiterClasses.DELIMITER_AFTER + ',.' + DelimiterClasses.DELIMITER_BEFORE;

describe('Inline Entity On Plugin Event |', () => {
    let wrapper: HTMLElement;
    let editor: IEditor;

    beforeEach(() => {
        wrapper = document.createElement('span');
        wrapper.innerHTML = 'Test';
        document.body.appendChild(wrapper);

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
            function arrangeAndAct() {
                editor.getFocusedPosition = () => new Position(delimiterBefore!, 0);

                delimiterBefore?.insertBefore(textToAdd, delimiterBefore.firstChild);

                inlineEntityOnPluginEvent(
                    <PluginKeyDownEvent>{
                        eventType: PluginEventType.KeyDown,
                        rawEvent: <KeyboardEvent>{
                            which: 66 /* B */,
                            key: 'B',
                        },
                    },
                    editor
                );
            }

            it('Is Delimiter', () => {
                arrangeAndAct();

                expect(delimiterBefore?.textContent).toEqual('');
                expect(delimiterBefore?.textContent?.length).toEqual(0);
                expect(delimiterBefore?.childNodes.length).toEqual(0);
            });

            it('Is not Delimiter', () => {
                delimiterBefore?.removeAttribute('class');
                arrangeAndAct();

                expect(delimiterBefore?.textContent).not.toEqual('');
                expect(delimiterBefore?.textContent?.length).toEqual(4);
                expect(delimiterBefore?.childNodes.length).toEqual(1);
            });

            it('Selection not collapsed', () => {
                editor.getSelectionRangeEx = () => {
                    return <NormalSelectionRange>(<any>{
                        areAllCollapsed: false,
                        type: SelectionRangeTypes.Normal,
                    });
                };
                spyOn(editor, 'getElementAtCursor').and.returnValue(delimiterAfter as HTMLElement);

                arrangeAndAct();

                expect(editor.getElementAtCursor).not.toHaveBeenCalled();
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
            });
        });

        describe('Element After |', () => {
            afterEach(() => {
                document.body.childNodes.forEach(cn => {
                    document.body.removeChild(cn);
                });
            });
            function arrangeAndAct() {
                editor.getFocusedPosition = () => new Position(delimiterAfter!, 0);

                delimiterAfter?.appendChild(textToAdd);

                inlineEntityOnPluginEvent(
                    <PluginKeyDownEvent>{
                        eventType: PluginEventType.KeyDown,
                        rawEvent: <KeyboardEvent>{
                            which: 66 /* B */,
                            key: 'B',
                        },
                    },
                    editor
                );
            }

            it('Is Delimiter', () => {
                arrangeAndAct();

                delimiterAfter = getDelimiter(entity, true);
                expect(delimiterAfter.textContent).toEqual('');
                expect(delimiterAfter.textContent?.length).toEqual(0);
                expect(delimiterAfter.childNodes.length).toEqual(0);
            });

            it('Is not Delimiter', () => {
                delimiterAfter?.removeAttribute('class');
                arrangeAndAct();

                expect(delimiterAfter?.textContent).not.toEqual('');
                expect(delimiterAfter?.textContent?.length).toEqual(4);
                expect(delimiterAfter?.childNodes.length).toEqual(1);
            });

            it('Selection not collapsed', () => {
                editor.getSelectionRangeEx = () => {
                    return <NormalSelectionRange>(<any>{
                        areAllCollapsed: false,
                        type: SelectionRangeTypes.Normal,
                    });
                };
                spyOn(editor, 'getElementAtCursor').and.returnValue(delimiterAfter as HTMLElement);

                arrangeAndAct();

                expect(editor.getElementAtCursor).not.toHaveBeenCalled();
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

            inlineEntityOnPluginEvent(
                <BeforePasteEvent>(<any>{
                    eventType: PluginEventType.BeforePaste,
                    clipboardData: {},
                    fragment: rootDiv,
                }),
                editor
            );

            expect(rootDiv.querySelectorAll(DELIMITER_SELECTOR).length).toBe(expectedDelimiters);
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
