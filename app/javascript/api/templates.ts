import axios from "axios";

export const createTemplate = async (name: string) => {
  try {
    const response = await axios.post("/api/templates", {
      name: name,
    });

    if (response.data.id) {
      window.location.href = `/template/${response.data.id}`;
    } else {
      alert("Error: " + response.data.errors.join(", "));
    }
  } catch (error) {
    console.error("Error during template creation:", error);
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
      alert("Error: " + error.response.data.errors.join(", "));
    } else {
      alert("An error occurred while creating the template.");
    }
  }
};

export const updateTemplate = async (id: string, name: string) => {
  try {
    const response = await axios.put(`/api/templates/${id}`, {
      name: name,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating template:", error);
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
      alert("Error: " + error.response.data.errors.join(", "));
    } else {
      alert("An error occurred while updating the template.");
    }
    throw error;
  }
};

export const deleteTemplate = async (id: string) => {
  try {
    const response = await axios.delete(`/api/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting template:", error);
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      alert("Error: " + error.response.data.error);
    } else {
      alert("An error occurred while deleting the template.");
    }
    throw error;
  }
};

export const searchTemplates = async (query: string) => {
  try {
    const response = await axios.get("/api/templates/search", {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching templates:", error);
    throw new Error("An error occurred while searching templates");
  }
};
