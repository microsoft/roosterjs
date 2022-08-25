import convertPastedContentFromWordOnline from '../../../lib/plugins/Paste/officeOnlineConverter/convertPastedContentFromWordOnline';

describe('wordOnlineHandler', () => {
    function runTest(html: string, expectedInnerHtml: string) {
        const doc = sanitizeContent(html);

        expect(doc.body.innerHTML).toBe(expectedInnerHtml);
    }

    describe('HTML with fragment from Word Online', () => {
        describe('fragments only contain list items', () => {
            it('has all list items on the same level', () => {
                runTest(
                    '<html><body><div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul></div><div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">B</li></ul></div><div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ul></div></body></html>',
                    '<ul><li class="OutlineElement" role="listitem" data-aria-level="1">A</li><li class="OutlineElement" role="listitem" data-aria-level="1">B</li><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ul>'
                );
            });

            // e.g.
            // .a
            //    .b
            //       .c
            it('List items on different level but only going on direction in terms of depth', () => {
                runTest(
                    '<html><body><div class="ListContainerWrapper BCX0 SCXW200751125"><ul class="BulletListStyle1 BCX0 SCXW200751125"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW200751125">A</li></ul></div><div class="ListContainerWrapper BCX0 SCXW200751125"><ul class="BulletListStyle2 BCX0 SCXW200751125" role="list"><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW200751125">B</li></ul></div><div class="ListContainerWrapper BCX0 SCXW200751125" style="margin: 0px;"><ul class="BulletListStyle2 BCX0 SCXW200751125" role="list"><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW200751125">C</li></ul></div></body></html>',
                    '<ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW200751125">A</li><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW200751125">B</li><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW200751125">C</li></ul></ul></ul>'
                );
            });

            //
            // e.g.
            // .a
            //   .b
            //     .c
            //   .d
            //     .e
            it('List items on different level but have different branch in each level', () => {
                runTest(
                    '<html><body><div class="ListContainerWrapper SCXW81557186 BCX0"><ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW81557186">A</li></ul></div><div class="ListContainerWrapper SCXW81557186 BCX0"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW81557186">B</li></ul></div><div class="ListContainerWrapper SCXW81557186 BCX0"><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr SCXW81557186 BCX0" style="margin: 0px 0px 0px 120px;">C</li></ul></div><div class="ListContainerWrapper SCXW81557186 BCX0"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr SCXW81557186 BCX0">D</li></ul></div><div class="ListContainerWrapper SCXW81557186 BCX0"><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW81557186" style="margin: 0px 0px 0px 120px;">E</li></ul></div></body></html>',
                    '<ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW81557186">A</li><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW81557186">B</li><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr SCXW81557186 BCX0" style="margin: 0px 0px 0px 120px;">C</li></ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr SCXW81557186 BCX0">D</li><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW81557186" style="margin: 0px 0px 0px 120px;">E</li></ul></ul></ul>'
                );
            });

            // List items on different level with different branch with a combination of
            // order and unordered list items
            // e.g.
            // .a
            //   .b
            //     1.c1
            //     2.c2
            //   .d
            it('List items on different level with different branch with a combination of order and unordered list items', () => {
                runTest(
                    '<html><body><div class="ListContainerWrapper BCX0 SCXW221836524"><ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW221836524"> A </li></ul></div><div class="ListContainerWrapper BCX0 SCXW221836524"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW221836524"> B </li></ul></div><div class="ListContainerWrapper BCX0 SCXW221836524"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW221836524" style="margin: 0px 0px 0px 120px;"> C1 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW221836524"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW221836524" style="margin: 0px 0px 0px 120px;"> C2 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW221836524"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW221836524"> D </li></ul></div></body></html>',
                    '<ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW221836524"> A </li><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW221836524"> B </li><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW221836524" style="margin: 0px 0px 0px 120px;"> C1 </li><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW221836524" style="margin: 0px 0px 0px 120px;"> C2 </li></ol><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW221836524"> D </li></ul></ul>'
                );
            });
        });

        describe('fragments contains both list and text', () => {
            // e.g.
            //text text
            // .a
            //   .b
            //     1.c1
            //     2.c2
            //   .d
            //text text
            it('only has text and list', () => {
                runTest(
                    '<html><body><div class="BCX0 SCXW32709461"><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW32709461"> A </li></ul></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461"> B </li></ul></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 120px;"> C1 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 120px;"> C2 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461"> D </li></ul></div></div><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div></body></html>',
                    '<div class="BCX0 SCXW32709461"><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div><ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW32709461"> A </li><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461"> B </li><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 120px;"> C1 </li><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 120px;"> C2 </li></ol><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461"> D </li></ul></ul></div><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div>'
                );
            });

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
            it('fragments contains text, list and table that consist of list', () => {
                runTest(
                    '<html><body><div class="BCX0 SCXW32709461"><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW32709461"> A </li></ul></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461"> B </li></ul></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 120px;"> C1 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 120px;"> C2 </li></ol></div><div class="ListContainerWrapper BCX0 SCXW32709461"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461"> D </li></ul></div></div><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div><div class="OutlineElement Ltr BCX0 SCXW244795937"><div class="TableContainer SCXW244795937 BCX0"><table><tbody><tr><td><div><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div></div></td></tr><tr><td><div><div class="ListContainerWrapper SCXW244795937 BCX0"><ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937"> A </li><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937"> B </li><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937"> C </li><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937"> D </li></ul></div></div></td></tr></tbody></table></div></div><div class="OutlineElement Ltr BCX0 SCXW244795937"><p><span><span></span></span><span></span></p></div></body></html>',
                    '<div class="BCX0 SCXW32709461"><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div><ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW32709461"> A </li><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461"> B </li><ol><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 120px;"> C1 </li><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW32709461" style="margin: 0px 0px 0px 120px;"> C2 </li></ol><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW32709461"> D </li></ul></ul></div><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div><div class="OutlineElement Ltr BCX0 SCXW244795937"><div class="TableContainer SCXW244795937 BCX0"><table><tbody><tr><td><div><div class="OutlineElement Ltr BCX0 SCXW32709461"><p><span><span>asdfasdf</span></span><span></span></p></div></div></td></tr><tr><td><div><ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937"> A </li><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937"> B </li><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937"> C </li><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW244795937"> D </li></ul></div></td></tr></tbody></table></div></div><div class="OutlineElement Ltr BCX0 SCXW244795937"><p><span><span></span></span><span></span></p></div>'
                );
            });
            // e.g.
            //text text
            // .a
            //   .b
            //     1.c1
            //     2.c2
            //   .d
            //text text
            // -------------- --------------
            //| text text    | text text    |
            // -------------- --------------
            //| .a           | .a           |
            // -------------- --------------
            it('fragments contains text, list and table that consist of list', () => {
                runTest(
                    '<html><body><div class="OutlineElement"><div class="TableContainer"><table><tbody><tr><td><div><div class="OutlineElement"><p>asdfasdf</p></div></div></td><td><div><div class="OutlineElement"><p>asdfasdf222</p></div></div></td></tr><tr><td><div><div class="ListContainerWrapper"><ul><li role="listitem" data-aria-level="1" class="OutlineElement">A</li></ul></div></div></td><td><div><div class="ListContainerWrapper"><ul><li role="listitem" data-aria-level="1" class="OutlineElement">A</li></ul></div></div></td></tr></tbody></table></div></div></body></html>',
                    '<div class="OutlineElement"><div class="TableContainer"><table><tbody><tr><td><div><div class="OutlineElement"><p>asdfasdf</p></div></div></td><td><div><div class="OutlineElement"><p>asdfasdf222</p></div></div></td></tr><tr><td><div><ul><li role="listitem" data-aria-level="1" class="OutlineElement">A</li></ul></div></td><td><div><ul><li role="listitem" data-aria-level="1" class="OutlineElement">A</li></ul></div></td></tr></tbody></table></div></div>'
                );
            });
        });

        it('does not have list container', () => {
            runTest(
                '<html><body><ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW81557186">A</li></ul><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW81557186">B</li></ul><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr SCXW81557186 BCX0" style="margin: 0px 0px 0px 120px;">C</li></ul><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr SCXW81557186 BCX0">D</li></ul><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW81557186" style="margin: 0px 0px 0px 120px;">E</li></ul></body></html>',
                '<ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW81557186">A</li></ul><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW81557186">B</li></ul><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr SCXW81557186 BCX0" style="margin: 0px 0px 0px 120px;">C</li></ul><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr SCXW81557186 BCX0">D</li></ul><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW81557186" style="margin: 0px 0px 0px 120px;">E</li></ul>'
            );
        });

        it('does not have BulletListStyle or NumberListStyle but has ListContainerWrapper', () => {
            runTest(
                '<html><body><div class="ListContainerWrapper BCX0 SCXW200751125"><ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW200751125">A</li></ul></div><div class="ListContainerWrapper BCX0 SCXW200751125"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW200751125">B</li></ul></div><div class="ListContainerWrapper BCX0 SCXW200751125" style="margin: 0px;"><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW200751125">C</li></ul></div></body></html>',
                '<ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW200751125">A</li><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW200751125">B</li><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW200751125">C</li></ul></ul></ul>'
            );
        });

        it('does not have BulletListStyle or NumberListStyle but has no ListContainerWrapper', () => {
            runTest(
                '<html><body><div class="BCX0 SCXW200751125"><ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW200751125">A</li></ul></div><div class="BCX0 SCXW200751125"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW200751125">B</li></ul></div><div class="BCX0 SCXW200751125" style="margin: 0px;"><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW200751125">C</li></ul></div></body></html>',
                '<div class="BCX0 SCXW200751125"><ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW200751125">A</li></ul></div><div class="BCX0 SCXW200751125"><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW200751125">B</li></ul></div><div class="BCX0 SCXW200751125" style="margin: 0px;"><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW200751125">C</li></ul></div>'
            );
        });

        describe('When html is not strictly formatted as word online, but can be identified as word online only contains one type of list', () => {
            // html:
            // <div class="ListContainerWrapper">
            //     <ul class="BulletListStyle1"><li>text</li></ul>
            //     <ul><li>text</li></ul>
            // <div>
            // result:
            // .a
            // .b
            // .c
            it('should process html properly, if ListContainerWrapper contains two UL', () => {
                runTest(
                    '<html><body><div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">B</li></ul></div><div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ul></div></body></html>',
                    '<ul><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul><div class=" BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">B</li></ul></div><ul><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ul>'
                );
            });

            // html:
            // <div class="ListContainerWrapper">
            //     <ul></ul>
            //     <li>text</li>
            //     <li>text</li>
            //     <li>text</li>
            // <div>
            // result:
            // .test
            // .test
            // .test
            it('shuold process html properly, when list items are not in side ul tag', () => {
                runTest(
                    '<html><body><div class="ListContainerWrapper"><ul class="BulletListStyle1" role="list"></ul><li class="OutlineElement" role="listitem" aria-level="1" class="OutlineElement Ltr"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1" class="OutlineElement Ltr"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1" class="OutlineElement Ltr"><p>test</p></li></div></body></html>',
                    '<ul></ul><div class=""><li class="OutlineElement" role="listitem" aria-level="1"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1"><p>test</p></li></div>'
                );
            });

            // html:
            // <div class="ListContainerWrapper">
            //     <ul class="BulletListStyle1">
            //        <li>text</li>
            //        <li>text</li>
            //        <ul>
            //            <li>text</li>
            //            <li>text</li>
            //        </ul>
            //     </ul>
            // <div>
            // result:
            // .text
            // .text
            //   .text
            //   .text
            it('should process html properly, if ListContainerWrapper contains list that is already well formatted', () => {
                runTest(
                    '<html><body><div class="ListContainerWrapper SCXW81557186 BCX0"><ul class="BulletListStyle1"><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW81557186">A</li><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW81557186">B</li><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr SCXW81557186 BCX0">C</li></ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr SCXW81557186 BCX0">D</li><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW81557186">E</li></ul></ul></ul></div></body></html>',
                    '<ul><li role="listitem" data-aria-level="1" class="OutlineElement Ltr BCX0 SCXW81557186">A</li><ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr BCX0 SCXW81557186">B</li><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr SCXW81557186 BCX0">C</li></ul><li role="listitem" data-aria-level="2" class="OutlineElement Ltr SCXW81557186 BCX0">D</li><ul><li role="listitem" data-aria-level="3" class="OutlineElement Ltr BCX0 SCXW81557186">E</li></ul></ul></ul>'
                );
            });

            // html:
            // <div class="ListContainerWrapper">
            //     <ol class="NumberedListStyle1">
            //        <li>text</li>
            //        <li>text</li>
            //     </ol>
            // <div>
            // result:
            // 1. text
            // 2. text
            it('should process html properly, if there are multiple list item in ol (word online has one list item in each ol for ordered list)', () => {
                runTest(
                    '<html><body><div class="ListContainerWrapper BCX0 SCXW225173058"><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li><li class="OutlineElement" role="listitem" data-aria-level="1">B</li></ol></div><div class="ListContainerWrapper BCX0 SCXW225173058"><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol></div></body></html>',
                    '<ol><li class="OutlineElement" role="listitem" data-aria-level="1">A</li><li class="OutlineElement" role="listitem" data-aria-level="1">B</li><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol>'
                );
            });

            // html:
            // <div class="ListContainerWrapper">
            //     <ol class="NumberedListStyle1"></ol>
            //     <li>text</li>
            //     <li>text</li>
            // <div>
            // result:
            // 1. text
            // 2. text
            it('shuold process html properly, if list item in a ListContainerWrapper are not inside ol ', () => {
                runTest(
                    '<html><body><div class="ListContainerWrapper"><ol class="NumberListStyle1" role="list"></ol><li class="OutlineElement" role="listitem" aria-level="1" class="OutlineElement Ltr"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1" class="OutlineElement Ltr"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1" class="OutlineElement Ltr"><p>test</p></li></div></body></html>',
                    '<ol></ol><div class=""><li class="OutlineElement" role="listitem" aria-level="1"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1"><p>test</p></li><li class="OutlineElement" role="listitem" aria-level="1"><p>test</p></li></div>'
                );
            });
        });

        describe('When html is not strictly formatted as word online, but can be identified as word online only contains both types of list', () => {
            // html:
            // <div class="ListContainerWrapper">
            //     <ul class="BulletListStyle1"><li>text</li></ul>
            //     <ol><li>text</li></ol>
            // <div>
            // result:
            // . text
            // 1. text
            it('should process html properly, if ListContainerWrapper contains well formated UL and non formated ol', () => {
                runTest(
                    '<html><body><div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul></div><div class="ListContainerWrapper BCX0 SCXW225173058"><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">B</li></ol></div></body></html>',
                    '<ul><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul><ol><li class="OutlineElement" role="listitem" data-aria-level="1">B</li></ol>'
                );
            });

            // html:
            // <div class="ListContainerWrapper">
            //     <ul class="BulletListStyle1"><li>text</li></ul>
            // <div>
            // <div class="ListContainerWrapper">
            //     <ol class="NumberListStyle1"><li>text</li></ol>
            //     <ol><li>text</li></ol>
            // <div>
            // result:
            // . text
            // 1. text
            // 2. text
            it('should process html properly, if ListContainerWrapper contains two OL', () => {
                runTest(
                    '<html><body><div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul></div><div class="ListContainerWrapper BCX0 SCXW225173058"><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">B</li></ol><ol><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol></div></body></html>',
                    '<ul><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul><ol><li class="OutlineElement" role="listitem" data-aria-level="1">B</li></ol><div class=" BCX0 SCXW225173058"><ol><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol></div>'
                );
            });

            // html:
            // <div class="ListContainerWrapper">
            //     <ul class="BulletListStyle1"><li>text</li></ul>
            //     <ol><li>text</li></ol>
            //     <ol><li>text</li></ol>
            // <div>
            // result:
            // . text
            // . text
            // . text
            it('should process html properly, if ListContainerWrapper contains two OL and one UL', () => {
                runTest(
                    '<div class="ListContainerWrapper BCX0 SCXW225173058"><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">B</li></ol><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol></div>',
                    '<ul><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul><div class=" BCX0 SCXW225173058"><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">B</li></ol></div><div class=" BCX0 SCXW225173058"><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol></div>'
                );
            });

            // html:
            // <div class="ListContainerWrapper">
            //     <ol class="NumberListStyle1"><li>text</li></ol>
            // <div>
            // <ul class="BulletListStyle1"><li>text</li></ul>
            // result:
            // 1. text
            // . text
            it('should process html properly, if there are list not in the ListContainerWrapper', () => {
                runTest(
                    '<div class="ListContainerWrapper BCX0 SCXW225173058"><ol class="NumberListStyle1"><li class=OutlineElement role="listitem" data-aria-level="1">C</li></ol></div><ul class="NumberListStyle1"><li class=OutlineElement role="listitem" data-aria-level="1">A</li></ul>',
                    '<ol><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol><ul class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul>'
                );
            });

            // html:
            // <div class="ListContainerWrapper">
            //     <ol class="NumberListStyle1"><li>text</li></ol>
            // <div>
            // <ul class="BulletListStyle1"><li>text</li></ul>
            // <ul class="BulletListStyle1"><li>text</li></ul>
            // <ul class="BulletListStyle1"><li>text</li></ul>
            // result:
            // 1. text
            // . text
            // . text
            // . text
            it('should process html properly, if ListContainerWrapper contains two UL', () => {
                runTest(
                    '<div class="ListContainerWrapper BCX0 SCXW225173058"><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol></div><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul>',
                    '<ol><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul><ul class="BulletListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">A</li></ul>'
                );
            });

            // html
            // <div class="ListContainerWrapper">
            //     <p> paragraph </p>
            //     <ol class="NumberListStyle1"><li>text</li></ol>
            // <div>
            it('should retain all text, if ListContainerWrapper contains Elements before li and ul', () => {
                runTest(
                    '<html><body><div class="ListContainerWrapper BCX0 SCXW225173058"><p>paragraph</p><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol></div></body></html>',
                    '<div class=" BCX0 SCXW225173058"><p>paragraph</p></div><ol><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol>'
                );
            });

            // html
            // <div class="ListContainerWrapper">
            //     <ol class="NumberListStyle1"><li>text</li></ol>
            //     <p> paragraph </p>
            // <div>
            it('should retain all text, if ListContainerWrapper contains Elements after li and ul', () => {
                runTest(
                    '<html><body><div class="ListContainerWrapper BCX0 SCXW225173058"><ol class="NumberListStyle1"><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol><p>paragraph</p></div></body></html>',
                    '<ol><li class="OutlineElement" role="listitem" data-aria-level="1">C</li></ol><div class=" BCX0 SCXW225173058"><p>paragraph</p></div>'
                );
            });
        });

        describe('Contain Word WAC Image', () => {
            it('Contain Single WAC Image', () => {
                runTest(
                    '<span style="padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: relative; cursor: move; left: 0px; top: 2px; text-indent: 0px; color: rgb(0, 0, 0); font-family: &quot;Segoe UI&quot;, &quot;Segoe UI Web&quot;, Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; width: auto; height: auto; transform: rotate(0deg);" role="presentation" class="WACImageContainer NoPadding DragDrop BlobObject SCXW139784418 BCX8"><img style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; border: none; white-space: pre !important; vertical-align: baseline; width: 264px; height: 96px;" alt="Graphical user interface, text, application Description automatically generated" class="WACImage SCXW139784418 BCX8"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; white-space: pre !important; display: block; position: absolute; transform: rotate(0deg); width: 264px; height: 96px; left: 0px; top: 0px;" class="WACImageBorder SCXW139784418 BCX8"></span></span>',
                    '<span style="padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: relative; cursor: move; left: 0px; top: 2px; text-indent: 0px; color: rgb(0, 0, 0); font-family: &quot;Segoe UI&quot;, &quot;Segoe UI Web&quot;, Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; width: auto; height: auto; transform: rotate(0deg);" role="presentation" class="WACImageContainer NoPadding DragDrop BlobObject SCXW139784418 BCX8"><img style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; border: none; white-space: pre !important; vertical-align: baseline; width: 264px; height: 96px;" alt="Graphical user interface, text, application Description automatically generated" class="WACImage SCXW139784418 BCX8"></span><span style="padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: relative; cursor: move; left: 0px; top: 2px; text-indent: 0px; color: rgb(0, 0, 0); font-family: &quot;Segoe UI&quot;, &quot;Segoe UI Web&quot;, Arial, Verdana, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; width: auto; height: auto; transform: rotate(0deg);" role="presentation" class="WACImageContainer NoPadding DragDrop BlobObject SCXW139784418 BCX8"></span>'
                );
            });

            it('Contain WAC Image in a List Item and Text', () => {
                runTest(
                    '<html><body><div style="" class="SCXW50976191 BCX8"><div style="" role="list" class="BulletListStyle2 SCXW50976191 BCX8"><li style="" class="OutlineElement Ltr  BCX8 SCXW50976191" data-aria-level="2" role="listitem" data-aria-posinset="1" aria-setsize="-1" data-listid="1" data-font="Courier New" data-leveltext="o"><p style="" class="Paragraph SCXW50976191 BCX8"><span style="" role="presentation" class="WACImageContainer NoPadding DragDrop BlobObject SCXW50976191 BCX8"><img style="" src="" class="WACImage SCXW50976191 BCX8"><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; white-space: pre !important; display: block; position: absolute; transform: rotate(0deg); width: 265px; height: 97px; left: 0px; top: 0px;" class="WACImageBorder SCXW50976191 BCX8"></span></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; color: rgb(127, 127, 127); font-size: 12pt; line-height: 20.5042px; font-family: &quot;Calibri Light&quot;, &quot;Calibri Light_MSFontService&quot;, sans-serif;" class="TextRun EmptyTextRun SCXW50976191 BCX8" data-contrast="none"></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 20.5042px; font-family: &quot;Calibri Light&quot;, &quot;Calibri Light_MSFontService&quot;, sans-serif; color: rgb(127, 127, 127);" data-ccp-props="{&quot;134233117&quot;:true,&quot;134233118&quot;:true}" class="EOP SCXW50976191 BCX8">&nbsp;</span></p></li></ul></div></div></body></html>',
                    '<div style="" class="SCXW50976191 BCX8"><div style="" role="list" class="BulletListStyle2 SCXW50976191 BCX8"><li style="" class="OutlineElement Ltr  BCX8 SCXW50976191" data-aria-level="2" role="listitem" data-aria-posinset="1" aria-setsize="-1" data-listid="1" data-font="Courier New" data-leveltext="o"><p style="" class="Paragraph SCXW50976191 BCX8"><span style="" role="presentation" class="WACImageContainer NoPadding DragDrop BlobObject SCXW50976191 BCX8"><img style="" src="" class="WACImage SCXW50976191 BCX8"></span><span style="" role="presentation" class="WACImageContainer NoPadding DragDrop BlobObject SCXW50976191 BCX8"></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; color: rgb(127, 127, 127); font-size: 12pt; line-height: 20.5042px; font-family: &quot;Calibri Light&quot;, &quot;Calibri Light_MSFontService&quot;, sans-serif;" class="TextRun EmptyTextRun SCXW50976191 BCX8" data-contrast="none"></span><span style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 12pt; line-height: 20.5042px; font-family: &quot;Calibri Light&quot;, &quot;Calibri Light_MSFontService&quot;, sans-serif; color: rgb(127, 127, 127);" data-ccp-props="{&quot;134233117&quot;:true,&quot;134233118&quot;:true}" class="EOP SCXW50976191 BCX8">&nbsp;</span></p></li></div></div>'
                );
            });
        });
    });

    it('List directly under fragment', () => {
        runTest(
            '<div class="ListContainerWrapper"><ul class="BulletListStyle1"><li data-listid="6" class="OutlineElement"><p class="Paragraph" paraid="1126911352"><span data-contrast="auto" class="TextRun"><span class="NormalTextRun">A</span></span></p></li></ul></div><div class="OutlineElement"><p class="Paragraph" paraid="1628213048"><span data-contrast="none" class="TextRun"><span class="NormalTextRun">B</span></span></p></div>',
            '<ul><li data-listid="6" class="OutlineElement"><p class="Paragraph" paraid="1126911352"><span data-contrast="auto" class="TextRun"><span class="NormalTextRun">A</span></span></p></li></ul><div class="OutlineElement"><p class="Paragraph" paraid="1628213048"><span data-contrast="none" class="TextRun"><span class="NormalTextRun">B</span></span></p></div>'
        );
    });

    describe('HTML with fragment from OneNote Online', () => {
        // html
        //
        it('should remove the display and margin styles from the element', () => {
            runTest(
                '<html><body><ul class="BulletListStyle3 BCX0 SCXO236767657" role="list"><li class="OutlineElement"><p>A</p></li><li class="OutlineElement"><p>B</p></li><li class="OutlineElement"><p>C</p><ol class="NumberListStyle3 BCX0 SCXO236767657" role="list"><li class="OutlineElement"><p>D</p></li></ol></li></ul></body></html>',
                '<ul class="BulletListStyle3 BCX0 SCXO236767657" role="list"><li class="OutlineElement"><p>A</p></li><li class="OutlineElement"><p>B</p></li><li class="OutlineElement"><p>C</p><ol class="NumberListStyle3 BCX0 SCXO236767657" role="list"><li class="OutlineElement"><p>D</p></li></ol></li></ul>'
            );
        });
    });

    it('Keep the start property on lists and try to reuse the Word provided marker style', () => {
        const doc = sanitizeContent(
            '<html><body><div><p><span><span>Test</span></span><span>&nbsp;</span></p></div><div class="ListContainerWrapper"><ol start="1"><li data-aria-level="1" data-aria-posinset="1" aria-setsize="-1" data-listid="1" data-leveltext="%1."><p><span><span>Test</span></span><span>&nbsp;</span></p></li></ol></div><div class="ListContainerWrapper"><ul><li data-aria-level="2" data-aria-posinset="1" aria-setsize="-1" data-listid="1" data-leveltext="▫"><p><span><span>Test</span></span><span>&nbsp;</span></p></li></ul></div><div><p><span><span>Test</span></span><span>&nbsp;</span></p></div><div class="ListContainerWrapper"><ol start="5"><li data-aria-level="1" data-aria-posinset="2" aria-setsize="-1" data-listid="1" data-leveltext="%1."><p><span><span>Test</span></span><span>&nbsp;</span></p></li></ol></div><div class="ListContainerWrapper"><ul><li data-aria-level="2" data-aria-posinset="2" aria-setsize="-1" data-listid="1" data-leveltext="▫"><p><span><span>Test</span></span><span>&nbsp;</span></p></li></ul></div></body></html>'
        );

        doc.querySelectorAll('ul li').forEach(el => {
            const dataLevelText = el.getAttribute('data-leveltext');
            if (dataLevelText) {
                expect((el as HTMLElement).style.listStyleType).toContain(dataLevelText);
            }
        });

        const orderedLists = doc.querySelectorAll('ol');
        expect(orderedLists.length).toBe(2);
        expect(orderedLists[0].start).toBe(1);
        expect(orderedLists[1].start).toBe(5);
    });

    it('Keep the start property on lists and remove marker style that is not reusable', () => {
        const notUsableMarker = String.fromCharCode(10);
        const doc = sanitizeContent(
            `<html><body><div><p><span><span>Test</span></span><span>&nbsp;</span></p></div><div class="ListContainerWrapper"><ol start="1"><li data-aria-level="1" data-aria-posinset="1" aria-setsize="-1" data-listid="1" data-leveltext="%1."><p><span><span>Test</span></span><span>&nbsp;</span></p></li></ol></div><div class="ListContainerWrapper"><ul><li data-aria-level="2" data-aria-posinset="1" aria-setsize="-1" data-listid="1" data-leveltext="${notUsableMarker}"><p><span><span>Test</span></span><span>&nbsp;</span></p></li></ul></div><div><p><span><span>Test</span></span><span>&nbsp;</span></p></div><div class="ListContainerWrapper"><ol start="2"><li data-aria-level="1" data-aria-posinset="2" aria-setsize="-1" data-listid="1" data-leveltext="%1."><p><span><span>Test</span></span><span>&nbsp;</span></p></li></ol></div><div class="ListContainerWrapper"><ul><li data-aria-level="2" data-aria-posinset="2" aria-setsize="-1" data-listid="1" data-leveltext="${notUsableMarker}"><p><span><span>Test</span></span><span>&nbsp;</span></p></li></ul></div></body></html>`
        );

        doc.querySelectorAll('ul li').forEach(el => {
            const dataLevelText = el.getAttribute('data-leveltext');
            if (dataLevelText) {
                expect((el as HTMLElement).style.listStyleType).not.toContain(dataLevelText);
            }
        });

        const orderedLists = doc.querySelectorAll('ol');
        expect(orderedLists.length).toBe(2);
        expect(orderedLists[0].start).toBe(1);
        expect(orderedLists[1].start).toBe(2);
    });
});

function sanitizeContent(html: string) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const fragment = doc.createDocumentFragment();
    while (doc.body.firstChild) {
        fragment.appendChild(doc.body.firstChild);
    }

    convertPastedContentFromWordOnline(fragment);

    while (fragment.firstChild) {
        doc.body.appendChild(fragment.firstChild);
    }
    return doc;
}
