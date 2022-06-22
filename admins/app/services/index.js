class Services {
    getProductList = () => axios
        ({
            url: "https://628b99597886bbbb37bbca02.mockapi.io/api/capStoneProJects",
            method: "GET"
        });

    deleteProduct = (id) => axios
        ({
            url: `https://628b99597886bbbb37bbca02.mockapi.io/api/capStoneProJects/${id}`,
            method: "DELETE"
        });


    addProductApi = (product) => axios
        ({
            url: "https://628b99597886bbbb37bbca02.mockapi.io/api/capStoneProJects",
            method: "POST",
            data: product
        })

    getProductById = (id) => axios
        ({
            url: `https://628b99597886bbbb37bbca02.mockapi.io/api/capStoneProJects/${id}`,
            method: "GET"
        })

    editProductApi = (product) => axios
        ({
            url: `https://628b99597886bbbb37bbca02.mockapi.io/api/capStoneProJects/${product.id}`,
            method: "PUT",
            data: product
        })
}