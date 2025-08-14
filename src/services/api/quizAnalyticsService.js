// Mock analytics service - in production would connect to real analytics API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock analytics data storage
let analyticsData = {
  quizStarts: {},
  quizCompletions: {},
  userSessions: [],
  professionalRecommendations: {},
  dropOffPoints: {},
  conversionRates: {}
};

// Track quiz events
export const trackQuizStart = async (quizId, userId = null) => {
  await delay(100);
  
  const timestamp = new Date().toISOString();
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Initialize tracking for this quiz if not exists
  if (!analyticsData.quizStarts[quizId]) {
    analyticsData.quizStarts[quizId] = [];
  }
  
  analyticsData.quizStarts[quizId].push({
    timestamp,
    sessionId,
    userId,
    userAgent: navigator.userAgent,
    referrer: document.referrer
  });

  // Track user session
  analyticsData.userSessions.push({
    sessionId,
    quizId,
    startTime: timestamp,
    userId,
    events: ['quiz_started']
  });

  return { sessionId, timestamp };
};

export const trackQuizCompletion = async (quizId, sessionId, results, timeSpent) => {
  await delay(100);
  
  const timestamp = new Date().toISOString();
  
  // Initialize tracking for this quiz if not exists
  if (!analyticsData.quizCompletions[quizId]) {
    analyticsData.quizCompletions[quizId] = [];
  }
  
  analyticsData.quizCompletions[quizId].push({
    timestamp,
    sessionId,
    timeSpent,
    results,
    professionalRecommendations: results.professionals?.map(p => p.Id) || [],
    outcomeType: results.outcome?.type
  });

  // Update session data
  const session = analyticsData.userSessions.find(s => s.sessionId === sessionId);
  if (session) {
    session.completedTime = timestamp;
    session.timeSpent = timeSpent;
    session.events.push('quiz_completed');
    session.results = results;
  }

  // Track professional recommendations
  if (results.professionals) {
    results.professionals.forEach(prof => {
      if (!analyticsData.professionalRecommendations[prof.Id]) {
        analyticsData.professionalRecommendations[prof.Id] = 0;
      }
      analyticsData.professionalRecommendations[prof.Id]++;
    });
  }

  return { timestamp };
};

export const trackQuizDropOff = async (quizId, sessionId, questionIndex, timeSpent) => {
  await delay(100);
  
  if (!analyticsData.dropOffPoints[quizId]) {
    analyticsData.dropOffPoints[quizId] = {};
  }
  
  if (!analyticsData.dropOffPoints[quizId][questionIndex]) {
    analyticsData.dropOffPoints[quizId][questionIndex] = 0;
  }
  
  analyticsData.dropOffPoints[quizId][questionIndex]++;

  // Update session
  const session = analyticsData.userSessions.find(s => s.sessionId === sessionId);
  if (session) {
    session.events.push(`dropped_off_question_${questionIndex}`);
    session.dropOffPoint = questionIndex;
    session.timeSpent = timeSpent;
  }

  return true;
};

export const trackProfessionalContact = async (professionalId, fromQuizId = null, sessionId = null) => {
  await delay(100);
  
  if (!analyticsData.conversionRates[professionalId]) {
    analyticsData.conversionRates[professionalId] = {
      views: 0,
      contacts: 0,
      fromQuizzes: {}
    };
  }
  
  analyticsData.conversionRates[professionalId].contacts++;
  
  if (fromQuizId) {
    if (!analyticsData.conversionRates[professionalId].fromQuizzes[fromQuizId]) {
      analyticsData.conversionRates[professionalId].fromQuizzes[fromQuizId] = 0;
    }
    analyticsData.conversionRates[professionalId].fromQuizzes[fromQuizId]++;
  }

  // Update session if available
  if (sessionId) {
    const session = analyticsData.userSessions.find(s => s.sessionId === sessionId);
    if (session) {
      session.events.push(`contacted_professional_${professionalId}`);
      session.convertedToProfessional = professionalId;
    }
  }

  return true;
};

