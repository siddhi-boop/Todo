// Data model configurations using themes
const cardThemes = [
    'var(--color-beige)',
    'var(--color-green)',
    'var(--color-purple)',
    'var(--color-pink)',
    'var(--color-gray)'
];

let themeCounter = 0;
let globalSearchQuery = "";

// Mock Database Storage Array State
let todoLists = [
    {
        id: "list-1",
        title: 'Daily To-Do',
        date: 'Today',
        color: 'var(--color-beige)',
        currentTab: 'all', // options: 'all', 'active', 'completed'
        sortBy: 'oldest',  // options: 'az', 'za', 'oldest', 'newest'
        tasks: [
            { id: "t1", text: 'Stay positive', completed: true, created: 1709020800000 },
            { id: "t2", text: 'Deep clean floors.', completed: false, created: 1709024400000 },
            { id: "t3", text: 'Wash windows.', completed: false, created: 1709028000000 },
            { id: "t4", text: 'Sanitize high-touch areas.', completed: false, created: 1709031600000 },
            { id: "t5", text: 'Organize closets.', completed: false, created: 1709035200000 },
            { id: "t6", text: 'Dust surfaces.', completed: false, created: 1709038800000 }
        ]
    },
    {
        id: "list-2",
        title: 'Work To-Do',
        date: 'Tomorrow, Feb 28',
        color: 'var(--color-green)',
        currentTab: 'all',
        sortBy: 'oldest',
        tasks: [
            { id: "t7", text: 'Check Emails', completed: true, created: 1709107200000 },
            { id: "t8", text: 'Review Code Base', completed: false, created: 1709110800000 }
        ]
    }
];

// Elements Selectors
const listsGrid = document.getElementById('listsGrid');
const addListBtn = document.getElementById('addListBtn');
const globalSearchInput = document.getElementById('globalSearch');

// Global Multi-List Search Filter Trigger Function
globalSearchInput.addEventListener('input', (e) => {
    globalSearchQuery = e.target.value.toLowerCase().trim();
    renderAllCards();
});

// Create unique identifiers
function generateUUID() {
    return 'id-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
}

