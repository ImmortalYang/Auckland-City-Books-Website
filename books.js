var modalID = 0;		//auto generated modal id. each modal increment by 1

//define the prototype of Book Object
//@param jsonItem: an object represents a book extracted from json file by jquery ajax technique
function Book(jsonItem){
	"use strict";
	this.id = jsonItem.id;
	this.title = jsonItem.title;
	this.category = jsonItem.category;
	this.author = jsonItem.author;
	this.desc = jsonItem.desc;
	this.popularity = jsonItem.popularity;
	this.onsale = jsonItem.onsale;
	this.price = jsonItem.price;
	this.img = jsonItem.img;
	
	//each book is displayed in a td element in a table
	this.nodeElement = document.createElement("div");
	this.nodeElement.className += "book";
	this.nodeElement.style.textAlign = "center";
	
	var tempID = "MODAL" + modalID++;
	//image of the book
	var image = document.createElement("img");	
	image.setAttribute("src", "images/thumb/" + this.img);
	image.setAttribute("alt", "book");
	image.className += "img-responsive";
	image.setAttribute("data-toggle", "modal");
	image.setAttribute("data-target", "#" + tempID);
	this.nodeElement.appendChild(image);
	this.nodeElement.innerHTML += "<br/>";
	//title of the book
	var titleNode = document.createElement("div");
	//link to description modal
	var descLink = document.createElement("a");
	
	
	
	$(descLink).attr("data-toggle", "modal").attr("data-target", "#" + tempID).prop("href","#").html(this.title);
	//create description modal
	
	var modalNode = document.createElement("div");
	$(modalNode).prop("id", tempID).prop("role", "dialog").addClass("modal fade");
	
	modalNode.innerHTML += '<div class="modal-dialog">'+

		
		'<div class="modal-content">'+
		 ' <div class="modal-header">'+
		'	<button type="button" class="close" data-dismiss="modal">&times;</button>'+
		'	<h4 class="modal-title">'+ this.title + '</h4>'+
		'  </div>'+
		'  <div class="modal-body">'+
		'   <img src = "images/' + this.img + '" alt = "bookimg">'+
		'	<p>' + this.desc + '</p>'+
		'  </div>'+
		'  <div class="modal-footer">'+
		'	<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
		'  </div>'+
		'</div>'+
	
	  '</div>';
	
	$(titleNode).append(descLink);
	$(titleNode).append(modalNode);
	
	$(titleNode).addClass("booktitle");
	this.nodeElement.appendChild(titleNode);
	this.nodeElement.innerHTML += "<br/>";
	//price of the book
	var priceNode = document.createElement("div");
	$(priceNode).addClass("booktitle");
	if(this.onsale === "yes"){
		priceNode.innerHTML = "price: $" + this.price;
	}
	else{
		priceNode.innerHTML = "not available";	
	}
	this.nodeElement.appendChild(priceNode);
	this.nodeElement.innerHTML += "<br/>";
	//add to cart button
	var btnNode;
	if(this.onsale === "yes"){
		//on sale book has an add to cart button that add the book to shopping cart
		btnNode = document.createElement("button");
		btnNode.className += "btn btn-info";
		btnNode.innerHTML = "add to cart";
		
		btnNode.setAttribute("onclick", "addToCart(" + this.id + ");");
	}
	else{
		//unavailable book has a notify me button that link to membership signup page
		btnNode = document.createElement("a");
		btnNode.className += "btn btn-danger";
		btnNode.setAttribute("href", "membership.html");
		btnNode.setAttribute("role", "button");
		btnNode.innerHTML = "notify me";	
	}
	this.nodeElement.appendChild(btnNode);
}

//book shelf is object consists of rows of books
function BookShelf(){
	"use strict";
	this.nodeElement = document.createElement("div");
	$(this.nodeElement).addClass("bookshelf");
	
	//add a book to the book shelf
	this.addBook = function(paramBook){
		this.nodeElement.appendChild(paramBook.nodeElement);
	};
}

//an item in shopping cart
function Item(paramBook, quantity){
	"use strict";
	this.book = paramBook;
	this.qty = quantity;	
	this.unitPrice = this.book.price;
	this.nodeElement = document.createElement("div");
	
	
		var image = document.createElement("img");
		image.setAttribute("src", "images/thumb/" + this.book.img);
		image.setAttribute("alt", "book");
		image.className += "img-responsive";
	
		this.nodeElement.appendChild(image);
		var attr1 = document.createElement("div");
		attr1.innerHTML = "Unit Price: $" + this.book.price;
		this.nodeElement.appendChild(attr1);
		var attr2 = document.createElement("span");
		attr2.innerHTML = "Quantity: " + this.qty;
		this.nodeElement.appendChild(attr2);
		
		var btnPlus = document.createElement("button");
		btnPlus.className += "btn btn-default";
		btnPlus.innerHTML = "+";
		btnPlus.setAttribute("onclick", "addFromCart(" + this.book.id + ");");
		
		this.nodeElement.appendChild(btnPlus);
		
		var btnMinus = document.createElement("button");
		btnMinus.className += "btn btn-default";
		btnMinus.innerHTML = "-";
		btnMinus.setAttribute("onclick", "removeFromCart(" + this.book.id + ");");
		
		this.nodeElement.appendChild(btnMinus);
	
	this.addQty = function(){
		this.qty++;
		this.nodeElement.childNodes[2].innerHTML = "Quantity: " + this.qty;
	};
	
	this.reduceQty = function(){
		this.qty--;
		this.nodeElement.childNodes[2].innerHTML = "Quantity: " + this.qty;
	};
}

//shopping cart class
function Cart(paramList){
	"use strict";
	this.list = paramList;		//item list
	this.nodeElement = document.createElement("div");
	
	//add a book to shopping cart
	this.pushBook = function(paramBook){
		//try to find given book in the shopping list
		for(var i = 0; i < this.list.length; i++){
			//if found, increase the quantity of the book by 1 and return
			if(this.list[i].book.id === paramBook.id){
				this.list[i].addQty();
				return;	
			}
		}
		//if not found, add a new item to shopping list
		this.list.push(new Item(paramBook, 1));
		
	};
	
	//delete a book with given id
	this.popBook = function(bookId){
		//find the given book in the list by id
		for(var i = 0; i < this.list.length; i++){
			if(this.list[i].book.id === bookId){
				//reduce the quantity of the book by 1
				this.list[i].reduceQty();
				//if the quantity of the book reaches 0, then delete this item
				if(this.list[i].qty === 0){
					this.list.splice(i, 1);	
				}
			}
		}
	};
	
	//calculate total price
	this.calTotalPrice = function(){
		var result = 0;
		for(var i = 0; i < this.list.length; i++){
			result += this.list[i].unitPrice * this.list[i].qty;
		}
		//must be fixed due to imprecision in calculation of javascript
		return result.toFixed(2);
	};
	
	this.fillNode = function(){
		this.nodeElement.innerHTML = "<h4>Shopping Cart</h4>";
		for(var i = 0; i < this.list.length; i++){
			
			this.nodeElement.appendChild(this.list[i].nodeElement);	
		}
		this.nodeElement.innerHTML += "Total Price: $" + this.calTotalPrice();
	};
	
	this.isEmpty = function(){
		return this.list.length === 0;
	};
	
	this.clear = function(){
		this.list.length = 0;
		$(this.nodeElement).empty();
	};
	
}