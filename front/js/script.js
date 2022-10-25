const urlAPI = "http://localhost:3000/api/products";
const itemsSectionSelector = document.getElementById("items") 

// Requête API pour récupérer toutes les données
fetch(urlAPI) 
    .then(res => res.json())
    .then(apiArray => {
        displayProduct(apiArray);
    })
    .catch(err => console.log("Erreur API", err))

// Insert dans le HTML les liens vers les canapés avec leurs données associées
function displayProduct(arrayData) {
    for(let canapData of arrayData) {
        const itemsHTML =   `<a href="./product.html?id=${canapData._id}">
                                <article>
                                <img src="${canapData.imageUrl}" alt="${canapData.altTxt}">
                                <h3 class="productName">${canapData.name}</h3>
                                <p class="productDescription">${canapData.description}</p>
                                </article>
                            </a>`;
        
        itemsSectionSelector.innerHTML += itemsHTML;
    }
}