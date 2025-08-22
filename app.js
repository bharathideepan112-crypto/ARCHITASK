// ArchiTask Application JavaScript

class ArchiTask {
    constructor() {
        this.projects = [];
        this.tasks = [];
        this.currentView = 'dashboard';
        this.currentTaskView = 'list';
        this.editingProject = null;
        this.editingTask = null;
        this.currentDate = new Date();
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderDashboard();
        this.updateProjectFilters();
    }

    loadData() {
        // Load from localStorage or use sample data
        const savedProjects = localStorage.getItem('architask-projects');
        const savedTasks = localStorage.getItem('architask-tasks');

        if (savedProjects && savedTasks) {
            this.projects = JSON.parse(savedProjects);
            this.tasks = JSON.parse(savedTasks);
        } else {
            // Use sample data
            this.projects = [
                {
                    id: 1,
                    name: "Downtown Office Complex",
                    location: "123 Main Street, Downtown",
                    client: "ABC Corporation",
                    startDate: "2025-01-15",
                    endDate: "2025-12-30",
                    description: "Modern 15-story office building with sustainable design features",
                    status: "In Progress"
                },
                {
                    id: 2,
                    name: "Residential Villa Project",
                    location: "456 Oak Avenue, Suburbs",
                    client: "Johnson Family",
                    startDate: "2025-02-01",
                    endDate: "2025-08-15",
                    description: "Luxury family villa with modern amenities and landscaping",
                    status: "Planning"
                },
                {
                    id: 3,
                    name: "Shopping Mall Renovation",
                    location: "789 Commerce Blvd",
                    client: "Mall Management LLC",
                    startDate: "2025-03-01",
                    endDate: "2025-11-30",
                    description: "Complete renovation of existing shopping center",
                    status: "In Progress"
                }
            ];

            this.tasks = [
                {
                    id: 1,
                    projectId: 1,
                    title: "Structural Design Review",
                    description: "Review and finalize structural plans for floors 10-15",
                    priority: "High",
                    dueDate: "2025-08-25",
                    category: "Design",
                    status: "In Progress",
                    assignee: "John Architect",
                    notes: "Coordinate with structural engineer for load calculations",
                    createdDate: "2025-08-15"
                },
                {
                    id: 2,
                    projectId: 1,
                    title: "Client Presentation",
                    description: "Present final design concepts to ABC Corporation board",
                    priority: "Critical",
                    dueDate: "2025-08-28",
                    category: "Meeting",
                    status: "Not Started",
                    assignee: "John Architect",
                    notes: "Prepare presentation slides and 3D renderings",
                    createdDate: "2025-08-20"
                },
                {
                    id: 3,
                    projectId: 2,
                    title: "Site Survey",
                    description: "Conduct detailed site survey and soil analysis",
                    priority: "High",
                    dueDate: "2025-08-30",
                    category: "Site Visit",
                    status: "Not Started",
                    assignee: "Sarah Engineer",
                    notes: "Coordinate with surveying team",
                    createdDate: "2025-08-18"
                },
                {
                    id: 4,
                    projectId: 3,
                    title: "Building Permit Application",
                    description: "Submit renovation plans to city planning department",
                    priority: "Medium",
                    dueDate: "2025-09-05",
                    category: "Documentation",
                    status: "In Progress",
                    assignee: "Mike Planner",
                    notes: "Include environmental impact assessment",
                    createdDate: "2025-08-12"
                },
                {
                    id: 5,
                    projectId: 1,
                    title: "MEP System Design",
                    description: "Finalize mechanical, electrical, and plumbing system layouts",
                    priority: "High",
                    dueDate: "2025-09-01",
                    category: "Design",
                    status: "Not Started",
                    assignee: "Lisa MEP Engineer",
                    notes: "Focus on energy efficiency and sustainability",
                    createdDate: "2025-08-22"
                }
            ];
        }
    }

