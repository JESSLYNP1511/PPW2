const socket = io();

socket.on("newTask", (task) => {
  alert(`Tugas baru ditambahkan: ${task.title}`);
  window.location.reload();
});
