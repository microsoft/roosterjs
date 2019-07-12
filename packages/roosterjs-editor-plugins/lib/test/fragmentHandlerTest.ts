import fragmentHandler from '../Paste/fragmentHandler';
import { htmlToDom } from 'roosterjs-html-sanitizer';

describe('fragmentHandler', () => {
    function runTest(html: string, preserveFragmentOnly: boolean, expectedInnerHtml: string) {
        let doc = htmlToDom(html, preserveFragmentOnly, fragmentHandler);
        if (expectedInnerHtml === null) {
            expect(doc).toBeNull();
        } else {
            expect(doc.body.innerHTML).toBe(expectedInnerHtml);
        }
    }

    it('HTML with fragment from EXCEL', () => {
        runTest(
            '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><body><table><tr><!--StartFragment--><td>a</td><td></td><!--EndFragment--></tr></table></body></html>',
            true,
            '<table><tbody><tr><td style="border: 1px solid rgb(212, 212, 212);">a</td><td style="border: 1px solid rgb(212, 212, 212);"></td></tr></tbody></table>'
        );
        runTest(
            '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><body><table><!--StartFragment--><tr><td>a</td><td></td></tr><!--EndFragment--></table></body></html>',
            true,
            '<table><tbody><tr><td style="border: 1px solid rgb(212, 212, 212);">a</td><td style="border: 1px solid rgb(212, 212, 212);"></td></tr></tbody></table>'
        );
    });

    describe('HTML with fragment from Word Online', () => {
        it('fragments only contain list items', () => {
            // All list items on the same level
            runTest(
                '<html><body><div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" style="margin: 0px 0px 0px 24px;">A</li></ul></div><div class="ListContainerWrapper BCX0 SCXW225173058"><ul><li role="listitem" data-aria-level="1" style="margin: 0px 0px 0px 24px;">B</li></ul></div><div class="ListContainerWrapper BCX0 SCXW225173058"><ul><li role="listitem" data-aria-level="1" style="margin: 0px 0px 0px 24px;">C</li></ul></div></body></html>',
                true,
                '<ul><li role="listitem" data-aria-level="1">A</li><li role="listitem" data-aria-level="1">B</li><li role="listitem" data-aria-level="1">C</li></ul>'
            )

            // List items on different level but only going on direction in terms of depth
            // e.g.
            // .a
            //    .b
            //       .c
            runTest(
                '<html><body><div class="ListContainerWrapper BCX0 SCXW200751125"><ul class="BulletListStyle1 BCX0 SCXW200751125"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW200751125" style="margin: 0px 0px 0px 24px;">A</li></ul></div><div class="ListContainerWrapper BCX0 SCXW200751125"><ul class="BulletListStyle2 BCX0 SCXW200751125" role="list"><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW200751125" style="margin: 0px 0px 0px 72px;">B</li></ul></div><div class="ListContainerWrapper BCX0 SCXW200751125" style="margin: 0px;"><ul class="BulletListStyle2 BCX0 SCXW200751125" role="list"><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW200751125" style="margin: 0px 0px 0px 72px;">C</li></ul></div></body></html>',
                true,
                '<ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW200751125">A</li><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW200751125">B</li><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW200751125">C</li></ul></ul></ul>'
            )

            // List items on different level but have different branch in each level
            // e.g.
            // .a
            //   .b
            //     .c
            //   .d
            //     .e
            runTest(
                '<html><body><div class="ListContainerWrapper SCXW81557186 BCX0"><ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW81557186" style="margin: 0px 0px 0px 24px;">A</li></ul></div><div class="ListContainerWrapper SCXW81557186 BCX0"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW81557186" style="margin: 0px 0px 0px 72px;">B</li></ul></div><div class="ListContainerWrapper SCXW81557186 BCX0"><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr SCXW81557186 BCX0" style="margin: 0px 0px 0px 120px;">C</li></ul></div><div class="ListContainerWrapper SCXW81557186 BCX0"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr SCXW81557186 BCX0" style="margin: 0px 0px 0px 72px;">D</li></ul></div><div class="ListContainerWrapper SCXW81557186 BCX0"><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW81557186" style="margin: 0px 0px 0px 120px;">E</li></ul></div></body></html>',
                true,
                '<ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW81557186">A</li><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW81557186">B</li><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr SCXW81557186 BCX0">C</li></ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr SCXW81557186 BCX0">D</li><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW81557186">E</li></ul></ul></ul>'
            )

            // List items on different level with different branch with a combination of
            // order and unordered list items
            // e.g.
            // .a
            //   .b
            //     1.c1
            //     2.c2
            //   .d
            runTest(
                '<html><body><div class="ListContainerWrapper BCX0 SCXW221836524"><ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW221836524" style="margin: 0px 0px 0px 24px;"> A </li></ul></div><div class="ListContainerWrapper BCX0 SCXW221836524"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW221836524" style="margin: 0px 0px 0px 72px;"> B </li></ul></div><div class="ListContainerWrapper BCX0 SCXW221836524"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW221836524" style="margin: 0px 0px 0px 120px;"> C1 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW221836524"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW221836524" style="margin: 0px 0px 0px 120px;"> C2 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW221836524"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW221836524" style="margin: 0px 0px 0px 72px;"> D </li></ul></div></body></html>',
                true,
                '<ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW221836524"> A </li><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW221836524"> B </li><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW221836524"> C1 </li><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW221836524"> C2 </li></ol><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW221836524"> D </li></ul></ul>'
            )
        });
    });

    it('fragments contains both list and text', () => {
        // e.g.
        //text text
        // .a
        //   .b
        //     1.c1
        //     2.c2
        //   .d
        //text text
        runTest(
            '<html><body><div class="BCX0 SCXW32709461"><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 24px;"> A </li></ul></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 72px;"> B </li></ul></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 120px;"> C1 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 120px;"> C2 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 72px;"> D </li></ul></div></div><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div></body></html>',
            true,
            '<div class="BCX0 SCXW32709461"><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div><ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW32709461"> A </li><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461"> B </li><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461"> C1 </li><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461"> C2 </li></ol><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461"> D </li></ul></ul></div><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div>'
        )
    });

    it('fragments contains text, list and table that consist of list', () => {
        // e.g.
        //text text
        // .a
        //   .b
        //     1.c1
        //     2.c2
        //   .d
        //text text
        // --------------
        //| text text    |
        // --------------
        //| .a           |
        //| .b           |
        //| .c           |
        //| .d           |
        // --------------
        runTest(
            '<html><body><div class="BCX0 SCXW32709461"><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 24px;"> A </li></ul></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 72px;"> B </li></ul></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 120px;"> C1 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 120px;"> C2 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 72px;"> D </li></ul></div></div><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div><div class="OutlineElement Ltr BCX0 SCXW244795937"><div class="TableContainer SCXW244795937 BCX0"><table><tbody><tr><td><div><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div></div></td></tr><tr><td><div><div class="ListContainerWrapper SCXW244795937 BCX0"><ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937" style="margin: 0px 0px 0px 24px;"> A </li><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937" style="margin: 0px 0px 0px 24px;"> B </li><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937" style="margin: 0px 0px 0px 24px;"> C </li><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937" style="margin: 0px 0px 0px 24px;"> D </li></ul></div></div></td></tr></tbody></table></div></div><div class="OutlineElement Ltr BCX0 SCXW244795937"><p><span><span></span></span><span></span></p></div></body></html>',
            true,
            '<div class="BCX0 SCXW32709461"><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div><ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW32709461"> A </li><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461"> B </li><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461"> C1 </li><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461"> C2 </li></ol><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461"> D </li></ul></ul></div><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div><div class="OutlineElement Ltr BCX0 SCXW244795937"><div class="TableContainer SCXW244795937 BCX0"><table><tbody><tr><td><div><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div></div></td></tr><tr><td><div><ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937"> A </li><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937"> B </li><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937"> C </li><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937"> D </li></ul></div></td></tr></tbody></table></div></div><div class="OutlineElement Ltr BCX0 SCXW244795937"><p><span><span></span></span><span></span></p></div>'
        )
    })
});
