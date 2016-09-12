function open_Main() {
	//resets main panel to Logo page
	top.contentpanel.location.href='Logo.html';
}

function search_Bar(kataItem, xmlSize) {	
	var contentFrame = parent.contentpanel.document;
	var search = document.forms["search"]["searchbar"].value.toString(); //search bar value
	var search_Value = search.charAt(0).toUpperCase() + search.slice(1, search.length); //capitalizes first letter
	list_Of_Items = [];
	
	for (var i = 0; i < xmlSize.length; i++)
	{
		//string-tokenizers
		var name_Array = kataItem[i].name.split(" ");
		var company_Array = kataItem[i].company.split(" ");
		var category_Array = kataItem[i].category.split(" ");
		var description_Array = kataItem[i].description.split(" ");
		var plural = search_Value.substring(0, search_Value.length - 1) + 'ies'; //plural version of search value
		var lowercase = search_Value; //checks lowercase words in description field
		
		for (var c = 0; c < name_Array.length; c++) //checks names
		{
			if (search_Value == name_Array[c] || search_Value + 's' == name_Array[c] || plural == name_Array[c] || search_Value == kataItem[i].name)
			{
				if (list_Of_Items.indexOf(kataItem[i]) == -1) //if item is not added already
				{
					list_Of_Items.push(kataItem[i]); //adds the item if conditions are met (including plural variation)
				}
				
			}
		}
		for (var c = 0; c < company_Array.length; c++) //checks companies
		{
			if (search_Value == company_Array[c] || search_Value + 's' == company_Array[c] || plural == company_Array[c] || search_Value == kataItem[i].company)
			{
				if (list_Of_Items.indexOf(kataItem[i]) == -1)
				{
					list_Of_Items.push(kataItem[i]);
				}
			}
		}
		for (var c = 0; c < category_Array.length; c++) //checks categories
		{
			if (search_Value == category_Array[c] || search_Value + 's' == category_Array[c] || plural == category_Array[c] || search_Value == kataItem[i].category)
			{
				if (list_Of_Items.indexOf(kataItem[i]) == -1)
				{
					list_Of_Items.push(kataItem[i]);
				}
			}
		}
		for (var c = 0; c < description_Array.length; c++) //checks descriptions
		{
			if (search_Value == description_Array[c] || search_Value + 's' == description_Array[c] || plural == description_Array[c] || lowercase == description_Array[c]  || search_Value == kataItem[i].description)
			{
				if (list_Of_Items.indexOf(kataItem[i]) == -1)
				{
					list_Of_Items.push(kataItem[i]);
				}
			}
		}
	}
	create_Table(list_Of_Items.length, list_Of_Items, "Search Items", kataItem, xmlSize, "Yes");
}

function browse_By_Company(kataItem, xmlSize) {
	var company_Names = []; //list of company names array
	var company_Obj = [];
	for(var i = 0; i < xmlSize.length; i++)
	{
		if (company_Names.indexOf(kataItem[i].company) === -1) //if company_Names array doesn't have the company already (for repeats) -- negative 1 is null
		{
			company_Names.push(kataItem[i].company); //adds name to array for condition
			company_Obj.push(kataItem[i]);  //adds the actual object to another array
		}		
	}
	create_Table(company_Names.length, company_Obj, "Company", kataItem, xmlSize, "Yes"); //creates the table with companies
}

function browse_By_Category(kataItem, xmlSize) {
	var category_Names = []; //same as browse_By_Company(), but for categories
	var category_Obj = [];
	for(var i = 0; i < xmlSize.length; i++)
	{
		if (category_Names.indexOf(kataItem[i].category) === -1)
		{
			category_Names.push(kataItem[i].category);
			category_Obj.push(kataItem[i]);
		}
		
	}
	create_Table(category_Names.length, category_Obj, "Categories", kataItem, xmlSize, "Yes"); //creates the table with categories
}

function add_To_Cart(item, amount, kataItem) 
{
	var exists = new Boolean(0); //boolean at false
	for (var i = 0; i < parent.purchased_Items.length; i++)
	{	
		if (parent.purchased_Items[i].name == item.name) //if this particular item already exists in the cart
		{			
			parent.amountStored[i] = parseInt(parent.amountStored[i]) + parseInt(amount);
			exists = 1; //if item is already in cart, boolean 'exists' set to true, and the number is added to the existed item's number
			break;
		}
	}
	if (exists == 0) //0 = flase. if item does that exist (new item into the cart), new item is added
	{
		parent.purchased_Items.push(item);
		parent.amountStored.push(amount);
	}
	cart_Amount(amount, "increase"); //amount of items in cart increases
}

