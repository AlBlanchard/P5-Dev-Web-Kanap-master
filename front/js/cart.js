const urlAPI = "http://localhost:3000/api/products/";
const cartSection = document.getElementById("cart__items")
let cartData = JSON.parse(localStorage.getItem("cartData"));

try {
    JSON.parse(localStorage.getItem("cartData"));
} catch {
    localStorage.clear();
};

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
const isDataValid = async (cartData) => {
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
        if(cartData == [] || cartData == undefined || cartData == "") {
            emptyMessageHTML();
        } else {
            return true;
        }

    } else {
        return true;
    }
}

// Liste les éléments du panier dans le DOM
const cartListing = async (cartData) => {
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

const deleteEventListener = async (cartData) => {
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
            if(cartData == "" || cartData == undefined) {
                emptyMessageHTML();
            }
        });
    }
}

const quantityEventListener = async (cartData) => {

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

const total = async (cartData) => {
    const totalSelector = document.querySelector(".cart__price");

    let totalQuantity = 0;
    let totalPrice = 0;
    let articleS = "articles";

    let totalHtml = "";

    if(cartData == [] || cartData == undefined) {
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

const cartToDom = async (cartData) => {
    await isDataValid(cartData);
    await cartListing(cartData);
    await deleteEventListener(cartData);
    await quantityEventListener(cartData);
    await total(cartData);
}

function deleteData(cartData, arrayIndex) {
    for(index of arrayIndex) {
        console.error("Ces données ont été supprimées car elles ne sont pas valides :", cartData[index]);
        cartData.splice(index, 1);
        localStorage.setItem("cartData", JSON.stringify(cartData));
    }
}

function emptyMessageHTML() {
    const emptyElement = document.createElement("h2");
    const emptyText = document.createTextNode("Votre panier est vide.");
    emptyElement.appendChild(emptyText);
    cartSection.appendChild(emptyElement);
};

if(cartData == [] || cartData == undefined || cartData == "") {
    emptyMessageHTML();
    total(cartData);
} else {
    cartToDom(cartData);
}