    saveData() {
        localStorage.setItem('architask-projects', JSON.stringify(this.projects));
        localStorage.setItem('architask-tasks', JSON.stringify(this.tasks));
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });

        // Quick Add
        document.getElementById('quick-add-btn').addEventListener('click', () => {
            this.showModal('quick-add-modal');
        });

        document.getElementById('quick-add-project').addEventListener('click', () => {
            this.hideModal('quick-add-modal');
            this.showAddProjectModal();
        });

        document.getElementById('quick-add-task').addEventListener('click', () => {
            this.hideModal('quick-add-modal');
            this.showAddTaskModal();
        });

        // Project Modal
        document.getElementById('add-project-btn').addEventListener('click', () => {
            this.showAddProjectModal();
        });

        document.getElementById('project-form').addEventListener('submit', (e) => {
            this.handleProjectSubmit(e);
        });

        // Task Modal
        document.getElementById('add-task-btn').addEventListener('click', () => {
            this.showAddTaskModal();
        });

        document.getElementById('task-form').addEventListener('submit', (e) => {
            this.handleTaskSubmit(e);
        });

        // Task View Toggle
        document.querySelectorAll('[data-task-view]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTaskView(e.target.dataset.taskView);
            });
        });

        // Filters
        document.getElementById('project-filter').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('status-filter').addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('priority-filter').addEventListener('change', () => {
            this.applyFilters();
        });

        // Calendar Navigation
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        // Modal Close Events
        document.querySelectorAll('.modal-close, #cancel-project, #cancel-task').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        document.getElementById('close-quick-add-modal').addEventListener('click', () => {
            this.hideModal('quick-add-modal');
        });

        // Close modal on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
    }

    switchView(view) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Update views
        document.querySelectorAll('.view').forEach(v => {
            v.classList.remove('active');
        });
        document.getElementById(`${view}-view`).classList.add('active');

        this.currentView = view;

        // Render view content
        switch (view) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'projects':
                this.renderProjects();
                break;
            case 'tasks':
                this.renderTasks();
                break;
            case 'calendar':
                this.renderCalendar();
                break;
        }
    }

    switchTaskView(taskView) {
        document.querySelectorAll('[data-task-view]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-task-view="${taskView}"]`).classList.add('active');

        document.querySelectorAll('.task-view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`task-${taskView}-view`).classList.add('active');

        this.currentTaskView = taskView;

        if (taskView === 'kanban') {
            this.renderKanban();
        } else {
            this.renderTaskList();
        }
    }

    renderDashboard() {
        this.updateDashboardStats();
        this.renderRecentProjects();
        this.renderUrgentTasks();
    }

    updateDashboardStats() {
        const totalProjects = this.projects.length;
        const totalTasks = this.tasks.length;
        const today = new Date().toISOString().split('T')[0];
        
        const overdueTasks = this.tasks.filter(task => 
            task.dueDate < today && task.status !== 'Completed'
        ).length;
        
        const dueTodayTasks = this.tasks.filter(task => 
            task.dueDate === today && task.status !== 'Completed'
        ).length;

        document.getElementById('total-projects').textContent = totalProjects;
        document.getElementById('total-tasks').textContent = totalTasks;
        document.getElementById('overdue-tasks').textContent = overdueTasks;
        document.getElementById('due-today').textContent = dueTodayTasks;
    }

    renderRecentProjects() {
        const container = document.getElementById('recent-projects');
        const recentProjects = this.projects.slice(0, 3);

        if (recentProjects.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-building"></i><h3>No projects yet</h3><p>Create your first project to get started</p></div>';
            return;
        }

        container.innerHTML = recentProjects.map(project => this.createProjectCard(project, true)).join('');
    }

    renderUrgentTasks() {
        const container = document.getElementById('urgent-tasks');
        const today = new Date().toISOString().split('T')[0];
        const urgentTasks = this.tasks.filter(task => 
            (task.priority === 'Critical' || task.priority === 'High') && 
            task.status !== 'Completed'
        ).slice(0, 5);

        if (urgentTasks.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-check-circle"></i><h3>No urgent tasks</h3><p>You\'re all caught up!</p></div>';
            return;
        }

        container.innerHTML = urgentTasks.map(task => this.createTaskItem(task)).join('');
        this.attachTaskEventListeners();
    }

    renderProjects() {
        const container = document.getElementById('all-projects');
        
        if (this.projects.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-building"></i><h3>No projects yet</h3><p>Create your first project to start managing tasks</p><button class="btn btn--primary" onclick="app.showAddProjectModal()">Add Project</button></div>';
            return;
        }

        container.innerHTML = this.projects.map(project => this.createProjectCard(project)).join('');
    }

    renderTasks() {
        this.updateProjectFilters();
        if (this.currentTaskView === 'list') {
            this.renderTaskList();
        } else {
            this.renderKanban();
        }
    }

    renderTaskList() {
        const container = document.getElementById('all-tasks');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-tasks"></i><h3>No tasks found</h3><p>Create a task or adjust your filters</p><button class="btn btn--primary" onclick="app.showAddTaskModal()">Add Task</button></div>';
            return;
        }

        container.innerHTML = filteredTasks.map(task => this.createTaskItem(task)).join('');
        this.attachTaskEventListeners();
    }

    renderKanban() {
        const statuses = ['Not Started', 'In Progress', 'Completed', 'On Hold'];
        const filteredTasks = this.getFilteredTasks();

        statuses.forEach(status => {
            const container = document.querySelector(`[data-status="${status}"]`);
            const statusTasks = filteredTasks.filter(task => task.status === status);
            
            container.innerHTML = statusTasks.map(task => this.createKanbanTask(task)).join('');
        });

        this.setupKanbanDragAndDrop();
    }

    renderCalendar() {
        this.updateCalendarHeader();
        const container = document.getElementById('calendar-grid');
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Create calendar header
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let calendarHTML = weekdays.map(day => 
            `<div class="calendar-header">${day}</div>`
        ).join('');

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        // Add empty cells for days before the first day
        for (let i = 0; i < startingDayOfWeek; i++) {
            const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
            calendarHTML += `<div class="calendar-day other-month">
                <div class="calendar-day-number">${prevDate.getDate()}</div>
            </div>`;
        }

        // Add days of the month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            const dayTasks = this.tasks.filter(task => task.dueDate === dateStr);
            const isToday = date.toDateString() === today.toDateString();

            calendarHTML += `<div class="calendar-day ${isToday ? 'today' : ''}">
                <div class="calendar-day-number">${day}</div>
                ${dayTasks.map(task => 
                    `<div class="calendar-task" title="${task.title}">${task.title}</div>`
                ).join('')}
            </div>`;
        }

        container.innerHTML = calendarHTML;
    }

    updateCalendarHeader() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        document.getElementById('current-month').textContent = 
            `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }

    getFilteredTasks() {
        let filtered = [...this.tasks];

        const projectFilter = document.getElementById('project-filter').value;
        const statusFilter = document.getElementById('status-filter').value;
        const priorityFilter = document.getElementById('priority-filter').value;

        if (projectFilter) {
            filtered = filtered.filter(task => task.projectId == projectFilter);
        }

        if (statusFilter) {
            filtered = filtered.filter(task => task.status === statusFilter);
        }

        if (priorityFilter) {
            filtered = filtered.filter(task => task.priority === priorityFilter);
        }

        return filtered;
    }

    applyFilters() {
        if (this.currentView === 'tasks') {
            this.renderTasks();
        }
    }

    updateProjectFilters() {
        const projectFilter = document.getElementById('project-filter');
        const taskProjectSelect = document.getElementById('task-project');
        
        const projectOptions = this.projects.map(project => 
            `<option value="${project.id}">${project.name}</option>`
        ).join('');

        projectFilter.innerHTML = '<option value="">All Projects</option>' + projectOptions;
        taskProjectSelect.innerHTML = '<option value="">Select Project</option>' + projectOptions;
    }

    createProjectCard(project, isDashboard = false) {
        const projectTasks = this.tasks.filter(task => task.projectId === project.id);
        const completedTasks = projectTasks.filter(task => task.status === 'Completed');
        const progress = projectTasks.length > 0 ? (completedTasks.length / projectTasks.length) * 100 : 0;

        return `
            <div class="project-card" data-project-id="${project.id}">
                <div class="project-header">
                    <h3 class="project-title">${project.name}</h3>
                    <span class="project-status ${project.status.toLowerCase().replace(' ', '-')}">${project.status}</span>
                </div>
                <div class="project-info">
                    <div class="project-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${project.location}</span>
                    </div>
                    <div class="project-info-item">
                        <i class="fas fa-user"></i>
                        <span>${project.client}</span>
                    </div>
                    <div class="project-info-item">
                        <i class="fas fa-calendar"></i>
                        <span>${this.formatDate(project.startDate)} - ${this.formatDate(project.endDate)}</span>
                    </div>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-progress">
                    <div class="progress-label">
                        <span>Progress</span>
                        <span>${Math.round(progress)}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
                ${!isDashboard ? `
                <div class="project-actions">
                    <button class="btn btn--sm btn--outline" onclick="app.editProject(${project.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn--sm btn--outline" onclick="app.deleteProject(${project.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
                ` : ''}
            </div>
        `;
    }

    createTaskItem(task) {
        const project = this.projects.find(p => p.id === task.projectId);
        const today = new Date().toISOString().split('T')[0];
        const isOverdue = task.dueDate < today && task.status !== 'Completed';
        const isDueToday = task.dueDate === today && task.status !== 'Completed';

        return `
            <div class="task-item ${isOverdue ? 'overdue' : ''} ${isDueToday ? 'due-today' : ''}" data-task-id="${task.id}">
                <div class="task-header">
                    <div>
                        <h4 class="task-title">${task.title}</h4>
                        <div class="task-meta">
                            <div class="task-meta-item">
                                <i class="fas fa-building"></i>
                                <span>${project ? project.name : 'Unknown Project'}</span>
                            </div>
                            <div class="task-meta-item">
                                <i class="fas fa-tag"></i>
                                <span>${task.category}</span>
                            </div>
                            <div class="task-meta-item">
                                <i class="fas fa-calendar"></i>
                                <span>${this.formatDate(task.dueDate)}</span>
                            </div>
                            ${task.assignee ? `
                            <div class="task-meta-item">
                                <i class="fas fa-user"></i>
                                <span>${task.assignee}</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    <span class="task-priority ${task.priority.toLowerCase()}">${task.priority}</span>
                </div>
                ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
                <div class="task-footer">
                    <select class="task-status-select" data-task-id="${task.id}">
                        <option value="Not Started" ${task.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                        <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="On Hold" ${task.status === 'On Hold' ? 'selected' : ''}>On Hold</option>
                    </select>
                    <div class="task-actions">
                        <button class="task-action-btn" onclick="app.editTask(${task.id})" title="Edit Task">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="task-action-btn" onclick="app.deleteTask(${task.id})" title="Delete Task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    createKanbanTask(task) {
        const project = this.projects.find(p => p.id === task.projectId);
        
        return `
            <div class="kanban-task" data-task-id="${task.id}" draggable="true">
                <h5 class="kanban-task-title">${task.title}</h5>
                <div class="kanban-task-meta">
                    <span class="task-priority ${task.priority.toLowerCase()}">${task.priority}</span>
                    <span>${this.formatDate(task.dueDate)}</span>
                </div>
                <div class="kanban-task-project">${project ? project.name : 'Unknown'}</div>
            </div>
        `;
    }

    attachTaskEventListeners() {
        // Task status changes
        document.querySelectorAll('.task-status-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const taskId = parseInt(e.target.dataset.taskId);
                this.updateTaskStatus(taskId, e.target.value);
            });
        });
    }

    setupKanbanDragAndDrop() {
        const kanbanTasks = document.querySelectorAll('.kanban-task');
        const kanbanColumns = document.querySelectorAll('.kanban-tasks');

        kanbanTasks.forEach(task => {
            task.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
                e.target.style.opacity = '0.5';
            });

            task.addEventListener('dragend', (e) => {
                e.target.style.opacity = '1';
            });
        });

        kanbanColumns.forEach(column => {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                column.style.backgroundColor = 'rgba(var(--color-primary-rgb), 0.1)';
            });

            column.addEventListener('dragleave', (e) => {
                column.style.backgroundColor = '';
            });

            column.addEventListener('drop', (e) => {
                e.preventDefault();
                column.style.backgroundColor = '';
                
                const taskId = parseInt(e.dataTransfer.getData('text/plain'));
                const newStatus = column.dataset.status;
                
                this.updateTaskStatus(taskId, newStatus);
                this.renderKanban();
            });
        });
    }

    updateTaskStatus(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            this.saveData();
            
            // Update dashboard if currently viewing it
            if (this.currentView === 'dashboard') {
                this.updateDashboardStats();
            }
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('hidden');
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('hidden');
        
        // Reset forms
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
        
        this.editingProject = null;
        this.editingTask = null;
    }

    showAddProjectModal() {
        document.getElementById('project-modal-title').textContent = 'Add New Project';
        document.getElementById('project-form').reset();
        this.editingProject = null;
        this.showModal('project-modal');
    }

    showAddTaskModal() {
        document.getElementById('task-modal-title').textContent = 'Add New Task';
        document.getElementById('task-form').reset();
        this.editingTask = null;
        this.updateProjectFilters();
        this.showModal('task-modal');
    }

    editProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        this.editingProject = project;
        document.getElementById('project-modal-title').textContent = 'Edit Project';
        
        // Populate form
        document.getElementById('project-name').value = project.name;
        document.getElementById('project-location').value = project.location;
        document.getElementById('project-client').value = project.client;
        document.getElementById('project-start-date').value = project.startDate;
        document.getElementById('project-end-date').value = project.endDate;
        document.getElementById('project-description').value = project.description || '';
        
        this.showModal('project-modal');
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        this.editingTask = task;
        document.getElementById('task-modal-title').textContent = 'Edit Task';
        
        // Populate form
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description || '';
        document.getElementById('task-project').value = task.projectId;
        document.getElementById('task-category').value = task.category;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-due-date').value = task.dueDate;
        document.getElementById('task-assignee').value = task.assignee || '';
        document.getElementById('task-notes').value = task.notes || '';
        
        this.showModal('task-modal');
    }

    deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
            this.projects = this.projects.filter(p => p.id !== projectId);
            this.tasks = this.tasks.filter(t => t.projectId !== projectId);
            this.saveData();
            this.renderProjects();
            this.updateProjectFilters();
            
            if (this.currentView === 'dashboard') {
                this.renderDashboard();
            }
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveData();
            
            // Re-render current view
            if (this.currentView === 'dashboard') {
                this.renderDashboard();
            } else if (this.currentView === 'tasks') {
                this.renderTasks();
            }
        }
    }

    handleProjectSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const projectData = {
            name: document.getElementById('project-name').value,
            location: document.getElementById('project-location').value,
            client: document.getElementById('project-client').value,
            startDate: document.getElementById('project-start-date').value,
            endDate: document.getElementById('project-end-date').value,
            description: document.getElementById('project-description').value,
            status: 'Planning'
        };

        if (this.editingProject) {
            // Update existing project
            Object.assign(this.editingProject, projectData);
        } else {
            // Create new project
            const newProject = {
                id: this.getNextProjectId(),
                ...projectData
            };
            this.projects.push(newProject);
        }

        this.saveData();
        this.hideModal('project-modal');
        this.updateProjectFilters();
        
        if (this.currentView === 'projects') {
            this.renderProjects();
        } else if (this.currentView === 'dashboard') {
            this.renderDashboard();
        }
    }

    handleTaskSubmit(e) {
        e.preventDefault();
        
        const taskData = {
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-description').value,
            projectId: parseInt(document.getElementById('task-project').value),
            category: document.getElementById('task-category').value,
            priority: document.getElementById('task-priority').value,
            dueDate: document.getElementById('task-due-date').value,
            assignee: document.getElementById('task-assignee').value,
            notes: document.getElementById('task-notes').value,
            status: 'Not Started'
        };

        if (this.editingTask) {
            // Update existing task
            Object.assign(this.editingTask, taskData);
        } else {
            // Create new task
            const newTask = {
                id: this.getNextTaskId(),
                createdDate: new Date().toISOString().split('T')[0],
                ...taskData
            };
            this.tasks.push(newTask);
        }

        this.saveData();
        this.hideModal('task-modal');
        
        if (this.currentView === 'tasks') {
            this.renderTasks();
        } else if (this.currentView === 'dashboard') {
            this.renderDashboard();
        }
    }

    getNextProjectId() {
        return Math.max(...this.projects.map(p => p.id), 0) + 1;
    }

    getNextTaskId() {
        return Math.max(...this.tasks.map(t => t.id), 0) + 1;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Initialize the application
const app = new ArchiTask();