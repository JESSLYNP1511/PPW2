const API_URL = "http://localhost:3000/api"; // Ganti dengan URL backend kamu

// 🔹 LOGIN
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                window.location.href = "index.html"; // Redirect ke halaman utama
            } else {
                document.getElementById("loginError").innerText = data.message;
            }
        });
    }
});

// 🔹 LOGOUT
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// 🔹 AMBIL DAFTAR TUGAS
async function getTasks() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const response = await fetch(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const tasks = await response.json();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${task.title}</strong> - ${task.description}
            <button onclick="updateTask(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Hapus</button>
        `;
        taskList.appendChild(li);
    });
}

// 🔹 TAMBAH TUGAS
document.getElementById("taskForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
    });

    if (response.ok) {
        getTasks();
    }
});

// 🔹 UPDATE TUGAS
async function updateTask(id) {
    const newTitle = prompt("Masukkan judul baru:");
    const newDescription = prompt("Masukkan deskripsi baru:");
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: newTitle, description: newDescription }),
    });

    getTasks();
}

// 🔹 HAPUS TUGAS
async function deleteTask(id) {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    getTasks();
}

// 🔹 Load daftar tugas saat halaman utama dibuka
if (document.getElementById("taskList")) {
    getTasks();
}
