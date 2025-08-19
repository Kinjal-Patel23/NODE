import React, { useState, useRef } from 'react'
import Create from './Create'
import View from './View';

const App = () => {
  const [reload, setReload] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const taskInputRef = useRef(null);
  
  const handleTaskAdded = () => {
    setReload(!reload);
  }
  
  // const handleCreateTaskClick = () => {
  //   if (taskInputRef.current) {
  //     taskInputRef.current.focus();
  //   }
  // }
  
  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Todo App</h2>
        <ul className="sidebar-menu">
          <li>
            <a 
              href="#" 
              className={activeTab === 'all' ? 'active' : ''} 
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('all');
              }}
            >
              <i>📋</i> <span>All Tasks</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={activeTab === 'important' ? 'active' : ''} 
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('important');
              }}
            >
              <i>⭐</i> <span>Important</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={activeTab === 'today' ? 'active' : ''} 
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('today');
              }}
            >
              <i>📅</i> <span>Today</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={activeTab === 'week' ? 'active' : ''} 
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('week');
              }}
            >
              <i>📆</i> <span>This Week</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="main-content">
        <div className="app-header">
          <h1>My Tasks</h1>
          <p>Manage your daily tasks efficiently</p>
        </div>
        
        <Create onTaskAdded={handleTaskAdded} ref={taskInputRef}/>
        <View reload={reload} activeTab={activeTab} />
      </div>
    </div>
  )
}

export default App