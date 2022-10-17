const pageTitle = document.querySelector("Title");
const urlQuery = window.location.search;
const urlParamSplit = new URLSearchParams(urlQuery);
const urlID = urlParamSplit.get("id");

const urlAPI = "http://localhost:3000/api/products";

let idFound = false;

fetch(urlAPI) 
    .then(res => res.json())
    .then(arrayAPI => {
        wichProduct(arrayAPI, urlID);
        return arrayAPI
    })
    .catch(err => console.log("Erreur API", err))

// Cherche les données du canapé correspondant à l'id de l'url
function wichProduct(arrayData, pageID) {
    for(let canapData of arrayData) {
        if(canapData._id == pageID) {
            productHTML(canapData);
            idFound = true;
        }
    }
    if(idFound == false) {
        productNotFound()
        pageTitle.innerHTML = "Produit non trouvé";
    }
};

// Insert les données du canapé en question dans le HTML
const nameSelector = document.getElementById("title");
const imgParentSelector = document.querySelector(".item__img");
const priceSelector = document.getElementById("price");
const descriptionSelector = document.getElementById("description");
const colorSelector = document.getElementById("colors");

function productHTML(productData) {
    const name = productData.name;
    const imageUrl = productData.imageUrl;
    const altTxt = productData.altTxt;
    const price = productData.price;
    const description = productData.description;
    const colors = productData.colors;

    pageTitle.innerHTML = productData.name;

    nameSelector.insertAdjacentText("afterbegin", name)
    priceSelector.insertAdjacentText("afterbegin", price);
    descriptionSelector.insertAdjacentText("afterbegin", description);

    const image = document.createElement("img");
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
    errorTitleElement.appendChild(errorTitleText);

    const errorParagrElement = document.createElement("p");
    const errorParagrText = document.createTextNode("Il semblerait que le produit demandé ne soit plus disponible ou ait été modifié pour votre plus grand confort. L'heureux élu vous attend parmi ");
    errorParagrElement.appendChild(errorParagrText);

    const errorLinkElement = document.createElement("a");
    errorLinkElement.setAttribute("href", "./index.html");
    const errorLinkText = document.createTextNode("Nos produits.");
    errorLinkElement.appendChild(errorLinkText);

    sectionSelector.replaceChildren(errorArticleElement);
    errorArticleElement.insertAdjacentElement("beforeend", errorTitleElement);
    errorArticleElement.insertAdjacentElement("beforeend", errorParagrElement);
    errorParagrElement.insertAdjacentElement("beforeend", errorLinkElement);
};


// Empêche de saisir une quantité non valide
const quantitySelector = document.getElementById("quantity");

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
const addToCartButton = document.getElementById("addToCart");
class product {
    constructor(id, color, quantity) {
        this.id = id;
        this.color = color;
        this.quantity = quantity;
    }
};

addToCartButton.addEventListener("click", () => {
    if ((colorSelector.value == "" && quantitySelector.value == 0) || colorSelector.value == "" || quantitySelector.value == 0) {
    notSelectedError();
    } else {
    errorSelector.innerHTML = "";
    addToCart(urlID, colorSelector.value, quantitySelector.value);
    }
});

const errorEmplacementSelector = document.querySelector(".item__content__settings__quantity");
const errorElement = document.createElement("span");
errorElement.setAttribute("class", "cartError");
errorEmplacementSelector.insertAdjacentElement("afterend", errorElement);
const errorSelector = document.querySelector(".cartError");
errorElement.style.color = "black";

function notSelectedError() {
    if (colorSelector.value == "" && quantitySelector.value == 0) {
        errorSelector.innerHTML = "- Veuillez choisir une couleur et une quantité -";
    } else if (colorSelector.value == "") {
        errorSelector.innerHTML = "- Veuillez choisir une couleur -";
    } else {
        errorSelector.innerHTML = "- Veuillez choisir une quantité -";
    }
};

// Ajoute au panier et enregistre dans le local storage

function addToCart(idToAdd, colorToAdd, quantityToAdd) {
    // Efface le local storage en cas d'erreur
    try {
        JSON.parse(localStorage.getItem("cartData"));
    } catch {
        localStorage.clear();
    }

    let cartData = JSON.parse(localStorage.getItem("cartData"));
    
    if (Array.isArray(cartData) == true) {
        // Cherche si produit déjà dans le panier
        let alreadyInCart = false;

        for(let productClass of cartData) {
            if(productClass.id == idToAdd && productClass.color == colorToAdd) {
                productClass.quantity = Number(productClass.quantity) + Number(quantityToAdd);
                if(productClass.quantity > 100) {
                    productClass.quantity = 100;
                }
                alreadyInCart = true;
                console.log(productClass.quantity);
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


