import axios from "axios";

export const createList = async (containerId: string, name: string) => {
  try {
    const response = await axios.post("/api/lists", {
      list: {
        name: name,
        container_id: containerId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating list:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Container not found");
      } else if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors.join(", "));
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
    return response.data;
  } catch (error) {
    console.error("Error updating list:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("List not found");
      } else if (error.response?.data?.errors) {
        throw new Error(error.response.data.errors.join(", "));
      }
    }
    throw new Error("An error occurred while updating the list");
  }
};

export const deleteList = async (listId: string) => {
  try {
    const response = await axios.delete(`/api/lists/${listId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting list:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("List not found");
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
    }
    throw new Error("An error occurred while deleting the list");
  }
};

export const reorderLists = async (
  lists: Array<{ id: string; position: number }>
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
        throw new Error("One or more lists not found");
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
    }
    throw new Error("An error occurred while reordering lists");
  }
};
