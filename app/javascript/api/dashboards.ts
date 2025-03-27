import axios from "axios";
import { useToast } from "../functions/modal";

export const createDashboard = async (name: string) => {
  try {
    const response = await axios.post("/api/dashboards", {
      name: name,
    });

    if (response.data.id) {
      window.location.href = `/dashboard/${response.data.id}`;
      useToast("Dashboard created successfully.", "success");
    } else {
      useToast("Error: " + response.data.errors.join(", "), "error");
    }
  } catch (error) {
    console.error("Error during dashboard creation:", error);
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
      useToast("Error: " + error.response.data.errors.join(", "), "error");
    } else {
      useToast("An error occurred while creating the dashboard.", "error");
    }
  }
};

export const updateDashboard = async (
  id: string,
  name?: string,
  backgroundImg?: string
) => {
  try {
    const response = await axios.put(`/api/dashboards/${id}`, {
      name: name,
      dashboard: {
        background_img: backgroundImg,
      },
    });
    useToast("Dashboard name updated successfully!", "success");
    return response.data;
  } catch (error) {
    console.error("Error updating dashboard:", error);
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
      useToast("Error: " + error.response.data.errors.join(", "), "error");
    } else {
      useToast("An error occurred while updating the dashboard.", "error");
    }
    throw error;
  }
};

export const deleteDashboard = async (id: string) => {
  try {
    const response = await axios.delete(`/api/dashboards/${id}`);
    window.location.href = `/`;
    useToast("Dashboard deleted successfully!", "success");
    return response.data;
  } catch (error) {
    console.error("Error deleting dashboard:", error);
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      useToast("Error: " + error.response.data.error, "error");
    } else {
      useToast("An error occurred while deleting the dashboard.", "error");
    }
    throw error;
  }
};

export const addDashboardMember = async (
  dashboardId: string,
  userEmail: string
) => {
  try {
    const response = await axios.post(
      `/api/dashboards/${dashboardId}/members`,
      {
        email: userEmail,
      }
    );
    useToast("Member added to dashboard.", "success");
    return response.data;
  } catch (error) {
    console.error("Error adding dashboard member:", error);
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      useToast("Error: " + error.response.data.error, "error");
    } else {
      useToast("An error occurred while adding the member.", "error");
    }
    throw error;
  }
};

export const removeDashboardMember = async (
  dashboardId: string,
  membersId: string
) => {
  try {
    const response = await axios.delete(
      `/api/dashboards/${dashboardId}/members/${membersId}`
    );
    useToast("Member removed from dashboard.", "success");

    if (response.data.is_self) {
      window.location.href = `/`;
    }
    return response.data;
  } catch (error) {
    console.error("Error removing dashboard member:", error);
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      useToast("Error: " + error.response.data.error, "error");
    } else {
      useToast("An error occurred while removing the member.", "error");
    }
    throw error;
  }
};

export const createDashboardFromTemplate = async (
  templateId: string,
  name: string
) => {
  try {
    const response = await axios.post(
      `/api/dashboards/template/${templateId}`,
      {
        name: name,
      }
    );

    if (response.data.id) {
      window.location.href = `/dashboard/${response.data.id}`;
      useToast("Dashboard created from template successfully.", "success");
    } else {
      useToast("Error: " + response.data.errors.join(", "), "error");
    }
    return response.data;
  } catch (error) {
    console.error("Error creating dashboard from template:", error);
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
      useToast("Error: " + error.response.data.errors.join(", "), "error");
    } else {
      useToast(
        "An error occurred while creating dashboard from template.",
        "error"
      );
    }
    throw error;
  }
};
