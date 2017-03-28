var fileName = "books.json";	//json file that store the products information
var books = [];		//book array
var prdNoEachRequest = 5;	//number of products loaded each request
var bookShelf = new BookShelf(); //book shelf in products page
var shoppingCart = new Cart([]); //shopping cart object
shoppingCart.fillNode();
var store;			//persist store object that stores the shopping cart object
var featureIndex = 0;	//the index of the last book in json file that is loaded to the featured item section 
var dealIndex = 0;		//the index of the last book in json file that is loaded to the deal of the day section


$(document).ready(function(){
	"use strict";
	store = new Persist.Store('My Application');
	
	showCart();
	//initialize popover elements
	$('[data-toggle="popover"]').popover(); 
	
	$("#BTNAGREE").click(function(){
		$("#CHECKAGREE").prop("checked", true);	
	});
	
	//form validation
		//name field
		$("#NAME").on("keyup blur change",
			function(){
				var result = $(this).val();
				var reg1 = /[a-zA-Z]{5,}/;	//test if value contains at least 5 letters
				var reg2 = /[^a-zA-Z]/;		//test if non-letters are in the value
				if(!reg1.test(result) || reg2.test(result)){
					//if input fails the test, show error glyphicon
					$("#NAME_ICON").removeClass("glyphicon-ok")
							.addClass("glyphicon-remove").css({"display":"inline"});
					$(this).parent().removeClass("has-success").addClass("has-error");
				}
				else{
					//if input success, show success glyphicon
					$("#NAME_ICON").removeClass("glyphicon-remove")
							.addClass("glyphicon-ok").css({"display":"inline"});
					$(this).parent().removeClass("has-error").addClass("has-success");
				}
			}
		);
		
		//surname field
		$("#SURNAME").on("keyup blur change",
			function(){
				var result = $(this).val();
				var reg1 = /[a-zA-Z]{8,}/;	//test if value contains at least 8 letters
				var reg2 = /[^a-zA-Z]/;		//test if non-letters are in the value
				if(!reg1.test(result) || reg2.test(result)){
					//if input fails the test, show error glyphicon
					$("#SURNAME_ICON").removeClass("glyphicon-ok")
							.addClass("glyphicon-remove").css({"display":"inline"});
					$(this).parent().removeClass("has-success").addClass("has-error");
				}
				else{
					//if input success, show success glyphicon
					$("#SURNAME_ICON").removeClass("glyphicon-remove")
							.addClass("glyphicon-ok").css({"display":"inline"});
					$(this).parent().removeClass("has-error").addClass("has-success");
				}
			}
		);
		
		//email address field
		$("#EMAIL").on("keyup blur change",
			function(){
				var result = $(this).val();
				var reg1 = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;	//email address pattern
				if(!reg1.test(result) ){
					//if input fails the test, show error glyphicon
					$("#EMAIL_ICON").removeClass("glyphicon-ok")
							.addClass("glyphicon-remove").css({"display":"inline"});
					$(this).parent().removeClass("has-success").addClass("has-error");
				}
				else{
					//if input success, show success glyphicon
					$("#EMAIL_ICON").removeClass("glyphicon-remove")
							.addClass("glyphicon-ok").css({"display":"inline"});
					$(this).parent().removeClass("has-error").addClass("has-success");
				}
			}
		);
		
		//date of birth field
		$("#DATEOFBIRTH").on("keyup blur change", 
			function(){
				if($(this).val() === ""){
					$("#DATEOFBIRTH_ICON").removeClass("glyphicon-ok")
							.addClass("glyphicon-remove").css({"display":"inline"});
					$(this).parent().removeClass("has-success").addClass("has-error");
				}
				else{
					$("#DATEOFBIRTH_ICON").removeClass("glyphicon-remove")
							.addClass("glyphicon-ok").css({"display":"inline"});
					$(this).parent().removeClass("has-error").addClass("has-success");
				}
			}
		);
		
		//submit button
		$("#SUBMIT").click(
			function(){
				var validation = true;
				if(!$("#NAME_ICON").hasClass("glyphicon-ok")){
					$("#NAME_HINT").html("You must enter valid  name.");
					validation = false;
				}else{
					$("#NAME_HINT").html("");
				}
				
				if(!$("#SURNAME_ICON").hasClass("glyphicon-ok")){
					$("#SURNAME_HINT").html("You must enter valid  surname.");
					validation = false;
				}else{
					$("#SURNAME_HINT").html("");
				}
				
				if(!$("#EMAIL_ICON").hasClass("glyphicon-ok")){
					$("#EMAIL_HINT").html("You must enter valid email address");
					validation = false;
				}else{
					$("#EMAIL_HINT").html("");
				}
				
				if(!$("#CHECKAGREE").prop("checked")){
					$("#CHECKAGREE_HINT").html("You must agree with term of service");
					validation = false;
				}else{
					$("#CHECKAGREE_HINT").html("");
				}
				
				if($("#DATEOFBIRTH").val() === ""){
					$("#DATEOFBIRTH_HINT").html("Please enter your date of birth ");
					validation = false;
				}else{
					$("#DATEOFBIRTH_HINT").html("");
				}
				
				if($("#MALE").prop("checked") === false && $("#FEMALE").prop("checked") === false){
					$("#GENDER_HINT").html("Please select your gender");
				}else{
					$("#GENDER_HINT").html("");
				}
				
				if(validation === true){
					/*
						send input information
						server side application
					*/
					alert("Form has been submitted successfully!");
					resetForm();
				}
			}
		);
		
		//reset button
		$("#RESET").click(
			function(){
				resetForm();
			}
		);
		
		//end of form validation
		
});
//end of document ready function

