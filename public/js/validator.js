let validator = (function() {

    let errMsg = function(msg) {
        toastr.error(msg);
        throw new Error(msg);
    };

    let err = {
        username: "Username must be between 2 and 20 symbols long",
        password: "Password must be between 6 and 40 symbols long",
        emptyTitle: "Title cannot be empty",
        emptyContent: "Content cannot be empty",
        emptyCategory: "Category cannot be empty",
        emptyDescription: "Description cannot be empty",
        productPrice: "Price must be a number bigger than 0",
        userAuth: "You must be logged in to do that"
    };

    let user = function(userData) {
        let invalidUsername = userData.username.length < 2 || userData.username.length > 20;
        let invalidPassword = userData.password.length < 6 || userData.password.length > 40;
        if (invalidUsername) {
            errMsg(err.username);
        }
        if (invalidPassword) {
            errMsg(err.password);
        }
    };

    let msg = function(msgData) {
        let invalidTitle = msgData.title === "";
        let invalidContent = msgData.content === "";
        if (invalidTitle) {
            errMsg(err.emptyTitle);
        }
        if (invalidContent) {
            errMsg(err.emptyContent);
        }
    };

    let product = function(productData) {
        let invalidTitle = productData.title === "";
        let invalidCategory = productData.category === "";
        let invalidDescription = productData.description === "";
        let invalidPrice = productData.price === "" || +productData.price <= 0;
        if (invalidTitle) {
            errMsg(err.emptyTitle);
        }
        if (invalidCategory) {
            errMsg(err.emptyCategory);
        }
        if (invalidDescription) {
            errMsg(err.emptyDescription);
        }
        if (invalidPrice) {
            errMsg(err.productPrice);
        }
    };

    let auth = function() {
        if (!localStorage.getItem("LOGIN_AUTHKEY")) {
            errMsg(err.userAuth);
        }
    };

    return {
        user,
        msg,
        product,
        auth
    }   
}());