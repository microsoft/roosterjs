import * as TestHelper from '../../../../roosterjs-editor-api/test/TestHelper';
import { TableFeatures } from '../../../lib/plugins/ContentEdit/features/tableFeatures';
import {
    IEditor,
    PluginEventType,
    PluginKeyboardEvent,
    PositionType,
    Keys,
    BuildInEditFeature,
} from 'roosterjs-editor-types';

describe('TableFeatures | ', () => {
    let editor: IEditor;
    const TEST_ID = 'TableFeatureTest';
    const TEST_ELEMENT_ID = 'TableFeatureTestTestElementId';

    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID);
    });

    afterEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement.removeChild(element);
        }
        editor.dispose();
    });

    const keyboardEvent = (whichInput?: number) => {
        return new KeyboardEvent('keydown', {
            shiftKey: false,
            altKey: false,
            ctrlKey: false,
            cancelable: true,
            which: whichInput,
        });
    };

    function runShouldHandleEvent(
        feature: BuildInEditFeature<PluginKeyboardEvent>,
        content: string,
        shouldHandleExpect: boolean,
        rawKeyboardEvent: KeyboardEvent,
        selectContentCallback: (element: HTMLElement) => void
    ) {
        const keyboardPluginEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: rawKeyboardEvent,
        };
        editor.setContent(content);
        const element = document.getElementById(TEST_ELEMENT_ID);

        editor.focus();
        selectContentCallback(element);
        const result = feature.shouldHandleEvent(keyboardPluginEvent, editor, false);

        expect(!!result).toBe(shouldHandleExpect);
    }

    function runHandleEvent(
        feature: BuildInEditFeature<PluginKeyboardEvent>,
        content: string,
        rawEvent: KeyboardEvent,
        selectContentCallback: (element: HTMLElement) => void,
        expectedRangeCallback: () => Range
    ) {
        //Arrange
        const doc = editor.getDocument();
        editor.setContent(content);
        const keyboardPluginEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: rawEvent,
        };
        const element = doc.getElementById(TEST_ELEMENT_ID);
        editor.focus();
        selectContentCallback(element);

        //Act
        feature.handleEvent(keyboardPluginEvent, editor);
        const range = doc.getSelection().getRangeAt(0);

        //Assert
        expect(range).toEqual(expectedRangeCallback());
    }

    describe('tabInTable | ', () => {
        describe('Should Handle Event | ', () => {
            TestHelper.itFirefoxOnly('Do nothing on Shift Tab and in first cell', () => {
                runShouldHandleEvent(
                    TableFeatures.tabInTable,
                    `<div><table cellspacing="0" cellpadding="1" data-rooster-table-info="{&quot;topBorderColor&quot;:&quot;#ABABAB&quot;,&quot;bottomBorderColor&quot;:&quot;#ABABAB&quot;,&quot;verticalBorderColor&quot;:&quot;#ABABAB&quot;,&quot;hasHeaderRow&quot;:false,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:false,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#ABABAB20&quot;,&quot;headerRowColor&quot;:&quot;#ABABAB&quot;,&quot;tableBorderFormat&quot;:0}" style="border-collapse: collapse;"><tbody><tr><td id=${TEST_ELEMENT_ID} style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr></tbody></table><br></div><!--{"start":[0,0,0,0,0,0],"end":[0,0,0,0,0,0]}-->`,
                    true,
                    keyboardEvent(Keys.TAB),
                    (element: HTMLElement) =>
                        editor.select(element, PositionType.End, element, PositionType.Begin)
                );
            });
        });

        describe('Handle Event | ', () => {
            TestHelper.itFirefoxOnly('Do nothing on Shift Tab and in first cell', () => {
                const rawEvent = new KeyboardEvent('keydown', {
                    shiftKey: false,
                    altKey: false,
                    ctrlKey: false,
                    cancelable: true,
                });

                runHandleEvent(
                    TableFeatures.tabInTable,
                    `<div><table cellspacing="0" cellpadding="1" data-rooster-table-info="{&quot;topBorderColor&quot;:&quot;#ABABAB&quot;,&quot;bottomBorderColor&quot;:&quot;#ABABAB&quot;,&quot;verticalBorderColor&quot;:&quot;#ABABAB&quot;,&quot;hasHeaderRow&quot;:false,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:false,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#ABABAB20&quot;,&quot;headerRowColor&quot;:&quot;#ABABAB&quot;,&quot;tableBorderFormat&quot;:0}" style="border-collapse: collapse;"><tbody><tr><td id=${TEST_ELEMENT_ID} style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr></tbody></table><br></div><!--{"start":[0,0,0,0,0,0],"end":[0,0,0,0,0,0]}-->`,
                    rawEvent,
                    (element: HTMLElement) =>
                        editor.select(element, PositionType.End, element, PositionType.Begin),
                    () => {
                        const element = editor.getDocument().getElementById(TEST_ELEMENT_ID);
                        const expectedRange = new Range();
                        expectedRange.setStart(element, 0);
                        expectedRange.setEnd(element, 0);
                        return expectedRange;
                    }
                );
            });
        });
    });
});
