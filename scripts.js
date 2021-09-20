let myLibrary = localStorage.getItem("myLibrary");
myLibrary = JSON.parse(myLibrary);
if (null === myLibrary) {
  	myLibrary = [];
}

let table = document.getElementById("library");

window.onload = () => {
	generateData();
	renderTable(myLibrary);
};

function capFirst(string) {
	try {
		return string.charAt(0).toUpperCase() + string.slice(1);
	} catch (error) {
		return "Bob";
	}
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateName() {
	let name1 = [
		"abandoned",
		"able",
		"absolute",
		"adorable",
		"adventurous",
		"academic",
		"acceptable",
		"acclaimed",
		"accomplished",
		"accurate",
		"aching",
		"acidic",
		"acrobatic",
		"active",
		"actual",
		"adept",
		"admirable",
		"admired",
		"adolescent",
		"adorable",
		"adored",
		"advanced",
		"afraid",
		"affectionate",
		"aged",
		"aggravating",
		"aggressive",
		"agile",
		"agitated",
		"agonizing",
		"agreeable",
		"ajar",
		"alarmed",
		"alarming",
		"alert",
		"alienated",
		"alive",
		"all",
		"altruistic",
		"amazing",
		"ambitious",
		"ample",
		"amused",
		"amusing",
		"anchored",
		"ancient",
		"angelic",
		"angry",
		"anguished",
		"animated",
		"annual",
		"another",
		"antique",
		"anxious"
	];

	let name2 = [
		"people",
		"history",
		"way",
		"art",
		"world",
		"information",
		"map",
		"family",
		"government",
		"health",
		"system",
		"computer",
		"meat",
		"year",
		"thanks",
		"music",
		"person",
		"reading",
		"method",
		"data",
		"food",
		"understanding"
	];

	let name = capFirst(name1[getRandomInt(0, name1.length + 1)]) + " " + capFirst(name2[getRandomInt(0, name2.length + 1)]);
	return name;
}

function uuidv4() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		let r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

class Book {
	constructor(title, author, pages, isRead) {
		this.title = title;
		this.author = author;
		this.pages = pages;
		this.isRead = isRead;
		this.uuid = uuidv4();
	}
}

function findBook(id) {
  	return myLibrary.findIndex((book) => book.uuid == id);
}

function removeBook(id) {
	document.getElementById(id).remove();
	let removeIndex = findBook(id);
	myLibrary.splice(removeIndex, 1);
	localStorage.clear();
	localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
	updateTotal();
}

function markAsRead(id) {
	let bookIndex = findBook(id);
	let book = myLibrary[bookIndex];
	book.isRead = !book.isRead;

	localStorage.clear();
	localStorage.setItem("myLibrary", JSON.stringify(myLibrary));

	let elem = document.getElementById(id).cells[3];
	elem.innerHTML = capFirst(book.isRead.toString());
	updateTotal();
}

function removeTableRows(table) {
	for (let i = table.rows.length - 1; i >= 0; i--) {
		table.rows[i].remove();
	}
}

function removeAllBooks(table) {
	removeTableRows(table);
	localStorage.clear();
	myLibrary = [];
	renderTable(myLibrary);
}

function removeAllRead() {
	let removeList = [];
	for (let i = 0; i < myLibrary.length; i++) {
		if (myLibrary[i].isRead) {
			removeList.push(myLibrary[i].uuid);
		}
	}
	
	removeList.forEach(id => {
		removeBook(id);
	});
}

function hideTable() {
	let tableDisplay = document.getElementById("libraryTable");
	if (myLibrary.length === 0) {
		tableDisplay.hidden = true;
	} else {
		tableDisplay.hidden = false;
	}
}

function renderTable(arr) {
	let table = document.getElementById("library");
	
	removeTableRows(table);
	for (let i = 0; i < myLibrary.length; i++) {
	let book = arr[i];
	let headers = Object.keys(book);
	let row = table.insertRow(0);
	row.id = book.uuid;
	row.classList.add("libraryRow");

	for (let j = 0; j < headers.length; j++) {
		if ([headers[j]] != "uuid") {
			// Skips the ID of the book in the UI
			let cell = row.insertCell(j);
			if (!headers[j].match(/^(pages|isRead)$/)) {
				cell.classList.add("tableText");
			}
			cell.innerHTML = capFirst(book[headers[j]].toString());
		}
	}

	let cell = row.insertCell(row.cells.length);
	let btn = document.createElement("button");

	btn.innerText = "Toggle Completed";
	btn.classList.add("complete");
	btn.classList.add("control");
	btn.addEventListener("click", () => {
		markAsRead(book.uuid);
	});
	cell.appendChild(btn);
	cell.classList.add("tableText");

	cell = row.insertCell(row.cells.length);
	btn = document.createElement("button");
	btn.classList.add("remove");
	btn.classList.add("control");
	btn.innerHTML = "Remove";
	btn.addEventListener("click", () => {
		removeBook(book.uuid);
	});
	cell.appendChild(btn);
	cell.classList.add("tableText");
	}

	updateTotal();
	hideTable();
}

function addBookToLibrary() {
	let title = document.getElementById("title");
	let author = document.getElementById("author");
	let pages = document.getElementById("pages");
	let read = document.getElementById("read");
	let book = new Book(title.value, author.value, pages.value, read.checked);

	if (title.value === "" || author.value === "" || pages.value === "") {
		console.error("nope");
		alert("All fields must be entered before submitting");
		return;
	}

	myLibrary.push(book);
	localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
	myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
	renderTable(myLibrary);

	updateTotal()
	if (!generateData()) {
		document.getElementById("inputForm").reset();
	}
}

function updateTotal() {
	let completed = 0;
	myLibrary.forEach(book => {
		if (book.isRead) {
			completed++;
		}
	});
	document.getElementById("totalBooks").innerHTML = myLibrary.length;
	document.getElementById("completedBooks").innerHTML = completed.toString();
}

function test() {
	for (let i = 0; i < 10; i++) {
		addBookToLibrary();
	}
}

function generateData() {
	let title = document.getElementById("title");
	let author = document.getElementById("author");
	let pages = document.getElementById("pages");
	let read = document.getElementById("read");
	
	if (genData.checked) {
		title.value = generateName();
		author.value = generateName();
		pages.value = Math.floor(Math.random() * 1000);
		read.checked = Math.random() < 0.5;
		return true;
	} else {
		document.getElementById("inputForm").reset();
		return false;
	}
}

let genData = document.getElementById("genData");
genData.addEventListener("click", () => {
	generateData()
});

let footer = document.getElementById("year");
footer.innerText = new Date().getFullYear();