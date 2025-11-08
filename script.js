// 等待 DOM 内容加载完毕后执行
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. 获取 DOM 元素 ---
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // --- 2. 加载本地存储中的任务 ---
    loadTasks();

    // --- 3. 事件监听：提交新任务 ---
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); // 阻止表单默认提交行为
        
        const taskText = taskInput.value.trim(); // 获取输入内容并去除首尾空格

        if (taskText !== '') {
            createTaskElement(taskText); // 创建任务 DOM 元素
            saveTasksToLocalStorage();   // 保存到本地存储
            taskInput.value = '';        // 清空输入框
        }
    });

    // --- 4. 事件监听：处理任务列表点击（完成/删除）---
    // 我们使用“事件委托”，只在父元素 <ul> 上添加一个监听器
    taskList.addEventListener('click', (e) => {
        const clickedElement = e.target; // 获取被点击的元素

        // 检查是否点击了“删除”按钮
        if (clickedElement.classList.contains('delete-btn')) {
            const taskItem = clickedElement.parentElement; // 获取父元素 <li>
            taskList.removeChild(taskItem);                // 从 DOM 中删除
            saveTasksToLocalStorage();                     // 更新本地存储
        }
        
        // 检查是否点击了任务项 <li> (用于标记完成)
        // 我们也检查 span，确保点击文本也能触发
        if (clickedElement.tagName === 'LI' || clickedElement.tagName === 'SPAN') {
            const taskItem = clickedElement.tagName === 'SPAN' 
                ? clickedElement.parentElement 
                : clickedElement;
            
            taskItem.classList.toggle('completed'); // 切换 'completed' 类
            saveTasksToLocalStorage();              // 更新本地存储
        }
    });

    // --- 5. 函数：创建任务元素 (DOM) ---
    function createTaskElement(text, isCompleted = false) {
        const li = document.createElement('li');
        
        // 如果任务已完成，添加 'completed' 类
        if (isCompleted) {
            li.classList.add('completed');
        }

        // 设置 li 的 HTML 内容
        li.innerHTML = `
            <span>${text}</span>
            <button class="delete-btn">删除</button>
        `;
        
        taskList.appendChild(li); // 将新任务添加到列表中
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

        // localStorage 只能存储字符串，所以我们将数组转换为 JSON 字符串
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // --- 7. 函数：从本地存储加载任务 ---
    function loadTasks() {
        // 从 localStorage 获取任务，如果不存在则返回一个空数组
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        tasks.forEach(task => {
            // 使用存储的数据创建 DOM 元素
            createTaskElement(task.text, task.completed);
        });
    }

});