import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Flag,
} from 'lucide-react';

export const TaskFilters = ({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onReset,
}) => {
  return (
    <div className="filter-panel card">
      <div className="filter-row-top">
        {/* Search input */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="search-clear-btn"
              onClick={() => setSearch('')}
              title="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        {/* Reset button */}
        {(search || status !== 'All' || priority !== 'All' || sortBy !== 'dueDate' || sortOrder !== 'asc') && (
          <button className="btn btn-ghost reset-btn" onClick={onReset} title="Reset all filters">
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="filter-row-bottom">
        {/* Status Filter */}
        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select
            className="filter-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="filter-group">
          <label className="filter-label">Priority</label>
          <select
            className="filter-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="filter-group">
          <label className="filter-label">Sort By</label>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="dueDate">Due Date</option>
            <option value="createdAt">Date Created</option>
          </select>
        </div>

        {/* Sort Order Toggle */}
        <div className="filter-group">
          <label className="filter-label">Order</label>
          <button
            type="button"
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={`Toggle order (${sortOrder === 'asc' ? 'Ascending' : 'Descending'})`}
          >
            <ArrowUpDown size={15} />
            <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
