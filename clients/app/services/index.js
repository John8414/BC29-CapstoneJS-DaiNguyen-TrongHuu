class Services {
    getProductList = () => axios
        ({
            url: "https://628b99597886bbbb37bbca02.mockapi.io/api/capStoneProJects",
            method: "GET"
        });

    getProductApi = (id) => axios
        ({
            url: `https://628b99597886bbbb37bbca02.mockapi.io/api/capStoneProJects/${id}`,
            method: "GET"
        });

}