function remove_From_Cart(item, amount, kataItem, index) 
{
	if (parent.amountStored[index] - parseInt(amount) > 0) //if remaining amount is still greater than 1
	{
		parent.amountStored[index] = parent.amountStored[index] - parseInt(amount); //item is merely subtracted
	}
	else
	{
		parent.purchased_Items.splice(index, 1); //if remaining item is gone (like 5 - 7), item is removed from cart altogether
		parent.amountStored.splice(index, 1);
	}
	cart_Amount(amount, "decrease"); //amount of items in cart decreases
	view_Cart(kataItem); //refreshes cart page by re-creating it
}

function cart_Amount(amount, increment) {	
	if (increment == "increase") //if it is add_To_Cart
	{
		parent.items_In_Cart = parent.items_In_Cart + parseInt(amount); //adds the amount purchased
	}
	else //if it is remove_From_Cart
	{
		parent.items_In_Cart = parent.items_In_Cart - parseInt(amount); //subtracts the amount removed
	}
	var cartAmount = parent.menupanel.document.getElementById('viewcart'); //the element that displays View Cart(x);
	
	if (parent.items_In_Cart < 0) //if number of items in cart somehow decreases beyond 0, 0 is still displayed
		parent.items_In_Cart = 0;
	
	cartAmount.innerHTML='View Cart (' + parent.items_In_Cart + ')'; //sets text to new amount
}

function view_Cart(kataItem) { //creates table with cart items
	create_Table(parent.purchased_Items.length, parent.purchased_Items, "Items in Cart", kataItem, parent.xmlSize, "Yes");
}	

