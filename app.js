
///TEST FILE;

const fs = require('fs');
const RedBlackTree = require('functional-red-black-tree')
const h = require('./hash.js')
const a = require('./avl.js')
//moja implementacia
const ht = new h.HashTable();
const avl = new a.AVLTree();

//prevzata
let rbtree = RedBlackTree();
const ht_p = new Map();



let data_avl = fs.readFileSync("ExportJson-5.json", "utf8");
let data_inner_avl = JSON.parse(data_avl);

let data_hash = fs.readFileSync("ExportJson-4.json", "utf8")
let data_inner_hash = JSON.parse(data_hash);





//Testing AVL
console.log("Testing my AVL tree implementation on 20k {name:\"name\",age:49} objects");
const avl_start = Date.now();
console.log("Inserting.....(This might take approx 30-40s :( )")
for (let i of data_inner_avl.items) {
    avl.insert(i.meno,i);
}
const avl_result = Date.now() - avl_start;
console.log(`This took me ${avl_result}ms. \n`);
console.log("Vyhladavam.....")
const avl_find_start = Date.now();
console.log(avl.find("David Irving"));
const avl_find_result = Date.now()-avl_find_start;
console.log(`This took me ${avl_find_result}ms. `);
console.log("\n\n")


//Testing RBT

console.log("Testing imported RBT tree implementation on 20k {name:\"name\",age:49} objects");
const rbt_insert_start = Date.now();
console.log("Inserting.....")
for (let i of data_inner_hash.items) {
    rbtree = rbtree.insert(i.meno,i);
}
const rbt_insert_result = Date.now()-rbt_insert_start;
console.log(`This took me ${rbt_insert_result}ms.`);
console.log("Vyhladavam.....")
const rbt_find_start = Date.now();
console.log(rbtree.get("Anais Weatcroft"));
const rbtree_find_result = Date.now()-rbt_find_start;
console.log(`This took me ${rbtree_find_result}ms. `);
console.log("\n\n")






//Testing HashTable
console.log("Testing my HashTable implementation\n")
console.log("Inserting.....")
const ht_start = Date.now();
for (let i of data_inner_hash.items) {
    ht.insert(i);
}
const ht_result = Date.now() - ht_start;
console.log(`This took me ${ht_result}ms. `);
console.log("Vyhladavam.....")
const ht_find_start = Date.now();
console.log(ht.search("Anais Weatcroft"));
const ht_find_result = Date.now()-ht_find_start;
console.log(`This took me ${ht_find_result}ms. `);
console.log("\n\n")



//Testing HashTable in JS Map
console.log("Testing native JS Map() (kinda same with hashtable but the implementation varies with different engines (Node, V8-chrome etc)) implementation\n");
console.log("Inserting.....")
const htp_start = Date.now();
for (let i of data_inner_hash.items) {
    ht_p.set(i.meno,i);
}
const htp_result = Date.now() - htp_start;
console.log(`This took me ${htp_result}ms. `);
console.log("Vyhladavam.....")
const htp_find_start = Date.now();
console.log(ht_p.get("Anais Weatcroft"));
const htp_find_result = Date.now()-htp_find_start;
console.log(`This took me ${htp_find_result}ms. `);
console.log("\n\n")