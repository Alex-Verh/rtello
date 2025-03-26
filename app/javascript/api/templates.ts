import axios from "axios";
import { useToast } from "../functions/modal";

export const createTemplate = async (name: string) => {
  try {
    const response = await axios.post("/api/templates", {
      name: name,
    });

    if (response.data.id) {
      window.location.href = `/template/${response.data.id}`;
      useToast("Template created successfully.", "success");
    } else {
      useToast("Error: " + response.data.errors.join(", "), "error");
    }
  } catch (error) {
    console.error("Error during template creation:", error);
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
      useToast("Error: " + error.response.data.errors.join(", "), "error");
    } else {
      useToast("An error occurred while creating the template.", "error");
    }
  }
};

export const updateTemplate = async (id: string, name: string) => {
  try {
    const response = await axios.put(`/api/templates/${id}`, {
      name: name,
    });
    useToast("Template name updated successfully!", "success");
    return response.data;
  } catch (error) {
    console.error("Error updating template:", error);
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
      useToast("Error: " + error.response.data.errors.join(", "), "error");
    } else {
      useToast("An error occurred while updating the template.", "error");
    }
    throw error;
  }
};

export const deleteTemplate = async (id: string) => {
  try {
    const response = await axios.delete(`/api/templates/${id}`);
    useToast("Template deleted successfully!", "success");
    return response.data;
  } catch (error) {
    console.error("Error deleting template:", error);
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      useToast("Error: " + error.response.data.error, "error");
    } else {
      useToast("An error occurred while deleting the dashboard.", "error");
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
    useToast("An error occurred while searching for template.", "error");
    throw new Error("An error occurred while searching templates");
  }
};
