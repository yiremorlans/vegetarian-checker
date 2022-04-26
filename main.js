function getFetch(){
    let inputVal = document.getElementById('barcode').value

    if(inputVal.length > 12 && inputVal < 8) {
        alert(`Please ensure it is a valid barcode 8 - 12 digits`)
        return;
    }

    const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`


    fetch(url)
        .then(res => res.json() ) //parse response as JSON
        .then(data => {
            console.log(data)
            if (data.status === 1) {
                const item = new ProductInfo(data.product)
                item.showInfo()
                item.listIngredients()
            //call additional stuff
            } else if (data.status === 0) {
                alert(`Product ${inputVal} not found. Please try another.`)
            }

        })
        .catch(err => {
            console.log(`error ${err}`)
        });

}

class ProductInfo {
    constructor(productData) { //Passing in data.product 
        this.name = productData.product_name
        this.ingredients = productData.ingredients 
        this.keywords = productData._keywords
        this.image = productData.image_url 
    }

    showInfo() {
        document.getElementById('productImg').src = this.image
        document.getElementById('productName').innerText = this.name
    }

    listIngredients() {
        let tableRef = document.getElementById('ingredientTable')
        for(let i=1; i <tableRef.rows.length;) {
            tableRef.deleteRow(i)
        }

        for(let key in this.ingredients) {
            let newRow = tableRef.insertRow(-1)
            let newICell = newRow.insertCell(0)
            let newVCell = newRow.insertCell(1)
            // let newVeganCell = newRow.insertCell(2)
            let newIText = document.createTextNode(this.ingredients[key].text)
            // let newVegText = document.createTextNode(this.keywords[key].text)

            let vegStatus = !(this.ingredients[key].vegetarian) ? 'unknown' : this.ingredients[key].vegetarian
            //If this line returns truthy (NOT vegetarian) return unknown, else return vegetarian.
            let newVText = document.createTextNode(vegStatus)
            newICell.appendChild(newIText)
            newVCell.appendChild(newVText)
            if (vegStatus === 'no') {
                newVCell.classList.add('non-veg-item')
            } else if (vegStatus === 'unknown' || vegStatus === 'maybe') {
                newVCell.classList.add('unknown-maybe-item')
            }

            // let veganStatus = this.keywords[key].vegan
            // let newVeganText = document.createTextNode(veganStatus)
            // newICell.appendChild(newVeganText)
            // newVeganCell.appendChild(newVegText)
        }
    }
}