// Get analytics data
export const getQuizAnalytics = async (quizId, dateRange = null) => {
  await delay(300);
  
  const starts = analyticsData.quizStarts[quizId] || [];
  const completions = analyticsData.quizCompletions[quizId] || [];
  const dropOffs = analyticsData.dropOffPoints[quizId] || {};
  
  // Filter by date range if provided
  const filteredStarts = dateRange ? 
    starts.filter(s => new Date(s.timestamp) >= dateRange.start && new Date(s.timestamp) <= dateRange.end) : 
    starts;
  
  const filteredCompletions = dateRange ?
    completions.filter(c => new Date(c.timestamp) >= dateRange.start && new Date(c.timestamp) <= dateRange.end) :
    completions;

  // Calculate metrics
  const totalStarts = filteredStarts.length;
  const totalCompletions = filteredCompletions.length;
  const completionRate = totalStarts > 0 ? (totalCompletions / totalStarts) * 100 : 0;
  
  const averageTimeSpent = filteredCompletions.length > 0 ?
    filteredCompletions.reduce((sum, c) => sum + (c.timeSpent || 0), 0) / filteredCompletions.length :
    0;

  // Professional recommendation counts
  const professionalCounts = {};
  filteredCompletions.forEach(completion => {
    if (completion.professionalRecommendations) {
      completion.professionalRecommendations.forEach(profId => {
        professionalCounts[profId] = (professionalCounts[profId] || 0) + 1;
      });
    }
  });

  // Drop-off analysis
  const dropOffAnalysis = Object.entries(dropOffs).map(([questionIndex, count]) => ({
    questionIndex: parseInt(questionIndex),
    dropOffCount: count,
    dropOffRate: totalStarts > 0 ? (count / totalStarts) * 100 : 0
  }));

  // Outcome distribution
  const outcomeDistribution = {};
  filteredCompletions.forEach(completion => {
    if (completion.outcomeType) {
      outcomeDistribution[completion.outcomeType] = (outcomeDistribution[completion.outcomeType] || 0) + 1;
    }
  });

  return {
    totalStarts,
    totalCompletions,
    completionRate: parseFloat(completionRate.toFixed(1)),
    averageTimeSpent: parseFloat(averageTimeSpent.toFixed(1)),
    professionalRecommendations: professionalCounts,
    dropOffPoints: dropOffAnalysis,
    outcomeDistribution,
    dateRange: dateRange || { start: null, end: null },
    
    // Additional insights
    insights: {
      mostCommonDropOff: dropOffAnalysis.length > 0 ? 
        dropOffAnalysis.reduce((max, current) => max.dropOffRate > current.dropOffRate ? max : current) : 
        null,
      topProfessionalRecommendation: Object.entries(professionalCounts)
        .sort(([,a], [,b]) => b - a)[0] || null,
      conversionRate: totalStarts > 0 ? 
        (Object.values(analyticsData.conversionRates)
          .reduce((sum, prof) => sum + prof.contacts, 0) / totalStarts * 100) : 0
    }
  };
};

export const getAllQuizAnalytics = async (dateRange = null) => {
  await delay(500);
  
  const allQuizIds = Object.keys(analyticsData.quizStarts);
  const analyticsPromises = allQuizIds.map(quizId => getQuizAnalytics(parseInt(quizId), dateRange));
  const allAnalytics = await Promise.all(analyticsPromises);
  
  const summary = {
    totalQuizzes: allQuizIds.length,
    totalStarts: allAnalytics.reduce((sum, analytics) => sum + analytics.totalStarts, 0),
    totalCompletions: allAnalytics.reduce((sum, analytics) => sum + analytics.totalCompletions, 0),
    overallCompletionRate: 0,
    averageTimeSpent: 0,
    quizAnalytics: allQuizIds.map((quizId, index) => ({
      quizId: parseInt(quizId),
      ...allAnalytics[index]
    }))
  };
  
  summary.overallCompletionRate = summary.totalStarts > 0 ? 
    (summary.totalCompletions / summary.totalStarts) * 100 : 0;
  
  summary.averageTimeSpent = allAnalytics.length > 0 ?
    allAnalytics.reduce((sum, analytics) => sum + analytics.averageTimeSpent, 0) / allAnalytics.length : 0;

  return summary;
};

export const getProfessionalAnalytics = async (professionalId) => {
  await delay(200);
  
  const profData = analyticsData.conversionRates[professionalId] || {
    views: 0,
    contacts: 0,
    fromQuizzes: {}
  };
  
  const totalQuizRecommendations = analyticsData.professionalRecommendations[professionalId] || 0;
  const conversionRate = totalQuizRecommendations > 0 ? 
    (profData.contacts / totalQuizRecommendations) * 100 : 0;
  
  return {
    professionalId: parseInt(professionalId),
    totalRecommendations: totalQuizRecommendations,
    totalContacts: profData.contacts,
    conversionRate: parseFloat(conversionRate.toFixed(1)),
    quizBreakdown: profData.fromQuizzes,
    trending: {
      isIncreasing: Math.random() > 0.5, // Mock trend data
      percentageChange: (Math.random() * 40 - 20).toFixed(1) // -20% to +20%
    }
  };
};

// Utility functions for date ranges
export const getDateRange = (period) => {
  const end = new Date();
  const start = new Date();
  
  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(start.getDate() - 7);
      break;
    case 'month':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'quarter':
      start.setMonth(start.getMonth() - 3);
      break;
    case 'year':
      start.setFullYear(start.getFullYear() - 1);
      break;
    default:
      start.setDate(start.getDate() - 30); // Default to 30 days
  }
  
  return { start, end };
};

// Export analytics data (for backup/analysis)
export const exportAnalyticsData = async (format = 'json') => {
  await delay(200);
  
  if (format === 'json') {
    return JSON.stringify(analyticsData, null, 2);
  }
  
  // Could add CSV export here
  throw new Error('Unsupported export format');
};

// Clear analytics data (for testing)
export const clearAnalyticsData = async () => {
  await delay(100);
  
  analyticsData = {
    quizStarts: {},
    quizCompletions: {},
    userSessions: [],
    professionalRecommendations: {},
    dropOffPoints: {},
    conversionRates: {}
  };
  
  return true;
};

export default {
  trackQuizStart,
  trackQuizCompletion,
  trackQuizDropOff,
  trackProfessionalContact,
  getQuizAnalytics,
  getAllQuizAnalytics,
  getProfessionalAnalytics,
  getDateRange,
  exportAnalyticsData,
  clearAnalyticsData
};