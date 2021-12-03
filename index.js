const db = new Dexie ('myShoppingApp')
db.version(1).stores( {items: '++id, name, price, isPurchased'} )

const itemForm = document.getElementById('itemForm')
const itemsDiv = document.getElementById('itemsDiv')
const totalPriceDiv = document.getElementById('totalPriceDiv')

const populateItemsDiv = async() => {
    const allItems = await db.items.reverse().toArray()

    itemsDiv.innerHTML = allItems.map(item => `

        <div class= "item ${item.isPurchased && 'purchased'}" >
            <label>
                <input 
                type="checkbox" 
                class="checkbox" 
                onchange = "toggleItemStatus(event, ${item.id})"
                ${item.isPurchased && 'checked'}>
            </label>
        
            <div class="itemInfo">
                <p class="item-name">${item.name}</p>
                <p>#${item.price} x ${item.quantity}</p>
            </div>

            <button class="editButton" onclick="toggleItemEdit(${item.id})">
                Edit <i class="far fa-edit" style="font-size: 24px"></i>
            </button>
        
            <button class="deleteButton" onclick="removeItem(${item.id})">
            X
            </button>

        </div>
    `).join (seperator = ' ')



    const arrayOfPrices = allItems.map (item => item.price * item.quantity)
    const totalPrice = arrayOfPrices.reduce((a, b) => a + b, 0)



    totalPriceDiv.innerText = 'Total Price: #' + totalPrice
}

window.onload = populateItemsDiv

itemForm.onsubmit = async(event) => {
    event.preventDefault()

    const name = document.getElementById('nameInput').value
    const quantity = document.getElementById('quantityInput').value
    const price = document.getElementById('priceInput').value
    const itemFormMode = document.getElementById("itemFormMode").value
    const currentEditingItem = Number(document.getElementById("currentEditingItem").value)



    if (itemFormMode == 'edit') {
        await db.items.update(currentEditingItem, { name: name, quantity: quantity, price: price})
        document.getElementById("addItemButton").innerText = "Add Item"
        document.getElementById("itemFormMode").value = "create"
    } else {
        await db.items.add({name, quantity, price})
    }

    await populateItemsDiv()
    itemForm.reset()
}

const toggleItemEdit = async(id) => {
    const itemData = await db.items.get(id)
    document.getElementById("nameInput").value = itemData.name
    document.getElementById("quantityInput").value = itemData.quantity
    document.getElementById("priceInput").value = itemData.price
    document.getElementById("currentEditingItem").value = itemData.id
    document.getElementById("itemFormMode").value = "edit"
    document.getElementById("addItemButton").innerText = "Update Item"
}


const toggleItemStatus = async(event, id) => {
    await db.items.update(id, {isPurchased: !!event.target.checked})
    await populateItemsDiv()
}

const removeItem = async(id) => {
    await db.items.delete(id)
    await populateItemsDiv()
}

const clearAll = async() => {
    // items = document.getElementById("itemsDiv")
    await db.items.clear()
    itemsDiv.innerHTML = ''
    totalPriceDiv.innerText = 'Total Price: #0'
}

