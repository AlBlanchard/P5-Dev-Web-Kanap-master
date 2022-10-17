try {
    JSON.parse(localStorage.getItem("cartData"));
} catch {
    localStorage.clear();
}

const urlAPI = "http://localhost:3000/api/products";
const cartSection = document.getElementById("cart__items")
let cartData = JSON.parse(localStorage.getItem("cartData"));

if (cartIsEmpty(cartData) == true) {
    emptyHTML();
} else {
    cartListing(cartData);
}


function cartIsEmpty(localStorageData) {
    if (localStorageData == "" || localStorageData == undefined) {
        return true;
    } else {
        return false;
    }
} 


function emptyHTML() {
    const emptyElement = document.createElement("h2");
    const emptyText = document.createTextNode("Votre panier est vide.");
    emptyElement.appendChild(emptyText);
    cartSection.appendChild(emptyElement);
}


function cartListing(localStorageData) {
    fetch(urlAPI) 
    .then(res => res.json())
    .then(kanapAPI => {
        cartProductFinder(kanapAPI, localStorageData);
        return kanapAPI;
    })
    .catch(err => console.log("Erreur API", err));
}

function cartProductFinder(dataAPI, localStorageData) {
    for(let i in localStorageData) {
        let productFound = false;

        for(let productAPI of dataAPI) {
            if(productAPI._id == localStorageData[i].id) {
                productFound = true;
                if(isDataValid(productAPI.colors, localStorageData[i]) == true) {
                    productHTML(productAPI, localStorageData[i]);

                } else {
                    console.error("Un produit a été supprimé dans le panier car sa quantité ou sa couleur n'était pas valide", localStorageData[i])
                    //localStorageData.splice(i, 1);
                }
            }
        }
        
        if(productFound == false) {
            console.error("Un produit a été supprimé dans le panier car son id n'était pas valide", localStorageData[i])
            localStorageData.splice(i, 1);
        }
    }

    localStorage.setItem("cartData", JSON.stringify(localStorageData));
}


function isDataValid(objectColorAPI, objectLocalStorage) {
    let dataValid = false;
    console.log(objectColorAPI);
    console.log(objectLocalStorage.color);
    console.log(objectLocalStorage.quantity);
    console.log(Number.isInteger(Number(objectLocalStorage.quantity)));

    if(objectLocalStorage.quantity > 1 || objectLocalStorage.quantity < 100) {
        return dataValid;
    } else if (Number.isInteger(Number(objectLocalStorage.quantity))) {
        dataValid = true;
        return dataValid;
    } else {
        for(color of objectColorAPI) {
            if(color == objectLocalStorage.color) {
                dataValid = true;
            } else {
                dataValid = false;
            }
        }
        return dataValid;
    }
}


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
                            </article>`
}
