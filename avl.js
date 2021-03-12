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
        if(n==null){return -1}
        return Math.max(height(n.left),height(n.right))+1;
    }
    balanced(n){
        return n==null?0:this.height(n.left)-this.height(n.right);

    }
    insert(value){
        const node = new Node(value);
        if(this.base == null){
            this.base = node;
            return this;
        }        

    }


    
}