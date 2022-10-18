const urlAPI = "http://localhost:3000/api/products";
const cartSection = document.getElementById("cart__items")
let cartData = JSON.parse(localStorage.getItem("cartData"));

try {
    JSON.parse(localStorage.getItem("cartData"));
} catch {
    localStorage.clear();
};


if (cartIsEmpty(cartData) == true) {
    emptyHTML();
} else {
    cartListing(cartData);
};


function cartIsEmpty(localStorageData) {
    if (localStorageData == "" || localStorageData == undefined) {
        return true;
    } else {
        return false;
    }
};

function emptyHTML() {
    const emptyElement = document.createElement("h2");
    const emptyText = document.createTextNode("Votre panier est vide.");
    emptyElement.appendChild(emptyText);
    cartSection.appendChild(emptyElement);
};

// Appelle l'API
function cartListing(localStorageData) {
    fetch(urlAPI) 
    .then(res => res.json())
    .then(kanapAPI => {
        cartProductFinder(kanapAPI, localStorageData);
        eventListener();
        return kanapAPI;
    })
    .catch(err => console.log("Erreur API", err));
};

// Cherche les différentes informations des produits, vérifie les données et créer les éléments HTML
function cartProductFinder(dataAPI, localStorageData) {
    for(let i in localStorageData) {
        let productFound = false;

        for(let productAPI of dataAPI) {
            if(productAPI._id == localStorageData[i].id) {
                if(isDataValid(productAPI.colors, localStorageData[i])) {
                    productFound = true;
                    productHTML(productAPI, localStorageData[i]);
                }
            }
        }
        
        if(productFound == false) {
            console.error("Un produit a été supprimé dans le panier car ses informations ne sont pas valide", localStorageData[i])
            localStorageData.splice(i, 1);
            if (cartIsEmpty(cartData) == true) {
                emptyHTML();
            } else {
                cartListing(cartData);
            };
        }
    }
    localStorage.setItem("cartData", JSON.stringify(localStorageData));
};

// Vérifie si le nombre et la couleur sont valides 
function isDataValid(objectColorAPI, objectLocalStorage) {
    let dataValid = false;

    if(objectLocalStorage.quantity >= 1 && objectLocalStorage.quantity <= 100) {
        if(Number.isInteger(Number(objectLocalStorage.quantity))) {
            for(color of objectColorAPI) {
                if(color == objectLocalStorage.color) {
                    dataValid = true;
                }
            }
        } else {
            dataValid = false;
        }
    }
    return dataValid;
};

// Créer les éléments HTML
function productHTML(objectAPI, objectLocalStorage) {
    cartSection.innerHTML += `<article class="cart__item" data-id="${objectLocalStorage.id}" data-color="${objectLocalStorage.color}">

                                <div class="cart__item__img">
                                    <img src="${objectAPI.imageUrl}" alt="${objectAPI.altTxt}">
                                </div>

                                <div class="cart__item__content">
                                    <div class="cart__item__content__description">
                                        <h2>${objectAPI.name}</h2>
                                        <p>${objectLocalStorage.color}</p>
                                        <p>${objectAPI.price} €</p>
                                    </div>

                                    <div class="cart__item__content__settings">
                                        <div class="cart__item__content__settings__quantity">
                                            <p>Qté : ${objectLocalStorage.quantity}</p>
                                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${objectLocalStorage.quantity}">
                                        </div>
                                        
                                        <div class="cart__item__content__settings__delete">
                                            <p class="deleteItem">Supprimer</p>
                                        </div>
                                    </div>
                                </div>
                            </article>`;
};

function eventListener() {
    const deleteButtonList = document.querySelectorAll(".deleteItem");

    for(let i in deleteButtonList) {
        deleteButtonList[i].addEventListener("click", () => {
            console.log("bonjour");
        });
    }
};

