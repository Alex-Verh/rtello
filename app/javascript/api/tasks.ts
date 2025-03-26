import axios from "axios";
import { useToast } from "../functions/modal";

export const createTask = async (listId: string, description: string) => {
  try {
    const response = await axios.post("/api/tasks", {
      task: {
        description: description,
        list_id: listId,
      },
    });
    useToast("Task created successfully.", "success");
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        useToast("Task not found.", "error");
      } else if (error.response?.data?.errors) {
        useToast("Error: " + error.response.data.errors.join(", "), "error");
      } else {
        useToast("An error occurred while creating the task.", "error");
      }
    }
    throw new Error("An error occurred while creating the task");
  }
};

export const updateTask = async (taskId: string, description: string) => {
  try {
    const response = await axios.put(`/api/tasks/${taskId}`, {
      task: {
        description: description,
      },
    });
    useToast("Task description changed successfully.", "success");
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        useToast("Task not found.", "error");
      } else if (error.response?.data?.errors) {
        useToast("Error: " + error.response.data.errors.join(", "), "error");
      } else {
        useToast("An error occurred while updating the task.", "error");
      }
    }
    throw new Error("An error occurred while updating the task");
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const response = await axios.delete(`/api/tasks/${taskId}`);
    useToast("Task deleted successfully.", "success");
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        useToast("Task not found.", "error");
      } else if (error.response?.data?.error) {
        useToast("Error: " + error.response.data.error, "error");
      } else {
        useToast("An error occurred while deleting the task.", "error");
      }
    }
    throw new Error("An error occurred while deleting the task");
  }
};

export const updateTaskState = async (taskId: string) => {
  try {
    const response = await axios.patch(`/api/tasks/${taskId}/update_state`);
    return response.data;
  } catch (error) {
    console.error("Error updating task state:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        useToast("Task not found.", "error");
      } else if (error.response?.data?.error) {
        useToast("Error: " + error.response.data.error, "error");
      } else if (error.response?.status === 422) {
        useToast("Invalid task state transition.", "error");
      } else {
        useToast("An error occurred while marking the task.", "error");
      }
    }
    throw new Error("An error occurred while updating task state");
  }
};

export const reorderTasks = async (
  tasks: Array<{ id: string; list_id: string; position: number }>
) => {
  try {
    const response = await axios.post("/api/tasks/reorder", {
      tasks: tasks,
    });
    return response.data;
  } catch (error) {
    console.error("Error reordering tasks:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        useToast("One or more tasks not found.", "error");
      } else if (error.response?.data?.error) {
        useToast("Error: " + error.response.data.error, "error");
      } else {
        useToast("An error occurred while reordering the tasks.", "error");
      }
    }
    throw new Error("An error occurred while reordering tasks");
  }
};
