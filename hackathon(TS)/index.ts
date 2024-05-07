interface ITodoItem {
    id: number;
    name: string;
    completed: boolean;
}
class TodoItem implements ITodoItem {
    id: number;
    name: string;
    completed: boolean;
    constructor(id: number, name: string, completed: boolean) {
        this.id = id;
        this.name = name;
        this.completed = completed;
    }
}
class TodoList {
    todoList: TodoItem[];
    constructor() {
        let storedList = localStorage.getItem("todoList");
        if (storedList) {
            this.todoList = JSON.parse(storedList).map((item: ITodoItem) => new TodoItem(item.id, item.name, item.completed));
        } else {
            this.todoList = [];
        }
    }
    renderJob(): void {
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
    createJob(name: string): void {
        if (!this.validateInput(name)) {
            return;
        }
        // Tiến hành thêm mới công việc
        let newItem = new TodoItem(this.todoList.length + 1, name, false);
        this.todoList.push(newItem);
        this.saveToLocalStorage();
        this.renderJob();
    }
    updateJob(id: number, completed: boolean): void {
        let itemIndex = this.todoList.findIndex((item) => item.id === id);
        this.todoList[itemIndex].completed = completed;
        this.saveToLocalStorage();
        this.renderJob();
    }
    editJob(id: number): void {
        let newName = prompt("Nhập tên mới cho công việc:");
        if (newName !== null && newName.trim() !== "") {
            let itemIndex = this.todoList.findIndex((item) => item.id === id);
            this.todoList[itemIndex].name = newName.trim();
            this.saveToLocalStorage();
            this.renderJob();
        }
    }
    deleteJob(id: number): void {
        let itemIndex = this.todoList.findIndex((item) => item.id === id);
        this.todoList.splice(itemIndex, 1);
        this.saveToLocalStorage();
        this.renderJob();
    }
    saveToLocalStorage(): void {
        localStorage.setItem("todoList", JSON.stringify(this.todoList));
    }
    countCompletedJobs(): number {
        let completedJobs = this.todoList.filter((item) => item.completed);
        return completedJobs.length;
    }
    validateInput(name: string): boolean {
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
    let inputElement = document.querySelector(".header-input") as HTMLInputElement;
    let jobName = inputElement.value.trim();
    if (jobName !== "") {
        todoList.createJob(jobName);
        inputElement.value = "";
    } else {
        alert("Tên công việc không được để trống!");
    }
});
