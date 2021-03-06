import toastr from "toastr";
import "jquery-ui";
import {templates} from "templates";
import {parseQuery} from "parse-query";
import {data} from "data";
import {validator} from "validator";

var productsController = (function() {

  class ProductsController {
    all(context) {
      var products;
      let categoryFilter = parseQuery(document.location.href).category;

      data.products.get()
        .then(function(res) {
          if (categoryFilter) {
            categoryFilter = decodeURIComponent(categoryFilter);
            res.products = res.products.filter(x => x.category === categoryFilter);
          }
          products = res;
          return templates.get('products');
        })
        .then(function(template) {
          context.$element().html(template(products));

          $(".btn-add-to-cart").on("click", function() {
            let $that = $(this);
            let id = $that.attr("data-product-id");
            if (!localStorage.SHOPPING_CART) {
              localStorage.setItem("SHOPPING_CART", id);
              toastr.success("Added product to cart!");
            } else if (localStorage.SHOPPING_CART && localStorage.SHOPPING_CART.search(id) < 0) {
              localStorage.SHOPPING_CART += "," + id;
              toastr.success("Added product to cart!");
            } else {
              toastr.error("This product is added to your cart already!");
              return;
            }
          });

          $("#accordion").accordion({
            collapsible: true,
            active: false
          });
        });
    }

    add(context) {
      validator.auth();

      let categories;

      data.products.getCategories()
        .then(function(response) {
          categories = response;
          return templates.get('product-add');
        })
        .then(function(template) {
          context.$element().html(template());

          $("#tb-product-category").autocomplete({
            source: categories,
            delay: 10,
            minLength: 0
          }).focus(function() {
            $(this).autocomplete("search");
          });

          $('#btn-product-add').on('click', function() {

            var product = {
              title: $('#tb-product-title').val(),
              description: $('#tb-product-description').val(),
              category: $('#tb-product-category').val(),
              price: Number($('#tb-product-price').val())
            };

            data.products.add(product)
              .then(function(product) {
                window.history.back();
                toastr.success(`Product successfully added!`);
              }, function(error) {
                toastr.error(error.responseText);
              });
          });
        });
    }

    manage(context) {
      let products;
      let categoryFilter = parseQuery(document.location.href).category;

      validator.auth();
      data.products.getForCurrentUser()
        .then(function(response) {
          if (categoryFilter) {
            categoryFilter = decodeURIComponent(categoryFilter);
            response.products = response.products.filter(x => x.category === categoryFilter);
          }
          products = response;
          return templates.get("products-manage");
        })
        .then(function(template) {
          context.$element().html(template(products));

          $("#accordion").accordion({
            collapsible: true,
            active: false
          });
        });
    };

    edit(context) {
      let productId = parseQuery(document.location.href).productid;
      let product;
      let categories;

      data.products.getCategories()
        .then(function(response) {
          categories = response;
          return data.products.getByIds(productId);
        })
        .then(function(response) {
          product = response.products[0];
          return templates.get("product-edit");
        })
        .then(function(template) {
          context.$element().html(template(product));

          $("#tb-product-category").autocomplete({
            source: categories,
            delay: 10,
            minLength: 0
          }).focus(function() {
            $(this).autocomplete("search");
          });

          $("#btn-product-edit").on("click", function() {
            let productData = {
              title: $('#tb-product-title').val(),
              description: $('#tb-product-description').val(),
              category: $('#tb-product-category').val(),
              price: Number($('#tb-product-price').val()),
              productId: productId
            };

            data.products.edit(productData)
              .then(function(response) {
                context.redirect("#/products/manage");
                toastr.success("Product edited successfuly");
              }, function(error) {
                toastr.error(error.responseText);
              });
          });
        });
    }

    delete(context) {
      templates.get("product-delete")
        .then(function(template) {
          context.$element().html(template());

          $("#btn-delete-confirm").on("click", function(e) {
            let productId = parseQuery(document.location.href).productid;
            data.products.delete(productId)
              .then(function(response) {
                context.redirect("#/products/manage");
                toastr.success("Product deleted successfuly!");
              }, function(error) {
                toastr.error(error.responseText);
              });
          });

          $("#btn-delete-decline").on("click", function() {
            document.location.hash = "#/products/manage";
          });
        });
    };
  }
  

  return new ProductsController();
}());

export {productsController};