function create_Table(amount_Of_Items, item, type, kataItem, xmlSize, clear_Yes_No) {
	var contentFrame = parent.contentpanel.document;
	if (clear_Yes_No == "Yes") //refreashes the page or not
		contentFrame.open();
		
	var text_Value = []; //array of text nodes (to display names, companies, categories, etc); arbitrary
	var item_Price = []; //array of the items prices
	var cells = []; //individual cells
	var purchase_Buttons = []; //array of add buttons	
	var remove_Buttons = []; //array of remove buttons
	var item_Names = []; //array of item names
	var css_Link = document.createElement('link');
	css_Link.setAttribute('rel', 'stylesheet'); //creates link-element to be able to use external CSS
	css_Link.setAttribute('type', 'text/css');
	css_Link.setAttribute('href', 'CSS.css');
	//using single quotes on external quotations!
	num_Of_Cols = 2; //default number of columns

	var main_Div = document.createElement("div"); //creates main div
	var table = document.createElement('table'); //creates the table
	main_Div.appendChild(css_Link); //adds the link-element for external css
	
	main_Div.setAttribute('class', 'contentdiv');
	table.setAttribute('class', 'contenttable');
	
	if (type === "Search Items") //if searching, displays the # of search results
	{
		var results_Num = document.createElement("h4");
		results_Num.setAttribute('class', 'resulttext');
		results_Num.innerHTML= amount_Of_Items !== 0 ? 'Showing ' + amount_Of_Items + ' search results.' : 'Your search yielded no results. Poop. :(';
		main_Div.appendChild(results_Num);
	}

	for (var i = 0; i < amount_Of_Items; i++)
	{	
		if (i % 2 === 0)
		{
			new_Row=table.insertRow(-1); //new rows
		}
		
		cells.push(new_Row.insertCell(-1)); //creates new cell
		cells[i].setAttribute('class', 'tablecell'); //class .tablecell -- css
		text_Value[i] = document.createElement('h4'); //creates text node
		text_Value[i].setAttribute('class', 'tabletext');
		item_Price[i] = document.createElement('h4'); //creates text node for prices
		
		var product_Image = document.createElement('img'); //product image
		
		if (type === "Company") //if browsing by company, text node shows company name
		{
			text_Value[i].innerHTML=item[i].company;
		}
		if (type === "Categories") //if browsing by category, text node shows category name
		{
			text_Value[i].innerHTML=item[i].category;
		}
		if (type === "Items" || type === "Items in Cart" || type === "Search Items") //if shows Items and not company or category
		{	
			item_Price[i].innerHTML=item[i].price; //price
			text_Value[i].innerHTML=item[i].name; //name
			product_Image.src=item[i].img; //image
			product_Image.setAttribute('class', 'tableimg');
			cells[i].appendChild(product_Image); //adds image
			var description = document.createElement('h5');
			description.innerHTML='"' + item[i].description + '"'; //description
			cells[i].appendChild(description); //adds description
		}

		cells[i].appendChild(text_Value[i]);
		purchase_Buttons[i] = document.createElement('button');
		if (item[i].onsale == 'yes' && type !== 'Company' && type !== 'Categories') // if item is on sale
		{
			var was_Now = document.createElement('h4'); //was, and now
			was_Now.innerHTML='<b class="colortextgreen">Was <s>$' + item[i].price + '</s></b> &#8211; <b class="colortextred">Now $' + item[i].sale + '</b>'; //shows the price before sale in striked-off text
			was_Now.setAttribute('class', 'tabletext');
			cells[i].appendChild(was_Now);
			purchase_Buttons[i].innerHTML='$' + parseFloat(item[i].sale).toFixed(2) + ' -- Add to Cart'; //sale price on the add-to-cart button
		}
		else //if item is not sale
		{
			purchase_Buttons[i].innerHTML='$' + parseFloat(item[i].price).toFixed(2) + ' -- Add to Cart'; //normal price on the add-to-cart button
		}
		
		//if it is showing categories or companies
		if (type === "Categories" || type === "Company") //if browsing by company or categorie
		{
			text_Value[i].style.padding='35%'; // expands the box
			(function(i) { //anonymous function that adds event listeners
				cells[i].addEventListener('click', function() { 
					find_Items(xmlSize, item[i], kataItem, type);
				}, false);
			}(i));
		}
		//if it is showing the actual items
		if (type === "Items" || type === "Search Items") //if showing items and search results, but not showing cart
		{	
			if (item[i].onsale === "yes") //if item is on sale
			{
				var discount_Text = document.createElement('h4');
				var sale_Percent = Math.round((1 - parseFloat(item[i].sale) / parseFloat(item[i].price)) * 100);
				discount_Text.innerHTML=sale_Percent + '% OFF!';
				cells[i].appendChild(discount_Text); //adds the discounted price
			}		
			(function(i) { //anonymous function, adds event listeners for purchase/add to cart buttons
				purchase_Buttons[i].addEventListener('click', function() {
					var check = new Boolean(0); //false
					var add_Prompt;
					while (check == 0 && add_Prompt !== null) //if prompt is not null, and prompt value is valid
					{
						add_Prompt = prompt("How many would you like to add?", "Please enter a numerical value.");
						if (!isNaN(parseFloat(add_Prompt)) && isFinite(add_Prompt) && add_Prompt.charAt(0) !== '-') //if prompt is a number value
						{						
							add_To_Cart(item[i], add_Prompt, kataItem); //adds specific item to cart
							check = 1; //sets to true, breaks out of loop
						}
					}
				}, false);
			}(i));		
			cells[i].appendChild(purchase_Buttons[i]); //adds the add-to-cart button
		}
		if (type === "Items in Cart") //if browsing through cart
		{			
			remove_Buttons[i] = document.createElement('button');
			remove_Buttons[i].innerHTML='Remove from Cart';
			var amount_Text = [];
			amount_Text[i] = document.createElement('h4');
			amount_Text[i].setAttribute('class', 'tabletext');
			amount_Text[i].innerHTML='Quantity: ' + parent.amountStored[i];
			cells[i].appendChild(amount_Text[i]); //to tell you how many of this item you have in your cart
			cells[i].appendChild(remove_Buttons[i]); //if you're looking at the cart, you get the option of removing item from cart
			(function(i) { //anonymous function -- same as add-to-cart, but this is remove-from-cart
				remove_Buttons[i].addEventListener('click', function() {
					var check = new Boolean(0);
					var remove_Prompt;
					while (check == 0 && remove_Prompt !== null)
					{
						remove_Prompt = prompt('How many would you like to remove?', 'Please enter a numerical value.');
						if (!isNaN(parseFloat(remove_Prompt)) && isFinite(remove_Prompt) && remove_Prompt.charAt(0) !== '-')
						{						
							remove_From_Cart(item[i], remove_Prompt, kataItem, i);
							check = 1;
						}
					}
				}, false);
			}(i));	
			
			if (i == (amount_Of_Items - 1))
			{	
				if (amount_Of_Items % 2 == 0)
					new_Row=table.insertRow(-1);
				
				var shipping_Fee = 0;
				var total;
				var shipping = document.createElement('h4');
				shipping.innerHTML='Purchase of under $60 <br>-- $5.00 shipping. <br>Purchase of $60 - $120 <br>-- $10.00 shipping. <br>Purchase of over $120 <br>-- FREE shipping!';
				var grand_Total = document.createElement('h4');
				var total_Cell=new_Row.insertCell(-1);
				var checkout = document.createElement('button');
				checkout.innerHTML='Proceed to Checkout!';
				var total_Info = document.createElement('h4');
				var cart_Price = 0;
				for (var i = 0; i < parent.purchased_Items.length; i++)
				{
					if (parent.purchased_Items[i].onsale == 'yes') //if on sale, cart price accumulates next item's discounted price
					{
						cart_Price = cart_Price + (parseFloat(parent.purchased_Items[i].sale) * parseInt(parent.amountStored[i]));
					}
					else //if not on sale, cart price accumulates next item's normal price
					{
						cart_Price = cart_Price + (parseFloat(parent.purchased_Items[i].price) * parseInt(parent.amountStored[i]));
					}
				}
				total_Info.innerHTML='<br>Subtotal: <br>$' + cart_Price + '<br><br>' + 'Total number of items: <br>' + parent.items_In_Cart;
				total_Cell.setAttribute('class', 'tablecell');	
				total_Info.setAttribute('class', 'tabletext');
				total_Cell.appendChild(total_Info);	
				total_Cell.appendChild(shipping);
				
				if (cart_Price <= 120) //if subtotal is less than or equal to 120; note: shipping fee is default, 0 dollars, so it will only change if price is under, or equal to, $120
					shipping_Fee = cart_Price < 60 ? 5 : 10; //if price is under $60, fee is $5, if it's above $60, fee is $10
				
				total = cart_Price + shipping_Fee; //grand total payment price
				grand_Total.innerHTML='Total: $' + total;
				total_Cell.appendChild(grand_Total);
				
				(function(total) { //anonymous function that adds checkout button to input billing info
					checkout.addEventListener('click', function() {
						checkout_Page(total);
					}, false);
				}(total));	
				
				total_Cell.appendChild(checkout);
			}
		}
	}
	if (type === "Items in Cart" && parent.items_In_Cart <= 0) //if browsing cart, but cart is empty
	{
			var text = document.createElement('h1');
			text.innerHTML='Your cart is empty!'; //says cart is empty
			text.setAttribute('class', 'carttext');
			main_Div.appendChild(text);
	}
	main_Div.appendChild(table); //adds finished table to main div

	if (clear_Yes_No == "Yes")	//if the page was reset when this function was activated
	{
		contentFrame.appendChild(main_Div);
		contentFrame.close(); //contentframe document must be closed upon finished use
	}
	else
		contentFrame.body.appendChild(main_Div); //escapes Hierarchy error
}

