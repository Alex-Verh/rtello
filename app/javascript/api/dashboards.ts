import axios from "axios";

export const createDashboard = async (name: string) => {
  try {
    const response = await axios.post("/api/dashboards", {
      name: name,
    });

    if (response.data.id) {
      window.location.href = `/dashboard/${response.data.id}`;
    } else {
      alert("Error: " + response.data.errors.join(", "));
    }
  } catch (error) {
    console.error("Error during dashboard creation:", error);
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
      alert("Error: " + error.response.data.errors.join(", "));
    } else {
      alert("An error occurred while creating the dashboard.");
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

    return response.data;
  } catch (error) {
    console.error("Error updating dashboard:", error);
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
      alert("Error: " + error.response.data.errors.join(", "));
    } else {
      alert("An error occurred while updating the dashboard.");
    }
    throw error;
  }
};

export const deleteDashboard = async (id: string) => {
  try {
    const response = await axios.delete(`/api/dashboards/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting dashboard:", error);
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      alert("Error: " + error.response.data.error);
    } else {
      alert("An error occurred while deleting the dashboard.");
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
    return response.data;
  } catch (error) {
    console.error("Error removing dashboard member:", error);
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      alert("Error: " + error.response.data.error);
    } else {
      alert("An error occurred while removing the member.");
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
    } else {
      alert("Error: " + response.data.errors.join(", "));
    }
    return response.data;
  } catch (error) {
    console.error("Error creating dashboard from template:", error);
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
      alert("Error: " + error.response.data.errors.join(", "));
    } else {
      alert("An error occurred while creating dashboard from template.");
    }
    throw error;
  }
};
