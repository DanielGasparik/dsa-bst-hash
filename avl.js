const max = (a,b) => {

    if(a===b){
        return a;
    }
        return (a>b)?a:b;

}

class Node{
    constructor(value){
        this.value = value;
        this.right = null;
        this.left = null;
        this.height = 0;
    }
}
class Tree{
    constructor(value){
        this.base = null;
    }
    height(n){
        let a;
        n==null?a=0:a=n.height;
        return a;
    }
    balanced(n){
        return n==null?0:this.height(n.left)-this.height(n.right);

    }
    insert(value){
        const node = new Node(value);
        if(this.root == null){
            this.root = node;
            return this;
        }        

    }


    
}