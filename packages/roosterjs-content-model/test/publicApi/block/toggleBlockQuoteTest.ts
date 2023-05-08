import * as formatWithContentModel from '../../../lib/publicApi/utils/formatWithContentModel';
import * as toggleModelBlockQuote from '../../../lib/modelApi/block/toggleModelBlockQuote';
import toggleBlockQuote from '../../../lib/publicApi/block/toggleBlockQuote';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('toggleBlockQuote', () => {
    const fakeModel: any = { a: 'b' };
    let editor: IContentModelEditor;

    beforeEach(() => {
        editor = ({
            createContentModel: () => fakeModel,
        } as any) as IContentModelEditor;
    });

    it('toggleBlockQuote', () => {
        spyOn(formatWithContentModel, 'formatWithContentModel').and.callThrough();
        spyOn(toggleModelBlockQuote, 'toggleModelBlockQuote');

        toggleBlockQuote(editor, { a: 'b', c: 'd' } as any);

        expect(formatWithContentModel.formatWithContentModel).toHaveBeenCalledTimes(1);
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
        spyOn(formatWithContentModel, 'formatWithContentModel').and.callThrough();
        spyOn(toggleModelBlockQuote, 'toggleModelBlockQuote');

        toggleBlockQuote(editor, { lineHeight: '2', textColor: 'red' });

        expect(formatWithContentModel.formatWithContentModel).toHaveBeenCalledTimes(1);
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
