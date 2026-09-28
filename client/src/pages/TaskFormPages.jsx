import React from 'react';
import { TaskForm } from '../components/TaskForm';

export const CreateTask = () => {
  return <TaskForm isEditMode={false} />;
};

export const EditTask = () => {
  return <TaskForm isEditMode={true} />;
};