// Global Core UI Rendering Processing Loop
function renderAllCards() {
    listsGrid.innerHTML = "";

    todoLists.forEach(listObj => {
        const card = document.createElement('div');
        card.className = 'todo-card';
        card.style.backgroundColor = listObj.color;

        // Card UI structure scaffolding block
        card.innerHTML = `
            <div class="card-header">
                <input type="text" class="card-title" value="${listObj.title}" placeholder="Add Title">
                <button class="btn-delete-card" title="Delete Card"><i class="fa-regular fa-trash-can"></i></button>
            </div>
            <div class="card-date">
                <i class="fa-regular fa-calendar"></i>
                <input type="text" value="${listObj.date}" placeholder="Due to">
            </div>

            <div class="card-utilities">
                <div class="card-tabs">
                    <button class="tab-btn ${listObj.currentTab === 'all' ? 'active' : ''}" data-tab="all">All</button>
                    <button class="tab-btn ${listObj.currentTab === 'active' ? 'active' : ''}" data-tab="active">Active</button>
                    <button class="tab-btn ${listObj.currentTab === 'completed' ? 'active' : ''}" data-tab="completed">Completed</button>
                </div>
                <select class="sort-select">
                    <option value="oldest" ${listObj.sortBy === 'oldest' ? 'selected' : ''}>Oldest</option>
                    <option value="newest" ${listObj.sortBy === 'newest' ? 'selected' : ''}>Newest</option>
                    <option value="az" ${listObj.sortBy === 'az' ? 'selected' : ''}>A to Z</option>
                    <option value="za" ${listObj.sortBy === 'za' ? 'selected' : ''}>Z to A</option>
                </select>
            </div>

            <div class="batch-actions">
                <button class="batch-btn" data-action="all">Select All</button>
                <button class="batch-btn" data-action="none">Unselect All</button>
                <button class="batch-btn danger" data-action="delete">Delete Selected</button>
            </div>

            <ul class="tasks-list"></ul>

            <div class="input-task-wrapper">
                <input type="text" class="input-task" placeholder="+ Add a task">
            </div>
        `;

        // Inner Processing Elements hooks setup
        const cardTitleInput = card.querySelector('.card-title');
        const cardDateInput = card.querySelector('.card-date input');
        const btnDeleteCard = card.querySelector('.btn-delete-card');
        const tasksListUl = card.querySelector('.tasks-list');
        const inputTask = card.querySelector('.input-task');
        const sortSelect = card.querySelector('.sort-select');

        // Dynamic Text Binding State updates
        cardTitleInput.addEventListener('change', (e) => { listObj.title = e.target.value; });
        cardDateInput.addEventListener('change', (e) => { listObj.date = e.target.value; });

        // Card Complete Wipe Processing
        btnDeleteCard.addEventListener('click', () => {
            todoLists = todoLists.filter(l => l.id !== listObj.id);
            renderAllCards();
        });

        // Tab Filtering Calculations
        let filteredTasks = [...listObj.tasks];
        if (listObj.currentTab === 'active') {
            filteredTasks = filteredTasks.filter(t => !t.completed);
        } else if (listObj.currentTab === 'completed') {
            filteredTasks = filteredTasks.filter(t => t.completed);
        }

        // Global Search execution parameter evaluations
        if (globalSearchQuery !== "") {
            filteredTasks = filteredTasks.filter(t => t.text.toLowerCase().includes(globalSearchQuery));
        }

        // Sorting Computation Engine Configurations 
        if (listObj.sortBy === 'az') {
            filteredTasks.sort((a, b) => a.text.localeCompare(b.text));
        } else if (listObj.sortBy === 'za') {
            filteredTasks.sort((a, b) => b.text.localeCompare(a.text));
        } else if (listObj.sortBy === 'oldest') {
            filteredTasks.sort((a, b) => a.created - b.created);
        } else if (listObj.sortBy === 'newest') {
            filteredTasks.sort((a, b) => b.created - a.created);
        }

        // Generate Task Rows DOM inside this card loop instance context
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <div class="task-left">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <input type="text" class="task-editable-text" value="${task.text}">
                </div>
                <button class="btn-delete-task"><i class="fa-solid fa-xmark"></i></button>
            `;

            const checkbox = li.querySelector('.task-checkbox');
            const editableInput = li.querySelector('.task-editable-text');
            const btnDeleteTask = li.querySelector('.btn-delete-task');

            // Complete Task Check box toggles handling state engine changes tracking
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                // Re-render because if you are on 'Active' or 'Completed' tab, the item should disappear
                renderAllCards();
            });

            // FEATURE Added: Inline Editing direct input change detection hooks binding variables logic execution
            editableInput.addEventListener('change', (e) => {
                task.text = e.target.value.trim();
            });

            // Single item row manual targeting cross click destruction routing actions mapping
            btnDeleteTask.addEventListener('click', () => {
                listObj.tasks = listObj.tasks.filter(t => t.id !== task.id);
                renderAllCards();
            });

            tasksListUl.appendChild(li);
        });

        
        card.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                listObj.currentTab = e.target.getAttribute('data-tab');
                renderAllCards();
            });
        });

        // Sorting Switch Selection listeners hooks binding 
        sortSelect.addEventListener('change', (e) => {
            listObj.sortBy = e.target.value;
            renderAllCards();
        });

        // Batch Toolkit Execution Actions Processing Logic Configuration mappings execution pipeline hooks
        card.querySelectorAll('.batch-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                if (action === 'all') {
                    filteredTasks.forEach(t => t.completed = true);
                } else if (action === 'none') {
                    filteredTasks.forEach(t => t.completed = false);
                } else if (action === 'delete') {
                    // Extract non-matching selected filtered elements rows profiles tracking IDs deletion array mapping checks
                    const filteredIds = filteredTasks.map(t => t.id);
                    listObj.tasks = listObj.tasks.filter(t => !(filteredIds.includes(t.id) && t.completed));
                }
                renderAllCards();
            });
        });

        // Add task generation enter validation logic bindings tracking
        inputTask.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && inputTask.value.trim() !== "") {
                listObj.tasks.push({
                    id: generateUUID(),
                    text: inputTask.value.trim(),
                    completed: false,
                    created: Date.now()
                });
                inputTask.value = "";
                renderAllCards();
            }
        });

        listsGrid.appendChild(card);
    });
}

// Master Action tracking logic mapping execution triggering new cards boilerplate components configurations append row arrays logic blocks tracking routing
addListBtn.addEventListener('click', () => {
    const nextColor = cardThemes[themeCounter % cardThemes.length];
    themeCounter++;

    todoLists.push({
        id: generateUUID(),
        title: '',
        date: '',
        color: nextColor,
        currentTab: 'all',
        sortBy: 'oldest',
        tasks: []
    });

    renderAllCards();
});

// Runtime initialization
renderAllCards();