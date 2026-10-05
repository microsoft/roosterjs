import * as wordFile from '../../../lib/paste/WordDesktop/processPastedContentFromWordDesktop';
import { initEditor } from './testUtils';
import { itChromeOnly } from 'roosterjs-content-model-dom/test/testUtils';
import { paste } from 'roosterjs-content-model-core';
import type { ClipboardData, IEditor } from 'roosterjs-content-model-types';

const ID = 'Word_Nested_List_Margin';

describe(ID, () => {
    let editor: IEditor;

    beforeEach(() => {
        editor = initEditor(ID);
        spyOn(wordFile, 'processPastedContentFromWordDesktop').and.callThrough();
    });

    afterEach(() => {
        document.getElementById(ID)?.remove();
    });

    itChromeOnly('does not add top margins to nested Word list levels', () => {
        const rawHtml = `<html xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
<meta name="ProgId" content="Word.Document">
<style>
p.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst, div.MsoListParagraphCxSpFirst {
    margin-top: 0in;
    margin-right: 0in;
    margin-bottom: 0in;
    margin-left: .5in;
    line-height: 115%;
}
p.MsoListParagraphCxSpMiddle, li.MsoListParagraphCxSpMiddle, div.MsoListParagraphCxSpMiddle {
    margin-top: 0in;
    margin-right: 0in;
    margin-bottom: 0in;
    margin-left: .5in;
    line-height: 115%;
}
p.MsoListParagraphCxSpLast, li.MsoListParagraphCxSpLast, div.MsoListParagraphCxSpLast {
    margin-top: 0in;
    margin-right: 0in;
    margin-bottom: 10pt;
    margin-left: .5in;
    line-height: 115%;
}
@list l0:level1 {
    mso-level-number-format: bullet;
    mso-level-text: ;
}
@list l0:level2 {
    mso-level-number-format: bullet;
    mso-level-text: o;
}
@list l0:level3 {
    mso-level-number-format: bullet;
    mso-level-text: ;
}
ul {
    margin-bottom: 0in;
}
</style>
</head>
<body>
<!--StartFragment-->
<p class="MsoListParagraphCxSpFirst" style="text-indent:-.25in;mso-list:l0 level1 lfo1">
    <span><span style="mso-list:Ignore">·<span>&nbsp;&nbsp;</span></span></span>Desktop Outlook
</p>
<p class="MsoListParagraphCxSpMiddle" style="margin-left:1in;text-indent:-.25in;mso-list:l0 level2 lfo1">
    <span><span style="mso-list:Ignore">o<span>&nbsp;&nbsp;</span></span></span>Compose window
</p>
<p class="MsoListParagraphCxSpMiddle" style="margin-left:1in;text-indent:-.25in;mso-list:l0 level2 lfo1">
    <span><span style="mso-list:Ignore">o<span>&nbsp;&nbsp;</span></span></span>Received message
</p>
<p class="MsoListParagraphCxSpMiddle" style="margin-left:1.5in;text-indent:-.25in;mso-list:l0 level3 lfo1">
    <span><span style="mso-list:Ignore">§<span>&nbsp;</span></span></span>Expanded reading pane
</p>
<p class="MsoListParagraphCxSpLast" style="margin-left:1.5in;text-indent:-.25in;mso-list:l0 level3 lfo1">
    <span><span style="mso-list:Ignore">§<span>&nbsp;</span></span></span>Pop-out window
</p>
<!--EndFragment-->
</body>
</html>`;
        const clipboardData = {
            types: ['text/plain', 'text/html'],
            text: '',
            image: null,
            files: [],
            rawHtml,
            customValues: {},
            pasteNativeEvent: true,
        } as ClipboardData;

        paste(editor, clipboardData);

        expect(wordFile.processPastedContentFromWordDesktop).toHaveBeenCalled();

        const listItems = editor
            .getContentModelCopy('disconnected')
            .blocks.filter(
                block => block.blockType == 'BlockGroup' && block.blockGroupType == 'ListItem'
            );

        expect(listItems.length).toBe(5);
        expect(listItems[1].levels[1].format.marginTop).toBe('0in');
        expect(listItems[3].levels[2].format.marginTop).toBe('0in');
    });
});
