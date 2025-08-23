class BudgetApp {
    constructor() {
        this.categories = this.loadCategories();
        this.expenses = this.loadExpenses();
        this.currentExpense = null;
        
        this.initializeEventListeners();
        this.renderCategories();
    }

    // Load data from localStorage
    loadCategories() {
        const saved = localStorage.getItem('budget-categories');
        return saved ? JSON.parse(saved) : ['Food', 'Transportation', 'Entertainment', 'Utilities'];
    }

    loadExpenses() {
        const saved = localStorage.getItem('budget-expenses');
        return saved ? JSON.parse(saved) : [];
    }

    // Save data to localStorage
    saveCategories() {
        localStorage.setItem('budget-categories', JSON.stringify(this.categories));
    }

    saveExpenses() {
        localStorage.setItem('budget-expenses', JSON.stringify(this.expenses));
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Submit button
        document.getElementById('submit-btn').addEventListener('click', () => {
            this.handleSubmit();
        });

        // Enter key on inputs
        document.getElementById('description').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSubmit();
        });
        document.getElementById('amount').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSubmit();
        });

        // Modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        // Add category button
        document.getElementById('add-category-btn').addEventListener('click', () => {
            this.addNewCategory();
        });

        // Enter key on new category input
        document.getElementById('new-category').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addNewCategory();
        });
    }

    // Handle expense submission
    handleSubmit() {
        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);

        if (!description || !amount || amount <= 0) {
            alert('Please enter a valid description and amount.');
            return;
        }

        this.currentExpense = { description, amount };
        this.showCategoryModal();
    }

    // Show category selection modal
    showCategoryModal() {
        const modal = document.getElementById('category-modal');
        const categoryOptions = document.getElementById('category-options');
        
        categoryOptions.innerHTML = '';
        
        this.categories.forEach(category => {
            const option = document.createElement('div');
            option.className = 'category-option';
            option.innerHTML = `
                <span>${category}</span>
                <button class="btn-danger" onclick="app.deleteCategory('${category}')">Delete</button>
            `;
            option.addEventListener('click', (e) => {
                if (e.target.tagName !== 'BUTTON') {
                    this.selectCategory(category);
                }
            });
            categoryOptions.appendChild(option);
        });

        modal.style.display = 'block';
    }

    // Select a category and add expense
    selectCategory(category) {
        const expense = {
            ...this.currentExpense,
            category,
            date: new Date().toISOString(),
            id: Date.now().toString()
        };

        this.expenses.push(expense);
        this.saveExpenses();
        this.renderCategories();
        this.closeModal(document.getElementById('category-modal'));
        this.clearForm();
    }

    // Add new category
    addNewCategory() {
        const newCategoryInput = document.getElementById('new-category');
        const categoryName = newCategoryInput.value.trim();

        if (!categoryName) {
            alert('Please enter a category name.');
            return;
        }

        if (this.categories.includes(categoryName)) {
            alert('Category already exists.');
            return;
        }

        this.categories.push(categoryName);
        this.saveCategories();
        newCategoryInput.value = '';
        this.showCategoryModal(); // Refresh the modal
    }

    // Delete category
    deleteCategory(categoryName) {
        if (confirm(`Are you sure you want to delete the "${categoryName}" category? This will also delete all expenses in this category.`)) {
            this.categories = this.categories.filter(cat => cat !== categoryName);
            this.expenses = this.expenses.filter(exp => exp.category !== categoryName);
            this.saveCategories();
            this.saveExpenses();
            this.renderCategories();
            this.showCategoryModal(); // Refresh the modal
        }
    }

    // Calculate total amount for a category
    getCategoryTotal(category) {
        return this.expenses
            .filter(expense => expense.category === category)
            .reduce((total, expense) => total + expense.amount, 0);
    }

    // Get expenses for a category
    getCategoryExpenses(category) {
        return this.expenses
            .filter(expense => expense.category === category)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Render categories
    renderCategories() {
        const categoriesList = document.getElementById('categories-list');
        
        if (this.categories.length === 0) {
            categoriesList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <p>No categories yet. Add your first expense to get started!</p>
                </div>
            `;
            return;
        }

        categoriesList.innerHTML = '';
        
        this.categories.forEach(category => {
            const total = this.getCategoryTotal(category);
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="category-name">${category}</div>
                <div class="category-amount">$${total.toFixed(2)}</div>
            `;
            card.addEventListener('click', () => {
                this.showExpenseModal(category);
            });
            categoriesList.appendChild(card);
        });
    }

    // Show expense list modal
    showExpenseModal(category) {
        const modal = document.getElementById('expense-modal');
        const title = document.getElementById('expense-modal-title');
        const expenseList = document.getElementById('expense-list');
        
        title.textContent = `${category} Expenses`;
        
        const expenses = this.getCategoryExpenses(category);
        
        if (expenses.length === 0) {
            expenseList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💸</div>
                    <p>No expenses in this category yet.</p>
                </div>
            `;
        } else {
            expenseList.innerHTML = '';
            expenses.forEach(expense => {
                const item = document.createElement('div');
                item.className = 'expense-item';
                const date = new Date(expense.date).toLocaleDateString();
                item.innerHTML = `
                    <div>
                        <div class="expense-description">${expense.description}</div>
                        <div class="expense-date">${date}</div>
                    </div>
                    <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
                `;
                expenseList.appendChild(item);
            });
        }
        
        modal.style.display = 'block';
    }

    // Close modal
    closeModal(modal) {
        modal.style.display = 'none';
        this.currentExpense = null;
    }

    // Clear form
    clearForm() {
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('description').focus();
    }

    // Export data (bonus feature)
    exportData() {
        const data = {
            categories: this.categories,
            expenses: this.expenses,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'budget-data.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Import data (bonus feature)
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.categories && data.expenses) {
                    this.categories = data.categories;
                    this.expenses = data.expenses;
                    this.saveCategories();
                    this.saveExpenses();
                    this.renderCategories();
                    alert('Data imported successfully!');
                }
            } catch (error) {
                alert('Error importing data. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the app
const app = new BudgetApp();

// Make app globally available for inline event handlers
window.app = app;
