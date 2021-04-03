const csv = require('csv-parser');
const fs = require("fs");
class AVLNode {
    constructor(obj) {
        this.obj = obj;
        this.value = this.obj.str;
        this.right = null;
        this.left = null;
        this.height = 0;
        this.balance = 0;
    }
}
class AVLObj {
    constructor(str, payload) {
        this.str = str;
        this.payload = [];
        this.payload.push(payload);
    }
}
class AVLTree {
    constructor() {
        this.base = null;

    }
    getHeight(n) {
        if (n == null || typeof n == "undefined") {
            return -1;
        }
        return Math.max(this.getHeight(n.left), this.getHeight(n.right)) + 1;
    }
    balance(n) {
        if (n.left == null && n.right == null) {
            return 0;
        }
        return (this.getHeight(n.left) - this.getHeight(n.right));

    }

    insertN(root, node) {
        if (root == null) {
            return node;

        } else if (node.value < root.value) {
            //klasicka rekurzia na najdenie mostleft wanted node kde mame insertnut nas node
            //console.log("vnaram sa dolava");
            root.left = this.insertN(root.left, node);


        } else if (node.value > root.value) {
            //console.log("vnaram sa doprava");
            root.right = this.insertN(root.right, node);

        }

        //console.log("som v node "+root.value);
        root.height = this.getHeight(root);
        //console.log("height "+root.height);
        //console.log("Som v node"+root.value+" s vyskou "+root.height+"node vpravo je "+root.right===null?"null":root.right.value+"node vlavo je" +(root.left===null?"null":root.left.value)+"\n");
        root.balance = this.balance(root);
        //console.log("balance "+root.balance);

        if (root.balance > 1 && node.value < root.left.value) {
            //perform rotation to the right
            root = this.rotateLH(root);
        }
        if (root.balance > 1 && node.value > root.left.value) {
            root = this.rotateLR(root);
        }
        if (root.balance < -1 && node.value > root.right.value) {
            //perform rotation to the left
            root = this.rotateRH(root);
        }
        if (root.balance < -1 && node.value < root.right.value) {
            root = this.rotateRL(root);
        }


        return root;


    }
    height_util(node) {
        return (node == null ? 0 : node.height);
    }
    insert(value, payload) {
        let node = new AVLNode(new AVLObj(value, payload));

        if (this.base === null) {
            //console.log("Insertujem for the first time "+node.value)
            this.base = node;
        } else {
            //console.log("Insertujem "+node.value)
            this.base = this.insertN(this.base, node);
        }


    }
    //rotate left
    //the tree is right heavy
    //RR
    rotateRH(node) {
        let a = node.right;
        node.right = a.left;
        a.left = node;

        node.height = this.getHeight(node);
        node.balance = this.balance(node);
        a.height = this.getHeight(a);
        a.balance = this.balance(node);

        return a;
    }
    //rotate right
    //the tree is left heavy
    //LL
    rotateLH(node) {
        let a = node.left;
        node.left = a.right;
        a.right = node;

        node.height = this.getHeight(node);
        node.balance = this.balance(node);
        a.height = this.getHeight(a);
        a.balance = this.balance(a);

        return a;

    }


    rotateLR(node) {
        //perform left rotation on the left subtree
        node.left = this.rotateRH(node.left);
        //perform right rotation on the root subtree
        return this.rotateLH(node);

    }

    rotateRL(node) {
        //perform right rotation on the right subtree
        node.right = this.rotateLH(node.right);
        //perform left rotation on the root subtree
        return this.rotateRH(node);
    }

    inorder(node) {

        if (node !== null) {
            this.inorder(node.left);
            console.log(`value->${node.value},height->${node.height},balance->${node.balance}\n`);
            this.inorder(node.right);
        }

    }
    getRoot() {
        return this.base;
    }
    find(key) {
        let a = this.findHelper(this.base, key);
        if (a == null) {
            console.log("Nenašiel som daný prvok");
            return null;
        } 
        return a;
        

    }
    findHelper(node, key) {
        if (node == null) {
            return null;
        }
        if (node.value == key) {

            console.log(`Našiel som hladany key ${key} v node ${node.value}`);
            return node;

        } else if (key < node.value) {
            node = this.findHelper(node.left, key);
        } else if (key > node.value) {
            node = this.findHelper(node.right, key);
        } else {
            node = null;
        }


        return node;

    }

}
const tree = new AVLTree();
let i = 0;
let name;
let payload;
tree.insert("d", {
    s: "d"
})
tree.insert("a", {
    s: "a"
})
tree.insert("c", {
    s: "c"
})
tree.insert("b", {
    s: "b"
})
tree.insert("q", {
    s: "q"
})
tree.insert("j", {
    s: "x"
})
tree.insert("f", {
    s: "d"
})
tree.inorder(tree.getRoot());
console.log(tree.find("c"));


console.time("Execution Time");
fs.createReadStream("test.csv").pipe(csv())
    .on("data", (row) => {
        
        name = row["name"] + row["Surname"];
        payload = row["Age"];
        tree.insert(name, payload);


    }).on("end", () => {
        console.timeEnd("Execution Time");
        //console.log(tree.getRoot());
        //tree.inorder(tree.getRoot());
        console.log(tree);
        
    });