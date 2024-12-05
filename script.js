document.addEventListener('DOMContentLoaded', function() {
    let users = [];
    const userTableBody = document.getElementById('userTableBody');
    const totalUsersSpan = document.getElementById('totalUsers');
    const searchInput = document.getElementById('searchInput');

    // Fetch users from PHP script
    fetch('fetch_data.php')
        .then(response => response.json())
        .then(data => {
            users = data;
            renderUsers(users);
            totalUsersSpan.textContent = users.length;
        })
        .catch(error => console.error('Error:', error));

    // Render users in the table
    function renderUsers(usersToRender) {
        userTableBody.innerHTML = '';
        usersToRender.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
            `;
            userTableBody.appendChild(row);
        });
    }

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm)
        );
        renderUsers(filteredUsers);
    });

    // Sorting functionality
    document.querySelectorAll('.sort-btn').forEach(button => {
        button.addEventListener('click', function() {
            const sortBy = this.dataset.sort;
            users.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
            if (this.classList.contains('sorted-asc')) {
                users.reverse();
                this.classList.remove('sorted-asc');
                this.classList.add('sorted-desc');
            } else {
                this.classList.remove('sorted-desc');
                this.classList.add('sorted-asc');
            }
            renderUsers(users);
        });
    });
});