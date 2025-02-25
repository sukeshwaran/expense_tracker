const API_URL = 'http://localhost:5000/api/auth';
const API_CONTACTS_URL = 'http://localhost:5000/api/v1/contacts';
const API_EXPENSES_URL = 'http://localhost:5000/api/v1/expenses';
const token = localStorage.getItem('token');

// Function to check if user is authenticated
function checkAuth() {
    if (!token) {
        alert('You are not authenticated. Please log in.');
        window.location.href = 'login.html';
    }
}

// Login function
async function login(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch("http://localhost:5000/api/v1/auth/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
}

// Signup function
async function signup(event) {
    event.preventDefault();
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (!username || !email || !password) {
        alert("All fields are required");
        return;
    }
    try {
        const response = await fetch("http://localhost:5000/api/v1/auth/register", {  // Make sure endpoint is correct
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Signup successful! Please log in.');
            window.location.href = 'login.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during signup:', error);
        alert('An error occurred. Please try again.');
    }
}

// Logout function
function logout() {
    try {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error during logout:', error);
        alert('An error occurred while logging out.');
    }
}

// Expense functions
async function fetchExpenses() {
    try {
        const token = localStorage.getItem('token'); // Get token
        if (!token) {
            console.error('No token found, redirecting to login.');
            window.location.href = 'login.html'; // Redirect to login
            return;
        }

        const response = await fetch('http://localhost:5000/api/v1/expenses', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const responseData = await response.json();
        console.log('Response received:', responseData); // Debugging

        if (response.ok) {
            if (Array.isArray(responseData.data)) {
                displayExpenses(responseData.data);
            } else {
                console.error('Expected an array but got:', responseData);
            }
        } else {
            alert(responseData.message || 'Error fetching expenses.');
        }
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
}

function displayExpenses(expenses) {
    if (!Array.isArray(expenses)) {
        console.error('Expenses is not an array:', expenses);
        return;
    }

    const expenseTableBody = document.getElementById('expenseTableBody');
    expenseTableBody.innerHTML = ''; // Clear old data

    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.category}</td>
            <td>₹${expense.amount}</td>
            <td>${expense.description}</td>
            <td>
                <button onclick="updateExpense('${expense.id}')">✏️ Edit</button>
                <button onclick="deleteExpense('${expense.id}')">🗑️ Delete</button>
            </td>
        `;
        expenseTableBody.appendChild(row);
    });
}

async function deleteExpense(expenseId) {
    if (confirm('Are you sure you want to delete this expense?')) {
        try {
            console.log(`Deleting expense with ID: ${expenseId}`); // ✅ Debugging

            const response = await fetch(`${API_EXPENSES_URL}/${expenseId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const responseData = await response.json(); // ✅ Read response

            if (response.ok) {
                console.log('Expense deleted:', responseData);
                fetchExpenses(); // ✅ Refresh the list after deletion
            } else {
                alert(responseData.message || 'Error deleting expense.');
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
            alert('There was an issue deleting the expense. Please try again.');
        }
    }
}

async function addExpense(event) {
    event.preventDefault();

    const token = localStorage.getItem('token'); // ✅ Get token from localStorage
    if (!token) {
        alert('User not authenticated! Please log in.');
        window.location.href = 'login.html';
        return;
    }

    // ✅ Get values from input fields
    const category = prompt('Enter new category:');
    const amount = prompt('Enter new amount:');
    const description = prompt('Enter new description:'); // 🔄 Changed 'title' to 'description'
    

    if (!description || !amount || !category) {
        alert('All fields are required!');
        return;
    }

    try {
        const response = await fetch(API_EXPENSES_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ description, amount, category })
        });

        const responseData = await response.json(); // ✅ Read response JSON

        if (response.ok) {
            alert('Expense added successfully!');
            fetchExpenses(); // ✅ Refresh expenses
        } else {
            alert(responseData.error || 'Error adding expense.');
        }
    } catch (error) {
        console.error('Error adding expense:', error);
        alert('There was an issue adding the expense. Please try again.');
    }
}
async function updateExpense(expenseId) {
    const description = prompt('Enter new description:'); // 🔄 Changed 'title' to 'description'
    const amount = prompt('Enter new amount:');
    const category = prompt('Enter new category:');

    if (!description || !amount || !category) {
        alert('All fields are required!');
        return;
    }

    try {
        const response = await fetch(`${API_EXPENSES_URL}/${expenseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ description, amount, category }) // 🔄 Updated field names
        });

        if (response.ok) {
            fetchExpenses();
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Error updating expense.');
        }
    } catch (error) {
        console.error('Error updating expense:', error);
        alert('There was an issue updating the expense. Please try again.');
    }
}

async function addContact(event) {
    event.preventDefault();
    const usernameField = document.getElementById('contact-username');
    const emailField = document.getElementById('contact-email');
    const messageField = document.getElementById('contact-message');
    
    const username = usernameField.value;
    const email = emailField.value;
    const message = messageField.value;

    try {
        const response = await fetch(API_CONTACTS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, message })
        });

        if (!response.ok) throw new Error('Failed to add contact');

        // ✅ Clear the form after successful submission
        usernameField.value = "";
        emailField.value = "";
        messageField.value = "";

        // ✅ Show a success message
        const responseMessage = document.getElementById('responseMessage');
        responseMessage.classList.remove('hidden');
        setTimeout(() => responseMessage.classList.add('hidden'), 3000);
        
    } catch (error) {
        console.error('Error adding contact:', error);
        alert('An error occurred while adding the contact.');
    }
}




document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');

    // ✅ Fetch expenses only if the user is logged in
    if (token && document.getElementById('expensesTable')) {
        fetchExpenses();
    }

    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token'); // ✅ Clear token
            window.location.href = 'login.html'; // ✅ Redirect to login
        });
    }

    if (document.getElementById('login-form')) {
        document.getElementById('login-form').addEventListener('submit', login);
    }

    if (document.getElementById('signup-form')) {
        document.getElementById('signup-form').addEventListener('submit', signup);
    }
    // ✅ Correct way to add expense listener
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', addExpense);
    }
    document.getElementById('contactForm').addEventListener('submit', addContact);
});
