// 等待 DOM 内容加载完毕后执行
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. 获取 DOM 元素 (新增统计相关的元素) ---
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // 新增：获取统计显示元素
    const totalTasksSpan = document.getElementById('total-tasks');
    const completedTasksSpan = document.getElementById('completed-tasks');
    const pendingTasksSpan = document.getElementById('pending-tasks');

    // --- 2. 加载本地存储中的任务 ---
    loadTasks();
    // 新增：加载任务后立即更新统计
    updateTaskStats();

    // --- 3. 事件监听：提交新任务 ---
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const taskText = taskInput.value.trim(); 

        if (taskText !== '') {
            createTaskElement(taskText); 
            saveTasksToLocalStorage();   
            taskInput.value = '';        
            updateTaskStats(); // 新增：添加任务后更新统计
        }
    });

    // --- 4. 事件监听：处理任务列表点击（完成/删除）---
    taskList.addEventListener('click', (e) => {
        const clickedElement = e.target; 

        // 检查是否点击了“删除”按钮
        if (clickedElement.classList.contains('delete-btn')) {
            const taskItem = clickedElement.parentElement; 
            taskList.removeChild(taskItem);                
            saveTasksToLocalStorage();                     
            updateTaskStats(); // 新增：删除任务后更新统计
        }
        
        // 检查是否点击了任务项 <li> (用于标记完成)
        if (clickedElement.tagName === 'LI' || clickedElement.tagName === 'SPAN') {
            const taskItem = clickedElement.tagName === 'SPAN' 
                ? clickedElement.parentElement 
                : clickedElement;
            
            taskItem.classList.toggle('completed'); 
            saveTasksToLocalStorage();              
            updateTaskStats(); // 新增：标记完成/未完成后更新统计
        }
    });

    // --- 5. 函数：创建任务元素 (DOM) ---
    function createTaskElement(text, isCompleted = false) {
        const li = document.createElement('li');
        
        if (isCompleted) {
            li.classList.add('completed');
        }

        li.innerHTML = `
            <span>${text}</span>
            <button class="delete-btn">删除</button>
        `;
        
        taskList.appendChild(li); 
    }

    // --- 6. 函数：保存任务到本地存储 (localStorage) ---
    function saveTasksToLocalStorage() {
        const tasks = [];
        const taskItems = taskList.querySelectorAll('li');

        taskItems.forEach(item => {
            const taskText = item.querySelector('span').textContent;
            const isCompleted = item.classList.contains('completed');
            
            tasks.push({ text: taskText, completed: isCompleted });
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // --- 7. 函数：从本地存储加载任务 ---
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        tasks.forEach(task => {
            createTaskElement(task.text, task.completed);
        });
    }

    // --- 8. 新增函数：更新任务统计显示 ---
    function updateTaskStats() {
        const allTasks = taskList.querySelectorAll('li');
        const completedTasks = taskList.querySelectorAll('li.completed');

        totalTasksSpan.textContent = allTasks.length;
        completedTasksSpan.textContent = completedTasks.length;
        pendingTasksSpan.textContent = allTasks.length - completedTasks.length;
    }

});