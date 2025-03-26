import axios from "axios";

export const createTask = async (listId: string, description: string) => {
  try {
    const response = await axios.post("/api/tasks", {
      task: {
        description: description,
        list_id: listId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("List not found");
      } else if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors.join(", "));
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
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Task not found");
      } else if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors.join(", "));
      }
    }
    throw new Error("An error occurred while updating the task");
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const response = await axios.delete(`/api/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Task not found");
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
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
        throw new Error("Task not found");
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.status === 422) {
        throw new Error("Invalid state transition");
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
        throw new Error("One or more tasks not found");
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
    }
    throw new Error("An error occurred while reordering tasks");
  }
};
