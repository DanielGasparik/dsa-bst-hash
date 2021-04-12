

const hash = (key, size) => {

    let hash = 0;
    [...key].forEach(c => hash += c.charCodeAt())
    return hash % size;

}
class HashTable {
    constructor() {

        this.buckets = [];
        this.size = 4;
        this.count = 0;
        for (let i = 0; i < this.size; i++) {
            this.buckets.push([]);
        }
        this.buckets2 = [];

    }
    insert(obj) {
        if (this.count >= 0.6 * this.size) {
            this.rehash();

        }
        this.count += 1;
        this.buckets[hash(obj.meno, this.size)]
            .push(obj);

    }
    search(string) {

        let idx = hash(string, this.size);
        if (idx != undefined) {
            return this.buckets[idx].find((obj) => {
                return obj.meno == string;
            });
        }



    }
    rehash() {
        const size2 = this.size * 2;
        for (let i = 0; i < size2; i++) {
            this.buckets2.push([]);
        }
        for (let bucket of this.buckets) {
            if (bucket.length != 0) {
                bucket.forEach(item => {
                    this.buckets2[hash(item.meno, size2)].push(item);

                })
            }

        }
        this.size *= 2;
        //only shallow copy but it's fine here
        this.buckets = [...this.buckets2];
        this.buckets2 = [];

    }
}

module.exports = {hash,HashTable};

