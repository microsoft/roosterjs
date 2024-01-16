import * as toggleModelBlockQuote from '../../../lib/modelApi/block/toggleModelBlockQuote';
import toggleBlockQuote from '../../../lib/publicApi/block/toggleBlockQuote';
import { IStandaloneEditor } from 'roosterjs-content-model-types';
import {
    ContentModelFormatter,
    FormatWithContentModelContext,
} from 'roosterjs-content-model-types';

describe('toggleBlockQuote', () => {
    const fakeModel: any = { a: 'b' };
    let editor: IStandaloneEditor;
    let formatContentModelSpy: jasmine.Spy;
    let context: FormatWithContentModelContext;

    beforeEach(() => {
        context = undefined!;

        formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter) => {
                context = {
                    newEntities: [],
                    newImages: [],
                    deletedEntities: [],
                };
                callback(fakeModel, context);
            });

        editor = ({
            focus: jasmine.createSpy('focus'),
            formatContentModel: formatContentModelSpy,
        } as any) as IStandaloneEditor;
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
        expect(context).toEqual({
            newEntities: [],
            newImages: [],
            deletedEntities: [],
            newPendingFormat: 'preserve',
        });
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
        expect(context).toEqual({
            newEntities: [],
            newImages: [],
            deletedEntities: [],
            newPendingFormat: 'preserve',
        });
    });
});
