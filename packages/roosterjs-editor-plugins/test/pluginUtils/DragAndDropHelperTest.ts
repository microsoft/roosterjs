import DragAndDropContext from 'roosterjs-editor-types';
import DragAndDropHelper from '../../lib/pluginUtils/DragAndDropHelper';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions } from 'roosterjs-editor-types';
import { IEditor } from 'roosterjs-editor-types';
//import * as TestHelper from '../TestHelper';

describe('DragAndDropHelper', () => {
    let editor: IEditor;
    let id = 'DragAndDropHelperId';
    let dndHelper: DragAndDropHelper<DragAndDropContext, any>;
    beforeEach(() => {
        let node = document.createElement('div');
        node.id = id;
        document.body.insertBefore(node, document.body.childNodes[0]);
        let options: EditorOptions = {
            plugins: [],
            defaultFormat: {
                fontFamily: 'Calibri,Arial,Helvetica,sans-serif',
                fontSize: '11pt',
                textColor: '#000000',
            },
            corePluginOverride: {},
        };

        editor = new Editor(node as HTMLDivElement, options);

        /*const context: DragAndDropContext = {editor.getZoomScale()};
        dndHelper = new DragAndDropHelper<DragAndDropContext, any>(
            node,
            context,
        );*/
    });

    afterEach(() => {});

    function runTest() {
        debugger;
    }

    it('should replace', () => {
        runTest();
    });
});

function simulateTouchEvent(type: string, target: HTMLElement) {
    const rect = target.getBoundingClientRect();
    let lll: Touch[] = [
        new Touch({ identifier: 0, target: target, clientX: rect.left, clientY: rect.top }),
    ];
    var event = new TouchEvent(type, {
        view: window,
        bubbles: true,
        cancelable: true,
        touches: lll,
    });
    target.dispatchEvent(event);
}
