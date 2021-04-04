# DSA zadanie 2 - Daniel Gašparík

V mojom riešení nájdete vlastné implementácie hashovacej tabuľky a binárneho vyhľadávacieho stromu s algoritmom vyvažovania - AVL. Ďalej tu nájdete prevzaté riešenia/implementácie červeno-čierneho stromu a upravenej hashovacej tabuľky cez JS triedu Map. K riešeniu je dodaný aj testovací súbor `app.js` . Všetko potrebné sa dozviete v tejto dokumentácií.


# Predhovor

V kapitolách nižšie nájdtete samotné **[implementácie](#implementácie)**, ako aj **[porovnania časových zložitostí](#zložitosti)** a porovnania mojich **[odtestovaných časových výstupov](#porovnanie-časovej-výkonnosti-implementácií)**. Nájdete tu aj **zoznam [súborov](#súbory-a-požiadavky-na-spustenie)** dodaných so zadaním ako aj **požiadavky** potrebné na spustenie môjho riešenia.  Na konci nájdete **[záver](#záver)** a  **[referencie](#referencie)** z prevzatých implementácií.

# Zložitosti



|                |Vkladanie                          |Hľadanie                         |
|----------------|-------------------------------|-----------------------------|
|**AVL**|  $O(log n )$          |$O(log n )$        |
|**RBT**          |$O(log n )$            |$O(log n )$            |
|**HashTable**          |$O(1)$           |$O(1)$            |
|**Map**          |$O(1)$           |$O(1)$            |

# Implementácie

**1.** Implementácia **[AVL ](#implementácia-avl)**
**2.** Implementácia **[HashTable](#implementácia-hashtable)**
**3.** Prevzatá implementácia **[Reed Black Tree](#implementácia-red-black-tree)**
**4.** [Natívna (JS) Implementácia](#implementácia-map) HashTable - **V8 engine in Node.js**
**5.** **[Porovnanie](#porovnanie-časovej-výkonnosti-implementácií)** časovej výkonnosti implementácií

## Porovnanie časovej výkonnosti implementácií

- **Stromy** boli vykonávané na súbore o veľkosti **20 000** záznamov
- **HashTable** bola vykonávané na súbore o veľkosti **100 000** záznamov

### Rýchlosti boli merané v node.js na Macbook Air 2017 | i5 1,8Ghz | 8GB RAM

|                |Moja implementácia                          |Prevzatá implementácia                         |
|----------------|-------------------------------|-----------------------------|
|**Stromy**|`Insert - ~30-40s | Search - ~13ms`            |`Insert - ~432ms | Search -  ~1ms`            |
|**HashTable**          |`Insert - ~200-300ms | Search - ~3ms`            |`Insert - ~76ms | Search - ~0ms`            |

## Súbory a požiadavky na spustenie

- **app.js** - Testovač `node app.js`
- **avl.js** - Zdrojový kód pre AVL Strom
- **hash.js** - Zdrojový kód pre HashTable
- node_modules/functional-red-black-tree/**rbtree.js** - Zdrojový kód pre Red Black Tree
- **ExportJson-5.json** - Dáta pre stromy
- **ExportJson-4.json** - Dáta pre Hashovacie tabuľky
- **dokumentacia.markdown** & **dokumentacia.pdf**

**Spustenie**
`npm init`
`npm install functional-red-black-tree`
`node -v` - skontroluje verziu Node.js
`node app.js`

>Na spustenie **potrebujete** Node.js verziu 12.x a vyššie a npm

# Implementácia AVL

Moja implementácia **AVL** pramení z podstaty AVL stromov a použitia rekurzie ako logickej metódy vkladania a hľadania prvkov.

**AVL strom** je prvý vynájdený samovyvažovaci binárny vyhľadávací strom. V AVL strome sa pre každý uzol rozdiel výšky dvoch podstromov detských uzlov líšia **najviac o jednotku**, preto je známy aj ako výškovo vyvážený (To znamená že **Koeficient vyváženia môže byť -1, 0 alebo 1**). Pridávanie a mazanie môže vyžadovať vyváženie stromu jednou alebo viacerými **rotáciami** stromu.

**Koeficient vyváženia** uzla je výška jeho pravého podstromu mínus výška jeho ľavého podstromu.
```js
balance(n) {
	if (n.left == null && n.right == null) {
		return  0;
	}

	return (this.getHeight(n.left) - this.getHeight(n.right));
}
```
**Výška  podstromu** je najvačšia vzdialenosť do *node* neobsahujúceho žiadneho potomka, z aktuálneho koreňa.
```js
getHeight(n) {//n je root node v ktorej sa aktuálne nachádzame
	if (n == null || typeof  n == "undefined") {
		return -1;
	}

	return  Math.max(this.getHeight(n.left), this.getHeight(n.right)) + 1;

}
```

>Celý AVL strom sa v mojej implementácií skladá z 3 Objektov - *AVLNode*, *AVLObj*, *AVLTree*.


- **AVLNode** reprezentuje konkrétny prvok, ktorý bude vkladaný do stromu. Uchováva svoj **koeficient vyváženia**, **výšku**, **kľúč** a jednotlivé **podstromy** (vľavo a vpravo) a **objekt** s payloadom.
```js
class  AVLNode {
	constructor(obj) {
		this.obj = obj; //objekt s payloadom
		this.value = this.obj.str; //kľúč
		this.right = null; //pravý podstrom
		this.left = null; //ľavý podstrom
		this.height = 0; //výška
		this.balance = 0; //koeficient vyváženia

	}
}
```
- **AVLObj** je objekt, ktorý uchováva **kľúč** a **payload**, v ktorom môžeme uchovávať rôzne dáta.
```js
class  AVLObj {
	constructor(str, payload) {
		this.str = str;
		this.payload = [];
		this.payload.push(payload);
	}
}
```
-  **AVLTree** je nadtrieda AVLNode, ktorá uchováva začiatočný node stromu a všetky potrebné funkcie.
```js
class  AVLTree {
	constructor() {
		this.base = null;
	}
	...
}	
```
Teraz, keď máme predstavenú štruktúru, môžeme opísať samotné **vkladanie**, **vyhľadávanie** a **rotácie**.

## Vkladanie
- Ako prvé sa vykoná klasické rekurzívne vloženie potomkov do binárneho vyhľadávacieho stromu.
1. Najskôr sa zavolá funkcia na vloženie prvého *node*
```js
insert(value, payload) {
	let  node = new  AVLNode(new  AVLObj(value, payload));
	//ak na začiatku stromu nie je nič, naša prvá node bude node
	if (this.base === null) {
		this.base = node;
	} else {
		//pomocná funkcia na rekurzívne vkladanie nodeov
		this.base = this.insertN(this.base, node);
	}
}
``` 
2. Keď už máme nejaký node v strome, potrebujeme pridávať ďalšie nadväzujúce *nodes*
```js
insertN(root, node) {
	//Ak sne prišli do prázdnej node, vrátime node, ktorú chceme pridať
	if (root == null) {
		return  node;
	} else  if (node.value < root.value) {
		//ak je key v našej chcenej node menší ako v tej ktorej sme, ideme doľava
		root.left = this.insertN(root.left, node);		
	} else  if (node.value > root.value) {
		//ak je key v našej chcenej node väčší ako v tej ktorej sme, ideme doprava
		root.right = this.insertN(root.right, node);
	}
	//vypočítame výšku v node v ktorej sme
	root.height = this.getHeight(root);
	//vypočítame koeficient vyváženia
	root.balance = this.balance(root);
	//Začíname rotácie
	//Ak je koeficient vyváženia väčší ako 1 a key je menší ako hodnota lavého node koreňa, v ktorom sa nachádzame
	if (root.balance > 1 && node.value < root.left.value) {
		//zrotujeme doprava
		root = this.rotateLH(root);
	}
	//Ak je koeficient vyváženia väčší ako 1 a key je väčší ako hodnota lavého node koreňa, v ktorom sa nachádzame
	if (root.balance > 1 && node.value > root.left.value) {
		//musíme zrotovať nasjkôr doľava a potom doprava
		root = this.rotateLR(root);
	}
	//Ak je koeficient vyváženia menší ako -1 a key je väčší ako hodnota pravého node koreňa, v ktorom sa nachádzame
	if (root.balance < -1 && node.value > root.right.value) {
		//zrotujeme doprava
		root = this.rotateRH(root);
	}
	//Ak je koeficient vyváženia menší ako -1 a key je menší ako hodnota pravého node koreňa, v ktorom sa nachádzame
	if (root.balance < -1 && node.value < root.right.value) {
		//musíme zrotovať najskôr doprava a potom doľava
		root = this.rotateRL(root);
	}
//nakoniec vrátime node v ktorom sa nachádzame aby sa rekurzia mohla správne napojiť na celý strom
return  root;
}
```
3. Teraz prichádzajú na rad samotné rotácie
### Rotácia vľavo (RH)
Túto rotáciu musíme spraviť keď máme strom **naklonený doprava** -> viď. obrázok

![Čísla znázorňujú balance factor](https://www.tutorialspoint.com/data_structures_algorithms/images/avl_left_rotation.jpg)
- Takúto rotáciu vieme implementovať nasledovne
```js
rotateRH(A) {
	let  B = A.right;
	A.right = B.left;
	B.left = A;

	A.height = this.getHeight(node);
	A.balance = this.balance(node);
	B.height = this.getHeight(B);
	B.balance = this.balance(B);
	return  B;
}
```
### Rotácia vpravo (LH)
Túto rotáciu musíme spraviť keď máme strom **naklonený doľava** -> viď. obrázok

![Čísla znázorňujú balance factor](https://www.tutorialspoint.com/data_structures_algorithms/images/avl_right_rotation.jpg)
- Takúto rotáciu vieme implementovať nasledovne
```js
rotateRH(C) {
	let  B = C.left;
	C.left = B.right;
	B.right = C;

	C.height = this.getHeight(C);
	C.balance = this.balance(C);
	B.height = this.getHeight(B);
	B.balance = this.balance(B);
	return  B;
}
```
### Rotácia vpravo a následne vľavo (LR)
Túto rotáciu musíme spraviť keď máme strom **naklonený takto** -> viď. obrázok

![LR rotacia](https://www.tutorialspoint.com/data_structures_algorithms/images/right_subtree_of_left_subtree.jpg)

- Tu už musíme spraviť viacero rotácií vo viacerých krokoch

|  Stav              |Moja implementácia  |
|----------------|-------------------------------|
|![enter image description here](https://www.tutorialspoint.com/data_structures_algorithms/images/right_subtree_of_left_subtree.jpg)| Naša node má ľavého potomka, ktorý má pravého potomka a celý strom je unbalanced
|![enter image description here](https://www.tutorialspoint.com/data_structures_algorithms/images/subtree_left_rotation.jpg) | **Krok 1**: Najskôr musíme vykonať ľavú rotáciu na ľavom podstrome *node* C  |
|![enter image description here](https://www.tutorialspoint.com/data_structures_algorithms/images/left_unbalanced_tree.jpg) |*node* C je stále unbalanced ale už ju vieme vybalancovať pravou rotáciou |
|![enter image description here](https://www.tutorialspoint.com/data_structures_algorithms/images/right_rotation.jpg) |**Krok 2**: Strom vybalancujeme klasickou rotáciou vpravo čo nám poskytne plne vybalancovaný strom|

**Implementácia** 👇
```js
if (root.balance > 1 && node.value > root.left.value) {
		//musíme zrotovať nasjkôr doľava a potom doprava
		root = this.rotateLR(root);
	}
rotateLR(node) {
	//perform left rotation on the left subtree -> Krok 1
	node.left = this.rotateRH(node.left);
	//perform right rotation on the root subtree -> Krok 2
	return  this.rotateLH(node);
}
```
### Rotácia vpravo a následne vľavo (RL)
Túto rotáciu musíme spraviť keď máme strom **naklonený takto** -> viď. obrázok

![RL rotacia](https://www.tutorialspoint.com/data_structures_algorithms/images/left_subtree_of_right_subtree.jpg)

- Tu už musíme spraviť viacero rotácií vo viacerých krokoch

|  Stav              |Moja implementácia  |
|----------------|-------------------------------|
|![enter image description here](https://www.tutorialspoint.com/data_structures_algorithms/images/left_subtree_of_right_subtree.jpg)| Naša node má pravého potomka, ktorý má ľavého potomka a celý strom je unbalanced
|![enter image description here](https://www.tutorialspoint.com/data_structures_algorithms/images/subtree_right_rotation.jpg) | **Krok 1**: Najskôr musíme vykonať pravú rotáciu na pravom podstrome *node* A  |
|![enter image description here](https://www.tutorialspoint.com/data_structures_algorithms/images/right_unbalanced_tree.jpg) |*node* A je stále unbalanced ale už ju vieme vybalancovať ľavou rotáciou |
|![enter image description here](https://www.tutorialspoint.com/data_structures_algorithms/images/left_rotation.jpg) |**Krok 2**: Strom vybalancujeme klasickou rotáciou vľavo čo nám poskytne plne vybalancovaný strom|

**Implementácia** 👇
```js
if (root.balance < -1 && node.value < root.right.value) {
		//musíme zrotovať najskôr doprava a potom doľava
		root = this.rotateRL(root);
	}
//nakoni
rotateLR(node) {
	//perform left rotation on the left subtree
	node.left = this.rotateRH(node.left);
	//perform right rotation on the root subtree
	return  this.rotateLH(node);
}
```
**Teraz máme implementáciu vkladania hotovú a môžeme sa pozrieť na hľadanie**

## Hľadanie v AVL
- Hľadanie v AVL strome je implementované klasickou rekurziou, identickou pri vkladaní (moja nevkladá duplikáty)

**Implementácia**👇
```js
find(key) {

	let  a = this.findHelper(this.base, key);
	if (a == null) {
		console.log("Nenašiel som daný prvok");
		return  null;	
	}
	return  a;
}

findHelper(node, key) {
	if (node == null) {
		return  null;
	}
	if (node.value == key) {
		console.log(`Našiel som hladany key ${key} v node ${node.value}`);
		return  node;
	} 
	else  if (key < node.value) {
		
		node = this.findHelper(node.left, key);
	} 	
	else  if (key > node.value) {

		node = this.findHelper(node.right, key);
	} 	
	
	return  node;
}
```
# Implementácia HashTable
**Hashovacia tabuľka**  je údajová štruktúra ktorá asociuje _kľúče_ s _hodnotami_. Primárna efektívne podporovaná operácia je _vyhľadávanie_: pri zadaní kľúča (napr. meno osoby) nájsť zodpovedajúcu hodnotu (napr. telefónne číslo tejto osoby). Pracuje vďaka transformácii kľúča **hašovacou funkciou** na _hash_, číslo, ktoré tabuľka používa na nájdenie požadovanej hodnoty.

**Hashovacia tabuľka** však nefunguje perfektne, preto sa stretávame s tzv. **kolíziami hashov**. Toto nastane, keď nám 2 rôzne kľúče po prejdení hashovacou funkciou vrátia tú istú hodnotu. Tým pádom by sme nevedeli, kam takýto key:value pár uložiť. Naštastie existujú riešenia týchto kolízií, napríklad Linear probing, **chaining**, Quadratic probing, double hashing a iné.

V mojej implementácií som si vybral metódu **chainingu**, ktorá spočíva v reťazení objektov za sebou na takom istom kľúči. V podstate je to *doubly linked list*. Dole si ukážeme tak **implementáciu chainingu**, ako aj **zväčšovanie tabuľky** a našu **hashovaciu funkciu**.

## Hashovacia funkcia
Naša hashovacia funkcia dostane na vstup *kľúč* v podobe reťazca a aktuálnu veľkosť pola pre indexy, ktoré generuje.

**Veľkosť poľa** predstavuje počet *bucketov*, ktoré má naše pole. Jeden bucket predstavuje pole objektov pre istý index, ktoré do tej hashovacej tabuľky priraďujeme.

**Implementácia**👇
```js
//Funkcia slúži na vypočítanie hashu
//Prejde každým znakom zo stringu
//Ktorý na konci vymoduluje veľkosťou poľa (Toto ošetruje index, ktorý nám hashovacia funkcia vygeneruje tak aby bol v rozmedzí od 0-veľkosť_poľa-1)
const  hash = (key, size) => {
	let  hash = 0;
	[...key].forEach(c  =>  hash += c.charCodeAt())
	return  hash % size;
}
```
## HashTable
Je konkrétna trieda, ktorá obsahuje všetky potrebné atribúty a metódy
```js
class  HashTable {

	constructor() {
		//pole polí pre rôzne indexy vygenerované hashovacou funkciou
		this.buckets = [];
		//počiatočná veľkosť
		this.size = 4;
		//utility atribút, cez ktorý počítame zaplnenie
		this.count = 0;
		//vyplnenie poľa prázdnym poľom, do ktorého budeme vkladať konkrétne objekty
		for (let  i = 0; i < this.size; i++) {
			this.buckets.push([]);
		}
		//utility pole na zväčšovanie tabuľky
		this.buckets2 = [];
		  
	}
	...
}
```
## Insert
Metóda umožňujúca vkladanie prvkov do hashovacej tabuľky. Taktiež kontroluje zaplnenie, ktoré keď prekročí hranicu 60%, tak sa veľkosť tabuľky dvojnásobne zväčší a celá sa prehashuje	(V JS sa to dá spraviť aj bez tohoto kroku, avšak rýchlosť tabuľky je značne obmedzená).

**Implementácia**👇
```js
insert(obj) {
	//rehashovanie pri 60%+ zaplnení
	if (this.count >= 0.6 * this.size) {
		this.rehash();
	}
	this.count += 1;
	//hashovanie a uloženie
	this.buckets[hash(obj.meno, this.size)]
	.push(obj);
}
```

## Rehash
Metóda, ktorá prehashuje pôvodnú tabuľku. Treba to vykonať kvôli zväčšeniu veľkosti *buckets*, inak by nám hashovacie indexy nesedeli.

**Implementácia**👇
```js
rehash() {
	//utility veľkosť
	const  size2 = this.size * 2;
	for (let  i = 0; i < size2; i++) {

		this.buckets2.push([]);

	}
	//prehashovanie jediná časť so zložitosťou O(n^2)
	for (let  bucket  of  this.buckets) {
		if (bucket.length != 0) {
			bucket.forEach(item  => {
				this.buckets2[hash(item.meno, size2)].push(item);
			})

		}

	 }
//zväčšenie
this.size *= 2;
//kopírovanie arrayov
this.buckets = [...this.buckets2];
this.buckets2 = [];
}
```
## Vyhľadávanie
Vyhľadanie konkrétneho *kľuča* v tabuľke.
```js
search(string) {
	//vypočítanie hashu pre O(1) prístup
	let  idx = hash(string, this.size);
	if (idx != undefined) {
		//nájde a vráti len taký objekt, ktorého kľúč sa zhoduje s argumentom funkcie 
		return  this.buckets[idx].find((obj) => {
			return  obj.meno == string;
		});
	}
}
```

# Implementácia Red Black Tree
> **Táto implementácia je prevzatá z npm package** [functional-red-black-tree](https://www.npmjs.com/package/functional-red-black-tree)

A  [fully persistent](http://en.wikipedia.org/wiki/Persistent_data_structure)  [red-black tree](http://en.wikipedia.org/wiki/Red%E2%80%93black_tree)  written 100% in JavaScript. Works both in node.js and in the browser via  [browserify](http://browserify.org/).

Functional (or fully presistent) data structures allow for non-destructive updates. So if you insert an element into the tree, it returns a new tree with the inserted element rather than destructively updating the existing tree in place. Doing this requires using extra memory, and if one were naive it could cost as much as reallocating the entire tree. Instead, this data structure saves some memory by recycling references to previously allocated subtrees. This requires using only O(log(n)) additional memory per update instead of a full O(n) copy.

Some advantages of this is that it is possible to apply insertions and removals to the tree while still iterating over previous versions of the tree. Functional and persistent data structures can also be useful in many geometric algorithms like point location within triangulations or ray queries, and can be used to analyze the history of executing various algorithms. This added power though comes at a cost, since it is generally a bit slower to use a functional data structure than an imperative version. However, if your application needs this behavior then you may consider using this module.

# [](https://www.npmjs.com/package/functional-red-black-tree#install)Install

```
npm install functional-red-black-tree

```

# [](https://www.npmjs.com/package/functional-red-black-tree#example)Example

Here is an example of some basic usage:

//Load the library

var createTree =  require("functional-red-black-tree")

//Create a tree

var t1 =  createTree()

//Insert some items into the tree

var t2 =  t1.insert(1,  "foo")

var t3 =  t2.insert(2,  "bar")

//Remove something

var t4 =  t3.remove(1)

# [](https://www.npmjs.com/package/functional-red-black-tree#api)API

var createTree =  require("functional-red-black-tree")

## [](https://www.npmjs.com/package/functional-red-black-tree#overview)Overview

-   [Tree methods](https://www.npmjs.com/package/functional-red-black-tree#tree-methods)
    -   [`var tree = createTree([compare])`](https://www.npmjs.com/package/functional-red-black-tree#var-tree-=-createtreecompare)
    -   [`tree.keys`](https://www.npmjs.com/package/functional-red-black-tree#treekeys)
    -   [`tree.values`](https://www.npmjs.com/package/functional-red-black-tree#treevalues)
    -   [`tree.length`](https://www.npmjs.com/package/functional-red-black-tree#treelength)
    -   [`tree.get(key)`](https://www.npmjs.com/package/functional-red-black-tree#treegetkey)
    -   [`tree.insert(key, value)`](https://www.npmjs.com/package/functional-red-black-tree#treeinsertkey-value)
    -   [`tree.remove(key)`](https://www.npmjs.com/package/functional-red-black-tree#treeremovekey)
    -   [`tree.find(key)`](https://www.npmjs.com/package/functional-red-black-tree#treefindkey)
    -   [`tree.ge(key)`](https://www.npmjs.com/package/functional-red-black-tree#treegekey)
    -   [`tree.gt(key)`](https://www.npmjs.com/package/functional-red-black-tree#treegtkey)
    -   [`tree.lt(key)`](https://www.npmjs.com/package/functional-red-black-tree#treeltkey)
    -   [`tree.le(key)`](https://www.npmjs.com/package/functional-red-black-tree#treelekey)
    -   [`tree.at(position)`](https://www.npmjs.com/package/functional-red-black-tree#treeatposition)
    -   [`tree.begin`](https://www.npmjs.com/package/functional-red-black-tree#treebegin)
    -   [`tree.end`](https://www.npmjs.com/package/functional-red-black-tree#treeend)
    -   [`tree.forEach(visitor(key,value)[, lo[, hi]])`](https://www.npmjs.com/package/functional-red-black-tree#treeforEachvisitorkeyvalue-lo-hi)
    -   [`tree.root`](https://www.npmjs.com/package/functional-red-black-tree#treeroot)
-   [Node properties](https://www.npmjs.com/package/functional-red-black-tree#node-properties)
    -   [`node.key`](https://www.npmjs.com/package/functional-red-black-tree#nodekey)
    -   [`node.value`](https://www.npmjs.com/package/functional-red-black-tree#nodevalue)
    -   [`node.left`](https://www.npmjs.com/package/functional-red-black-tree#nodeleft)
    -   [`node.right`](https://www.npmjs.com/package/functional-red-black-tree#noderight)
-   [Iterator methods](https://www.npmjs.com/package/functional-red-black-tree#iterator-methods)
    -   [`iter.key`](https://www.npmjs.com/package/functional-red-black-tree#iterkey)
    -   [`iter.value`](https://www.npmjs.com/package/functional-red-black-tree#itervalue)
    -   [`iter.node`](https://www.npmjs.com/package/functional-red-black-tree#iternode)
    -   [`iter.tree`](https://www.npmjs.com/package/functional-red-black-tree#itertree)
    -   [`iter.index`](https://www.npmjs.com/package/functional-red-black-tree#iterindex)
    -   [`iter.valid`](https://www.npmjs.com/package/functional-red-black-tree#itervalid)
    -   [`iter.clone()`](https://www.npmjs.com/package/functional-red-black-tree#iterclone)
    -   [`iter.remove()`](https://www.npmjs.com/package/functional-red-black-tree#iterremove)
    -   [`iter.update(value)`](https://www.npmjs.com/package/functional-red-black-tree#iterupdatevalue)
    -   [`iter.next()`](https://www.npmjs.com/package/functional-red-black-tree#iternext)
    -   [`iter.prev()`](https://www.npmjs.com/package/functional-red-black-tree#iterprev)
    -   [`iter.hasNext`](https://www.npmjs.com/package/functional-red-black-tree#iterhasnext)
    -   [`iter.hasPrev`](https://www.npmjs.com/package/functional-red-black-tree#iterhasprev)

## [](https://www.npmjs.com/package/functional-red-black-tree#tree-methods)Tree methods

### [](https://www.npmjs.com/package/functional-red-black-tree#var-tree--createtreecompare)`var tree = createTree([compare])`

Creates an empty functional tree

-   `compare`  is an optional comparison function, same semantics as array.sort()

**Returns**  An empty tree ordered by  `compare`

### [](https://www.npmjs.com/package/functional-red-black-tree#treekeys)`tree.keys`

A sorted array of all the keys in the tree

### [](https://www.npmjs.com/package/functional-red-black-tree#treevalues)`tree.values`

An array array of all the values in the tree

### [](https://www.npmjs.com/package/functional-red-black-tree#treelength)`tree.length`

The number of items in the tree

### [](https://www.npmjs.com/package/functional-red-black-tree#treegetkey)`tree.get(key)`

Retrieves the value associated to the given key

-   `key`  is the key of the item to look up

**Returns**  The value of the first node associated to  `key`

### [](https://www.npmjs.com/package/functional-red-black-tree#treeinsertkey-value)`tree.insert(key, value)`

Creates a new tree with the new pair inserted.

-   `key`  is the key of the item to insert
-   `value`  is the value of the item to insert

**Returns**  A new tree with  `key`  and  `value`  inserted

### [](https://www.npmjs.com/package/functional-red-black-tree#treeremovekey)`tree.remove(key)`

Removes the first item with  `key`  in the tree

-   `key`  is the key of the item to remove

**Returns**  A new tree with the given item removed if it exists

### [](https://www.npmjs.com/package/functional-red-black-tree#treefindkey)`tree.find(key)`

Returns an iterator pointing to the first item in the tree with  `key`, otherwise  `null`.

### [](https://www.npmjs.com/package/functional-red-black-tree#treegekey)`tree.ge(key)`

Find the first item in the tree whose key is  `>= key`

-   `key`  is the key to search for

**Returns**  An iterator at the given element.

### [](https://www.npmjs.com/package/functional-red-black-tree#treegtkey)`tree.gt(key)`

Finds the first item in the tree whose key is  `> key`

-   `key`  is the key to search for

**Returns**  An iterator at the given element

### [](https://www.npmjs.com/package/functional-red-black-tree#treeltkey)`tree.lt(key)`

Finds the last item in the tree whose key is  `< key`

-   `key`  is the key to search for

**Returns**  An iterator at the given element

### [](https://www.npmjs.com/package/functional-red-black-tree#treelekey)`tree.le(key)`

Finds the last item in the tree whose key is  `<= key`

-   `key`  is the key to search for

**Returns**  An iterator at the given element

### [](https://www.npmjs.com/package/functional-red-black-tree#treeatposition)`tree.at(position)`

Finds an iterator starting at the given element

-   `position`  is the index at which the iterator gets created

**Returns**  An iterator starting at position

### [](https://www.npmjs.com/package/functional-red-black-tree#treebegin)`tree.begin`

An iterator pointing to the first element in the tree

### [](https://www.npmjs.com/package/functional-red-black-tree#treeend)`tree.end`

An iterator pointing to the last element in the tree

### [](https://www.npmjs.com/package/functional-red-black-tree#treeforeachvisitorkeyvalue-lo-hi)`tree.forEach(visitor(key,value)[, lo[, hi]])`

Walks a visitor function over the nodes of the tree in order.

-   `visitor(key,value)`  is a callback that gets executed on each node. If a truthy value is returned from the visitor, then iteration is stopped.
-   `lo`  is an optional start of the range to visit (inclusive)
-   `hi`  is an optional end of the range to visit (non-inclusive)

**Returns**  The last value returned by the callback

### [](https://www.npmjs.com/package/functional-red-black-tree#treeroot)`tree.root`

Returns the root node of the tree

## [](https://www.npmjs.com/package/functional-red-black-tree#node-properties)Node properties

Each node of the tree has the following properties:

### [](https://www.npmjs.com/package/functional-red-black-tree#nodekey)`node.key`

The key associated to the node

### [](https://www.npmjs.com/package/functional-red-black-tree#nodevalue)`node.value`

The value associated to the node

### [](https://www.npmjs.com/package/functional-red-black-tree#nodeleft)`node.left`

The left subtree of the node

### [](https://www.npmjs.com/package/functional-red-black-tree#noderight)`node.right`

The right subtree of the node

## [](https://www.npmjs.com/package/functional-red-black-tree#iterator-methods)Iterator methods

### [](https://www.npmjs.com/package/functional-red-black-tree#iterkey)`iter.key`

The key of the item referenced by the iterator

### [](https://www.npmjs.com/package/functional-red-black-tree#itervalue)`iter.value`

The value of the item referenced by the iterator

### [](https://www.npmjs.com/package/functional-red-black-tree#iternode)`iter.node`

The value of the node at the iterator's current position.  `null`  is iterator is node valid.

### [](https://www.npmjs.com/package/functional-red-black-tree#itertree)`iter.tree`

The tree associated to the iterator

### [](https://www.npmjs.com/package/functional-red-black-tree#iterindex)`iter.index`

Returns the position of this iterator in the sequence.

### [](https://www.npmjs.com/package/functional-red-black-tree#itervalid)`iter.valid`

Checks if the iterator is valid

### [](https://www.npmjs.com/package/functional-red-black-tree#iterclone)`iter.clone()`

Makes a copy of the iterator

### [](https://www.npmjs.com/package/functional-red-black-tree#iterremove)`iter.remove()`

Removes the item at the position of the iterator

**Returns**  A new binary search tree with  `iter`'s item removed

### [](https://www.npmjs.com/package/functional-red-black-tree#iterupdatevalue)`iter.update(value)`

Updates the value of the node in the tree at this iterator

**Returns**  A new binary search tree with the corresponding node updated

### [](https://www.npmjs.com/package/functional-red-black-tree#iternext)`iter.next()`

Advances the iterator to the next position

### [](https://www.npmjs.com/package/functional-red-black-tree#iterprev)`iter.prev()`

Moves the iterator backward one element

### [](https://www.npmjs.com/package/functional-red-black-tree#iterhasnext)`iter.hasNext`

If true, then the iterator is not at the end of the sequence

### [](https://www.npmjs.com/package/functional-red-black-tree#iterhasprev)`iter.hasPrev`

If true, then the iterator is not at the beginning of the sequence


# Implementácia Map
Ako **prevzatú implementáciu** Hashovacej tabuľky som si zvolil natívnu JS **Map**().
V dokumentácií nenájdete samotnú implementáciu hashovania v tejto triede, pretože to záleží od *engine-u*, ktorý ju spracováva. Avšak, vysvetlenie ako by ju mohol spracovávať **V8 engine** od Google, kotrý sa používa aj v **Node.js** som našiel [tu](https://itnext.io/v8-deep-dives-understanding-map-internals-45eb94a183df).

Konkrétnu **ECMAScript** špecifikáciu pre JS map nájdete [tu](https://tc39.es/ecma262/#sec-map-objects).

**MDN** verziu nájdete [tu](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

# Testovanie
**Testovací program** `app.js` pomocou **Node.js** porovnáva časové výkony podané rôznymi implementáciami *AVL | RBT* a *HashTable*.

Do testvacieho programu sa nahrávajú 2 `.json` súbory, ktoré obsahujú objekty na spracovanie.

Súbor `ExportJson-4.json` obsahuje **100 000** záznamov s objektami.
Súbor `ExportJson-5.json` obsahuje **20 000** záznamov s objektami.

# Záver
>Výhody HashTable
✔️ O(1) zložitosť vloženia/vyhľadávania/vymazania.
✔️ Potrebuje menej čítaní v pamäti (cachce friendly).
✔️ Používame keď **vieme input size in advance**.


>Výhody BST
✔️ Nepotrebujeme vedieť input size in advance
✔️ Je usporiadaný
✔️ Neobsahuje kolízie

# Referencie

 - [1 ] [Functional Red Black Tree](https://www.npmjs.com/package/functional-red-black-tree) - (c) 2013 Mikola Lysenko. MIT License
 - [2 ] [JavaScript Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) - Mozilla Developer Network

### [Back to 🔝](#predhovor)
