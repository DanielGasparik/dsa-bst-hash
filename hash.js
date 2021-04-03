/*let array = new Array(20);
console.log(array.length);
let array_misc = new Array(array.length * 2);
array = [...array, ...array_misc]; //zväčšovanie
*/

const hash = (key, size) => {

    let hash = 0;
    [...key].forEach(c => hash += c.charCodeAt())
    return hash % size;

}
const fs = require('fs');

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
            return this.buckets[idx].find((obj)=>{
                return obj.meno === string;
            });
        }



    }
    rehash() {

        for (let i = 0; i < this.size * 2; i++) {
            this.buckets2.push([]);
        }
        for (let bucket of this.buckets) {
            if (bucket.length != 0) {
                bucket.forEach(item => {
                    this.buckets2[hash(item.meno, this.size * 2)].push(item);
                    //console.log(this.buckets2[hash(item.str,this.size)]);
                })
            }

        }
        this.size *= 2;
        //only shallow copy but it's fine here
        this.buckets = [...this.buckets2];
        this.buckets2 = [];

    }
}

let ht = new HashTable();


let data = fs.readFileSync("ExportJson-4.json", "utf8");
let data_inner = JSON.parse(data);

for (let i of data_inner.items) {
    ht.insert(i);
}

const start = Date.now()
console.log(ht.search("Anthony Wilson"));
const result = Date.now()-start;

console.log(`This took me ${result}ms. `)

//console.log(ht.search("a14x"));