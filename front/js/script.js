const urlAPI = "http://localhost:3000/api/products";
const itemsSectionSelector = document.getElementById("items") 

fetch(urlAPI) 
    .then(res => res.json())
    .then(canapArray => {
        displayProduct(canapArray);
        return canapArray
    })
    .catch(err => console.log("Erreur API", err))

// Insert dans le HTML les liens vers les canapés avec leurs données associées
function displayProduct(arrayData) {
    for(let canapData of arrayData) {
        const itemsHTML = `<a href="./product.html?id=${canapData._id}">
                        <article>
                        <img src="${canapData.imageUrl}" alt="${canapData.altTxt}">
                        <h3 class="productName">${canapData.name}</h3>
                        <p class="productDescription">${canapData.description}</p>
                        </article>
                    </a>`;
        
        itemsSectionSelector.innerHTML += itemsHTML;
    }
}
//<a href="./product.html?id=42">
//    <article>
//        <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
//        <h3 class="productName">Kanap name1</h3>
//        <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
//    </article>
//</a>