//clear and reset user input form in membership signup
function resetForm(){
	"use strict";
	//clear all the hints
	$("#NAME_HINT").html("");
	$("#SURNAME_HINT").html("");
	$("#EMAIL_HINT").html("");
	$("#CHECKAGREE_HINT").html("");
	$("#DATEOFBIRTH_HINT").html("");
	$("#GENDER_HINT").html("");
	
	//uncheck checkbox and radio button
	$("#CHECKAGREE").prop("checked", false);
	$("#MALE").prop("checked", false);
	$("#FEMALE").prop("checked", false);
	//remove all glyphicons
	$("#NAME_ICON").removeClass("glyphicon-ok glyphicon-remove");
	$("#SURNAME_ICON").removeClass("glyphicon-ok glyphicon-remove");
	$("#EMAIL_ICON").removeClass("glyphicon-ok glyphicon-remove");
	$("#DATEOFBIRTH_ICON").removeClass("glyphicon-ok glyphicon-remove");
	//clear texts and border effects
	$("#NAME").val("").parent().removeClass("has-success has-error");
	$("#SURNAME").val("").parent().removeClass("has-success has-error");
	$("#EMAIL").val("").parent().removeClass("has-success has-error");
	$("#DATEOFBIRTH").val("").parent().removeClass("has-success has-error");
}

//get products information from server
//@param string paramCategory: category name
//@param bool isRefresh: true if load new category, false if load more under current category
function loadProducts(paramCategory, isRefresh){
	"use strict";
	$.getJSON(fileName, function(data, status){
		if(status === "success"){
			
			//if load a new category, then clear the current bookshelf
			if(isRefresh){
				books.length = 0;
				bookShelf = new BookShelf();
			}
			var count = 0;
			//iterate each item in json file
			$.each(data.books, function(index, value){
				//only load the selected category
				if(paramCategory === "all" || value.category === paramCategory){	
					if(index >= books.length){	
						var book = new Book(value);	
						books.push(book);
						bookShelf.addBook(book);
						if(++count === prdNoEachRequest){
							//load 6 items then break out of the each loop
							return false;	
						}
					}
					
				}
			});
			if(isRefresh){
				$("#BOOKSHELF").fadeOut(500, function(){
					$(this).empty().append(bookShelf.nodeElement).fadeIn();
				});
			}
			else{
				
				$(bookShelf.nodeElement).css("display", "none");
				$("#BOOKSHELF").append(bookShelf.nodeElement);
				$(bookShelf.nodeElement).css("display", "block").hide().slideDown();
			}
			//if there are more books than those being displayed, then show the button show more
			if(paramCategory === "all" && books.length < data.books.length){
				$("#BTN_SHOWMORE").css("display", "block");	
			}
			else{
				$("#BTN_SHOWMORE").css("display", "none");	
			}
			
		}
		else{
			//error in getJSON 
			alert("fail to load products");
		}
		
	});
}

//load featured items
function loadFeature(){
	"use strict";
	$.getJSON(fileName, function(data, status){
		if(status === "success"){
			var bookshelf = new BookShelf();
			var count = 0;
			var lastBookId;
			
			while(count < 5){
				$.each(data.books, function(index, value){
					lastBookId = value.id;
					if(value.popularity === "high" && value.id > featureIndex){
						
						var book = new Book(value);
						if(findBook(value.id) === -1){
							books.push(book);
						}
						bookshelf.addBook(book);
						if(++count === 5){
								//load 5 items then break out of the each loop
								
								return false;
						}
					}
					
				});
				featureIndex = lastBookId;
				if(featureIndex === 20){
					featureIndex = 0;	
				}
			}
			

			$("#FEATURED").fadeOut(500, function(){
				$(this).empty().append(bookshelf.nodeElement).fadeIn();
			});
			
		}
		else{
			alert("fail to load products");	
		}
	});
}

