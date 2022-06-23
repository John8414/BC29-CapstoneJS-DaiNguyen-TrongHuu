const services = new Services();
const productList = new ProductList();
const cartList = new CartList();
const getEle = id => document.getElementById(id);

// lấy thông tin api về
const getProductLstApi = () => {
  getEle("loader").style.display = "block";
  services
    .getProductList()
    .then((result) => {
      tempProductList(result.data);
      getEle("loader").style.display = "none";
    })
    .catch((error) => {
      console.log(error);
      getEle("loader").style.display = "none";
    });
};

const tempProductList = (data) => {
  data.forEach((ele) => {
    const id = ele.id;
    const name = ele.name;
    const price = ele.price;
    const screen = ele.screen;
    const backCamera = ele.backCamera;
    const frontCamera = ele.frontCamera;
    const img = ele.img;
    const desc = ele.desc;
    const type = ele.type;
    const phone = new Product(
      id,
      name,
      price,
      screen,
      backCamera,
      frontCamera,
      img,
      desc,
      type
    );
    productList.addProduct(phone);
    renderProducListByApi(productList.arrProductList);
  });
};

getProductLstApi();

// render thông tin api qua html
const renderProducListByApi = (data) => {
  let content = "";
  data.forEach((product) => {
    content += `
        <div class=" my-3 cart_item col-lg-3 col-md-4 col-sm-6 col-xs-12">
                    <div class="card text-center">
                        <div class="card-img">
                            <img src="./assets/img/${product.img}" class="img-fluid phoneImg" alt="${product.img}">
                            <span class="phoneId text-success"> ${product.id} </span>
            <div class="card-cart d-flex  justify-content-around">
                <button type="button" class="btn-card-detail btn btn-success" data-toggle="modal"
                    data-target="#myModal" onclick="reviewProduct(${product.id})">Preview Info</button>
                <button type="button" class="btn-card-cart btn btn-warning" onclick="addToCart(event)"
                    data-action="${product.id}">Add to Cart</button>
            </div>
        </div>
        <div class="card-body">
            <h4 class="card-title my-3 phoneName">${product.name}</h4>
            <p class="card-text my-3"> <sup class="text-warning"><i class="fa-2x fas fa-dollar-sign"></i></sup><span class="phonePrice">${product.price}</span></p>
            <p class="card-star mb-2">
                <i class="fas fa-star text-warning"></i>
                <i class="fas fa-star text-warning"></i>
                <i class="fas fa-star text-warning"></i>
                <i class="fas fa-star text-warning"></i>
                <i class="fas fa-star text-warning"></i>
            </p>
        </div>
    </div>
</div>
        `;
  });
  getEle("showUI").innerHTML = content;
};

// hiện thị khi chọn loại phone
typePhone = () => {
  const typeSelected = getEle("selectedType").value;
  const filerPhone = productList.arrProductList.filter((product) => {
    if (product.type !== typeSelected) {
      return false;
    }
    return true;
  });
  if (filerPhone.length == 0) {
    renderProducListByApi(productList.arrProductList);
  } else {
    renderProducListByApi(filerPhone);
  }
};

// hiện thị thông tin product lên modals review
const getProductApiById = (id) => {
  services
    .getProductApi(id)
    .then((result) => {
      getEle("phoneNameModals").innerHTML = result.data.name;
      getEle("phonePriceModals").innerHTML = "$" + result.data.price;
      getEle("phoneScreenModals").innerHTML = result.data.screen;
      getEle("phoneBackModals").innerHTML = result.data.backCamera;
      getEle("phoneFontModals").innerHTML = result.data.frontCamera;
      getEle("phoneDescModals").innerHTML = result.data.desc;
    })
    .catch((error) => {
      console.log(error);
    });
};

reviewProduct = (id) => {
  getProductApiById(id);
};

const setItemLocalStorage = () => {
  const stringify = JSON.stringify(cartList.arrCartList);
  localStorage.setItem("CART_LIST", stringify);
};

const getItemLocalStorage = () => {
  const stringify = localStorage.getItem("CART_LIST");
  cartList.arrCartList = stringify ? JSON.parse(stringify) : [];
};

getItemLocalStorage();

// add item vao cart list
addToCart = (event) => {
  const ele = event.target.parentElement;

  const cartItemDom = event.target.closest(".cart_item");
  const cartItemId = event.target.getAttribute("data-action");
  const cartItemImg = cartItemDom
    .querySelector(".phoneImg")
    .getAttribute("alt");
  const cartItemName = cartItemDom.querySelector(".phoneName").innerHTML;
  const cartItemPrice = cartItemDom.querySelector(".phonePrice").innerHTML;
  let cartItemQty = 1;
  const cartItem = new CartItem(
    cartItemId,
    cartItemName,
    cartItemPrice,
    cartItemImg,
    cartItemQty
  );
  cartList.addCart(cartItem);
  renderCartNum();
  setItemLocalStorage();
};

