
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
    getHeight(n){ 
        if(n==null){return -1;}
        return Math.max(this.getHeight(n.left),this.getHeight(n.right))+1;
    }
    balance(n){
        if( n == null){return 0;}
        return this.getHeight(n.left)-this.getHeight(n.right);

    }
    //rotate left
    //the tree is right heavy
    //RR
    rotateRH(node){
        let a = node.right;
        node.right = a.left;
        a.left = node;
         return a;
    }
    //rotate right
    //the tree is left heavy
    //LL
    rotateLH(node){
        let a = node.left;
        node.left = a.right;
        a.right = node;

        return a;

    }

    
    rotateLR(node){
        //perform left rotation on the left subtree
        node.left = this.rotateRH(node.left);
        //perform right rotation on the root subtree
        return this.rotateLH(node);
        
    }

    rotateRL(node){
        //perform right rotation on the right subtree
        node.right = this.rotateLH(node.right);
        //perform left rotation on the root subtree
        return this.rotateRH(node);
    }
    insertN(root,node){
        if(root === null){
            root = node;
             
        }
        if(node.value < root.value){
            //klasicka rekurzia na najdenie mostleft wanted node kde mame insertnut nas node
            root.left = this.insertN(root.left,node);
            
            
        }
        else if(node.value>root.value){
            root.right = this.insertN(root.right,node);
            
        }
        else { return root;}
        
        root.height = this.getHeight(root);
        let balance = this.balance(root);
        if(balance>1&& node.value<root.left.value){
             return this.rotateLH(root);
        }
        if(balance<-1&&node.value>root.right.value){
            return this.rotateRH(root);
        }
        if(balance >1 && node.value>root.left.value){
            return this.rotateLR(root);
        }
        if(balance <-1 && node.value<root.left.value){
            return this.rotateRL(root);
        }
        return root;
    }
    insert(value){
        let node = new AVLNode(value);
        let root = this.base;
        if(this.base == null){
            this.base = node;     
        }
        else{
            this.insertN(root,node);
        }
          
               

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
tree.insert(3);
tree.insert(2);
tree.insert(1);
console.log(tree.base);
