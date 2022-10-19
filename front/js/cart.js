const urlAPI = "http://localhost:3000/api/products";
const cartSection = document.getElementById("cart__items")
let cartData = JSON.parse(localStorage.getItem("cartData"));

try {
    JSON.parse(localStorage.getItem("cartData"));
} catch {
    localStorage.clear();
};


if (cartData == "" || cartData == undefined) {
    emptyMessageHTML();
} else {
    fetch(urlAPI) 
    .then(apiData => apiData.json())
    .then(apiData => {
        isDataValid(apiData, cartData);
        cartListingHTML(apiData, cartData);
        quantityChange(cartData);
        deleteAction(cartData);
    })
    .catch(err => console.log("Erreur API", err));
};

function emptyMessageHTML() {
    const emptyElement = document.createElement("h2");
    const emptyText = document.createTextNode("Votre panier est vide.");
    emptyElement.appendChild(emptyText);
    cartSection.appendChild(emptyElement);
};

function isDataValid(apiData, cartData) {
    for(let i in cartData) {
        let dataValid = false;

        for(let productApi of apiData) {
            if(productApi._id == cartData[i].id) {
                if(cartData[i].quantity >= 1 && cartData[i].quantity <= 100) {
                    if(Number.isInteger(Number(cartData[i].quantity))) {
                        for(color of productApi.colors) {
                            if(color == cartData[i].color) {
                                dataValid = true;
                            }
                        }
                    }
                }
            }
        }

        if(dataValid == false) {
            console.error("Un produit a été supprimé dans le panier car ses données ne sont pas valides", cartData[i])
            cartData.splice(i, 1);
            localStorage.setItem("cartData", JSON.stringify(cartData));
            return false;
        } else {
            localStorage.setItem("cartData", JSON.stringify(cartData));
            return true;
        }
    }
};

// Créer les éléments HTML du panier
function cartListingHTML(apiData, cartData) {
    if (cartData == "" || cartData == undefined) {
        emptyMessageHTML();
    } else { 
        for(let i in cartData) {
            // Const block
            const articleElement = document.createElement("article");
            articleElement.setAttribute("class", "cart__item");

            const divImgElement = document.createElement("div");
            divImgElement.setAttribute("class", "cart__item__img");

            const imgElement = document.createElement("img");
            divImgElement.appendChild(imgElement);

            const divContentElement = document.createElement("div");
            divContentElement.setAttribute("class", "cart__item__content");

            const divDescriptionElement = document.createElement("div");
            divDescriptionElement.setAttribute("class", "cart__item__content__description");

            const nameElement = document.createElement("h2");
            const colorElement = document.createElement("p");
            const priceElement = document.createElement("p");
            divDescriptionElement.appendChild(nameElement);
            divDescriptionElement.appendChild(colorElement);
            divDescriptionElement.appendChild(priceElement);

            const divSettingsElement = document.createElement("div");
            divSettingsElement.setAttribute("class", "cart__item__content__settings");

            const divQuantityElement = document.createElement("div");
            divQuantityElement.setAttribute("class", "cart__item__content__settings__quantity");

            const pQuantityElement = document.createElement("p");

            const inputQuantityElement = document.createElement("input");
            inputQuantityElement.setAttribute("type", "number");
            inputQuantityElement.setAttribute("class", "itemQuantity");
            inputQuantityElement.setAttribute("name", "itemQuantity");
            inputQuantityElement.setAttribute("min", "1");
            inputQuantityElement.setAttribute("max", "100");
            divQuantityElement.appendChild(pQuantityElement);
            divQuantityElement.appendChild(inputQuantityElement);

            const divDeleteElement = document.createElement("div");
            divDeleteElement.setAttribute("class", "cart__item__content__settings__delete");

            const pDeleteElement = document.createElement("p");
            pDeleteElement.setAttribute("class", "deleteItem");
            pDeleteElement.appendChild(document.createTextNode("Supprimer"));

            divDeleteElement.appendChild(pDeleteElement);
            divSettingsElement.appendChild(divQuantityElement);
            divSettingsElement.appendChild(divDeleteElement);
            divContentElement.appendChild(divDescriptionElement);
            divContentElement.appendChild(divSettingsElement);

            articleElement.appendChild(divImgElement);
            articleElement.appendChild(divContentElement);
            //Const block end

            articleElement.setAttribute("data-id", cartData[i].id);
            articleElement.setAttribute("data-color", cartData[i].color);

            colorElement.appendChild(document.createTextNode(cartData[i].color));

            pQuantityElement.appendChild(document.createTextNode(`Qté : ${cartData[i].quantity}`));
            inputQuantityElement.setAttribute("value", cartData[i].quantity);

            for(let productApi of apiData) {
                if(productApi._id == cartData[i].id) {
                    imgElement.setAttribute("src", productApi.imageUrl);
                    imgElement.setAttribute("alt", productApi.altTxt);

                    nameElement.appendChild(document.createTextNode(productApi.name));
                    priceElement.appendChild(document.createTextNode(`${productApi.price} €`));
                }
            }

            cartSection.insertAdjacentElement("beforeend", articleElement);
        }
    }
}