// xử lý trùng id trong storage
const mergeDuplicate = (arr) => {
  let newArr = [];
  arr.forEach((ele) => {
    let el = newArr.find((newEle) => newEle.name == ele.name);
    if (el) {
      el.qty += ele.qty;
    } else {
      newArr.push(ele);
    }
  });
  return newArr;
};

// render số lượng đc chọn
const renderCartNum = () => {
  setItemLocalStorage();
  cartList.arrCartList = mergeDuplicate(cartList.arrCartList);
  let total = 0;
  for (let i = 0; i < cartList.arrCartList.length; i++) {
    total += cartList.arrCartList[i].qty;
  }
  if (total > 0) {
    getEle("cartTotalQty").classList.remove("inactive");
    getEle("cartTotalQty").innerHTML = total;
  } else {
    getEle("cartTotalQty").classList.add("inactive");
  }
};

renderCartNum();

// render lên cart list
const renderCartList = () => {
  setItemLocalStorage();
  cartList.arrCartList = mergeDuplicate(cartList.arrCartList);
  let contentHTML = "";
  let paysum = 0;
  cartList.arrCartList.forEach((product) => {
    const price = parseInt(product.price);
    const qty = parseInt(product.qty);
    const pricesum = price * qty;
    paysum += pricesum;
    contentHTML += `
                <tr>
                    <td class="w-25">
                        <img src="./assets/img/${product.img}" class="img-fluid img-thumbnail phoneImg" alt="${product.img}">
                    </td>
                    <td class="phoneName">${product.name}</td>
                    <td>$<span class="phonePrice">${product.price}</span></td>
                    <td class="qty"><input class="phoneQty" type="number" class="form-control" min=0 value="${qty}" onchange="checkQty(event)" data-action="${product.id}"></td>
                    <td>$${pricesum}</td>
                    <td>
                        <a href="#" id="btnCloseCartListITem" class="btn btn-danger btn-sm" onclick="removeItem('${product.id}')">
                            <i class="fa fa-times"></i>
                        </a>
                    </td>
                </tr>
            `;
  });
  paysum = "$" + paysum;
  getEle("paysum").innerHTML = paysum;
  checkCartListEmpty();
  getEle("tbodyInCart").innerHTML = contentHTML;
};

getEle("showCart").addEventListener("click", () => {
  renderCartList();
});

// kiểm tra cart list trống
const checkCartListEmpty = () => {
  if (cartList.arrCartList == 0) {
    getEle("btnCheckOut").disabled = true;
    getEle("titleCartList").innerHTML =
      "Looks like you haven't selected your favorites yet";
  } else {
    getEle("btnCheckOut").disabled = false;
    getEle("titleCartList").innerHTML = "Your shopping cart";
  }
};

// lấy giá trị tạo obj cartItem
const getFormValue = (event) => {
  const cartItemDom = event.target.closest("tr");
  const cartItemId = event.target.getAttribute("data-action");
  const cartItemImg = cartItemDom.querySelector(".phoneImg").getAttribute("alt");
  const cartItemName = cartItemDom.querySelector(".phoneName").innerHTML;
  const cartItemPrice = cartItemDom.querySelector(".phonePrice").innerHTML;
  const cartItemQty = cartItemDom.querySelector(".phoneQty").value * 1;
  return (item = new CartItem(
    cartItemId,
    cartItemName,
    cartItemPrice,
    cartItemImg,
    cartItemQty
  ));
};

// Xoá item trong cart list
removeItem = (id) => {
  cartList.deleteItem(id);
  if (cartList.arrCartList.length == 0) {
    getEle("closeCartList").click();
    getEle("cartTotalQty").classList.add("inactive");
    location.reload();
  }
  renderCartList();
  renderCartNum();
};

// xử lý thay đổi số lượng trong cart list
checkQty = (event) => {
  const cartItemDom = event.target.closest("tr");
  const cartItemQty = cartItemDom.querySelector(".phoneQty").value * 1;
  const cartItem = getFormValue(event);
  cartList.updateItem(cartItem);
  renderCartList();
  renderCartNum();
};
checkOut = () => {
  getEle("closeCartList").click();
  let contentHTML = "";
  let paysum = 0;
  cartList.arrCartList.forEach((ele) => {
    const price = parseInt(ele.price);
    const qty = parseInt(ele.qty);
    const pricesum = price * qty;
    paysum += pricesum;
    contentHTML += `
        <tr class="text-success">
            <td>${ele.name}</td>
            <td>${ele.qty}</td>
            <td>$${pricesum}</td>
        </tr>
        `;
  });
  paysum = "$" + paysum;
  getEle("paysumPurchase").innerHTML = paysum;
  getEle("contentPurchase").innerHTML = contentHTML;
};

// purchase cart list
purChase = () => {
  getEle("closeCheckOut").click();
  let orderNum = Math.floor(Math.random() * 1001);
  const orderNumContent = "Your order number: #" + orderNum;
  getEle("orderNum").innerHTML = orderNumContent;
};

confirmOrder = () => {
  cartList.arrCartList = [];
  localStorage.removeItem("CART_LIST");
  getEle("closeContinueShopping").click();
  getEle("cartTotalQty").classList.add("inactive");
  location.reload();
};
