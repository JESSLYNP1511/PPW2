document.addEventListener("DOMContentLoaded", function () {
    const apiBaseUrl = "http://localhost:3000"; // Sesuaikan dengan backend
    
    // LOGIN
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                const res = await fetch(`${apiBaseUrl}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });
                const data = await res.json();
                
                if (res.ok) {
                    localStorage.setItem("token", data.token);
                    alert("Login berhasil!");
                    window.location.href = "dashboard.html";
                } else {
                    alert(data.message || "Login gagal!");
                }
            } catch (err) {
                console.error("Login error:", err);
            }
        });
    }

    // REGISTER
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async function (e) {
            e.preventDefault(); // Mencegah reload halaman
        
            const username = document.getElementById("regUsername").value;
            const password = document.getElementById("regPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
        
            if (password !== confirmPassword) {
                alert("Password tidak cocok!");
                return;
            }
        
            try {
                const response = await fetch(`${apiBaseUrl}/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });
        
                const result = await response.json();
                if (response.ok) {
                    alert("Registrasi berhasil! Silakan login.");
                    window.location.href = "login"; // Redirect ke halaman login
                } else {
                    alert(result.message || "Registrasi gagal!");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });
    }

    // LOAD TASKS (DASHBOARD)
    const taskContainer = document.getElementById("taskContainer");
    async function loadTasks() {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Anda harus login terlebih dahulu!");
            window.location.href = "login.html";
            return;
        }

        try {
            const res = await fetch(`${apiBaseUrl}/tasks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const tasks = await res.json();
            
            taskContainer.innerHTML = tasks.map(task => `
                <div class="task">
                    <h3>${task.title}</h3>
                    <p>Kategori: ${task.category}</p>
                    <p>Status: ${task.status}</p>
                    <p>Deadline: ${task.deadline}</p>
                    <button onclick="deleteTask(${task.id})">Hapus</button>
                </div>
            `).join("");
        } catch (error) {
            console.error("Gagal memuat tugas:", error);
        }
    }

    if (taskContainer) {
        loadTasks();
    }

    // DELETE TASK
    window.deleteTask = async function (id) {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Anda harus login!");
            return;
        }

        try {
            await fetch(`${apiBaseUrl}/tasks/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Tugas berhasil dihapus!");
            loadTasks(); // Refresh daftar tugas setelah dihapus
        } catch (error) {
            console.error("Gagal menghapus tugas:", error);
        }
    };
});