//    cartSection.innerHTML += `<article class="cart__item" data-id="${objectLocalStorage.id}" data-color="${objectLocalStorage.color}">
//
//                                <div class="cart__item__img">
//                                    <img src="${objectAPI.imageUrl}" alt="${objectAPI.altTxt}">
//                                </div>
//
//                                <div class="cart__item__content">
//                                    <div class="cart__item__content__description">
//                                        <h2>${objectAPI.name}</h2>
//                                        <p>${objectLocalStorage.color}</p>
//                                        <p>${objectAPI.price} €</p>
//                                    </div>
//
//                                    <div class="cart__item__content__settings">
//                                        <div class="cart__item__content__settings__quantity">
//                                            <p>Qté : ${objectLocalStorage.quantity}</p>
//                                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${objectLocalStorage.quantity}">
//                                        </div>
//                                        
//                                        <div class="cart__item__content__settings__delete">
//                                            <p class="deleteItem">Supprimer</p>
//                                        </div>
//                                    </div>
//                                </div>
//                            </article>`;
//};

function quantityChange(cartData) {
    const quantityInputList = document.querySelectorAll(".itemQuantity");

    for(let quantityInput of quantityInputList) {
        const articleParentElement = quantityInput.parentElement.parentElement.parentElement.parentElement;

        quantityInput.addEventListener("change", () => {
            if (quantityInput.value > 100) {
                quantityInput.value = 100;
            } else if (quantityInput.value < 1) {
                quantityInput.value = 1;
            } else {
                quantityInput.value = Math.round(quantityInput.value);
            }

            for(let product of cartData) {
                if(product.id == articleParentElement.dataset.id) {
                    if(product.color == articleParentElement.dataset.color) {
                        product.quantity = quantityInput.value;
                    }
                }
            }
            quantityInput.previousElementSibling.innerHTML = `Qté : ${quantityInput.value}`;
            localStorage.setItem("cartData", JSON.stringify(cartData));
        });
    }
};

function deleteAction(cartData) {
    const deleteButtonList = document.querySelectorAll(".deleteItem");

    for(let deleteButton of deleteButtonList) {
        const articleParentElement = deleteButton.parentElement.parentElement.parentElement.parentElement;

        deleteButton.addEventListener("click", () => {
            for(let i in cartData) {
                if(cartData[i].id == articleParentElement.dataset.id) {
                    if(cartData[i].color == articleParentElement.dataset.color) {
                        cartData.splice(i, 1);
                    }
                }
            }

            articleParentElement.remove();
            localStorage.setItem("cartData", JSON.stringify(cartData));
            if(cartData == "" || cartData == undefined) {
                emptyMessageHTML();
            }
        });
    }
}

const orderButton = document.getElementById("order");

orderButton.addEventListener("click", () => {
    cartData = JSON.parse(localStorage.getItem("cartData"));
    if (body.contact.firstName) {
        alert("Un champs du formulaire est mal renseigné");
    } else if (cartData == "" || cartData == undefined) {
        alert("Impossible de commander, votre panier est vide !");
    } else {
        fetch(urlAPI) 
        .then(apiData => apiData.json())
        .then(apiData => {
            if(isDataValid(apiData, cartData) == true) {

            } else {
                alert("Une erreur est survenue lors de votre commande, les données renseignées ne sont plus valides.")
            }
        })
        .catch(err => console.log("Erreur API", err));
    };
});

function formError() {
    const formElement = document.querySelector("form");
    const inputsElement = formElement.querySelectorAll("input");
    const formErr = ["prénom", "nom", "adresse", "ville", "adresse e-mail"]

    for(let i = 0; i <= 4; i++) {
        if(inputsElement[i].value == "" || inputsElement[i].value == undefined) {
            let formErrMessage = `Veuillez renseigner votre ${formErr[i]}`
            inputsElement[i].nextElementSibling.innerHTML = formErrMessage;
        }
    }
}

formError();
