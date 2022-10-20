const urlAPI = "http://localhost:3000/api/products/";
const cartSection = document.getElementById("cart__items")
let cartData = JSON.parse(localStorage.getItem("cartData"));

try {
    JSON.parse(localStorage.getItem("cartData"));
} catch {
    localStorage.clear();
};

cartListing();

function cartListing() {
    let test = false;
    for(let i in cartData) {
        fetch(urlAPI + cartData[i].id) 
            .then(res => {
                // Condition en cas d'erreur 404
                if(res.ok) {
                    res.json().then(apiProductData => {
                        test = true;
                        // Vérification des données, inscrit dans le HTML ou supprime si données non valides
                        if (isDataValid(apiProductData, cartData[i])) {
                            insertInHTML(apiProductData, cartData[i]);
                        } else {
                            console.error("Un produit a été supprimé du panier car ses données ne sont pas valides", cartData[i]);
                            cartData.splice(i, 1);
                            localStorage.setItem("cartData", JSON.stringify(cartData));

                            if (cartData == "" || cartData == undefined) {
                                emptyMessageHTML();
                            }
                        }
                    });
                } else {
                    console.error("Un produit a été supprimé du panier car ses données ne sont pas valides", cartData[i]);
                    cartData.splice(i, 1);
                    localStorage.setItem("cartData", JSON.stringify(cartData));

                    if (cartData == "" || cartData == undefined) {
                        emptyMessageHTML();
                    }
                }
            })
            .catch(err => {
                console.log("Erreur API", err);
        })
    }
    console.log(test);
};

function emptyMessageHTML() {
    const emptyElement = document.createElement("h2");
    const emptyText = document.createTextNode("Votre panier est vide.");
    emptyElement.appendChild(emptyText);
    cartSection.appendChild(emptyElement);
};

function isDataValid(apiProductData, cartProductData) {
    let dataValid = false;

    if(cartProductData.quantity >= 1 && cartProductData.quantity <= 100) {
        if(Number.isInteger(Number(cartProductData.quantity))) {
            for(color of apiProductData.colors) {
                if(color == cartProductData.color) {
                    dataValid = true;
                }
            }
        }
    }
    return dataValid;
};

// Créer les éléments HTML du panier
function insertInHTML(apiProductData, cartProductData) {
    cartSection.innerHTML += `<article class="cart__item" data-id="${cartProductData.id}" data-color="${cartProductData.color}">

                                <div class="cart__item__img">
                                    <img src="${apiProductData.imageUrl}" alt="${apiProductData.altTxt}">
                                </div>

                                <div class="cart__item__content">
                                    <div class="cart__item__content__description">
                                        <h2>${apiProductData.name}</h2>
                                        <p>${cartProductData.color}</p>
                                        <p>${apiProductData.price} €</p>
                                    </div>

                                    <div class="cart__item__content__settings">
                                        <div class="cart__item__content__settings__quantity">
                                            <p>Qté : ${cartProductData.quantity}</p>
                                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartProductData.quantity}">
                                        </div>
                                        
                                        <div class="cart__item__content__settings__delete">
                                            <p class="deleteItem">Supprimer</p>
                                        </div>
                                    </div>
                                </div>
                            </article>`;
};




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

async function quantityChange(cartData) {
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

async function deleteAction(cartData) {
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

orderButton.addEventListener("click", (order) => {
    order.preventDefault()
    cartData = JSON.parse(localStorage.getItem("cartData"));
    if (isformValid()) {
        if (isDataValid(apiData, cartData)) {
        } else {
            alert("Une erreur est survenue lors de votre commande, les données renseignées ne sont plus valides.")
        }
    } else {
        for(input of inputsElement) {
            input.addEventListener("change", () => {
                isformValid();
            });
        }
    }
});

let formValid = true
const formElement = document.querySelector("form");
const inputsElement = formElement.querySelectorAll("input");

function isformValid() {
    const formErr = ["prénom", "nom", "adresse", "ville", "adresse e-mail"];

    // Pratique pour tester les Regex : https://www.regexpal.com/
    const firstNameRegex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/g;
    const lastNameRegex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/g;
    const cityRegex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/g;

    const mailRegex = /^(?:[0-9a-zA-z.]+@[a-zA-Z]{2,}[/.][a-zA-Z]{2,4}|)$/g;
    const adressRegex = /^[\w'\-,.][^_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>[\]]{1,}$/g;

    let formErrMessage = "";

    formValid = true
    
    for(let i = 0; i <= 4; i++) {
        if (inputsElement[i].value == "" || inputsElement[i].value == undefined) {
            formErrMessage = `Veuillez renseigner votre ${formErr[i]}`
            formValid = false;

        } else if (i == 0 && !firstNameRegex.test(inputsElement[i].value)) {
            formErrMessage = `Le ${formErr[i]} renseigné n'est pas valide`;
            formValid = false;

        } else if (i == 1 && !lastNameRegex.test(inputsElement[i].value)) {
            formErrMessage = `Le ${formErr[i]} renseigné n'est pas valide`;
            formValid = false;

        } else if (i == 2 && !adressRegex.test(inputsElement[i].value)) {
            formErrMessage = `Votre ${formErr[i]} ne doit pas comprendre de caractères spéciaux`;
            formValid = false;

        } else if (i == 3 && !cityRegex.test(inputsElement[i].value)) {
            formErrMessage = `La ${formErr[i]} renseignée n'est pas valide`;
            formValid = false;

        } else if (i == 4 && !mailRegex.test(inputsElement[i].value)) {
            formErrMessage = `L'${formErr[i]} renseignée n'est pas valide`;
            formValid = false;

        } else {
            formErrMessage = "";
        }

        inputsElement[i].nextElementSibling.innerHTML = formErrMessage;
    }
    return formValid;
}


