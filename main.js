// Get elements by ID
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");
let search = document.getElementById("search");
let searchByTitleBtn = document.getElementById("searchByTitle");
let searchByCategoryBtn = document.getElementById("searchByCategory");

// Array to store created products
let products = localStorage.getItem("products")
  ? JSON.parse(localStorage.getItem("products"))
  : [];

// Function to calculate total
function getTotal() {
  if (price.value !== "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value +" EGP";
    total.innerHTML = result; // Append currency symbol
    total.style.background = "#040"; // Green background for valid total
  } else {
    total.innerHTML = "";
    total.style.background = "#a00d02"; // Red background for invalid total
  }
}

// Function to create a new product
function createProduct() {
  let product = {
    title: title.value,
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value,
  };

  // Validate inputs
  if (
    product.title !== "" &&
    product.price !== "" &&
    product.category !== "" &&
    product.total !== ""
  ) {
    // Convert count to number and validate
    let countValue = parseInt(product.count);
    if (isNaN(countValue) || countValue <= 0) {
      countValue = 1; // Default to 1 if invalid
    }

    // Add product to the list
    for (let i = 0; i < countValue; i++) {
      products.push(product);
    }

    // Save products to local storage
    localStorage.setItem("products", JSON.stringify(products));

    clearInputs(); // Clear inputs after creation
    showData(); // Show updated data
  } else {
    alert("Please fill in all required fields!");
  }
}

// Function to clear input fields
function clearInputs() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
  total.style.background = "#a00d02"; // Reset total background
}

// Function to show data in a table
function showData() {
  let table = "";
  let filteredProducts = products;

  // If search input is not empty, filter products
  let searchValue = search.value.toLowerCase();
  if (searchValue !== "") {
    filteredProducts = products.filter((product) =>
      getsearchmood === "title"
        ? product.title.toLowerCase().includes(searchValue)
        : product.category.toLowerCase().includes(searchValue)
    );
  }

  // Create table rows for the filtered products
  for (let i = 0; i < filteredProducts.length; i++) {
    let product = filteredProducts[i];
    table += `
      <tr>
        <td>${i + 1}</td>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>${product.taxes}</td>
        <td>${product.ads}</td>
        <td>${product.discount}</td>
        <td>${product.total}</td>
        <td>${product.category}</td>
        <td><button onclick="updateProduct(${i})">Update</button></td>
        <td><button onclick="deleteProduct(${i})">Delete</button></td>
      </tr>
    `;
  }

  document.getElementById("tableBody").innerHTML = table;

  // Show "Delete All" button if products are available
  let deleteAllDiv = document.getElementById("deleteAll");
  if (products.length > 0) {
    deleteAllDiv.innerHTML = `<button onclick="deleteAll()">Delete All (${products.length})</button>`;
  } else {
    deleteAllDiv.innerHTML = "";
  }
}

// Function to delete product
function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  showData(); // Refresh the table
}

// Placeholder for update function
function updateProduct(index) {
  let product = products[index];

  // Fill inputs with product data
  title.value = product.title;
  price.value = product.price;
  taxes.value = product.taxes;
  ads.value = product.ads;
  discount.value = product.discount;
  getTotal();
  count.value = 1; // Only update 1 item
  category.value = product.category;

  // Temporarily change button text to "Update"
  submit.innerHTML = "Update";

  // Remove the product from the list to re-add it after update
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  showData();
}

// Search function to change search mood
let getsearchmood = "title"; // Default search mode

function getSearchMood(id) {
  if (id === "searchByTitle") {
    getsearchmood = "title";
    search.placeholder = "Search by Title"; // Change placeholder text
  } else if (id === "searchByCategory") {
    getsearchmood = "category";
    search.placeholder = "Search by Category"; // Change placeholder text
  }
  search.focus();
  search.value = ""; // Clear the search input
  showData(); // Refresh the table after search mode change
}

// Function to handle search input change
search.oninput = function () {
  showData(); // Update the table based on the search value
};

submit.onclick = function () {
  createProduct(); // Create the product when submit is clicked
};

showData(); // Show data initially

// Event listeners for dynamic total calculation
price.oninput = getTotal;
taxes.oninput = getTotal;
ads.oninput = getTotal;
discount.oninput = getTotal;

// Delete all products
function deleteAll() {
  localStorage.removeItem("products");
  products = [];
  showData(); // Refresh the table after deletion
}

// Event listeners for search buttons
searchByTitleBtn.onclick = function () {
  getSearchMood("searchByTitle"); // Switch to title search mode
};

searchByCategoryBtn.onclick = function () {
  getSearchMood("searchByCategory"); // Switch to category search mode
};
