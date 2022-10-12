const urlQuery = window.location.search;
const urlParamSplit = new URLSearchParams(urlQuery);
const urlID = urlParamSplit.get("id");

const urlAPI = "http://localhost:3000/api/products";

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
        }
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