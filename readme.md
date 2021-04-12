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
|**Stromy**|`Insert - ~15-30s | Search - ~13ms`            |`Insert - ~432ms | Search -  ~1ms`            |
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
