let label = document.getElementById("label");
let ShoppingCart = document.getElementById("shopping-cart");

let basket = JSON.parse(localStorage.getItem("data")) || [];

let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x,y) => x + y, 0);
    
};

calculation();

let generateCartItems = () => {
    if(basket.length !== 0){
        return (ShoppingCart.innerHTML = basket
        .map((x) => {
            let { id, item } = x;
            let search = groceryItemsData.find((y) => y.id === id) || [];
            let { img, name, price } = search;
            return `
            <div class="cart-item">
                <img width="200" src=${img} alt="" />
                <div class="details"> 
                    <div class="title-price-x">
                        <h4 class="title-price">
                            <p>${name}</p>
                            <p class="cart-item-price">$ ${price}</p>
                        </h4>
                        <i onclick="removeItem(${id})" class="bi bi-x-circle"></i>
                    </div>
                    <div class="buttons">
                        <p>Qty:</p>
                        <i onclick="decrement(${id})" class="bi bi-dash-square"></i>
                        <div id=${id} class="quantity">${item}</div>
                        <i onclick="increment(${id})" class="bi bi-plus-square"></i> 
                    </div>
                    <h3>Total: $ ${item * search.price}</h3>
                </div>
            </div>
            
            </div>
            `
        })
        .join(""));
    } else {
        hideCheckout();
        ShoppingCart.innerHTML = ``;
        label.innerHTML = `
        <h2>Cart Empty</h2>
        <a href="index.html">
            <button class="HomeBtn">Back to Home</button>
        </a>
        `;
    }
};

generateCartItems();

let increment = (id) => {
    let selectedItem = id;
    let search = basket.find((x)=> x.id === selectedItem.id);

    if(search === undefined) {
        basket.push ({
            id: selectedItem.id,
            item: 1
        });
    }
    else {
        search.item += 1;
    }

    generateCartItems();
    update(selectedItem.id);
    localStorage.setItem("data", JSON.stringify(basket));

};

let decrement = (id) => {
    let selectedItem = id;
    let search = basket.find((x)=> x.id === selectedItem.id);

    if (search === undefined) return;
    else if (search.item === 0) return; 
    else {
        search.item -= 1;
    }

    update(selectedItem.id);
    basket = basket.filter((x) => x.item !== 0);
    generateCartItems();
    localStorage.setItem("data", JSON.stringify(basket));
};

let update = (id) => {
    let search  = basket.find((x) => x.id === id);
    //console.log(search.item);
    document.getElementById(id).innerHTML = search.item;
    calculation();
    TotalAmount();
};

let removeItem = (id) => {
    let selectedItem = id;
    basket = basket.filter((x) => x.id !== selectedItem.id);
    generateCartItems();
    TotalAmount();
    calculation();
    localStorage.setItem("data", JSON.stringify(basket));
}

let clearCart = () => {
    basket = [];
    generateCartItems();
    calculation();
    localStorage.setItem("data", JSON.stringify(basket));

    
}



let TotalAmount = () => {
    if (basket.length !== 0){
        let amount = basket
        .map((x) => {
            let { item, id } = x; 
            let search = groceryItemsData.find((y) => y.id === id) || [];
            return item * search.price;
        })
        .reduce((x, y) => x + y, 0);
        label.innerHTML = `
        <h2>Total Bill: $ ${amount}</h2>
        <form action="final.html">
        <button class="checkout">Checkout</button>
        <button onclick="clearCart()" class="removeAll">Clear Cart</button>
        </form>
        
        `;
    } else return; 
};

function hideCheckout() {
    var checkout = document.getElementById("checkoutForm");
    display = 0;

    if (display == 1) {
      checkout.style.display = 'block';
      display = 0;
    }
    else {
        checkout.style.display = 'none';
        display = 1;
    }
  };

TotalAmount();