// Declaring constants by using ID's from index.html
const bankBalance = document.getElementById("bankBalance");
const loanContainer = document.getElementById("loan");
const loanBalance = document.getElementById("loanBalance");
const getLoanButton = document.getElementById("getLoanButton");
const repayLoanButton = document.getElementById("repayLoanButton");
const workBalance = document.getElementById("workBalance");
const bankButton = document.getElementById("bankButton");
const workButton = document.getElementById("workButton");
const laptopsMenu = document.getElementById("laptopsMenu");
const featuresList = document.getElementById("featuresList");
const laptopTitle = document.getElementById("laptopTitle");
const laptopDescription = document.getElementById("laptopDescription");
const laptopPrice = document.getElementById("laptopPrice");
const buyButton = document.getElementById("buyButton");
const laptopImage = document.getElementById("laptopImage");

// Declaring starting totals
let bankTotal = 0;
let loanTotal = 0;
let workTotal = 0;
let laptops = [];
let boughtLaptop = true;
let baseUrl = "https://noroff-komputer-store-api.herokuapp.com/";

bankBalance.innerText = bankTotal;
loanBalance.innerText = loanTotal;
workBalance.innerText = workTotal;

// Getting the data from the API
fetch(baseUrl + "computers")
	.then(response => response.json())
	.then(data => (laptops = data))
	.then(laptops => addAllItemsToMenu(laptops))
	.catch(error => {
		console.log(error);
	});

// Adding all the laptops to the featureslist
const addAllItemsToMenu = laptops => {
	laptops.forEach(item => addSingleItemToMenu(item));
	featuresList.innerText = laptops[0].specs.join("\r\n");
	laptopImage.src = baseUrl + laptops[0].image;
	laptopTitle.innerText = laptops[0].title;
	laptopDescription.innerText = laptops[0].description;
	laptopPrice.innerText = laptops[0].price + " €";
};

// Creating an option selecter inside the featureslist
// Adding chosen laptop to list
const addSingleItemToMenu = laptop => {
	const menuItem = document.createElement("option");
	menuItem.value = laptop.id;
	menuItem.appendChild(document.createTextNode(laptop.title));
	laptopsMenu.appendChild(menuItem);
};

// Based on which laptop is chosen, changing data in description element
const handleChange = e => {
	const selectedItem = laptops[e.target.selectedIndex];
	featuresList.innerText = selectedItem.specs.join("\r\n");
	laptopImage.src = baseUrl + selectedItem.image;
	laptopTitle.innerText = selectedItem.title;
	laptopDescription.innerText = selectedItem.description;
	laptopPrice.innerText = selectedItem.price + " €";
};

// Check if there is an active loan and if there is, show loan ammound and the repay button
const checkLoan = () => {
	if (loanTotal <= 0) {
		loanContainer.style.display = "none";
		repayLoanButton.style.display = "none";
	} else {
		loanContainer.style.display = "flex";
		repayLoanButton.style.display = "inline-block";
	}
};

checkLoan();

// Making console show up and ask user how much he/she wants to lend
// Add requested loan to bank balance if the loan is two times or less the current bank balance 
// && user has no active loan && user bought laptop before requesting loan
const handleGetLoan = () => {
	const loanAmount = Number(window.prompt("How much do you want to lend?", ""));
	if (
		loanAmount <= bankTotal * (200 / 100) &&
		loanTotal <= 0 &&
		boughtLaptop === true
	) {
		bankTotal = parseInt(bankTotal + loanAmount);
		bankBalance.innerText = bankTotal;
		loanTotal = parseInt(loanTotal + loanAmount);
		loanBalance.innerText = loanTotal;
		boughtLaptop = false;
	} else {
		alert("At this moment you can't lend any money :(");
	}
	checkLoan();
};

// Check if user has sufficient bank balance
// When paying entire loan, the loan is reduced from bank balance
const handleRepayLoan = () => {
	if (bankTotal >= loanTotal) {
		bankTotal = parseInt(bankTotal - loanTotal);
		bankBalance.innerText = bankTotal;
		loanTotal = 0;
		loanBalance.innerText = loanTotal;
	} else {
		alert("Your balance is not sufficient to pay the loan.");
	}
	checkLoan();
};

// Add 100 to salary
const handleSalary = () => {
	workTotal = parseInt(workTotal + 100);
	workBalance.innerText = workTotal;
};

// Move salary to bank account
// If there is an active loan, 10% of salary will be reduced from loan balance
const handleBankMoney = () => {
	if (loanTotal > 0) {
		bankTotal = parseInt(bankTotal + workTotal * (90 / 100));
		loanTotal = parseInt(loanTotal - workTotal * (10 / 100));
		workTotal = 0;
		workBalance.innerText = 0;
		bankBalance.innerText = bankTotal;
		loanBalance.innerText = loanTotal;
	} else {
		bankTotal = parseInt(bankTotal + workTotal);
		workTotal = 0;
		workBalance.innerText = 0;
		bankBalance.innerText = bankTotal;
	}
	checkLoan();
};

// Buy new laptop if bank balance is sufficient
const handleBuyLaptop = () => {
	const selectedItem = laptops[laptopsMenu.selectedIndex];
	if (bankTotal >= selectedItem.price) {
		bankTotal = bankTotal - selectedItem.price;
		bankBalance.innerText = bankTotal;
		boughtLaptop = true;
		alert("WOW! You just bought " + selectedItem.title);
	} else {
		alert("Sorry my dude, you don't have enough money :(");
	}
};

// Event listeners
laptopsMenu.addEventListener("change", handleChange);
getLoanButton.addEventListener("click", handleGetLoan);
repayLoanButton.addEventListener("click", handleRepayLoan);
workButton.addEventListener("click", handleSalary);
bankButton.addEventListener("click", handleBankMoney);
buyButton.addEventListener("click", handleBuyLaptop);