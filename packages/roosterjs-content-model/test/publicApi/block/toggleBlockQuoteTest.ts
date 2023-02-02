import * as formatWithContentModel from '../../../lib/publicApi/utils/formatWithContentModel';
import * as toggleModelBlockQuote from '../../../lib/modelApi/block/toggleModelBlockQuote';
import toggleBlockQuote from '../../../lib/publicApi/block/toggleBlockQuote';
import { IExperimentalContentModelEditor } from '../../../lib/publicTypes/IExperimentalContentModelEditor';

describe('toggleBlockQuote', () => {
    const fakeModel: any = { a: 'b' };
    let editor: IExperimentalContentModelEditor;

    beforeEach(() => {
        editor = ({
            createContentModel: () => fakeModel,
        } as any) as IExperimentalContentModelEditor;
    });

    it('toggleBlockQuote', () => {
        spyOn(formatWithContentModel, 'formatWithContentModel').and.callThrough();
        spyOn(toggleModelBlockQuote, 'toggleModelBlockQuote');

        toggleBlockQuote(editor, { a: 'b' } as any, { c: 'd' } as any);

        expect(formatWithContentModel.formatWithContentModel).toHaveBeenCalledTimes(1);
        expect(toggleModelBlockQuote.toggleModelBlockQuote).toHaveBeenCalledTimes(1);
        expect(toggleModelBlockQuote.toggleModelBlockQuote).toHaveBeenCalledWith(
            fakeModel,
            {
                marginTop: '1em',
                marginBottom: '1em',
                marginLeft: '40px',
                marginRight: '40px',
                paddingLeft: '10px',
                a: 'b',
            } as any,
            { c: 'd' } as any
        );
    });
});
