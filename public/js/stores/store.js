class Store {
    constructor() {
        this.seed = 0;
        this.data = [];
        this.subscribers = [];
    }

    getAll() {
        return this.data;
    }

    getOne(id) {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].id === id) return this.data[i];
        }
    }

    getOneIndex(id) {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].id === id) return i;
        }
    }

    add(item) {
        item.id = Date.now() + this.seed++;
        this.data.push(item);
    }

    update(item) {
        const index = this.getOneIndex(item.id);

        this.data[index] = Object.assign({}, this.data[index], item);
    }

    remove(id) {
        const index = this.getOneIndex(id);

        this.data.splice(index, 1);
    }

    emit() {
        for (let i = 0; i < this.subscribers.length; i++){
            this.subscribers[i]();
        }
    }

    subscribe(handler) {
        this.subscribers.push(handler);
    }

    unsubscribe(handler) {
        const index = this.subscribers.indexOf(handler);

        this.subscribers.splice(index, 1);
    }
}

export default Store;