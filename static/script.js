class Node{
    constructor(data){
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class RemovalResult{
    constructor(node, tree){
        this.node = node; // Removed Node
        this.tree = tree; // Removed Tree
    }
}

class AVLNode extends Node{
    constructor(data){
        super(data);
        this.height = 0;
    }
    resetHeight(){
        let leftHeight = -1;
        let rightHeight = -1;
        if(this.left !== null){
            leftHeight = this.left.height;
        }
        if(this.right !== null){
            rightHeight = this.right.height;
        }
        this.height = 1 + Math.max(leftHeight, rightHeight);
    }
}

let root = null;
let r = document.getElementById("root");
let avlRoot = null;
let arr = [];

function getHeight(tree){
    if(tree === null){
        return -1;
    }else{
        return tree.height;
    }
}

function avlAdd(){    
    if(document.getElementById("text").value.length===0){
        showMessage("Input cannot be empty");
        return;
    }
    let val = Number.parseInt(document.getElementById("text").value);
    try{
        avlRoot = avlAddRecursive(avlRoot, val);
    }catch(err){
        showMessage(err);
        return;
    }
    render();
    arr.push(val);
}

function avlAddRecursive(tree, val){        
    if(tree === null){        
        return new AVLNode(val);
    }
    if(val < tree.data){        
        tree.left = avlAddRecursive(tree.left, val);
    }else if(val > tree.data){
        tree.right = avlAddRecursive(tree.right, val);
    }else if(val === tree.data){
        throw "Cannot Add Duplicates. Value: " + val;
    }

    //Check that tree is balanced
    let leftHeight = getHeight(tree.left);
    let rightHeight = getHeight(tree.right);

    if(Math.abs(leftHeight - rightHeight) === 2){        
        return balance(tree);
    }else{
        tree.resetHeight();
        return tree;
    }
}

function balance(tree){
    let rHeight = getHeight(tree.right);
    let lHeight = getHeight(tree.left);

    if(rHeight > lHeight){        
        rightChild = tree.right;
        let rrHeight = getHeight(rightChild.right);
        let rlHeight = getHeight(rightChild.left);
        if(rrHeight > rlHeight){
            return rrBalance(tree);
        }else{
            return rlBalance(tree);
        }
    }else{
        let leftChild = tree.left;
        let llHeight = getHeight(leftChild.left);
        let lrHeight = getHeight(leftChild.right);
        if(llHeight > lrHeight){
            return llBalance(tree);
        }else{
            return lrBalance(tree);
        }
    }
}

function rrBalance(tree){
    let rightChild = tree.right;
    let rightLeftChild = rightChild.left;
    rightChild.left = tree;
    tree.right = rightLeftChild;
    tree.resetHeight();
    rightChild.resetHeight();
    return rightChild;    
}

function rlBalance(tree){    
    let root = tree;
    let rNode = root.right;
    let rlNode = rNode.left;
    let rlrTree = rlNode.right;
    let rllTree = rlNode.left;

    rNode.left = rlrTree;
    root.right = rllTree;
    rlNode.left = root;
    rlNode.right = rNode;

    rNode.resetHeight();
    root.resetHeight();
    rlNode.resetHeight();

    return rlNode;
}

function llBalance(tree){
    let leftChild = tree.left;
    let lrTree = leftChild.right;
    leftChild.right = tree;
    tree.left = lrTree;
    tree.resetHeight();
    leftChild.resetHeight();
    return leftChild;
}

function lrBalance(tree){
    let root = tree;
    let lNode = root.left;
    let lrNode = lNode.right;
    let lrlTree = lrNode.left;
    let lrrTree = lrNode.right;

    lNode.right = lrlTree;
    root.left = lrrTree;
    lrNode.left = lNode;
    lrNode.right = root;

    lNode.resetHeight();
    root.resetHeight();
    lrNode.resetHeight();

    return lrNode;
}

function render(){
    if(avlRoot === null){
        document.getElementById("emptyMessage").style.visibility="visible";
    }else{
        document.getElementById("emptyMessage").style.visibility="hidden";
    }
    if(r.childElementCount !== 0){
        r.removeChild(r.childNodes[0]);
        r.removeChild(r.childNodes[0]);
    }    
    preOrderTraverseRender();
}

function remove(){
    if(document.getElementById("text").value.length===0){
        showMessage("Input cannot be empty");
        return;
    }
    let val = Number.parseInt(document.getElementById("text").value);    
    if(!arr.includes(val)){
        showMessage("Tree does not contain value " + val);
        return;
    }
    arr = arr.filter((e) => {        
        return (e !== val)
    });    
    avlRoot=null;
    arr.forEach((e) =>  {
        avlAddValue(e);
    });
    render();
}

function preOrderTraverseRender(){
    let node = avlRoot;
    preOrderTraverseRenderRecursive(node);
}

function preOrderTraverseRenderRecursive(node){
    if(node === null){
        return;
    }

    addToHtmlDom(node.data);

    preOrderTraverseRenderRecursive(node.left);

    preOrderTraverseRenderRecursive(node.right);
}

//----------HTML Logic-----------
function replaceLeftNode(node, newLeftNode){
    let children = node.childNodes[1];
    let left = children.childNodes[0];
    let right = children.childNodes[1];
    children.removeChild(left);
    children.removeChild(right);
    
    children.appendChild(newLeftNode);
    children.appendChild(right);
}

function replaceRightNode(node, newRightNode){
    let children = node.childNodes[1];
    
    let right = children.childNodes[1];
    
    children.removeChild(right);
    
    children.appendChild(newRightNode);
}

function getLeftNode(node){
    return node.childNodes[1].childNodes[0];
}

function getRightNode(node){
    let n = node.childNodes[1].childNodes[1]
    return n;
}

function getData(node){
    return Number.parseInt(node.childNodes[0].innerHTML);
}

function appendChildNodes(node, val){
    let children = document.createElement("div");    
    children.className = "ChildrenContainer";
    let head = document.createElement("div");
    head.className = "DataContainer";
    head.innerHTML = val;
    node.appendChild(head);
    node.appendChild(children);

    let child1 = document.createElement("div");
    child1.className = "Node";
    let child2 = document.createElement("div");
    child2.className = "Node";
    children.appendChild(child1);
    children.appendChild(child2);

    if(val < getData(node)){
        getLeftNode(node).appendChild(head);
        getLeftNode(node).appendChild(children);
    }

    if(val > getData(node)){
        getRightNode(node).appendChild(head);
        getRightNode(node).appendChild(children);
    }
}

function addToHtmlDom(val){    
    let node = r;    

    //empty BST
    if(isEmpty(node)){
        let children = document.createElement("div");    
        children.className = "ChildrenContainer";
        let head = document.createElement("div");
        head.className = "DataContainer";
        head.innerHTML = val;
        node.appendChild(head);
        node.appendChild(children);
    
        let child1 = document.createElement("div");
        child1.className = "Node";
        let child2 = document.createElement("div");
        child2.className = "Node";
        children.appendChild(child1);
        children.appendChild(child2);
        return;
    }
    
    while(!noChildren(node)){   
           
        if(val < getData(node)){                                    
            node = getLeftNode(node);
        }else if(val > getData(node)){                      
            node = getRightNode(node);
        }else{
            return;
        }
        
    }
    
    appendChildNodes(node, val);  
}

function noChildren(node){
    if(node.childElementCount === 0){
        return true;
    }

    if(numberOfChildren(node) === 0 || node.childElementCount === 0){
        return true;
    }else{
        return false;
    }
}

function numberOfChildren(node){
    let left = getLeftNode(node);
    let right = getRightNode(node);
    let count = 0;
    if((left.childElementCount > 0)) count++;
    if(right.childElementCount > 0) count++;
    return count;
}

function isEmpty(node){
    return node.childElementCount === 0;
}

function avlAddValue(val){
    try{
        avlRoot = avlAddRecursive(avlRoot, val);
    }catch(err){
        console.log(err);
        return;
    }    
    render();
}

function clearTree(){    
    avlRoot = null;
    arr=[];
    render();
}

function incrementAutofill(){
    let num = Number.parseInt(document.getElementById("autofill-text").value);
    if(num > 100){
        showMessage("Number of elements can't be greater than 100");
        return;
    }
    clearTree();
    for(let i = 1; i <= num; i++){
        avlAddValue(i);
        arr.push(i);
    }
}

function randomAutofill(){    
    let num = Number.parseInt(document.getElementById("autofill-text").value);
    if(num > 100){
        showMessage("Number of elements can't be greater than 100");
        return;
    }
    clearTree();
    let randomArr=[];
    let i = 1;
    while(i <= num){
        let elem = Number.parseInt(Math.random()*100);
        if(!randomArr.includes(elem)){
            i++;
            randomArr.push(elem);
            avlAddValue(elem);
            arr.push(elem);
        } 
    }
}
function showMessage(message){
    document.getElementById("errorMessage").innerHTML= message;
    document.getElementById("errorMessageButton").style.display="block";
}
function clearMessage(){
    document.getElementById("errorMessage").innerHTML= "";
    document.getElementById("errorMessageButton").style.display="none";
}

