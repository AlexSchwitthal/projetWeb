// AMROUCHE KARIM MOUMEN
// SCHWITTHAL ALEXANDRE

// === constants ===
const MAX_QTY = 9;
const productIdKey = "product";
const orderIdKey = "order";
const inputIdKey = "qte";

// === global variables  ===
// the total cost of selected products
var total = 0;



// function called when page is loaded, it performs initializations
var init = function () {
	createShop();
	document.getElementById("filter").addEventListener("keyup", search);

	// TODO : add other initializations to achieve if you think it is required
}
window.addEventListener("load", init);




// usefull functions

/*
* create and add all the div.produit elements to the div#boutique element
* according to the product objects that exist in 'catalog' variable
*/
var createShop = function () {
	var shop = document.getElementById("boutique");
	for(var i = 0; i < catalog.length; i++) {
		shop.appendChild(createProduct(catalog[i], i));
	}
}

/*
* create the div.produit elment corresponding to the given product
* The created element receives the id "index-product" where index is replaced by param's value
* @param product (product object) = the product for which the element is created
* @param index (int) = the index of the product in catalog, used to set the id of the created element
*/
var createProduct = function (product, index) {
	// build the div element for product
	var block = document.createElement("div");
	block.className = "produit";
	// set the id for this product
	block.id = index + "-" + productIdKey;
	// build the h4 part of 'block'
	block.appendChild(createBlock("h4", product.name));

	// add the figure of the product
	block.appendChild(createFigureBlock(product));

	// build and add the div.description part of 'block'
	block.appendChild(createBlock("div", product.description, "description"));
	// build and add the div.price part of 'block'
	block.appendChild(createBlock("div", product.price, "prix"));
	// build and add control div block to product element
	block.appendChild(createOrderControlBlock(index));
	return block;
}


/* return a new element of tag 'tag' with content 'content' and class 'cssClass'
 * @param tag (string) = the type of the created element (example : "p")
 * @param content (string) = the html wontent of the created element (example : "bla bla")
 * @param cssClass (string) (optional) = the value of the 'class' attribute for the created element
 */
var createBlock = function (tag, content, cssClass) {
	var element = document.createElement(tag);
	if (cssClass != undefined) {
		element.className =  cssClass;
	}
	element.innerHTML = content;
	return element;
}

/*
* builds the control element (div.controle) for a product
* @param index = the index of the considered product
*
* TODO : add the event handling,
*   /!\  in this version button and input do nothing  /!\
*/
var createOrderControlBlock = function (index) {
	var control = document.createElement("div");
	control.className = "controle";

	// create input quantity element
	var input = document.createElement("input");
	input.id = index + '-' + inputIdKey;
	input.type = "number";
	input.step = "1";
	input.value = "0";
	input.min = "0";
	input.max = MAX_QTY.toString();

	// add input to control as its child
	control.appendChild(input);

	// create order button
	var button = document.createElement("button");
	button.className = 'commander';
	button.id = index + "-" + orderIdKey;

	// add control to control as its child
	control.appendChild(button);

	// AJOUT D'EVENEMENT SUR INPUT
	// gestion de la quantité maximum et minimum autorisé pour un produit
	// via une mise à jour automatique de la valeur
	// à chaque changement manuel (keyup) de cette même valeur
	input.addEventListener("keyup", function() {
		// si la valeur est nul ou inférieur au minimum (nombre négatif) :
		// elle est mis à 0
		if(input.value.length == 0 | input.value < input.min) {
			input.value = 0;
		}
		// si la valeur est supérieur au maximum :
		// elle devient égal à ce même maximum
		else if(input.value > MAX_QTY) {
			input.value = MAX_QTY;
		}
		// si il y a 2 nombres ou plus :
		//garde uniquement le dernier
		/* NOTE : cette condition n'est ici que pour gérer la situation où la valeur
			 de l'input comporte une chaine comme "09" afin d'effacer le 0
			 le but est d'apporter ainsi de la lisibilité à l'utilisateur
		*/
		else if(input.value.length >= 2) {
			input.value = input.value.substring(input.value.length - 1);
		}

		if(input.value == 0) {
			button.style.opacity = "0.25";
		}
		else {
			button.style.opacity = "0.8";
		}
	});

	button.addEventListener("click", addProductToCard);

	// the built control div node is returned
	return control;
}


/*
* create and return the figure block for this product
* see the static version of the project to know what the <figure> should be
* @param product (product object) = the product for which the figure block is created
*/
var createFigureBlock = function (product) {
	// create two element, figure and img
	var figure = document.createElement("figure");
	var img = document.createElement('img');
		figure.appendChild(img);
	img.src = product.image;
	img.alt = product.name;

	return figure;
}


/*
* met à jour tout les éléments de la boutique,
* en les affichants/masquant selon le filtre (filter) courant
*/
var search = function() {
	/*
	NOTE : le filtre et le produit sont tout les deux passé en minuscule
	pour éviter tout problème de case lors du tri
	*/

	// récupération de la valeur courante de filter et de tout les éléments de la boutique
	var filter = document.getElementById('filter').value.toLowerCase();
	var products = document.querySelectorAll('#boutique > .produit');

	// boucle sur tout les produits de la boutique
	for(var product of products) {

		// récupération du nom du produits (via son titre "h4")
		var nameOfProduct = product.querySelector('h4').innerHTML.toLowerCase();

		//si le nom du produit contient le filtre :
		// l'on affiche le produit via un style de type inline-block
		// sinon on masque l'objet
		if(nameOfProduct.includes(filter)) {
			product.style.display = "inline-block";
		}
		else {
			product.style.display = "none";
		}
	}
}

var checkInput = function() {

}

var addProductToCard = function() {
	console.log("lol");
}
