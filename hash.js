/*let array = new Array(20);
console.log(array.length);
let array_misc = new Array(array.length * 2);
array = [...array, ...array_misc]; //zväčšovanie
*/

const hash = (key, size) => {

    let hash = 0;
    [...key].forEach(c => hash += c.charCodeAt() * 7)
    return hash % size;

}

class HashTable {
    constructor() {

        this.buckets = [];
        this.size = 100;
        for (let i = 0; i < this.size; i++) {
            this.buckets.push([]);
        }

    }
    insert(obj) {
        if (this.buckets.length == this.size) {
            this.rehash();
            
        }
        this.buckets[hash(obj.str, this.size)]
            .push(obj);

    }
    search(string) {
        let idx = hash(string, this.size);
        return this.buckets[idx][this.buckets.findIndex((wanted) => {
            wanted == string;
        })];

    }
    rehash() {
        for (let i = 0; i < this.size; i++) {
            this.buckets.push([]);
        }
        this.size *= 2;
        for (let i = 0; i < this.buckets.length; i++) {
            if (this.buckets[i].length !== 0) {
                this.buckets[this.rehash(this.buckets[i][0].str, this.size)]
                .push(this.buckets[i]);
                delete this.buckets[i];
            }
        }

    }
}

const ht = new HashTable();
let arr = [];
arr.push(["cow","milk",3,4,5,"six",7,"me","is"]);
arr.push(["abc","minecraft",3]);
console.log(arr);
console.log(arr.splice(1,1));