//load deal of the day items
function loadDeal(){
	"use strict";
	$.getJSON(fileName, function(data, status){
		if(status === "success"){
			var bookshelf = new BookShelf();
			var count = 0;
			var lastBookId;
			while(count < 5){
				$.each(data.books, function(index, value){
					lastBookId = value.id;
					if(value.onsale === "yes" && value.id > dealIndex){
						
						var book = new Book(value);
						if(findBook(value.id) === -1){
							books.push(book);
						}
						bookshelf.addBook(book);
						if(++count === 5){
								//load 5 items then break out of the each loop
								
								return false;
						}
					}
					
				});
				dealIndex = lastBookId;
				if(dealIndex === 20){
					dealIndex = 0;	
				}
			}
			$("#DEAL").fadeOut(500, function(){
				$(this).empty().append(bookshelf.nodeElement).fadeIn();
			});
			
		}
		else{
			alert("fail to load products");	
		}
	});
}

//add a book with given id to shopping cart 
function addToCart(bookId){
	"use strict";
	var paramBook;
	//find the selected book object from books array according to book id
	$.each(books, function(i, book){
		if(book.id === bookId){
			paramBook = book;
		}
	});
	
	//push the book into shopping cart
	shoppingCart.pushBook(paramBook);
	
	shoppingCart.fillNode();
	store.set("shopping_cart", JSON.stringify(shoppingCart.list));	
	store.save();
	showCart();
}

//increase the number of a book in the shopping list with given bookid
function addFromCart(bookId){
	"use strict";
	//find the selected book object from shopping list according to book id
	var paramBook;
	$.each(shoppingCart.list, function(i, shopItem){
		if(shopItem.book.id === bookId){
			paramBook = shopItem.book;	
		}
	});
	shoppingCart.pushBook(paramBook);
	
	shoppingCart.fillNode();
	store.set("shopping_cart", JSON.stringify(shoppingCart.list));	
	store.save();
	showCart();
}

//remove a book with given id from shopping cart
function removeFromCart(bookId){
	"use strict";
	shoppingCart.popBook(bookId);	
	shoppingCart.fillNode();
	store.set("shopping_cart", JSON.stringify(shoppingCart.list));
	store.save();
	showCart();
	
}

function showCart(){
	"use strict";
	$("#CART").empty();
	if (store === undefined)
	{
		store = new Persist.Store('My Application');
	}
    // get value from store and prompt user
    store.get('shopping_cart', function(ok, val)
	{
		if (ok)
		{
			var tempList = JSON.parse(val);
			var arr = [];
			$.each(tempList, function(i, value){
				arr.push(new Item(value.book, value.qty));
			});
			shoppingCart = new Cart(arr);
			shoppingCart.fillNode();
		}
	});
	if(shoppingCart.isEmpty()){
		var emptyImg = document.createElement("img");
		emptyImg.setAttribute("src", "images/cart.png");
		emptyImg.setAttribute("alt", "cart");
		$(emptyImg).css("margin", "auto");
		$("#CART").append(emptyImg);
		var shoplink = document.createElement("a");
		shoplink.className += "btn btn-success";
		shoplink.setAttribute("href", "products.html");
		shoplink.setAttribute("role", "button");
		shoplink.innerHTML = "go shopping now";
		shoplink.style.marginTop = "1em";
		$("#CART").append(shoplink);
	}
	else{
		
		$("#CART").append(shoppingCart.nodeElement);
		
		var divClear = document.createElement("div");	
		var btnClear = document.createElement("button");
		$(btnClear).addClass("btn");
		$(btnClear).html("clear");
		$(btnClear).click(function(){
			
			shoppingCart.clear();
			store.set("shopping_cart", "[]");
			store.save();
			showCart();
		});
		var btnCheckout = document.createElement("button");
		$(btnCheckout).addClass("btn");
		$(btnCheckout).html("check out");
		btnCheckout.style.width = "5em";
		$(btnCheckout).click(function(){
			$.post("hello.php", shoppingCart.list, function(data, status){
				if(status === "success"){
					alert(data);
				}
				else{
					alert("check out failed");	
				}
			});
			shoppingCart.clear();
			store.set("shopping_cart", "[]");
			store.save();
			showCart();
		});
		$(divClear).append(btnClear);
		
		$(divClear).append(btnCheckout);
		$("#CART").append(divClear);
		
	}
}

//find a book with given id in the books array. return index of the book. return -1 if not found
function findBook(bookId){
	"use strict";
	$.each(books, function(index, book){
		if(book.id === bookId){
			return index;
		}
	});
	return -1;
}