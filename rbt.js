const rbt = require('functional-red-black-tree')
let tree = rbt();
for(let i = 0;i<100;i++){
    tree = tree.insert(i+1,"aaaa");
}
console.log(tree.ge(20));