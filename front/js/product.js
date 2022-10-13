const urlQuery = window.location.search;
const urlParamSplit = new URLSearchParams(urlQuery);
const urlID = urlParamSplit.get("id");

const urlAPI = "http://localhost:3000/api/products";

let idFound = false

fetch(urlAPI) 
    .then(res => res.json())
    .then(canapArray => {
        wichProduct(canapArray, urlID);
        return canapArray
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
    }
}

// Insert les données du canapé en question dans le HTML
function productHTML(productData) {
    const name = productData.name;
    const imageUrl = productData.imageUrl;
    const altTxt = productData.altTxt;
    const price = productData.price;
    const description = productData.description;
    const colors = productData.colors;

    const nameSelector = document.getElementById("title");
    const imgParentSelector = document.querySelector(".item__img");
    const priceSelector = document.getElementById("price");
    const descriptionSelector = document.getElementById("description");
    const colorSelector = document.getElementById("colors");

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
}

// Message d'erreur si l'id ne correspond à aucun canapé
function productNotFound() {
    const sectionSelector = document.querySelector(".item");

    const errorArticleElement = document.createElement("article");
    
    const errorTitleElement = document.createElement("h1");
    const errorTitleText = document.createTextNode("Oooops !");
    errorTitleElement.appendChild(errorTitleText);

    const errorParagrElement = document.createElement("p");
    const errorParagrText = document.createTextNode("Il semblerait que le produit demandé n'est plus disponible ou a été modifié pour votre plus grand confort. L'heureux élu vous attend parmi ");
    errorParagrElement.appendChild(errorParagrText);

    const errorLinkElement = document.createElement("a");
    errorLinkElement.setAttribute("href", "./index.html");
    const errorLinkText = document.createTextNode("Nos produits.");
    errorLinkElement.appendChild(errorLinkText);

    sectionSelector.replaceChildren(errorArticleElement);
    errorArticleElement.insertAdjacentElement("beforeend", errorTitleElement);
    errorArticleElement.insertAdjacentElement("beforeend", errorParagrElement);
    errorParagrElement.insertAdjacentElement("beforeend", errorLinkElement);
}


// Empêche de saisir une quantité non valide

const quantitySelector = document.getElementById("quantity");

quantitySelector.addEventListener("change", () => {
    if (quantitySelector.value > 100) {
        quantitySelector.value = 100;
    } else if (quantitySelector.value < 0) {
        quantitySelector.value = 0;
    } else {
        quantitySelector.value = Math.round(quantitySelector.value);
    }
});


// Ajouter au panier

const addToCartButton = document.getElementById("addToCart");
class product {
    constructor(id, color, quantity) {
        this.id = id;
        this.color = color;
        this.quantity = quantity;
    }
}

let product1 = new product(12555, "blue", 5);
let product2 = new product(24444, "blue", 5);
console.log(product1);

addToCartButton.addEventListener("click", () => {
    let cartData = [];
    cartData = [product1, product2];
    console.log(cartData);
    localStorage.setItem("cartData", JSON.stringify(cartData));
})

console.log(localStorage.getItem("cartData"));

let variable = {};
let test = 1;

variable[test] = 25;
console.log(variable[test]);
