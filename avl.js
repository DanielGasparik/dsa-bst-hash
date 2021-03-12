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
    insertN(root,node){
        if(root === null){
            root = node; 
        }
        else if(node.value < root.value){
            //klasicka rekurzia na najdenie mostleft wanted node kde mame insertnut nas node
            root.left = this.insertN(root.left,node);
            //balancing
            if(this.balance(root)>1){
                if(root.left !== null && node.value>root.left.value){
                    root = rotationLeft(root);
                }
                else if(root.left != null && node.value<root.left.value){
                    
                }
                //check for rotation
            }
            
            
        }
        else if(node.value>root.value){
            root.right = this.insertN(root.right,node);
            if(this.balance(root)<-1){
                //check for rotation
            }
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
            this.insertN(this.base,node);
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
    //rotate right
    rotateLL(node){
        
        
        /*
        let a = node.right;
        node.right = a.left;
        a.left = node;
         return a;*/
    }
    rotateRR(node){}
    rotateLR(node){}
    rotateRR(node){}


    
}
console.log("hello world");
const tree = new AVLTree();
for(let i = 0;i<50;i++){
tree.insert(i);
tree.insert(i+50);
}
tree.inorder(tree.base);
