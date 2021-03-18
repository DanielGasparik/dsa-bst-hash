/*let array = new Array(20);
console.log(array.length);
let array_misc = new Array(array.length * 2);
array = [...array, ...array_misc]; //zväčšovanie
*/

const hash = (key, size) => {

    let hash = 0;
    [...key].forEach(c => hash += c.charCodeAt() )
    return hash % size;

}
const fs = require('fs');

class HashTable {
    constructor() {

        this.buckets = [];
        this.size = 40;
        this.count = 0;
        for (let i = 0; i < this.size; i++) {
            this.buckets.push([]);
        }
        this.buckets2 = null;

    }
    insert(obj) {
        if (this.count == this.size) {
            //console.log("now");
            this.rehash();

        }
        this.count++;
        this.buckets[hash(obj.str, this.size)]
            .push(obj);

    }
    search(string) {

        let idx = hash(string, this.size);
        console.log(idx);
        if (idx != undefined) {
            let idx2 = this.buckets[idx].findIndex((iterable) => {
                iterable.str == string;
            });
            if (idx2 != -1) {
                return this.buckets[idx][idx2];
            } {
                console.log("nenasiel som nic pice");
            }
        }



    }
    rehash() {
        /*for (let i = 0; i < this.size; i++) {
            this.buckets.push([]);
        }*/
        
        this.buckets2 = [];
        for(let i = 0;i<this.size*2;i++){
            this.buckets2.push([]);
        }
        for (let bucket of this.buckets) {
            if(bucket.length!=0){
                bucket.forEach(item=>{
                    this.buckets2[hash(item.str,this.size*2)].push(item);
                    //console.log(this.buckets2[hash(item.str,this.size)]);
                })
            }

        }
        this.size *= 2;
        //deep copy
        this.buckets = JSON.parse(JSON.stringify(this.buckets2));
        this.buckets2 = null;
        // for (let i = 0; i < this.buckets.length; i++) {
        //     if (this.buckets[i].length !== 0) {
        //         this.buckets[hash(this.buckets[i][0].str, this.size)]
        //             .push(this.buckets[i]);
        //         delete this.buckets[i];
        //     }
        // }

    }
}

let ht = new HashTable();

ht.insert({
    str: "asdasd",
    slt: 1
});


let data = fs.readFileSync("ExportJson-3.json", "utf8");
let data_inner = JSON.parse(data);
//console.log(data_inner);
//console.log(data_inner.items);
for (let i of data_inner.items) {
    ht.insert(i);
}

/*
ht.insert({
    str: "aasc",
    slt: 2
});
ht.insert({
    str: "assc",
    slt: 2
});
ht.insert({
    str: "ac",
    slt: 2
});
ht.insert({
    str: "aa+c",
    slt: 2
});
ht.insert({
    str: "aqsc",
    slt: 2
});
ht.insert({
    str: "aaťc",
    slt: 2
});
ht.insert({
    str: "aasc",
    slt: 2
});
ht.insert({
    str: "assc",
    slt: 2
});
ht.insert({
    str: "ac",
    slt: 2
});
ht.insert({
    str: "aa+c",
    slt: 2
});
ht.insert({
    str: "aqsc",
    slt: 2
});
ht.insert({
    str: "aaťc",
    slt: 2
});
ht.insert({
    str: "aasc",
    slt: 2
});
ht.insert({
    str: "assc",
    slt: 2
});
ht.insert({
    str: "ac",
    slt: 2
});
ht.insert({
    str: "aa+c",
    slt: 2
});
ht.insert({
    str: "a2+c",
    slt: 2
});
ht.insert({
    str: "a1+c",
    slt: 2
});
ht.insert({
    str: "2a+c",
    slt: 2
});
ht.insert({
    str: "aa+c",
    slt: 2
});
ht.insert({
    str: "a23x",
    slt: 2
});
ht.insert({
    str: "a14x",
    slt: 2
});
ht.insert({
    str: "2a2c",
    slt: 2
});
ht.insert({
    str: "aqc+c",
    slt: 2
});
ht.insert({
    str: "x",
    slt: 2
});
ht.insert({
    str: "y",
    slt: 2
});
*/
//console.log(ht.search("Rowan Saunders"));
console.log(ht);
