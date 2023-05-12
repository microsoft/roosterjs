import * as TestHelper from '../../../../roosterjs-editor-api/test/TestHelper';
import { Browser } from 'roosterjs-editor-dom';
import { TextFeatures } from '../../../lib/plugins/ContentEdit/features/textFeatures';

import {
    BuildInEditFeature,
    ExperimentalFeatures,
    IEditor,
    Keys,
    PluginEventType,
    PluginKeyboardEvent,
} from 'roosterjs-editor-types';

describe('Text Features |', () => {
    let editor: IEditor;
    const TEST_ID = 'Test_ID';
    const TEST_ELEMENT_ID = 'test';

    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID, null, [ExperimentalFeatures.TabKeyTextFeatures]);
    });

    afterEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement.removeChild(element);
        }
        editor.dispose();
    });

    function runShouldHandleTest(
        feature: BuildInEditFeature<PluginKeyboardEvent>,
        content: string,
        selectCallback: () => void,
        shouldHandleExpect: boolean,
        focusEditorOnStart: boolean = true
    ) {
        //Arrange
        if (focusEditorOnStart) {
            editor.focus();
        }
        const keyboardEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: simulateKeyDownEvent(Keys.TAB, feature == TextFeatures.outdentWhenTabText),
        };
        editor.setContent(content);
        selectCallback();

        //Act
        const result = feature.shouldHandleEvent(keyboardEvent, editor, false);

        //Assert
        expect(!!result).toBe(shouldHandleExpect);
    }

    function runHandleTest(
        feature: BuildInEditFeature<PluginKeyboardEvent>,
        content: string,
        selectCallback: () => void,
        contentExpected: string
    ) {
        //Arrange
        const keyboardEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: simulateKeyDownEvent(Keys.TAB, feature == TextFeatures.outdentWhenTabText),
        };
        editor.setContent(content);
        selectCallback();

        //Act
        feature.handleEvent(keyboardEvent, editor);

        //Assert
        expect(editor.getContent()).toBe(contentExpected);
    }

    describe('indentWhenTabText |', () => {
        describe('Should handle event |', () => {
            it('Should handle, text collapsed', () => {
                runShouldHandleTest(
                    TextFeatures.indentWhenTabText,
                    `<div id='${TEST_ELEMENT_ID}'></div>`,
                    () => {
                        const element = editor.getDocument().getElementById(TEST_ELEMENT_ID);
                        const range = new Range();
                        range.setStart(element, 0);
                        editor.select(range);
                    },
                    true
                );
            });

            it('Should handle, range not collapsed', () => {
                runShouldHandleTest(
                    TextFeatures.indentWhenTabText,
                    `<div id='${TEST_ELEMENT_ID}'>Test</div>`,
                    () => {
                        const element = editor.getDocument().getElementById(TEST_ELEMENT_ID);
                        const range = new Range();
                        range.setStart(element, 0);
                        range.setEnd(element, 1);
                        editor.select(range);
                    },
                    true
                );
            });

            it('Should not handle, in a list', () => {
                runShouldHandleTest(
                    TextFeatures.indentWhenTabText,
                    `<div> <ol> <li id='${TEST_ELEMENT_ID}'>sad </li></ol> </div>`,
                    () => {
                        const element = editor.getDocument().getElementById(TEST_ELEMENT_ID);
                        const range = new Range();
                        range.setStart(element, 0);
                        editor.select(range);
                    },
                    false
                );
            });

            it('Should not handle, in a not contenteditable entity', () => {
                runShouldHandleTest(
                    TextFeatures.indentWhenTabText,
                    `<div><br></div><div id='${TEST_ELEMENT_ID}' class="_Entity _EType_ _EReadonly_1" contenteditable="false"><span data-hydrated-html="">Not Editable</span></div>`,
                    () => {
                        const element = editor.getDocument().getElementById(TEST_ELEMENT_ID);
                        const range = new Range();
                        range.setStart(element, 0);
                        editor.select(range);
                    },
                    false
                );
            });

            it('Should not handle, Link in a not content editable entity is focused', () => {
                runShouldHandleTest(
                    TextFeatures.indentWhenTabText,
                    `<div><br></div><div class="_Entity _EType_ _EReadonly_1" contenteditable="false"><span data-hydrated-html="<a href='https://github.com/microsoft/roosterjs'>Link</a>"><a id='${TEST_ELEMENT_ID}' href="https://github.com/microsoft/roosterjs">Link</a></span></div><br>`,
                    () => {
                        const element = editor.getDocument().getElementById(TEST_ELEMENT_ID);
                        element.focus();
                    },
                    false,
                    false
                );
            });
        });

        describe('Handle event |', () => {
            function runHandleTest(
                feature: BuildInEditFeature<PluginKeyboardEvent>,
                content: string,
                selectCallback: () => void,
                contentExpected: string,
                additionalExpect?: () => void
            ) {
                //Arrange
                const keyboardEvent: PluginKeyboardEvent = {
                    eventType: PluginEventType.KeyDown,
                    rawEvent: simulateKeyDownEvent(Keys.TAB),
                };
                editor.setContent(content);
                selectCallback();

                //Act
                feature.handleEvent(keyboardEvent, editor);

                //Assert
                expect(editor.getContent()).toBe(contentExpected);
                additionalExpect?.();
            }
            TestHelper.itFirefoxOnly('Handle event, text collapsed', () => {
                runHandleTest(
                    TextFeatures.indentWhenTabText,
                    `<div id='${TEST_ELEMENT_ID}'></div>`,
                    () => {
                        const element = editor.getDocument().getElementById(TEST_ELEMENT_ID);
                        const range = new Range();
                        range.setStart(element, 0);
                        editor.select(range);
                    },
                    '<div id="test"><span>      </span></div>'
                );
            });

            TestHelper.itFirefoxOnly(
                'Handle, range not collapsed and is not selected from start to end 2',
                () => {
                    runHandleTest(
                        TextFeatures.indentWhenTabText,
                        `<div id='${TEST_ELEMENT_ID}'>Test</div>`,
                        () => {
                            const element = editor.getDocument().getElementById(TEST_ELEMENT_ID)
                                .firstChild;
                            const range = new Range();
                            range.setStart(element, 0);
                            range.setEnd(element, 1);
                            editor.select(range);
                        },
                        '<div id="test"><span>      </span>est</div>'
                    );
                }
            );

            TestHelper.itFirefoxOnly(
                'Handle, range not collapsed and is selected from start to end',
                () => {
                    runHandleTest(
                        TextFeatures.indentWhenTabText,
                        `<div id='${TEST_ELEMENT_ID}'>Test</div>`,
                        () => {
                            const element = editor.getDocument().getElementById(TEST_ELEMENT_ID)
                                .firstChild;
                            const range = new Range();
                            range.setStart(element, 0);
                            range.setEnd(element, 4);
                            editor.select(range);
                        },
                        '<blockquote style="margin-top:0;margin-bottom:0"><div id="test">Test</div></blockquote>'
                    );
                }
            );

            TestHelper.itFirefoxOnly(
                'Handle, range not collapsed and is selected from start to end, with empty elemets at start',
                () => {
                    runHandleTest(
                        TextFeatures.indentWhenTabText,
                        `<div id='${TEST_ELEMENT_ID}'><span><span></span></span>Test</div>`,
                        () => {
                            const element = editor.getDocument().getElementById(TEST_ELEMENT_ID)
                                .lastChild;
                            const range = new Range();
                            range.setStart(element, 0);
                            range.setEnd(element, 4);
                            editor.select(range);
                        },
                        '<blockquote style="margin-top:0;margin-bottom:0"><div id="test"><span><span></span></span>Test</div></blockquote>'
                    );
                }
            );

            TestHelper.itFirefoxOnly(
                'Handle, range not collapsed and is selected from start to end, with empty elemets at start 2',
                () => {
                    runHandleTest(
                        TextFeatures.indentWhenTabText,
                        `<div id='${TEST_ELEMENT_ID}'><span><b></b></span><span></span>Test</div>`,
                        () => {
                            const element = editor.getDocument().getElementById(TEST_ELEMENT_ID)
                                .lastChild;
                            const range = new Range();
                            range.setStart(element, 0);
                            range.setEnd(element, 4);
                            editor.select(range);
                        },
                        '<blockquote style="margin-top:0;margin-bottom:0"><div id="test"><span><b></b></span><span></span>Test</div></blockquote>'
                    );
                }
            );

            TestHelper.itFirefoxOnly(
                'Handle, range not collapsed and is selected from start to end, with empty elemets at start 3',
                () => {
                    runHandleTest(
                        TextFeatures.indentWhenTabText,
                        `<div id='${TEST_ELEMENT_ID}'><span><b></b></span><i></i><span></span>Test</div>`,
                        () => {
                            const element = editor.getDocument().getElementById(TEST_ELEMENT_ID)
                                .lastChild;
                            const range = new Range();
                            range.setStart(element, 0);
                            range.setEnd(element, 4);
                            editor.select(range);
                        },
                        '<blockquote style="margin-top:0;margin-bottom:0"><div id="test"><span><b></b></span><i></i><span></span>Test</div></blockquote>'
                    );
                }
            );

            TestHelper.itFirefoxOnly(
                'Handle, range not collapsed and is selected from start to end, with empty elemets at start 4',
                () => {
                    runHandleTest(
                        TextFeatures.indentWhenTabText,
                        `<div id='${TEST_ELEMENT_ID}'><span><b><i><u></u></i></b></span><span><b><i><u></u></i></b></span>Test</div>`,
                        () => {
                            const element = editor.getDocument().getElementById(TEST_ELEMENT_ID)
                                .lastChild;
                            const range = new Range();
                            range.setStart(element, 0);
                            range.setEnd(element, 4);
                            editor.select(range);
                        },
                        '<blockquote style="margin-top:0;margin-bottom:0"><div id="test"><span><b><i><u></u></i></b></span><span><b><i><u></u></i></b></span>Test</div></blockquote>'
                    );
                }
            );

            TestHelper.itFirefoxOnly(
                'Handle, range not collapsed and is selected from start to end, with empty elemets at end',
                () => {
                    runHandleTest(
                        TextFeatures.indentWhenTabText,
                        `<div id='${TEST_ELEMENT_ID}'>Test<span><span></span></span></div>`,
                        () => {
                            const element = editor.getDocument().getElementById(TEST_ELEMENT_ID)
                                .firstChild;
                            const range = new Range();
                            range.setStart(element, 0);
                            range.setEnd(element, 4);
                            editor.select(range);
                        },
                        '<blockquote style="margin-top:0;margin-bottom:0"><div id="test">Test<span><span></span></span></div></blockquote>'
                    );
                }
            );

            TestHelper.itFirefoxOnly(
                'Handle, range not collapsed and is selected from start to end, with empty elemets at end 2',
                () => {
                    runHandleTest(
                        TextFeatures.indentWhenTabText,
                        `<div id='${TEST_ELEMENT_ID}'>Test<span><b></b></span><span></span></div>`,
                        () => {
                            const element = editor.getDocument().getElementById(TEST_ELEMENT_ID)
                                .firstChild;
                            const range = new Range();
                            range.setStart(element, 0);
                            range.setEnd(element, 4);
                            editor.select(range);
                        },
                        '<blockquote style="margin-top:0;margin-bottom:0"><div id="test">Test<span><b></b></span><span></span></div></blockquote>'
                    );
                }
            );

            TestHelper.itFirefoxOnly(
                'Handle, range not collapsed and is selected from start to end, with empty elemets at end 3',
                () => {
                    runHandleTest(
                        TextFeatures.indentWhenTabText,
                        `<div id='${TEST_ELEMENT_ID}'>Test<span><b></b></span><i></i><span></span></div>`,
                        () => {
                            const element = editor.getDocument().getElementById(TEST_ELEMENT_ID)
                                .firstChild;
                            const range = new Range();
                            range.setStart(element, 0);
                            range.setEnd(element, 4);
                            editor.select(range);
                        },
                        '<blockquote style="margin-top:0;margin-bottom:0"><div id="test">Test<span><b></b></span><i></i><span></span></div></blockquote>'
                    );
                }
            );

            TestHelper.itFirefoxOnly(
                'Handle, range not collapsed and is selected from start to end, with empty elemets at end 4',
                () => {
                    runHandleTest(
                        TextFeatures.indentWhenTabText,
                        `<div id='${TEST_ELEMENT_ID}'>Test<span><b><i><u></u></i></b></span><span><b><i><u></u></i></b></span></div>`,
                        () => {
                            const element = editor.getDocument().getElementById(TEST_ELEMENT_ID)
                                .firstChild;
                            const range = new Range();
                            range.setStart(element, 0);
                            range.setEnd(element, 4);
                            editor.select(range);
                        },
                        '<blockquote style="margin-top:0;margin-bottom:0"><div id="test">Test<span><b><i><u></u></i></b></span><span><b><i><u></u></i></b></span></div></blockquote>'
                    );
                }
            );

            TestHelper.itFirefoxOnly(
                'Handle, range not collapsed and more than one block in selection',
                () => {
                    runHandleTest(
                        TextFeatures.indentWhenTabText,
                        `<div><span id='${TEST_ELEMENT_ID}2'>Test</span></div><div><span id='${TEST_ELEMENT_ID}'>Test</span></div>`,
                        () => {
                            const element = editor.getDocument().getElementById(TEST_ELEMENT_ID);
                            const element2 = editor
                                .getDocument()
                                .getElementById(TEST_ELEMENT_ID + '2');
                            const range = new Range();
                            range.setStart(element2.firstChild, 1);
                            range.setEnd(element.firstChild, 3);
                            editor.select(range);
                        },
                        '<blockquote style="margin-top:0;margin-bottom:0"><div><span id="test2">Test</span></div><div><span id="test">Test</span></div></blockquote>'
                    );
                }
            );

            TestHelper.itFirefoxOnly(
                'Handle, range not collapsed and is not selected from start to end 1',
                () => {
                    runHandleTest(
                        TextFeatures.indentWhenTabText,
                        `<div><span id='${TEST_ELEMENT_ID}'>Test</span></div>`,
                        () => {
                            const element = editor.getDocument().getElementById(TEST_ELEMENT_ID);
                            const range = new Range();
                            range.setStart(element.firstChild, 1);
                            range.setEnd(element.firstChild, 3);
                            editor.select(range);
                        },
                        '<div><span id="test">T<span>     </span>t</span></div>'
                    );
                }
            );

            TestHelper.itFirefoxOnly('Handle, Insert Tab before a Anchor Element', () => {
                runHandleTest(
                    TextFeatures.indentWhenTabText,
                    `<div id='${TEST_ELEMENT_ID}'>Test<a href='test'>TestAnchor</a></div>`,
                    () => {
                        const element = editor.getDocument().getElementById(TEST_ELEMENT_ID);
                        const range = new Range();
                        range.setStart(element, 1);
                        range.setEnd(element, 1);
                        editor.select(range);
                    },
                    '<div id="test">Test<span>  </span><a href="test">TestAnchor</a></div>',
                    () => {
                        const range = editor.getSelectionRange();

                        const element = editor.getDocument().getElementById(TEST_ELEMENT_ID);
                        const expectedRange = new Range();
                        expectedRange.setStart(element, 2);
                        expect(range).toEqual(expectedRange);
                    }
                );
            });
        });
    });

    describe('OutdentWhenTabText |', () => {
        describe('Should Handle Event |', () => {
            it('Should handle event, all paragraph selected', () => {
                runShouldHandleTest(
                    TextFeatures.outdentWhenTabText,
                    '<div><blockquote><p id="p1" style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">Lorem ipsum dolort.</p><p id="p2" style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">Nullam molestie iaculis .</p></blockquote><br></div>',
                    () => {
                        const p1 = editor.getDocument().getElementById('p1');
                        const p2 = editor.getDocument().getElementById('p2');
                        const range = new Range();
                        range.setStart(p1.firstChild, 0);
                        range.setEnd(p2.firstChild, 25);

                        editor.select(range);
                    },
                    true
                );
            });

            it('Should not handle event, all paragraph selected but not under blockquote', () => {
                runShouldHandleTest(
                    TextFeatures.outdentWhenTabText,
                    '<div><p id="p1" style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">Lorem ipsum dolort.</p><p id="p2" style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">Nullam molestie iaculis .</p><br></div>',
                    () => {
                        const p1 = editor.getDocument().getElementById('p1');
                        const p2 = editor.getDocument().getElementById('p2');
                        const range = new Range();
                        range.setStart(p1.firstChild, 0);
                        range.setEnd(p2.firstChild, 25);

                        editor.select(range);
                    },
                    false
                );
            });

            it('Should not handle, Feature is not enabled', () => {
                editor = TestHelper.initEditor(TEST_ID, null);
                runShouldHandleTest(
                    TextFeatures.outdentWhenTabText,
                    '<div><p id="p1" style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">Lorem ipsum dolort.</p><p id="p2" style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">Nullam molestie iaculis .</p><br></div>',
                    () => {
                        const element = editor.getDocument().getElementById('p1');
                        const range = new Range();
                        range.setStart(element, 0);
                        editor.select(range);
                    },
                    false
                );
            });

            it('Should handle event, not all paragraph selected', () => {
                runShouldHandleTest(
                    TextFeatures.outdentWhenTabText,
                    '<div><p id="p1" style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">Lorem ipsum dolort.</p><p id="p2" style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">Nullam molestie iaculis .</p><br></div>',
                    () => {
                        const p1 = editor.getDocument().getElementById('p1');
                        const p2 = editor.getDocument().getElementById('p2');
                        const range = new Range();
                        range.setStart(p1.firstChild, 0);
                        range.setEnd(p2.firstChild, 24);

                        editor.select(range);
                    },
                    false
                );
            });
        });
        describe('Handle Event |', () => {
            it('Handle Event when all paragraph selected', () => {
                runHandleTest(
                    TextFeatures.outdentWhenTabText,
                    '<div><blockquote><p id="p1" style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">Lorem ipsum dolort.</p><p id="p2" style="margin:0px 0px 15px;text-align:justify;font-family:&quot;Open Sans&quot;, Arial, sans-serif;font-size:14px;background-color:rgb(255, 255, 255)">Nullam molestie iaculis .</p></blockquote><br></div>',
                    () => {
                        const p1 = editor.getDocument().getElementById('p1');
                        const p2 = editor.getDocument().getElementById('p2');
                        const range = new Range();
                        range.setStart(p1.firstChild, 0);
                        range.setEnd(p2.firstChild, 25);

                        editor.select(range);
                    },
                    '<div><p id="p1" style="margin: 0px 0px 15px; text-align: justify; font-family: &quot;Open Sans&quot;, Arial, sans-serif; font-size: 14px; background-color: rgb(255, 255, 255);">Lorem ipsum dolort.</p><p id="p2" style="margin: 0px 0px 15px; text-align: justify; font-family: &quot;Open Sans&quot;, Arial, sans-serif; font-size: 14px; background-color: rgb(255, 255, 255);">Nullam molestie iaculis .</p><br></div>'
                );
            });
        });
    });
});

function simulateKeyDownEvent(
    whichInput: number,
    shiftKey: boolean = false,
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
