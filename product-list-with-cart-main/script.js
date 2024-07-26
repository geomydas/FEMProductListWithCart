const fragment = document.createDocumentFragment()

class Cart {
  constructor(id, title, price, quantity) {
    this.id = id
    this.title = title
    this.price = price
    this.quantity = quantity
  }
}

class UI {
  constructor() {
    this.cartContainerEl = document.querySelector('.hero_list')
    this.cartItems = document.querySelector('.cart__items')
  }

  init() {
    this.events()

    document.addEventListener('DOMContentLoaded', UI.displayCart)
  }

  events() {
    // addtocart event
    this.cartContainerEl.addEventListener('click', (e) => {
      if (e.target.classList.contains('hero_button-addtocart')) {
        this.addToCart(e.target.parentElement)
      }
    })

    let itemId
    // removeCart event
    this.cartItems.addEventListener('click', (e) => {
      if (e.target.id === 'removeCart') {
        this.cartItems.removeChild(e.target.parentElement)
        itemId = Number(e.target.parentElement.dataset.item)
        this.removeItemCart(itemId)
      }

      if (e.target.id === 'removeCartIcon') {
        this.cartItems.removeChild(e.target.parentElement.parentElement)
        itemId = Number(e.target.parentElement.parentElement.dataset.item)
        this.removeItemCart(itemId)
      }
    })
  }

  addToCart(item) {
    const itemInfo = {
      id: Number(item.dataset.item),
      title: item.querySelector('.hero_subheader-name').textContent,
      price: Number(
        item.querySelector('.hero_paragraph-price').textContent.slice(1)
      ),
      quantity: 1,
    }

    const cartItems = storage.getCartItems()
    const cartItemIs = cartItems.findIndex((item) => item.id === itemInfo.id)

    if (cartItemIs > -1) {
      cartItems[cartItemIs].quantity += 1
      storage.updateQuantity(cartItems)
    } else {
      const cartItem = new Cart(
        itemInfo.id,
        itemInfo.title,
        itemInfo.price,
        itemInfo.quantity
      )
      storage.addCartStorage(cartItem)
    }

    UI.displayCart()
  }

  removeItemCart(id) {
    const cartItemsDB = storage.getCartItems()

    const filteredCartItems = cartItemsDB.filter((item) => item.id !== id)

    localStorage.setItem('cart', JSON.stringify(filteredCartItems))

    UI.displayCart()
    UI.diplayTotalOrders()

    // if (filteredCartItems.length <= 0) {
    //   UI.displayCart()
    // }
  }

  static displayCart() {
    UI.diplayTotalOrders()
    const cartItemsDB = storage.getCartItems()
    const cartItems = document.querySelector('.cart__items')
    const cartTotalPay = document.getElementById('cartTotalPay')
    const cartCheckOut = document.querySelector('.cart__checkout')

    let totalPay
    if (cartItemsDB.length > 0) {
      cartItems.innerHTML = ''
      cartItemsDB.map((item) => {
        cartItems.innerHTML += `
            <div class="cart__item" data-item=${item.id}>
            <div class="cart__info">
              <p class="cart__title">${item.title}</p>
              <div>
                <span class="cart__quantity">${item.quantity}x</span>
                <span class="cart__price">@ $${item.price}</span>
                <span class="cartItem__total">$${
                  item.price * item.quantity
                }</span>
              </div>
            </div>
            <a href="#" class="cart__remove" id="removeCart">
              <img id="removeCartIcon" src="/images/icon-remove-item.svg" alt="Remove Icon" />
            </a>
          </div>
        `
      })

      // calculate total order pay
      totalPay = cartItemsDB.reduce(
        (acc, curr) => acc + curr.price * curr.quantity,
        0
      )

      cartTotalPay.textContent = totalPay ? '$' + totalPay : 0

      cartCheckOut.style.display = 'flex'
    } else {
      cartItems.innerHTML = `
       <img
            src="images/illustration-empty-cart.svg"
            alt=""
            class="cart_img-empty"
          />
          <p class="cart_paragraph-empty">Your added items will appear here</p>
      `
      cartCheckOut.style.display = 'none'
    }
  }

  static diplayTotalOrders() {
    const cartItemsDB = storage.getCartItems()
    const totalQuantity = document.getElementById('totalQuantity')

    if (cartItemsDB.length > 0) {
      // calculate total quantity
      let quantity = cartItemsDB.reduce((acc, curr) => acc + curr.quantity, 0)

      totalQuantity.textContent = `(${quantity})`
    } else {
      totalQuantity.textContent = '( )'
    }
  }
}

class Storage {
  getCartItems() {
    let cart
    if (localStorage.getItem('cart') === null) {
      cart = []
    } else {
      cart = JSON.parse(localStorage.getItem('cart'))
    }
    return cart
  }

  addCartStorage(items) {
    let carts = this.getCartItems()
    carts.push(items)
    localStorage.setItem('cart', JSON.stringify(carts))
  }

  updateQuantity(item) {
    localStorage.setItem('cart', JSON.stringify(item))
  }
}

const UIDisplay = new UI()
const storage = new Storage()

UIDisplay.init()
