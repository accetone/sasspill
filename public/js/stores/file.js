import Store from './store';
import Dispatcher from '../dispatcher';
import FileConstants from '../constants/file';
import TabActions from '../actions/tab';

class LocalStore {
    constructor() {
        this.isSupported = this.isSupportLocalStorage();
        this.storage = window.localStorage;
        this.key = 'files';
    }

    isSupportLocalStorage() {
        try {
            window.localStorage.setItem('test', 'test');
            window.localStorage.removeItem('test');

            return true;
        } catch (exception) {
            return false;
        }
    }

    save(files) {
        if (!this.isSupported) return;

        this.storage[this.key] = JSON.stringify(files);
    }

    get() {
        if (!this.isSupported || !this.storage[this.key]) return;

        return JSON.parse(this.storage[this.key]);
    }
}

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
const localStore = new LocalStore();

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

                localStore.save(fileStore.getAll());
            }

            TabActions.activate(file.id);

            break;
        }

        case FileConstants.FILE_UPDATE_CONTENT: {
            fileStore.update({
                id: action.id,
                content: action.content
            });

            localStore.save(fileStore.getAll());

            break;
        }

        case FileConstants.FILE_UPDATE_NAME: {
            fileStore.update({
                id: action.id,
                name: action.name
            });

            localStore.save(fileStore.getAll());

            break;
        }

        case FileConstants.FILE_DELETE: {
            fileStore.remove(action.id);

            localStore.save(fileStore.getAll());

            break;
        }

        case FileConstants.FILES_RESTORE: {
            const files = localStore.get();

            if (!files) return;

            for (let i = 0; i < files.length; i++) {
                fileStore.add(files[i]);
                TabActions.add(`${files[i].name}.${files[i].extension}`, files[i]);
            }

            break;
        }

        default: return;
    }

    fileStore.emit();
});

export default fileStore;