// Database Integration: roadmap_stage_c table
// Fields: Name, title_c, description_c, duration_c, activities_c, professional_ids_c, timeline_c, questions_c, notes_c

const tableName = 'roadmap_stage_c';

// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// Ensure comprehensive roadmap stages exist
const ensureDefaultStages = async () => {
  try {
    const existingStages = await getRoadmapStages();
    const stageNumbers = existingStages.map(stage => parseInt(stage.Name?.replace('Stage ', '') || '0'));
    const maxStage = Math.max(...stageNumbers, 0);
    
    const defaultStages = [
      {
        Name: "Stage 1",
        title_c: "Initial Planning & Concept Development",
        description_c: "The foundation of your renovation journey begins here. This crucial first stage focuses on understanding your needs, establishing realistic goals, and creating a solid framework for your project. Think of this as the blueprint phase where your dreams start taking concrete shape.",
        duration_c: "4-8 weeks",
        timeline_c: "4-8 weeks",
        activities_c: "• Define project scope and objectives\n• Establish preliminary budget parameters\n• Research design inspiration and styles\n• Interview and select key professionals\n• Conduct initial site assessment\n• Develop project brief and requirements\n• Create preliminary timeline\n• Assess planning and consent requirements",
        professional_ids_c: "1,2,3",
        questions_c: "• What are your primary goals for this renovation?\n• What's your realistic budget range including contingencies?\n• How will renovation disruption affect your daily life?\n• What design styles and features inspire you?\n• Are there any structural or planning constraints to consider?",
        notes_c: "The architect or designer is typically the lead professional at this stage, with builder input valuable for feasibility and preliminary costing. Most users benefit from professional guidance even for smaller projects."
      },
      {
        Name: "Stage 2",
        title_c: "Design Development & Documentation",
        description_c: "Transform your ideas into detailed plans and specifications. This stage involves creating comprehensive design documentation that will guide your entire project. The investment in thorough design work here pays dividends throughout construction by preventing costly changes and ensuring everyone understands the vision.",
        duration_c: "6-12 weeks",
        timeline_c: "6-12 weeks",
        activities_c: "• Develop detailed architectural drawings and plans\n• Create 3D visualizations and renderings\n• Specify materials, finishes, and fixtures\n• Coordinate structural and services engineering\n• Prepare detailed cost estimates\n• Refine design based on budget feedback\n• Finalize space planning and functionality\n• Document special features and custom elements",
        professional_ids_c: "1,2,4",
        questions_c: "• Do the detailed plans reflect your vision and needs?\n• Are all structural and engineering requirements addressed?\n• Is the specified level of finish within your budget?\n• How do material and fixture selections work together?\n• Are there any design elements that need refinement?",
        notes_c: "Architects and designers lead this stage with input from builders for constructability and accurate costing. Changes are much less expensive now than during construction."
      },
      {
        Name: "Stage 3",
        title_c: "Consents, Approvals & Final Documentation",
        description_c: "Navigate the regulatory requirements and finalize all project documentation. This often-underestimated stage ensures your project complies with all codes and regulations while providing the detailed information needed for accurate pricing and smooth construction. Patience here prevents significant delays later.",
        duration_c: "4-8 weeks",
        timeline_c: "4-8 weeks",
        activities_c: "• Submit building consent applications\n• Coordinate with council and comply with requirements\n• Finalize detailed construction documentation\n• Complete structural and engineering calculations\n• Obtain all necessary approvals and permits\n• Finalize construction contracts and pricing\n• Schedule pre-construction activities\n• Confirm material availability and lead times",
        professional_ids_c: "1,2",
        questions_c: "• Are all required consents and approvals obtained?\n• Is the final documentation complete and accurate?\n• Are construction contracts fair and comprehensive?\n• Is the construction timeline realistic and agreed?\n• Are all parties clear on roles and responsibilities?",
        notes_c: "While architects typically manage consent applications, builders provide crucial input on constructability and final pricing. This stage requires patience as council processes can vary."
      },
      {
        Name: "Stage 4",
        title_c: "Pre-Construction",
        description_c: "With approvals in hand, it's time to prepare for construction. This stage focuses on finalizing all the details and logistics before work begins on site. Think of this as the calm before the storm — good preparation here makes the construction phase much smoother and less stressful for everyone involved.",
        duration_c: "2-4 weeks",
        timeline_c: "2-4 weeks",
        activities_c: "• Finalize material orders and confirm delivery schedules\n• Schedule trades and coordinate availability\n• Set up site logistics including temporary facilities and safety measures\n• Conduct pre-construction meetings with all trades and suppliers\n• Confirm final interior design selections and order long-lead-time items\n• Establish project management systems and communication protocols",
        professional_ids_c: "2",
        questions_c: "• Are all materials and fixtures selected and ordered?\n• Is the construction schedule realistic and agreed upon?\n• Are temporary living arrangements adequate for your family?\n• How will site access and logistics be managed?\n• What communication systems will keep you informed of progress?",
        notes_c: "The builder is always the preferred choice with other relevant professionals as secondary/joint recommendations where relevant. Users rarely start here unless they have existing relationships. Builder is the clear lead professional at this stage. Focus on practical preparation and final decision-making."
      },
      {
        Name: "Stage 5",
        title_c: "Construction Phase",
        description_c: "This is where your vision becomes reality. The construction phase requires careful coordination, quality control, and regular communication to ensure everything goes according to plan. While it's exciting to see progress, construction can also be disruptive — effective project management keeps everything on track while minimizing stress.",
        duration_c: "8-20+ weeks (varies significantly by project scope)",
        timeline_c: "8-20+ weeks",
        activities_c: "• Site setup, demolition (if required), and structural work\n• Installation of all services including plumbing, electrical, and HVAC\n• Interior fit-out including joinery, cabinetry, and fixtures\n• Regular quality control inspections and progress reporting\n• Coordination of all trades and management of the construction sequence\n• Regular communication with you about progress and any issues",
        professional_ids_c: "2,1,4",
        questions_c: "• Is construction progressing according to schedule?\n• Are quality standards being maintained throughout the build?\n• How are any variations or changes being managed?\n• Are communication systems working effectively?\n• Is the site being managed safely and professionally?",
        notes_c: "The builder is always the preferred choice with other relevant professionals as secondary/joint recommendations where relevant. Users might engage here for project management of existing builds. Builder is the dominant professional relationship. Focus on communication and decision-making support."
      },
      {
        Name: "Stage 6",
        title_c: "Completion & Handover",
        description_c: "As construction nears completion, attention turns to final details, quality checks, and preparing for handover. While you might be eager to move in and enjoy your new space, taking time to do this stage properly ensures you receive a quality result with proper warranty coverage and all compliance requirements met.",
        duration_c: "1-2 weeks",
        timeline_c: "1-2 weeks",
        activities_c: "• Final council inspections to confirm compliance with building codes\n• Comprehensive snagging inspections to identify any defects requiring attention\n• Final cleaning and preparation of all spaces\n• Completion of all warranty documentation and maintenance information\n• Detailed handover process covering all systems and ongoing maintenance\n• Application for Code of Compliance certificate",
        professional_ids_c: "2,1",
        questions_c: "• Have all defects been identified and resolved?\n• Are all council inspections passed and compliance certificates issued?\n• Do you understand all warranty coverage and maintenance requirements?\n• Are you satisfied with the final quality and finish?\n• Have all project documentation and certificates been provided?",
        notes_c: "The builder is always the preferred choice with other relevant professionals as secondary/joint recommendations where relevant. Rarely an entry point for new clients. Builder relationship is crucial for ongoing warranty and support. Focus on satisfaction and future relationship building."
      }
    ];

    // Create missing stages
    for (const stage of defaultStages) {
      const stageNumber = parseInt(stage.Name.replace('Stage ', ''));
      if (!stageNumbers.includes(stageNumber)) {
        await createRoadmapStage(stage);
      }
    }
  } catch (error) {
    console.error('Error ensuring default roadmap stages:', error);
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getRoadmapStages = async () => {
  await delay(300);
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title_c" } },
        { field: { Name: "description_c" } },
        { field: { Name: "duration_c" } },
        { field: { Name: "timeline_c" } },
        { field: { Name: "activities_c" } },
        { field: { Name: "professional_ids_c" } },
        { field: { Name: "questions_c" } },
        { field: { Name: "notes_c" } }
      ],
      orderBy: [
        {
          fieldName: "Name",
          sorttype: "ASC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error('Failed to fetch roadmap stages:', response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching roadmap stages:', error);
    throw error;
  }
};

export const getRoadmapStageById = async (id) => {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title_c" } },
        { field: { Name: "description_c" } },
        { field: { Name: "duration_c" } },
        { field: { Name: "timeline_c" } },
        { field: { Name: "activities_c" } },
        { field: { Name: "professional_ids_c" } },
        { field: { Name: "questions_c" } },
        { field: { Name: "notes_c" } }
      ]
    };
    
    const response = await apperClient.getRecordById(tableName, id, params);
    
    if (!response.success) {
      console.error(`Failed to fetch roadmap stage ${id}:`, response.message);
      throw new Error(response.message);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching roadmap stage ${id}:`, error);
    throw error;
  }
};
export const createRoadmapStage = async (stageData) => {
  try {
    const params = {
      records: [{
        Name: stageData.Name,
        title_c: stageData.title_c,
        description_c: stageData.description_c,
        duration_c: stageData.duration_c,
        timeline_c: stageData.timeline_c,
        activities_c: stageData.activities_c,
        professional_ids_c: stageData.professional_ids_c,
        questions_c: stageData.questions_c,
        notes_c: stageData.notes_c
      }]
    };
    
    const response = await apperClient.createRecord(tableName, params);
    
    if (!response.success) {
      console.error('Failed to create roadmap stage:', response.message);
      throw new Error(response.message);
    }
    
    if (response.results && response.results.length > 0) {
      const result = response.results[0];
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to create roadmap stage');
      }
    }
    
    throw new Error('No result returned from create operation');
  } catch (error) {
    console.error('Error creating roadmap stage:', error);
    throw error;
  }
};

export const updateRoadmapStage = async (id, updateData) => {
  try {
    const params = {
      records: [{
        Id: parseInt(id),
        Name: updateData.Name,
        title_c: updateData.title_c,
        description_c: updateData.description_c,
        duration_c: updateData.duration_c,
        timeline_c: updateData.timeline_c,
        activities_c: updateData.activities_c,
        professional_ids_c: updateData.professional_ids_c,
        questions_c: updateData.questions_c,
        notes_c: updateData.notes_c
      }]
    };
    
    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error(`Failed to update roadmap stage ${id}:`, response.message);
      throw new Error(response.message);
    }
    
    if (response.results && response.results.length > 0) {
      const result = response.results[0];
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to update roadmap stage');
      }
    }
    
    throw new Error('No result returned from update operation');
  } catch (error) {
    console.error(`Error updating roadmap stage ${id}:`, error);
    throw error;
  }
};

export const deleteRoadmapStage = async (id) => {
  try {
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error(`Failed to delete roadmap stage ${id}:`, response.message);
      throw new Error(response.message);
    }
    
    if (response.results && response.results.length > 0) {
      const result = response.results[0];
      if (result.success) {
        return { success: true };
      } else {
        throw new Error(result.message || 'Failed to delete roadmap stage');
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting roadmap stage ${id}:`, error);
    throw error;
  }
};

// Default stages will be created when getRoadmapStages() is first called
// This prevents unauthorized API calls during service initialization