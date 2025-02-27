document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      window.location.href = "/login";
    }
  
    fetch("/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = data
          .map(
            (task) => `
            <li>
              ${task.title} - ${task.category}
              <button onclick="deleteTask('${task.id}')">Hapus</button>
            </li>`
          )
          .join("");
      });
  
    document.getElementById("add-task-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const category = document.getElementById("category").value;
  
      const res = await fetch("/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, category }),
      });
  
      if (res.ok) {
        window.location.reload();
      }
    });
  });
  
  async function deleteTask(taskId) {
    const token = localStorage.getItem("token");
    const res = await fetch(`/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  
    if (res.ok) {
      window.location.reload();
    }
  }
  