import axios from "axios";
import { useToast } from "../functions/modal";

export const createList = async (containerId: string, name: string) => {
  try {
    const response = await axios.post("/api/lists", {
      list: {
        name: name,
        container_id: containerId,
      },
    });
    useToast("List created successfully.", "success");
    return response.data;
  } catch (error) {
    console.error("Error creating list:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        useToast("Container not found.", "error");
      } else if (error.response?.data?.errors) {
        useToast("Error: " + error.response.data.errors.join(", "), "error");
      } else {
        useToast("An error occurred while creating the list.", "error");
      }
    }
    throw new Error("An error occurred while creating the list");
  }
};

export const updateList = async (listId: string, name: string) => {
  try {
    const response = await axios.put(`/api/lists/${listId}`, {
      list: {
        name: name,
      },
    });
    useToast("List name changed successfully.", "success");
    return response.data;
  } catch (error) {
    console.error("Error updating list:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        useToast("List not found.", "error");
      } else if (error.response?.data?.errors) {
        useToast("Error: " + error.response.data.errors.join(", "), "error");
      } else {
        useToast("An error occurred while updating the list.", "error");
      }
    }
    throw new Error("An error occurred while updating the list");
  }
};

export const deleteList = async (listId: string) => {
  try {
    const response = await axios.delete(`/api/lists/${listId}`);
    useToast("List deleted successfully.", "success");
    return response.data;
  } catch (error) {
    console.error("Error deleting list:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        useToast("List not found.", "error");
      } else if (error.response?.data?.error) {
        useToast("Error: " + error.response.data.error, "error");
      } else {
        useToast("An error occurred while deleting the list.", "error");
      }
    }
    throw new Error("An error occurred while deleting the list");
  }
};

export const reorderLists = async (
  lists: Array<{ id: string; position: number; container_id: string }>
) => {
  try {
    const response = await axios.post("/api/lists/reorder", {
      lists: lists,
    });
    return response.data;
  } catch (error) {
    console.error("Error reordering lists:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        useToast("One or more lists not found.", "error");
      } else if (error.response?.data?.error) {
        useToast("Error: " + error.response.data.error, "error");
      } else {
        useToast("An error occurred while reordering the lists.", "error");
      }
    }
    throw new Error("An error occurred while reordering lists");
  }
};
