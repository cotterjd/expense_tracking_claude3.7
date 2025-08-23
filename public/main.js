// Simple state management using localStorage
const defaultCategories = ["Food", "Transport", "Entertainment"];
let categories = JSON.parse(localStorage.getItem("categories")) || defaultCategories.map(name => ({ name, expenses: [] }));
let pendingExpense = null;

function saveCategories() {
  localStorage.setItem("categories", JSON.stringify(categories));
}

function renderCategories() {
  const list = document.getElementById("categoryList");
  list.innerHTML = "<h2>Categories</h2>" + categories.map(cat => `
    <div class="category" onclick="showExpenses('${cat.name}')">
      <span>${cat.name}</span>
      <span>$${cat.expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}</span>
    </div>
  `).join("");
}

function showCategoryPopup() {
  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popup-content">
      <h2>Select Category</h2>
      <div>
        ${categories.map(cat => `<button onclick="selectCategory('${cat.name}')">${cat.name}</button>`).join(" ")}
      </div>
      <div class="category-actions">
        <input type="text" id="newCategory" placeholder="Add category">
        <button onclick="addCategory()">Add</button>
        <button onclick="deleteCategory()">Delete</button>
      </div>
      <button onclick="closePopup()">Cancel</button>
    </div>
  `;
  popup.style.display = "flex";
}

function selectCategory(name) {
  if (pendingExpense) {
    const cat = categories.find(c => c.name === name);
    cat.expenses.push(pendingExpense);
    saveCategories();
    pendingExpense = null;
    closePopup();
    renderCategories();
  }
}

function addCategory() {
  const input = document.getElementById("newCategory");
  const name = input.value.trim();
  if (name && !categories.some(c => c.name === name)) {
    categories.push({ name, expenses: [] });
    saveCategories();
    input.value = "";
    showCategoryPopup();
  }
}

function deleteCategory() {
  const input = document.getElementById("newCategory");
  const name = input.value.trim();
  if (name && categories.some(c => c.name === name)) {
    categories = categories.filter(c => c.name !== name);
    saveCategories();
    input.value = "";
    showCategoryPopup();
  }
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

function showExpenses(name) {
  const cat = categories.find(c => c.name === name);
  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="modal-content">
      <h2>${cat.name} Expenses</h2>
      <div class="expense-list">
        ${cat.expenses.length ? cat.expenses.map(e => `<div class="expense"><span>${e.name}</span><span>$${e.amount.toFixed(2)}</span></div>`).join("") : "<em>No expenses yet.</em>"}
      </div>
      <button onclick="closePopup()">Close</button>
    </div>
  `;
  popup.style.display = "flex";
}

// Event listeners
window.showExpenses = showExpenses;
window.selectCategory = selectCategory;
window.addCategory = addCategory;
window.deleteCategory = deleteCategory;
window.closePopup = closePopup;

// Submit expense
const submitBtn = document.getElementById("submitExpense");
submitBtn.onclick = function() {
  const name = document.getElementById("expenseName").value.trim();
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  if (name && !isNaN(amount) && amount > 0) {
    pendingExpense = { name, amount };
    showCategoryPopup();
    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";
  }
};

renderCategories();
