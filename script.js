const storage_key = "asep-san";

const inputBuku = document.getElementById("inputBook");
const searchBook = document.getElementById("searchBook");

document.body.addEventListener('dblclick', function(event){
  document.body.classList.toggle('dark_mode');
  document.body.classList.replace('dark_border','light_border');
});

function cekStorage() {
  return typeof(Storage) !== "undefined";
}
inputBuku.addEventListener("submit", function (event) {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = Number(document.getElementById("inputBookYear").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;
  const id = JSON.parse(localStorage.getItem(storage_key)) === null ? 0 + Date.now() : JSON.parse(localStorage.getItem(storage_key)).length + Date.now();

  const newBook = {
    id: id,
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  putlistBook(newBook);
  const dataBook = getlistBook();
  renderBook(dataBook);
});

function putlistBook(data) {
  if (cekStorage()) {
    let dataBook = [];

    if (localStorage.getItem(storage_key) !== null) {
      dataBook = JSON.parse(localStorage.getItem(storage_key));
    }

    dataBook.push(data);
    localStorage.setItem(storage_key, JSON.stringify(dataBook));
  }
}

function renderBook(dataBook) {
  if (dataBook === null) {
    return;
  }

  const incompleteBook = document.getElementById("incompleteBookshelfList");
  const completeBook = document.getElementById("completeBookshelfList");
  incompleteBook.innerHTML = "";
  completeBook.innerHTML = "";

  for (let book of dataBook) {
    const id = book.id;
    const title = book.title;
    const author = book.author;
    const year = book.year;
    const isComplete = book.isComplete;

    let bookItem = document.createElement("article");
    bookItem.classList.add("book_item", "select_item");
    bookItem.innerHTML = "<h3 name = " + id + ">" + title + "</h3>";
    bookItem.innerHTML += "<p>Penulis: " + author + "</p>";
    bookItem.innerHTML += "<p>Tahun: " + year + "</p>";

    let containerActionItem = document.createElement("div");
    containerActionItem.classList.add("action");

    const greenButton = createGreenButton(book, function (event) {
      isCompleteBookHandler(event.target.parentElement.parentElement);
      const dataBook = getlistBook();
      resetAllForm();
      renderBook(dataBook);
    });

    //hapus
    const redButton = createRedButton(function (event) {
      deleteItem(event.target.parentElement.parentElement);
      const dataBook = getlistBook();
      resetAllForm();
      renderBook(dataBook);
    });

    containerActionItem.append(greenButton, redButton);
    bookItem.append(containerActionItem);

    if (isComplete === false) {
      incompleteBook.append(bookItem);
      bookItem.childNodes[0].addEventListener("click", function (event) {
        updateItem(event.target.parentElement);
      });

      continue;
    }

    completeBook.append(bookItem);

    bookItem.childNodes[0].addEventListener("click", function (event) {
      updateItem(event.target.parentElement);
    });
  }
}

function createGreenButton(book, events) {
  const isSelesai = book.isComplete ? "Belum selesai" : "Selesai";
  const greenButton = document.createElement("button");
  greenButton.classList.add("green");
  greenButton.innerText = isSelesai + " di Baca";
  greenButton.addEventListener("click", function (event) {
    events(event);
  });
  return greenButton;
}
function createRedButton(events) {
  const redButton = document.createElement("button");
  redButton.classList.add("red");
  redButton.innerText = "Hapus buku";
  redButton.addEventListener("click", function (event) {
    events(event);
  });
  return redButton;
}

function isCompleteBookHandler(itemElement) {
  const dataBook = getlistBook();
  if (dataBook.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index in dataBook) {
    if (dataBook[index].title === title && dataBook[index].id == titleNameAttribut) {
      dataBook[index].isComplete = !dataBook[index].isComplete;
      break;
    }
  }
  localStorage.setItem(storage_key, JSON.stringify(dataBook));
}

function searchlistBook(title) {
  const dataBook = getlistBook();
  if (dataBook.length === 0) {
    return;
  }

  const listBook = [];

  for (let index in dataBook) {
    const tempTitle = dataBook[index].title.toLowerCase();
    const tempTitleTarget = title.toLowerCase();
    if (dataBook[index].title.includes(title) || tempTitle.includes(tempTitleTarget)) {
      listBook.push(dataBook[index]);
    }
  }
  return listBook;
}

function greenButtonHandler(parentElement) {
  let book = isCompleteBookHandler(parentElement);
  book.isComplete = !book.isComplete;
}

function getlistBook() {
  if (cekStorage) {
    return JSON.parse(localStorage.getItem(storage_key));
  }
  return [];
}

function deleteItem(itemElement) {
  const dataBook = getlistBook();
  if (dataBook.length === 0) {
    return;
  }

  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index in dataBook) {
    if (dataBook[index].id == titleNameAttribut) {
      dataBook.splice(index, 1);
      break;
    }
  }

  localStorage.setItem(storage_key, JSON.stringify(dataBook));
}

function updateItem(itemElement) {
  if (itemElement.id === "incompleteBookshelfList" || itemElement.id === "completeBookshelfList") {
    return;
  }

  const dataBook = getlistBook();
  if (dataBook.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const author = itemElement.childNodes[1].innerText.splice(9, itemElement.childNodes[1].innerText.length);
  const getYear = itemElement.childNodes[2].innerText.splice(7, itemElement.childNodes[2].innerText.length);
  const year = Number(getYear);
  const isComplete = itemElement.childNodes[3].childNodes[0].innerText.length === "Selesai di baca".length ? false : true;

  const id = itemElement.childNodes[0].getAttribute("name");
  document.getElementById("inputBookTitle").value = title;
  document.getElementById("inputBookTitle").name = id;
  document.getElementById("inputBookAuthor").value = author;
  document.getElementById("inputBookYear").value = year;
  document.getElementById("inputBookIsComplete").checked = isComplete;

  for (let index of dataBook) {
    if (dataBook[index].id == id) {
      dataBook[index].id = id;
      dataBook[index].title = title;
      dataBook[index].author = author;
      dataBook[index].year = year;
      dataBook[index].isComplete = isComplete;
    }
  }
  localStorage.setItem(storage_key, JSON.stringify(dataBook));
}

searchBook.addEventListener("submit", function (event) {
  event.preventDefault();
  const dataBook = getlistBook();
  if (dataBook.length === 0) {
    return;
  }

  const title = document.getElementById("searchBookTitle").value;
  if (title === null) {
    renderBook(dataBook);
    return;
  }
  const listBook = searchlistBook(title);
  renderBook(listBook);
});

function resetAllForm() {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;
  document.getElementById("searchBookTitle").value = "";
}

window.addEventListener("load", function (event) {
  if (cekStorage) {
    if (localStorage.getItem(storage_key) !== null) {
      const dataBook = getlistBook();
      renderBook(dataBook);
    }
  } else {
    alert("Browser Tidak Support");
  }
});
