import * as pendingFormat from '../../../lib/modelApi/format/pendingFormat';
import * as toggleModelBlockQuote from '../../../lib/modelApi/block/toggleModelBlockQuote';
import toggleBlockQuote from '../../../lib/publicApi/block/toggleBlockQuote';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('toggleBlockQuote', () => {
    const fakeModel: any = { a: 'b' };
    let editor: IContentModelEditor;
    let formatContentModelSpy: jasmine.Spy;

    beforeEach(() => {
        formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: Function) => {
                callback(fakeModel);
            });

        spyOn(pendingFormat, 'formatAndKeepPendingFormat').and.callFake(
            (editor, formatter, options) => {
                editor.formatContentModel(formatter, options);
            }
        );

        editor = ({
            focus: jasmine.createSpy('focus'),
            formatContentModel: formatContentModelSpy,
        } as any) as IContentModelEditor;
    });

    it('toggleBlockQuote', () => {
        spyOn(toggleModelBlockQuote, 'toggleModelBlockQuote');

        toggleBlockQuote(editor, { a: 'b', c: 'd' } as any);

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(toggleModelBlockQuote.toggleModelBlockQuote).toHaveBeenCalledTimes(1);
        expect(toggleModelBlockQuote.toggleModelBlockQuote).toHaveBeenCalledWith(fakeModel, {
            marginTop: '1em',
            marginBottom: '1em',
            marginLeft: '40px',
            marginRight: '40px',
            paddingLeft: '10px',
            a: 'b',
            c: 'd',
        } as any);
    });

    it('toggleBlockQuote with real format', () => {
        spyOn(toggleModelBlockQuote, 'toggleModelBlockQuote');

        toggleBlockQuote(editor, { lineHeight: '2', textColor: 'red' });

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(toggleModelBlockQuote.toggleModelBlockQuote).toHaveBeenCalledTimes(1);
        expect(toggleModelBlockQuote.toggleModelBlockQuote).toHaveBeenCalledWith(fakeModel, {
            marginTop: '1em',
            marginBottom: '1em',
            marginLeft: '40px',
            marginRight: '40px',
            paddingLeft: '10px',
            lineHeight: '2',
            textColor: 'red',
        } as any);
    });
});
