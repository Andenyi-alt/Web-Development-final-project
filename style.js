document.getElementById('loginform').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Perform your login logic here (e.g., AJAX request to your server)

    // On successful login, redirect to the main website page
    window.location.href = 'view_expense.html'; // Replace 'main.html' with your main page URL
  });

  
  document.getElementById('expenseForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const name = document.getElementById('name').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;

    // Create a new row and cells
    const table = document.getElementById('expenseTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    const nameCell = newRow.insertCell(0);
    const amountCell = newRow.insertCell(1);
    const categoryCell = newRow.insertCell(2);

    // Set cell values
    nameCell.textContent = name;
    amountCell.textContent = amount;
    categoryCell.textContent = category;

    // Clear the form
    document.getElementById('expenseForm').reset();
  });

//script.js
document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.getElementById("expenseForm");
  const expenseList = document.getElementById("expense-list");


  let expenses = [];

  expenseForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const amount = parseFloat(document.getElementById("amount").value);
      const category = document.getElementById("category").value;
      

      const expense = {
          id: Date.now(),
          name,
          amount,
          category,
      };

      expenses.push(expense);
      displayExpenses(expenses);
      updateTotalAmount();

      expenseForm.reset();
  });

  expenseList.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
          const id = parseInt(e.target.dataset.id);
          expenses = expenses.filter(expense => expense.id !== id);
          displayExpenses(expenses);
          updateTotalAmount();
      }

      if (e.target.classList.contains("edit-btn")) {
          const id = parseInt(e.target.dataset.id);
          const expense = expenses.find(expense => expense.id === id);

          document.getElementById("name").value = expense.name;
          document.getElementById("amount").value = expense.amount;
          document.getElementById("category").value = expense.category;
          document.getElementById("date").value = expense.date;

          expenses = expenses.filter(expense => expense.id !== id);
          displayExpenses(expenses);
          updateTotalAmount();
      }
  });

  filterCategory.addEventListener("change", (e) => {
      const category = e.target.value;
      if (category === "All") {
          displayExpenses(expenses);
      } else {
          const filteredExpenses = expenses.filter(expense => expense.category === category);
          displayExpenses(filteredExpenses);
      }
  });

  function displayExpenses(expenses) {
      expenseList.innerHTML = "";
      expenses.forEach(expense => {
          const row = document.createElement("tr");

          row.innerHTML = `
              <td>${expense.name}</td>
              <td>$${expense.amount.toFixed(2)}</td>
              <td>${expense.category}</td>
              <td>${expense.date}</td>
              <td>
                  <button class="edit-btn" data-id="${expense.id}">Edit</button>
                  <button class="delete-btn" data-id="${expense.id}">Delete</button>
              </td>
          `;

          expenseList.appendChild(row);
      });
  }

  function updateTotalAmount() {
      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      totalAmount.textContent = total.toFixed(2);
  }
});
