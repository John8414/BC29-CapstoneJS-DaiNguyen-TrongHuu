const services = new Services();
const productList = new ProductList();
const valid = new Validation();
const getEle = (id) => document.getElementById(id);

// lấy thông tin api về
const getProductLstApi = () => {
    getEle("loader").style.display = "block";
    services
        .getProductList()
        .then((result) => {
            renderProducListByApi(result.data);
            getEle("loader").style.display = "none"
        })
        .catch((error) => {
            console.log(error);
            getEle("loader").style.display = "none"
        })
}

getProductLstApi();

// render thông tin api qua html
const renderProducListByApi = (data) => {
    let content = "";
    data.forEach((product, index) => {
        content += `
        <tr>
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td><img src="./../../assets/img/${product.img}" style="width:50px; height:50px"  alt=""></td>
            <td>${product.desc}</td>
            <td>
                <button class="btn btn-primary" data-toggle="modal" data-target="#myModal" onclick = "getProduct(${product.id})">Sửa</button>
                <button class="btn btn-danger" onclick= "deleteProduct(${product.id})">Xoá</button>
            </td>
        </tr>
        `;
    })
    getEle("tblDanhSachSanPham").innerHTML = content;
}

// Xoá sp
deleteProduct = (id) => {
    services
        .deleteProduct(id)
        .then((result) => {
            getProductLstApi();
        })
        .catch((error) => {
            console.log(error);
        })
}

// Thêm sp 
getEle("btnThemSP").onclick = () => {
    resetValue();
    document.getElementsByClassName("modal-title")[0].innerHTML = "Thêm mới sản phẩm";
    var btnThem = '<button class="btn btn-success" onclick="addProduct()">Thêm</button>';
    document.getElementsByClassName("modal-footer")[0].innerHTML = btnThem;
}

const getProductFormValue = (isEdit, id) => {
    let result;
    let idSP = isEdit ? id : "";
    const tenSP = getEle("tenSP").value;
    const donGia = getEle("donGia").value;
    const manHinh = getEle("manHinh").value;
    const cameraT = getEle("cameraT").value;
    const cameraS = getEle("cameraS").value;
    const hinhAnh = getEle("hAnh").value;
    const mota = getEle("moTa").value;
    const loaiSP = getEle("loaiSP").value;
    const product = new Product(idSP, tenSP, donGia, manHinh, cameraS, cameraT, hinhAnh, mota, loaiSP);
    // valiadtion
    let isValid = true;
    // kiểm tra tên sản phẩm không được trống
    isValid &= valid.kiemTraRong(tenSP, "tenError", "(*) Vui lòng nhập tên sản phẩm");
    // kiểm tra đơn giá không được trống và > 0
    isValid &= valid.kiemTraRong(donGia, "donGiaError", "(*) Vui lòng nhập đơn giá") &&
        valid.kiemTraSoDuong(donGia, "donGiaError", "(*) Đơn giá phải lớn hơn 0");
    // kiểm tra màn hình không được trống
    isValid &= valid.kiemTraRong(manHinh, "manHinhError", "(*) Vui lòng nhập thông tin màn hình");
    // kiểm tra camera trước không được trống
    isValid &= valid.kiemTraRong(cameraT, "cameraTError", "(*) Vui lòng nhập thông tin camera trước");
    // kiểm tra camera sau không được trống
    isValid &= valid.kiemTraRong(cameraS, "cameraSError", "(*) Vui lòng nhập thông tin camera sau");
    // kiểm tra hình ảnh  không được trống
    isValid &= valid.kiemTraRong(hinhAnh, "hAnhError", "(*) Vui lòng nhập tên ảnh ");
    // kiểm tra mô tả không được trống
    isValid &= valid.kiemTraRong(mota, "moTaError", "(*) Vui lòng nhập mô tả sản phẩm");
    // kiểm tra loại sản phẩm phải đc chọn
    isValid &= valid.kiemTraSelect("loaiSP", "loaSPError", "(*) Vui lòng chọn loại sản phẩm");
    return result = isValid == false ? null : product
}

addProduct = () => {
    const product = getProductFormValue(false, "");
    if (product == null) {
        return;
    }
    services
        .addProductApi(product)
        .then((result) => {
            getProductLstApi();
            document.getElementsByClassName("close")[0].click();
        })
        .catch((error) => {
            console.log(error);
        });
    resetValue();
}


function resetValue() {
    getEle("tenSP").value = "";
    getEle("donGia").value = "";
    getEle("manHinh").value = "";
    getEle("cameraT").value = "";
    getEle("cameraS").value = "";
    getEle("hAnh").value = "";
    getEle("moTa").value = "";
    getEle("loaiSP").selectedIndex = 0;
    getEle("tenError").innerHTML = "";
    getEle("donGiaError").innerHTML = "";
    getEle("manHinhError").innerHTML = "";
    getEle("cameraTError").innerHTML = "";
    getEle("cameraSError").innerHTML = "";
    getEle("hAnhError").innerHTML = "";
    getEle("loaSPError").innerHTML = "";
    getEle("moTaError").innerHTML = "";
}

getProduct = (id) => {
    services
        .getProductById(id)
        .then((result) => {
            var product = result.data;
            getEle("tenSP").value = product.name;
            getEle("donGia").value = product.price;
            getEle("manHinh").value = product.screen;
            getEle("cameraT").value = product.frontCamera;
            getEle("cameraS").value = product.backCamera;
            getEle("hAnh").value = product.img;
            getEle("moTa").value = product.desc;
            getEle("loaiSP").value = product.type;
            var btnUpdate = `<button class="btn btn-success" onclick="editProduct(${product.id})">Sửa</button>`;
            document.getElementsByClassName("modal-footer")[0].innerHTML = btnUpdate;
        })
        .catch((error) => {
            console.log(error);
        });
}

editProduct = (id) => {
    const product = getProductFormValue(true, id);
    if (product == null) {
        return;
    }
    services
        .editProductApi(product)
        .then((result) => {
            getProductLstApi();
            document.getElementsByClassName("close")[0].click();
        })
        .catch((error) => {
            console.log(error);
        });
    resetValue();
}