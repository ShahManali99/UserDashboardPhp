document.addEventListener('DOMContentLoaded', function() {
    let users = [];
    const userTableBody = document.getElementById('userTableBody');
    const totalUsers = document.getElementById('totalUsers');
    const searchInput = document.getElementById('searchInput');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const itemsPerPage = 4;
    let currentPage = 1;

    // Logic to handle pagination when user does successive page changes.
    let pageChangeTimeout;
    function changePage(newPage) {
        clearTimeout(pageChangeTimeout);
        pageChangeTimeout = setTimeout(() => {
            toggleSpinner(true);
            currentPage = newPage;
            renderTable(users);
            toggleSpinner(false);
        }, 100);
    }

    const toggleSpinner = (show) => {
        loadingSpinner.style.display = show ? "block" : "none";
    };

    // Fetch users from PHP script.
    const fetchData = async () => {
        toggleSpinner(true);
        try {
            const response = await fetch("fetch_data.php");
            const data = await response.json();

            if (data.error) {
                alert(data.error);
                toggleSpinner(false);
                return;
            }

            users = data;
            totalUsers.textContent = users.length;
            renderTable(users);
        } catch (error) {
            alert("Failed to fetch users");
            console.error('Error:', error)
        } finally {
            toggleSpinner(false);
        }
    };

    // Handles pagination dynamically.
    function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const paginationElement = document.getElementById('pagination');
        paginationElement.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = "page-item " + (i === currentPage ? "active" : "");
            li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
            paginationElement.appendChild(li);
        }

        paginationElement.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.dataset.page) {
                e.preventDefault();
                const newPage = parseInt(e.target.dataset.page);
                changePage(newPage);
            }
        });
    }

    // Creates a modal view for showing user details.
    window.showUserDetails = function showUserDetails(userId) {
        const user = users.find(u => u.id === userId);
        const modalBody = `
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
            <p><strong>Website:</strong> ${user.website}</p>
            <p><strong>Company:</strong> ${user.company.name}</p>
        `;
        
        const modalHTML = `
            <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="userModalLabel">User Details</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ${modalBody}
                        </div>
                    </div>
                </div>
            </div>
        `;
    
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('userModal'));
        modal.show();
    
        document.getElementById('userModal').addEventListener('hidden.bs.modal', function () {
            this.remove();
        });
    }

    // Render users in the table.
    function renderTable(usersToRender) {
        const start = (currentPage - 1) * itemsPerPage;
        const paginatedUsers = usersToRender.slice(start, start + itemsPerPage);
        userTableBody.innerHTML = '';
        paginatedUsers.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>
                    <button class="btn btn-sm bg-primary text-white" data-bs-toggle="tooltip" title="View Details" onclick="showUserDetails(${user.id})">
                        Details
                    </button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
        renderPagination(usersToRender.length);
    }

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchName = searchInput.value.toLowerCase();
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchName)
        );
        renderTable(filteredUsers);
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
            renderTable(users);
        });
    });

    fetchData();
    
});