function find_Items(xmlSize, name_Of_Obj, kataItem, type) {	
	var list_Of_Items = [];
	for (var i = 0; i < xmlSize.length; i++)
	{
		if (type === "Categories") //browsing by categories, displays all item under that category
		{
			if (kataItem[i].category === name_Of_Obj.category)
			{
				list_Of_Items.push(kataItem[i]);
			}
		}
		if (type === "Company") //browsing by companies, displays all items from that company
		{
			if (kataItem[i].company === name_Of_Obj.company)
			{
				list_Of_Items.push(kataItem[i]);
			}
		}
		//for browsing by price range
		var int_To_Test = kataItem[i].onsale == 'yes' ? kataItem[i].sale : kataItem[i].price; //if item is on sale, uses discounted price
		if (type === "Price")
		{
			if (name_Of_Obj === "first")
			{   
				if (parseInt(int_To_Test) <= 1.99) // if item is cheaper than $1.99, etc.
					list_Of_Items.push(kataItem[i])
			}
			else if (name_Of_Obj === "second")
			{
				if (parseInt(int_To_Test) <= 3.99 && parseInt(int_To_Test) >= 2.00)
					list_Of_Items.push(kataItem[i])
			}
			else if (name_Of_Obj === "third")
			{
				if (parseInt(int_To_Test) <= 5.99 && parseInt(int_To_Test) >= 4.00)
					list_Of_Items.push(kataItem[i])
			}
			else
			{
				if (parseInt(int_To_Test) >= 6.00)
					list_Of_Items.push(kataItem[i])
			}
		}
		
		if (type === "Sale")
		{
			if (kataItem[i].onsale == "yes") //if browsing by items on sale, finds all items on sale
				list_Of_Items.push(kataItem[i])
		}
	}
	create_Table(list_Of_Items.length, list_Of_Items, "Items", kataItem, xmlSize, "Yes"); //creates table with respective items
}

