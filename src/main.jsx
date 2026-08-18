import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Check, Circle, Filter, Plus, Search, Trash2, Sun, Moon, CalendarDays, BarChart3 } from 'lucide-react';
import './styles.css';

const initialTasks = [
  { id: 1, title: 'Review project proposal', category: 'Work', priority: 'High', due: 'Today', done: false },
  { id: 2, title: 'Prepare presentation slides', category: 'Work', priority: 'Medium', due: 'Tomorrow', done: false },
  { id: 3, title: 'Morning workout', category: 'Personal', priority: 'Low', due: 'Today', done: true },
  { id: 4, title: 'Read 20 pages', category: 'Learning', priority: 'Medium', due: 'Fri', done: false },
  { id: 5, title: 'Plan next week', category: 'Personal', priority: 'Low', due: 'Sun', done: false },
];

function App() {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('taskflow-tasks')) || initialTasks);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [dark, setDark] = useState(() => localStorage.getItem('taskflow-theme') === 'dark');
  const [newTask, setNewTask] = useState('');

  useEffect(() => localStorage.setItem('taskflow-tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('taskflow-theme', dark ? 'dark' : 'light'); }, [dark]);

  const visibleTasks = useMemo(() => tasks.filter(t => {
    const matchesFilter = filter === 'All' || (filter === 'Active' ? !t.done : t.done);
    return matchesFilter && t.title.toLowerCase().includes(search.toLowerCase());
  }), [tasks, filter, search]);

  const completed = tasks.filter(t => t.done).length;
  const addTask = e => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([{ id: Date.now(), title: newTask.trim(), category: 'General', priority: 'Medium', due: 'Today', done: false }, ...tasks]);
    setNewTask('');
  };

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="logo"><Check size={19}/></div><span>TaskFlow</span></div>
      <nav><button className="nav-item active"><CalendarDays size={18}/> My Tasks</button><button className="nav-item"><BarChart3 size={18}/> Analytics</button></nav>
      <div className="side-footer"><div className="progress-label"><span>Weekly progress</span><b>{Math.round((completed / tasks.length) * 100) || 0}%</b></div><div className="progress"><span style={{width: `${(completed / tasks.length) * 100 || 0}%`}}/></div></div>
    </aside>
    <main className="main">
      <header><div><p className="eyebrow">Tuesday, August 18</p><h1>Good morning, Ashley</h1><p className="muted">Here's what's on your plate today.</p></div><button className="icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun/> : <Moon/>}</button></header>
      <section className="stats"><div><span>All tasks</span><strong>{tasks.length}</strong></div><div><span>Completed</span><strong>{completed}</strong></div><div><span>Remaining</span><strong>{tasks.length - completed}</strong></div><div><span>Completion</span><strong>{Math.round((completed/tasks.length)*100) || 0}%</strong></div></section>
      <form className="add-task" onSubmit={addTask}><Plus size={20}/><input value={newTask} onChange={e=>setNewTask(e.target.value)} placeholder="Add a new task..."/><button>Add task</button></form>
      <div className="toolbar"><div className="filters"><Filter size={17}/>{['All','Active','Completed'].map(f=><button key={f} onClick={()=>setFilter(f)} className={filter===f?'selected':''}>{f}</button>)}</div><div className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks"/></div></div>
      <section className="task-list">{visibleTasks.map(task=><article className={`task ${task.done?'done':''}`} key={task.id}><button className="check" onClick={()=>setTasks(tasks.map(t=>t.id===task.id?{...t,done:!t.done}:t))}>{task.done?<Check size={17}/>:<Circle size={18}/>}</button><div className="task-content"><h3>{task.title}</h3><div className="meta"><span>{task.category}</span><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span><span>Due {task.due}</span></div></div><button className="delete" onClick={()=>setTasks(tasks.filter(t=>t.id!==task.id))}><Trash2 size={17}/></button></article>)}{visibleTasks.length===0&&<div className="empty">No tasks found. Add one above to get started.</div>}</section>
    </main>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
