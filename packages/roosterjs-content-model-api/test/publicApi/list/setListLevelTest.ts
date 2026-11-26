import * as setModelListLevel from '../../../lib/modelApi/list/setModelListLevel';
import { setListLevel } from '../../../lib/publicApi/list/setListLevel';
import {
    ContentModelDocument,
    ContentModelFormatter,
    FormatContentModelContext,
    FormatContentModelOptions,
    IEditor,
} from 'roosterjs-content-model-types';

describe('setListLevel', () => {
    it('call setModelListLevel', () => {
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [],
        };
        const context: FormatContentModelContext = {
            newEntities: [],
            deletedEntities: [],
            newImages: [],
        };
        const focusSpy = jasmine.createSpy('focus');
        const setModelListLevelSpy = spyOn(setModelListLevel, 'setModelListLevel').and.returnValue(
            true
        );
        const formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter, options: FormatContentModelOptions) => {
                expect(options.apiName).toBe('setListLevel');
                expect(callback(model, context)).toBeTrue();
            });
        const editor = ({
            focus: focusSpy,
            formatContentModel: formatContentModelSpy,
        } as any) as IEditor;

        setListLevel(editor, 'OL', 3);

        expect(focusSpy).toHaveBeenCalledTimes(1);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(setModelListLevelSpy).toHaveBeenCalledWith(model, 'OL', 3, context);
    });
});
