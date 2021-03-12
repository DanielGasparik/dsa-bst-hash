//swap
let a,b;
[a,b] = [b,a];
class AVLNode{
    constructor(value){
        this.value = value;
        this.right = null;
        this.left = null;
        this.height = 0;
    }
}

class AVLTree{
    constructor(){
        this.base = null;
    
    }
    height(n){ 
        if(n==null){return -1;}
        return Math.max(height(n.left),height(n.right))+1;
    }
    balance(n){
        return n==null?0:this.height(n.left)-this.height(n.right);

    }
    insert(value){
        const node = new AVLNode(value);
        let root = this.base;
        if(this.base == null){
            this.base = node;
            
        }
        else{
            insertN(this.base,node);
        }
          
               

    }
    insertN(root,node){
        if(root === null){
            root = node;
        }
        else if(node.value < root.value){
            root.left = insertN(root.left,node);
            
        }
        else if(node.value>root.value){
            
            root.right = insertN(root.right,node);
        }
        return root;
}
    inorder(node){
        
        if(node!==null){
            this.inorder(node.left);
            console.log(node.value);
            this.inorder(node.right);
        }

    }
    getRoot(){
        return this.base;
    }


    
}
console.log("hello world");
const tree = new AVLTree();
tree.insert(10);
tree.insert(20);
tree.insert(12);
tree.insert(40);
tree.insert(12);
tree.inorder(tree.base);
