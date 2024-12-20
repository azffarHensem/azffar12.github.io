// Check if a user is logged in
if (localStorage.getItem('loggedIn') === 'true') {
  window.location.href = 'dashboard.html'; // Redirect to dashboard if already logged in
}

// Handle login functionality
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Check if the username is 'admin' and password is 'admin'
  if (username === 'admin' && password === 'admin') {
    // Admin login
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify({ username: 'admin', role: 'admin' }));
    window.location.href = 'admin-dashboard.html';  // Redirect to admin dashboard
    return;
  }

  // Check if the user exists in the localStorage users list
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Store user info and set loggedIn status
    localStorage.setItem('loggedIn', true);
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = 'user-dashboard.html';  // Redirect to user dashboard
  } else {
    document.getElementById('error-message').style.display = 'block';
  }
});

// Handle sign-up functionality
document.getElementById('signup-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm-password').value;

  if (password !== confirmPassword) {
    document.getElementById('signup-error-message').innerText = 'Passwords do not match.';
    document.getElementById('signup-error-message').style.display = 'block';
    return;
  }

  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Check if the username already exists
  if (users.some(u => u.username === username)) {
    document.getElementById('signup-error-message').innerText = 'Username already exists.';
    document.getElementById('signup-error-message').style.display = 'block';
    return;
  }

  // Assign the 'user' role to all new users
  const role = 'user';  // All new users will have the 'user' role

  // Add the new user to localStorage
  users.push({ username, password, role });
  localStorage.setItem('users', JSON.stringify(users));

  // Redirect to login page
  window.location.href = 'index.html';
});

// Handle user dashboard
if (localStorage.getItem('loggedIn') !== 'true') {
  window.location.href = 'index.html'; // Redirect if not logged in
}

let actions = JSON.parse(localStorage.getItem('actions')) || [];
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

function updateActionTable() {
  const tableBody = document.querySelector('#action-table tbody');
  tableBody.innerHTML = '';
  
  actions.forEach(action => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${action.action}</td><td>${action.option}</td><td>${action.qty}</td><td>${action.timestamp}</td>`;
    tableBody.appendChild(row);
  });
}

// **User Dashboard**: Users can add/remove options
if (currentUser.role === 'user') {
  // Add Option
  document.getElementById('add-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const option = document.getElementById('add-option').value;
    const qty = document.getElementById('add-qty').value;

    const newAction = {
      action: 'Added',
      option,
      qty,
      timestamp: new Date().toLocaleString()
    };

    actions.push(newAction);
    localStorage.setItem('actions', JSON.stringify(actions));
    updateActionTable();
    
    document.getElementById('add-form').reset();
  });

  // Remove Option
  document.getElementById('remove-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const option = document.getElementById('remove-option').value;

    const newAction = {
      action: 'Removed',
      option,
      qty: 0,
      timestamp: new Date().toLocaleString()
    };

    actions.push(newAction);
    localStorage.setItem('actions', JSON.stringify(actions));
    updateActionTable();
    
    document.getElementById('remove-form').reset();
  });
}

// Admin Dashboard: Admin can see actions done by users
if (currentUser.role === 'admin') {
  document.getElementById('add-form').style.display = 'none';  // Hide user options for admins
  document.getElementById('remove-form').style.display = 'none';  // Hide user options for admins
}

// Update the action table on page load
updateActionTable();

// Logout function
function logout() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}
