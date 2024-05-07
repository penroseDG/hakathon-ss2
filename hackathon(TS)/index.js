"use strict";
class TodoItem {
    constructor(id, name, completed) {
        this.id = id;
        this.name = name;
        this.completed = completed;
    }
}
class TodoList {
    constructor() {
        let storedList = localStorage.getItem("todoList");
        if (storedList) {
            this.todoList = JSON.parse(storedList).map((item) => new TodoItem(item.id, item.name, item.completed));
        }
        else {
            this.todoList = [];
        }
    }
    renderJob() {
        let listElement = document.querySelector(".list-work");
        listElement.innerHTML = "";
        this.todoList.forEach((item) => {
            let listItem = document.createElement("li");
            listItem.className = "work-item";
            listItem.innerHTML = `
                <div class="work-item-left">
                    <input type="checkbox" ${item.completed ? "checked" : ""} onchange="todoList.updateJob(${item.id}, this.checked)">
                    <p ${item.completed ? 'style="text-decoration: line-through;"' : ''}>${item.name}</p>
                </div>
                <div class="work-item-right">
                    <i class="fa-solid fa-pen-to-square" onclick="todoList.editJob(${item.id})"></i>
                    <i class="fa-solid fa-trash-can" onclick="todoList.deleteJob(${item.id})"></i>
                </div>
            `;
            listElement.appendChild(listItem);
        });
    }
    createJob(name) {
        if (!this.validateInput(name)) {
            return;
        }
        // Tiến hành thêm mới công việc
        let newItem = new TodoItem(this.todoList.length + 1, name, false);
        this.todoList.push(newItem);
        this.saveToLocalStorage();
        this.renderJob();
    }
    updateJob(id, completed) {
        let itemIndex = this.todoList.findIndex((item) => item.id === id);
        this.todoList[itemIndex].completed = completed;
        this.saveToLocalStorage();
        this.renderJob();
    }
    editJob(id) {
        let newName = prompt("Nhập tên mới cho công việc:");
        if (newName !== null && newName.trim() !== "") {
            let itemIndex = this.todoList.findIndex((item) => item.id === id);
            this.todoList[itemIndex].name = newName.trim();
            this.saveToLocalStorage();
            this.renderJob();
        }
    }
    deleteJob(id) {
        let itemIndex = this.todoList.findIndex((item) => item.id === id);
        this.todoList.splice(itemIndex, 1);
        this.saveToLocalStorage();
        this.renderJob();
    }
    saveToLocalStorage() {
        localStorage.setItem("todoList", JSON.stringify(this.todoList));
    }
    countCompletedJobs() {
        let completedJobs = this.todoList.filter((item) => item.completed);
        return completedJobs.length;
    }
    validateInput(name) {
        // Kiểm tra xem tên công việc có rỗng không
        if (name.trim() === "") {
            alert("Tên công việc không được để trống!");
            return false;
        }
        const existingItem = this.todoList.find(item => item.name === name);
        if (existingItem) {
            alert("Tên công việc đã tồn tại trong danh sách!");
            return false;
        }
        return true;
    }
}
let todoList = new TodoList();
todoList.renderJob();
document.querySelector(".btn-add").addEventListener("click", () => {
    let inputElement = document.querySelector(".header-input");
    let jobName = inputElement.value.trim();
    if (jobName !== "") {
        todoList.createJob(jobName);
        inputElement.value = "";
    }
    else {
        alert("Tên công việc không được để trống!");
    }
});
