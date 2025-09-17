const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'quiz_c';
let quizSteps = []; // Store quiz steps for enhanced quiz management
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getQuizzes = async () => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "title_c" } },
        { field: { Name: "description_c" } },
        { field: { Name: "estimated_time_c" } },
        { field: { Name: "image_url_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "questions_c" } },
        { field: { Name: "outcomes_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "updated_at_c" } },
        { field: { Name: "quizLogic_c" } }
      ]
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching quizzes:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return [];
  }
};

export const getQuizById = async (id) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "title_c" } },
        { field: { Name: "description_c" } },
        { field: { Name: "estimated_time_c" } },
        { field: { Name: "image_url_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "questions_c" } },
        { field: { Name: "outcomes_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "updated_at_c" } },
        { field: { Name: "quizLogic_c" } }
      ]
    };

    const response = await apperClient.getRecordById(TABLE_NAME, id, params);
    
    if (!response.success) {
      console.error(response.message);
      return null;
    }

    return response.data || null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching quiz with ID ${id}:`, error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return null;
  }
};

export const createQuiz = async (quizData) => {
  try {
    // Only include Updateable fields
    const createData = {
      Name: quizData.Name,
      Tags: quizData.Tags,
      title_c: quizData.title_c,
      description_c: quizData.description_c,
      estimated_time_c: quizData.estimated_time_c,
      image_url_c: quizData.image_url_c,
      status_c: quizData.status_c || 'draft',
      questions_c: quizData.questions_c,
      outcomes_c: quizData.outcomes_c,
      created_at_c: new Date().toISOString(),
      updated_at_c: new Date().toISOString(),
      quizLogic_c: quizData.quizLogic_c || ''
    };

    const params = {
      records: [createData]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);

    if (!response.success) {
      console.error(response.message);
      return null;
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create quiz ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
      }
      
      return successfulRecords.length > 0 ? successfulRecords[0].data : null;
    }

    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating quiz:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return null;
  }
};

export const updateQuiz = async (id, updates) => {
  try {
    // Only include Updateable fields
    const updateData = {
      Id: id
    };

    if (updates.Name !== undefined) updateData.Name = updates.Name;
    if (updates.Tags !== undefined) updateData.Tags = updates.Tags;
    if (updates.title_c !== undefined) updateData.title_c = updates.title_c;
    if (updates.description_c !== undefined) updateData.description_c = updates.description_c;
    if (updates.estimated_time_c !== undefined) updateData.estimated_time_c = updates.estimated_time_c;
    if (updates.image_url_c !== undefined) updateData.image_url_c = updates.image_url_c;
    if (updates.status_c !== undefined) updateData.status_c = updates.status_c;
    if (updates.questions_c !== undefined) updateData.questions_c = updates.questions_c;
    if (updates.outcomes_c !== undefined) updateData.outcomes_c = updates.outcomes_c;
    if (updates.updated_at_c !== undefined) updateData.updated_at_c = updates.updated_at_c;
    if (updates.quizLogic_c !== undefined) updateData.quizLogic_c = updates.quizLogic_c;
    
    // Always update the modification timestamp
    updateData.updated_at_c = new Date().toISOString();

    const params = {
      records: [updateData]
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);

    if (!response.success) {
      console.error(response.message);
      return null;
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update quiz ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
      }
      
      return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
    }

    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating quiz:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return null;
  }
};

// Quiz Steps Management
export const createQuizSteps = async (quizId, steps) => {
  try {
    // Quiz steps would be handled by quiz_step_c table
    // For now, return empty array as steps are embedded in quiz questions_c
    await delay(300);
    return [];
  } catch (error) {
    console.error("Error creating quiz steps:", error);
    return [];
  }
};

export const updateQuizSteps = async (quizId, steps) => {
  try {
    // Quiz steps would be handled by quiz_step_c table
    // For now, return empty array as steps are embedded in quiz questions_c
    await delay(300);
    return [];
  } catch (error) {
    console.error("Error updating quiz steps:", error);
    return [];
  }
};

export const getQuizSteps = async (quizId) => {
  try {
    // Quiz steps would be retrieved from quiz_step_c table
    // For now, return empty array as steps are embedded in quiz questions_c
    await delay(200);
    return [];
  } catch (error) {
    console.error("Error fetching quiz steps:", error);
    return [];
  }
};

export const deleteQuiz = async (id) => {
  try {
    const params = {
      RecordIds: [id]
    };

    const response = await apperClient.deleteRecord(TABLE_NAME, params);

    if (!response.success) {
      console.error(response.message);
      return false;
    }

    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete quiz ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
      }
      
      return successfulDeletions.length > 0;
    }

    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting quiz:", error?.response?.data?.message);
    } else {
      console.error(error);
    }
    return false;
  }
};

// Analytics functions
export const recordQuizStart = async (quizId) => {
  await delay(100);
  // Analytics would be handled separately or through custom fields
  console.log(`Quiz ${quizId} started`);
};

export const recordQuizCompletion = async (quizId, results, timeSpent) => {
  await delay(100);
  // Analytics would be handled separately or through custom fields
  console.log(`Quiz ${quizId} completed`, { results, timeSpent });
};

export const getQuizAnalytics = async (quizId) => {
  await delay(300);
  // Analytics would need to be implemented through separate analytics tracking
  // or custom fields in the database
  return {
    totalStarts: 0,
    totalCompletions: 0,
    completionRate: 0,
    averageTimeSpent: 0,
    dropOffPoints: [],
    professionalRecommendations: {}
  };
};

export const publishQuiz = async (id) => {
  return updateQuiz(id, { status_c: 'published' });
};

export const unpublishQuiz = async (id) => {
  return updateQuiz(id, { status_c: 'draft' });
};