function checkout_Page(total) //displays the billing info page
{
	var contentFrame = parent.contentpanel.document;
	contentFrame.open();
	contentFrame.write('<link rel="stylesheet" type="text/css" href="CSS.css"></link>');
	contentFrame.write('<div class="billingdiv">'); //main div -- start
	contentFrame.write('<h4 class="billingtotalpayment">Your payment is: $' + total + '.<h4>');
	//text field div -- start
	contentFrame.write('<div class="billingsubdivright"><ul>');
	contentFrame.write('<input type="text"/><br/><br/>');		
	contentFrame.write('<input type="text"/><br/><br/>');
	contentFrame.write('<input type="text"/><br/><br/>');
	contentFrame.write('<input type="text"/><br/><br/>');
	contentFrame.write('<input type="int" value="mm" class="billingdatefield"/> / ');
	contentFrame.write('<input type="int" value="yy" class="billingdatefield"/> ');
	contentFrame.write('CVC: <input type="int" style="width:39px"/><br/><br/>');
	contentFrame.write('<input type="text"/><br/><br/>');
	contentFrame.write('<input type="text"/><br/><br/>');
	contentFrame.write('<input type="text"/><br/><br/>');	
	contentFrame.write('<input type="button" value="Confirm" class="confirmbutton"></input>');
	contentFrame.write('</ul></div>');
	//textfield div -- end
	//label side div -- start
	contentFrame.write('<div class="billingsubdivleft"><ul>');
	contentFrame.write('<label>Email: </label><br/><br/>'); //email
	contentFrame.write('<label>Card holder\'s name: </label><br/><br/>'); //card holder
	contentFrame.write('<label>Street address: </label><br/><br/>'); //street address
	contentFrame.write('<label>Card number: </label><br/><br/>'); //card number
	contentFrame.write('<label>Expiration date: </label><br/><br/>'); //expiration date
	contentFrame.write('<label>City: </label><br/><br/>'); //city
	contentFrame.write('<label>Province: </label><br/><br/>'); //province
	contentFrame.write('<label>Postal Code: </label><br/><br/>'); //postal code
	contentFrame.write('</ul></div></div>');
	//label side div -- end //main div -- end

	contentFrame.close();
}

function xml_To_Variable(xmlDoc, i) {
	var node=xmlDoc.getElementsByTagName("inventory")[i];
	//id of item
	idNode=getFirstChild(node);		
	idE=idNode.childNodes[0].nodeValue;
	//name of item
	nameNode=getNextSibling(idNode);
	nameE=nameNode.childNodes[0].nodeValue;
	//category of item
	categoryNode=getNextSibling(nameNode);
	categoryE=categoryNode.childNodes[0].nodeValue;
	//company of item
	companyNode=getNextSibling(categoryNode);
	companyE=companyNode.childNodes[0].nodeValue;
	//description of item
	descriptionNode=getNextSibling(companyNode);
	descriptionE=descriptionNode.childNodes[0].nodeValue;
	//price of item
	priceNode=getNextSibling(descriptionNode);
	priceE=priceNode.childNodes[0].nodeValue;
	//sale price of item
	saleNode=getNextSibling(priceNode);
	saleE=saleNode.childNodes[0].nodeValue;
	on_Sale=saleNode.getAttribute("id"); //on sale or not 'yes' or 'no'
	//image of item
	imgNode=getNextSibling(saleNode);
	imgE=imgNode.childNodes[0].nodeValue;
	
	katagiri = { //adds the information to the object, and object is sent to array at respective index.
		id: idE,
		name: nameE,
		category: categoryE,
		company: companyE,
		description: descriptionE,
		price: priceE,
		sale: saleE,
		onsale: on_Sale,
		img: imgE
	};
	return katagiri;			
}

function logo_Fun(image, direction, number) { //logos change color when you hover over :D
	if (direction == 'in')
		image.src = (number == 1) || (number == 4) ? 'Leaf 3.png' : 'Leaf 2.png';
	else
		image.src = 'Leaf 1.png';
}

function loadXMLDoc(dname)
{
	if (window.XMLHttpRequest) //finds the browser -- for chrome, mozilla
		{
		xhttp=new XMLHttpRequest();
		}
	else //for IE
		{
		xhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
	xhttp.open("GET",dname,false);
	xhttp.send();
	return xhttp.responseXML;
}

function getFirstChild(n) //gets the first child node of each item
{
	first_Child = n.firstChild;
	
	while (first_Child.nodeType != 1)
	  {
		first_Child = first_Child.nextSibling;
	  }
	  
	return first_Child;
}

function getNextSibling(n) //gets the next node of each item-- looped until all nodes are accounted for
{
	next_Child = n.nextSibling;
	
	while (next_Child.nodeType != 1)
	  {
		next_Child = next_Child.nextSibling;
	  }
	  
	return next_Child;
}