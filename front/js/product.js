const pageTitle = document.querySelector("Title");
const url = window.location.search;
const urlQuery = new URLSearchParams(url);
const urlID = urlQuery.get("id");
const urlAPI = "http://localhost:3000/api/products/";

const nameSelector = document.getElementById("title");
const imgParentSelector = document.querySelector(".item__img");
const priceSelector = document.getElementById("price");
const descriptionSelector = document.getElementById("description");
const colorSelector = document.getElementById("colors");
const quantitySelector = document.getElementById("quantity");
const addToCartButton = document.getElementById("addToCart");

class product {
    constructor(id, color, quantity) {
        this.id = id;
        this.color = color;
        this.quantity = quantity;
    }
};


// --------------------------------------- API --------------------------------------- //

// Requête API pour un produit spécifique
fetch(urlAPI + urlID) 
    .then(res => {
        // Condition en cas d'erreur 404
        if(res.ok) {
            res.json().then(productData => {
                productHTML(productData);
            });
        } else {
            productNotFound();
            pageTitle.innerHTML = "Produit non trouvé"; 
        }
    })
    .catch(err => {
        console.log("Erreur API", err);
        productNotFound(); 
});


// --------------------------------------- FONCTIONS --------------------------------------- //

// Insert les données du canapé en question dans le HTML
function productHTML(productData) {
    const name = productData.name;
    const imageUrl = productData.imageUrl;
    const altTxt = productData.altTxt;
    const price = productData.price;
    const description = productData.description;
    const colors = productData.colors;
    const image = document.createElement("img");

    pageTitle.innerHTML = productData.name;

    nameSelector.insertAdjacentText("afterbegin", name)
    priceSelector.insertAdjacentText("afterbegin", price);
    descriptionSelector.insertAdjacentText("afterbegin", description);

    image.setAttribute("src", imageUrl);
    image.setAttribute("alt", altTxt);
    imgParentSelector.insertAdjacentElement("beforeend", image);

    for(let color of colors) {
        const colorElement = document.createElement("option");
        const colorText = document.createTextNode(`${color}`);

        colorElement.setAttribute("value", color);
        colorElement.appendChild(colorText);

        colorSelector.insertAdjacentElement("beforeend", colorElement);
    }
};

// Message d'erreur si l'id ne correspond à aucun canapé
function productNotFound() {
    const sectionSelector = document.querySelector(".item");
    const errorArticleElement = document.createElement("article");
    const errorTitleElement = document.createElement("h1");
    const errorTitleText = document.createTextNode("Oooops !");
    const errorParagrElement = document.createElement("p");
    const errorParagrText = document.createTextNode("Il semblerait que le produit demandé ne soit plus disponible ou ait été modifié pour votre plus grand confort. L'heureux élu vous attend parmi ");
    const errorLinkElement = document.createElement("a");
    const errorLinkText = document.createTextNode("Nos produits.");

    errorTitleElement.appendChild(errorTitleText);
    errorParagrElement.appendChild(errorParagrText);
    errorLinkElement.setAttribute("href", "./index.html");
    errorLinkElement.appendChild(errorLinkText);
    sectionSelector.replaceChildren(errorArticleElement);
    errorArticleElement.insertAdjacentElement("beforeend", errorTitleElement);
    errorArticleElement.insertAdjacentElement("beforeend", errorParagrElement);
    errorParagrElement.insertAdjacentElement("beforeend", errorLinkElement);
};

// Affiche un message d'erreur si un ou deux champs ne sont pas remplis
function notSelectedError() {
    if (colorSelector.value == "" && quantitySelector.value == 0) {
        alert("Veuillez choisir une couleur et une quantité");
    } else if (colorSelector.value == "") {
        alert("Veuillez choisir une couleur");
    } else {
        alert("Veuillez choisir une quantité");
    }
};

// Ajoute au panier et enregistre dans le local storage
function addToCart(idToAdd, colorToAdd, quantityToAdd) {
    // Efface le local storage en cas d'erreur de lecture du json
    try {
        JSON.parse(localStorage.getItem("cartData"));
    } catch {
        localStorage.clear();
    }

    let cartData = JSON.parse(localStorage.getItem("cartData"));
    
    // Vérifie si le tableau cartData existe déjà, sinon le créé et ajoute le produit
    if (Array.isArray(cartData)) {
        let alreadyInCart = false;

        // Cherche si le produit est déjà dans le panier et agit en conséquence (augmente la quantité ou l'ajoute en entier)
        for(let productClass of cartData) {
            if(productClass.id == idToAdd && productClass.color == colorToAdd) {
                productClass.quantity = productClass.quantity + quantityToAdd;
                if(productClass.quantity > 100) {
                    productClass.quantity = 100;
                }
                alreadyInCart = true;
            }
        };
    
        if (alreadyInCart == true) {
            localStorage.setItem("cartData", JSON.stringify(cartData));
            alert("Produit ajouté au panier avec succès");
        } else {
            cartData.push(new product(idToAdd, colorToAdd, quantityToAdd));
            localStorage.setItem("cartData", JSON.stringify(cartData));
            alert("Produit ajouté au panier avec succès");
        };

    } else { 
        cartData = [];
        cartData.push(new product(idToAdd, colorToAdd, quantityToAdd));
        localStorage.setItem("cartData", JSON.stringify(cartData));
        alert("Produit ajouté au panier avec succès"); 
    }
};


// --------------------------------------- EVENT LISTENER --------------------------------------- //

// Empêche de saisir une quantité non valide
quantitySelector.addEventListener("change", () => {
    if (quantitySelector.value > 100) {
        quantitySelector.value = 100;
    } else if (quantitySelector.value < 1) {
        quantitySelector.value = 1;
    } else {
        quantitySelector.value = Math.round(quantitySelector.value);
    }
});

// Ajoute au panier et enregistre dans le local storage
addToCartButton.addEventListener("click", () => {
    if ((colorSelector.value == "" && quantitySelector.value == 0) || colorSelector.value == "" || quantitySelector.value == 0) {
    notSelectedError();
    } else {
    addToCart(urlID, colorSelector.value, Number(quantitySelector.value));
    }
});


