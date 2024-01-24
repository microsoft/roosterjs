import { mount as mountClassicalEditorMainPane } from './controls/MainPane';
import { mount as mountContentModelEditorMainPane } from './controls/ContentModelEditorMainPane';
import { mount as mountStandaloneEditorMainPane } from './controls/StandaloneEditorMainPane';

const search = document.location.search.substring(1).split('&');

if (search.some(x => x == 'cm=1')) {
    mountContentModelEditorMainPane(document.getElementById('mainPane'));
} else if (search.some(x => x == 'cm=2')) {
    mountStandaloneEditorMainPane(document.getElementById('mainPane'));
} else {
    mountClassicalEditorMainPane(document.getElementById('mainPane'));
}
