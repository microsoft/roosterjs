import { mount as mountClassicalEditorMainPane } from './controls/MainPane';
import { mount as mountContentModelEditorMainPane } from './controls/ContentModelEditorMainPane';
import { mount as mountContentModelCoreEditorMainPane } from './controls/ContentModelCoreEditorMainPane';

const search = document.location.search.substring(1).split('&');
const cm = search.filter(x => x.indexOf('cm=') == 0)[0]?.substring(3);

switch (cm) {
    case '2':
        mountContentModelCoreEditorMainPane(document.getElementById('mainPane'));
        break;

    case '1':
        mountContentModelEditorMainPane(document.getElementById('mainPane'));
        break;

    default:
        mountClassicalEditorMainPane(document.getElementById('mainPane'));
        break;
}
