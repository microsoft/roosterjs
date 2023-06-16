import { ContentModelEditorCore } from '../../../lib/publicTypes/ContentModelEditorCore';
import { createEditorContext } from '../../../lib/editor/coreApi/createEditorContext';

describe('createEditorContext', () => {
    it('create a normal context', () => {
        const isDarkMode = 'DARKMODE' as any;
        const defaultFormat = 'DEFAULTFORMAT' as any;
        const darkColorHandler = 'DARKHANDLER' as any;
        const addDelimiterForEntity = 'ADDDELIMITER' as any;

        const core = ({
            lifecycle: {
                isDarkMode,
            },
            defaultFormat,
            darkColorHandler,
            addDelimiterForEntity,
        } as any) as ContentModelEditorCore;

        const context = createEditorContext(core);

        expect(context).toEqual({
            isDarkMode,
            darkColorHandler,
            defaultFormat,
            addDelimiterForEntity,
        });
    });
});
