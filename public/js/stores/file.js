import Store from './store';
import Dispatcher from '../dispatcher';
import FileConstants from '../constants/file';
import TabActions from '../actions/tab';
import FileActions from '../actions/file';

class FileStore extends Store {
    find(name, extension) {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].name === name
                && this.data[i].extension === extension) {
                return this.data[i];
            }
        }
    }
}

const fileStore = new FileStore();

Dispatcher.subscribe((action) => {
    switch (action.actionType) {
        case FileConstants.FILE_ADD: {
            let file = fileStore.find(action.name, action.extension);

            if (!file) {
                file = {
                    name: action.name,
                    extension: action.extension,
                    attributes: action.attributes,
                    content: ''
                };

                if(file.extension === 'scss' && file.name.endsWith('.scss')) {
                    file.name = file.name.substr(0, file.name.length - 5);
                }

                fileStore.add(file);
                TabActions.add(`${file.name}.${file.extension}`, file);
            }

            TabActions.activate(file.id);

            break;
        }

        case FileConstants.FILE_UPDATE_CONTENT: {
            fileStore.update({
                id: action.id,
                content: action.content
            });

            break;
        }

        case FileConstants.FILE_UPDATE_NAME: {
            fileStore.update({
                id: action.id,
                name: action.name
            });

            break;
        }

        case FileConstants.FILE_DELETE: {
            fileStore.remove(action.id);

            break;
        }

        default: return;
    }

    fileStore.emit();
});

export default fileStore;