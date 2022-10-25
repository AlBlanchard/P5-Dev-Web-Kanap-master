const urlAPI = "http://localhost:3000/api/products/";
const cartSection = document.getElementById("cart__items")
const orderButton = document.getElementById("order");
const formElement = document.querySelector("form");
const inputsElement = formElement.querySelectorAll("input");

let cartData = JSON.parse(localStorage.getItem("cartData"));

try {
    JSON.parse(localStorage.getItem("cartData"));
} catch {
    localStorage.clear();
};


// --------------------------------------- FONCTIONS ASYNCHRONES --------------------------------------- //

// Contacte l'API pour obtenir les données associées à l'ID  
const apiResponse = (cartData, i) => fetch(urlAPI + cartData[i].id) 
        .then(response => {
            if(response.ok) {
                return response.json()
            } else {
                return 404;
            }
        })
        .catch(err => console.log("Erreur API", err))

// Vérifie si les données du panier sont valides, sinon supprime les données invalides dans le localstorage
async function isDataValid(cartData) {
    let invalidIndex = [];

    // Vérifications, id quantité et couleur
    for(let i in cartData) {
        const apiProduct = await apiResponse(cartData, i);
        let dataValid = false;
        
        if(apiProduct !== 404) {
            if(cartData[i].quantity >= 1 && cartData[i].quantity <= 100) {
                if(Number.isInteger(cartData[i].quantity)) {
                    for(color of apiProduct.colors) {
                        if(color == cartData[i].color) {
                            dataValid = true;
                        }
                    }
                }
            }
        }
        if(dataValid == false) {
            invalidIndex.push(i); 
        }
    }
    
    // Supprime les données incorrectes listées précédement
    if(invalidIndex !== []) {
        deleteData(cartData, invalidIndex);

        if(isEmpty(cartData)) {
            emptyMessageHTML();
        } else {
            return true;
        }

    } else {
        return true;
    }
}

// Liste les éléments du panier dans le DOM
async function cartListing(cartData) {
    for(let i in cartData) {
        const apiProduct = await apiResponse(cartData, i);

        cartSection.innerHTML += 

        `<article class="cart__item" data-id="${cartData[i].id}" data-color="${cartData[i].color}">
            <div class="cart__item__img">
                <img src="${apiProduct.imageUrl}" alt="${apiProduct.altTxt}">
            </div>

            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${apiProduct.name}</h2>
                    <p>${cartData[i].color}</p>
                    <p>${apiProduct.price} €</p>
                </div>

                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : ${cartData[i].quantity}</p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartData[i].quantity}">
                    </div>
                    
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        </article>`;
    }
}

// Permet d'ajouter un event listener pour chaque boutton "supprimer"
async function deleteEventListener(cartData) {
    const articleList = document.querySelectorAll(".cart__item");

    for(let article of articleList) {
        const deleteButton = article.querySelector(".deleteItem");

        deleteButton.addEventListener("click", () => {

            for(let i in cartData) {
                if(article.dataset.id == cartData[i].id) {
                    cartData.splice(i, 1);
                }
            }

            article.remove();
            localStorage.setItem("cartData", JSON.stringify(cartData));
            total(cartData);
            if(isEmpty(cartData)) {
                emptyMessageHTML();
            }
        });
    }
}

// Permet d'ajouter un event listener pour chaque input de quantité et empêche d'entrer une quantité non valide
async function quantityEventListener(cartData) {

    const articleList = document.querySelectorAll(".cart__item");

    for(let article of articleList) {
        const quantityInput = article.querySelector(".itemQuantity");

        quantityInput.addEventListener("change", () => {
            if (quantityInput.value > 100) {
                quantityInput.value = 100;
            } else if (quantityInput.value < 1) {
                quantityInput.value = 1;
            } else {
                quantityInput.value = Math.round(quantityInput.value);
            }

            for(let product of cartData) {
                if(product.id == article.dataset.id) {
                    if(product.color == article.dataset.color) {
                        product.quantity = Number(quantityInput.value);
                    }
                }
            }
            quantityInput.previousElementSibling.innerHTML = `Qté : ${quantityInput.value}`;
            localStorage.setItem("cartData", JSON.stringify(cartData));
            total(cartData);
        });
    }
}

