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
	//ajout de l'event de recherche sur le filtre
	document.getElementById("filter").addEventListener("keyup", search);
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
	block.appendChild(createFigureBlock(product.image, product.name));

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
	// changement de l'opacité du bouton d'achat selon la valeur de l'input
	input.addEventListener("change", function() {
		changeOpacity(input, button);
	});

	// AJOUT D'EVENEMENT SUR INPUT
	// gestion de la quantité maximum et minimum autorisé pour un produit
	// via une mise à jour automatique de la valeur
	// à chaque changement manuel (keyup) de cette même valeur
	input.addEventListener("keyup", function() {
		restrictInput(input);
		changeOpacity(input, button);
	});

	// EVENEMENT SUR L'AJOUT D'UN ELEMENT AU PANIER
	button.addEventListener("click", function() {
		// l'on vérifie que sa valeur est bien supérieur à 0
		// sinon cela n'aurait pas de sens de l'ajouté au panier
		if(input.value > 0) {
			// vérification de l'existence de l'élément dans le panier
			var exist = document.getElementById(index +"-achat");
			if(exist == null) {
				// s'il n'existe pas, le créer
				createProductCard(index);
			}
			else {
				// sinon, ajoute la valeur courant de l'input
				// à la valeur présente dans le panier
				addProductCard(index, input);
			}
		}
		// passe la valeur de l'input à 0 et met à jour l'opacité du button
		input.value = 0;
		changeOpacity(input, button);
	});

	// the built control div node is returned
	return control;
}


/*
* create and return the figure block for this product
* see the static version of the project to know what the <figure> should be
* @param product (product object) = the product for which the figure block is created
*/
var createFigureBlock = function (image, name) {
	// create two element, figure and img
	var figure = document.createElement("figure");
	var img = document.createElement('img');
	figure.appendChild(img);
	img.src = image;
	img.alt = name;

	return figure;
}

/*
* creer et retourne une div comportant un button poubelle
* qui permettra la suppression future de l'élément du panier si nécéssaire
* @param divClass = classe de la div contenant le bouton
* @param buttonClass = classe du bouton, qui est un élément enfant de la div
* @param index = identifiant de l'élément principale de la div,
* 							 permet de savoir quel élément devra être supprimé
*/
var createTrashBlock = function (divClass, buttonClass, index) {

	// création de la div
	var div = document.createElement("div");
	div.className = divClass;

	// création du button
	var button = document.createElement("button");
	button.className = buttonClass;
	button.id = index + "-remove";

	// ajoute le button à la div
	div.appendChild(button);

	// ajout de l'évenement de suppression sur le bouton
	button.addEventListener("click", function() {
		// récupère l'element du panier correspondant à l'index
		var element = document.getElementById(index + "-achat");
		// le supprime et met à jour la valeur du panier
		element.parentNode.removeChild(element);
		updateTotal();
	})
	return div;
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

function restrictInput(input) {
	// si la valeur est nul ou inférieur au minimum (nombre négatif) :
	// elle est mis à la valeur minimale de l'input
	if(input.value.length == 0 | input.value < input.min) {
		input.value = input.min;
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
}
/*
* change l'opacité du bouton en fonction de la valeur de l'input
* si la valeur est nul le bouton devient grisé
* sinon le bouton devient "normal"
* @param input = valeur déterminant le changement de l'opacité du bouton
* @param button = bouton dont l'opacité est mis à jour
*/
function changeOpacity(input, button) {
	if(input.value == 0) {
		button.style.opacity = "0.25";
	}
	else {
		button.style.opacity = "1";
	}
}

/*
* créer une nouvelle div dans le panier
* correspondant à l'objet indiqué via l'index
* @param index = identifiant de l'élement à ajouter au panier
*/
var createProductCard = function(index) {

	// récupère la liste des élements dans le panier (achats)
	var achats = document.querySelector(".achats");
	// récupère le produit devant être ajouter au panier via son index
	var product = document.getElementById(index + "-product");

	// créer la nouvelle div principale de l'élement à ajouter au panier
	var achat = document.createElement("div");
	achat.className = 'achat';
	achat.id = index + "-achat";

	// ajoute la div principale à la liste des achats
	achats.appendChild(achat);

	// création de l'image
	achat.appendChild(createFigureBlock(
		product.querySelector("img").getAttribute("src"),
		product.querySelector("img").alt
	));

	// création du titre
	achat.appendChild(createBlock("h4", product.querySelector(".description").innerHTML));

	// création de la quantité
	var quantite = product.querySelector("input").value;
	if(quantite > MAX_QTY) {
		quantite = MAX_QTY;
	}
	//achat.appendChild(createBlock("div", quantite, "quantite"));
	var divInput = document.createElement("div");
	divInput.className = "quantite";

	var newInput = document.createElement("input");
	newInput.type = "number";
	newInput.step = "1";
	newInput.value = quantite;
	newInput.min = "1";
	newInput.max = MAX_QTY.toString();

	newInput.addEventListener("keyup", function() {
		restrictInput(newInput);
	});
	newInput.addEventListener("change", function() {
		updateTotal();
	});
	divInput.appendChild(newInput)
	achat.appendChild(divInput);

	// création du prix
	achat.appendChild(createBlock("div", product.querySelector(".prix").innerHTML, "prix"));

	// création de la poubelle
	achat.appendChild(createTrashBlock("controle", "retirer", index));

	// update du prix total
	updateTotal();
}

/*
* ajoute la quantité de l'input d'un produit donné au panier
* dans ce cas, le produit existe déjà dans le panier
* correspondant à l'objet indiqué via l'index
* @param index = identifiant de l'élement qui est ajouté
 								 et sera mis à jour dans le panier
* @param input = quantité de l'élement qui devra être ajouté au panier
*/
var addProductCard = function(index, input) {
	var achat = document.getElementById(index + "-achat");
	var addQte = Number(input.value);
	var initQte = achat.querySelector("input").value;
	console.log(initQte);

	var sum = addQte + Number(initQte);
	if (sum > MAX_QTY) {
		sum = MAX_QTY;
	}
	achat.querySelector("input").value = sum;
	updateTotal();
}

/*
* fait une mise à jour du prix total du panier
*/
var updateTotal = function() {
	var total = 0;
	// recupère la liste des élements du panier
	var listProduct = document.querySelectorAll(".achat");
	// pour chaque élément, ajoute son prix * quantité au total
	for(var product of listProduct) {
		var prix = product.querySelector(".prix").innerHTML;
		var quantite = product.querySelector("input").value;
		total += prix * quantite;
	}
	// la valeur de #montant devient alors le total
	document.querySelector('#montant').innerHTML = total;
}