// Inscrit le prix et la quantité total dans le DOM 
async function total(cartData) {
    const totalSelector = document.querySelector(".cart__price");

    let totalQuantity = 0;
    let totalPrice = 0;
    let articleS = "articles";

    let totalHtml = "";

    if(isEmpty(cartData)) {
        totalQuantity = 0;
        totalPrice = 0;
        articleS = "article";
    } else {
        for(i in cartData) {
            const apiProduct = await apiResponse(cartData, i);

            totalQuantity += cartData[i].quantity; 
            totalPrice += cartData[i].quantity * apiProduct.price;
        }
    }

    if(totalQuantity < 2) {
        articleS = "article";
    } else {
        articleS = "articles";
    }

    totalHtml = `<p>Total (<span id="totalQuantity">${totalQuantity}</span> ${articleS}) : <span id="totalPrice">${totalPrice}</span> €</p>`;
    totalSelector.innerHTML = totalHtml;
}

// Lance les différentes fonctions pour la verification, l'affichage et les interactions sur le DOM
async function cartToDom(cartData) {
    await isDataValid(cartData);
    await cartListing(cartData);
    await deleteEventListener(cartData);
    await quantityEventListener(cartData);
    await total(cartData);
}

// Créer un objet de donnés en vue de l'envoyer à l'API pour une requête POST
async function jsonPostData(cartData) {
    let postRequest = {
        contact: {
            firstName: inputsElement[0].value,
            lastName: inputsElement[1].value,
            address: inputsElement[2].value,
            city: inputsElement[3].value,
            email: inputsElement[4].value,
        },

        products: []
    };

    for(product of cartData) {
        postRequest.products.push(product.id);
    }

    return postRequest;
}

// Envoie une requête POST à l'API
async function apiPost(cartData) {
    let postRequest = await jsonPostData(cartData);

    let apiPostResponse = await fetch(urlAPI + "order", {
        method : "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(postRequest)
    });
    
    // Redirige vers la page confirmation en y insérant le numéro de commande
    let result = await apiPostResponse.json();
    document.location.href=`../html/confirmation.html?orderId=${result.orderId}`;
}

// --------------------------------------- FONCTIONS SYNCHRONES --------------------------------------- //

// Comme son nom l'indique, vérifie sur le panier est vide
function isEmpty(cartData) {
    if (cartData == [] || cartData == undefined || cartData == "") {
        return true;
    } else {
        return false;
    }
}

// Affiche un message pour le panier vide
function emptyMessageHTML() {
    const emptyElement = document.createElement("h2");
    const emptyText = document.createTextNode("Votre panier est vide.");
    emptyElement.appendChild(emptyText);
    cartSection.appendChild(emptyElement);
};

// Supprime les données listés dans le cartData
function deleteData(cartData, arrayIndex) {
    for(index of arrayIndex) {
        console.error("Ces données ont été supprimées car elles ne sont pas valides :", cartData[index]);
        cartData.splice(index, 1);
        localStorage.setItem("cartData", JSON.stringify(cartData));
    }
}

// Vérifie si le formulaire est correctement rempli
function isformValid() {
    const formErr = ["prénom", "nom", "adresse", "ville", "adresse e-mail"];

    // Pratique pour tester les Regex : https://www.regexpal.com/
    const firstNameRegex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/g;
    const lastNameRegex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/g;
    const cityRegex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/g;

    const mailRegex = /^(?:[0-9a-zA-z.]+@[a-zA-Z]{2,}[/.][a-zA-Z]{2,4}|)$/g;
    const adressRegex = /^[\w'\-,.][^_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>[\]]{1,}$/g;

    let formErrMessage = "";
    let formValid = true
    
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


// --------------------------------------- BOUQUET FINAL --------------------------------------- //

// Lance les différentes fonctions au chargement de la page
if(isEmpty(cartData)) {
    emptyMessageHTML();
    total(cartData);
} else {
    cartToDom(cartData);
}

// Event Listener pour le boutton "commander", vérifie si le panier est vide, si le formulaire est valide, si les donnés sont valides, et envoie les donnés à l'API
orderButton.addEventListener("click", (order) => {
    order.preventDefault()
    cartData = JSON.parse(localStorage.getItem("cartData"));
    if (isEmpty(cartData) == false) {
        if (isformValid()) {
            if (isDataValid(cartData)) {
                apiPost(cartData);
                localStorage.clear();
            } else {
                alert("Une erreur est survenue lors de votre commande, les données renseignées ne sont plus valides.");
            }

        } else {
            for(input of inputsElement) {
                input.addEventListener("change", () => {
                    isformValid();
                });
            }
        }

    } else {
        alert("Votre panier est vide !");
    }
});



