import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import { 
  getQuizzes, 
  getQuizById, 
  createQuiz, 
  updateQuiz, 
  deleteQuiz, 
  publishQuiz, 
  unpublishQuiz,
  getQuizAnalytics,
  createQuizSteps,
  getQuizSteps,
  updateQuizSteps
} from '@/services/api/quizService';

const QuizBuilderPage = () => {
  const navigate = useNavigate();
  const { action, id } = useParams(); // /admin/quiz-builder/:action/:id?
  
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [quizSteps, setQuizSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [dragEnabled, setDragEnabled] = useState(false);

  // Enhanced form states for quiz builder
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    estimatedTime: 5,
    imageUrl: '',
    status: 'draft',
    quizLogic: {
      flowType: 'linear',
      complexity: 'standard',
      skipLogic: false,
      branching: false
    }
  });
  
  const [questions, setQuestions] = useState([]);
  const [outcomes, setOutcomes] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [flowVisualization, setFlowVisualization] = useState({});

  useEffect(() => {
    if (action === 'list' || !action) {
      loadQuizzes();
      setActiveTab('overview');
    } else if (action === 'edit' && id) {
      loadQuizForEdit(parseInt(id));
      setActiveTab('builder');
    } else if (action === 'create') {
      resetForm();
      setActiveTab('builder');
    } else if (action === 'analytics' && id) {
      loadAnalytics(parseInt(id));
      setActiveTab('analytics');
    }
  }, [action, id]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await getQuizzes();
      setQuizzes(data);
    } catch (err) {
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const loadQuizForEdit = async (quizId) => {
    try {
      setLoading(true);
      const [quiz, steps] = await Promise.all([
        getQuizById(quizId),
        getQuizSteps(quizId)
      ]);
      
      if (quiz) {
        setCurrentQuiz(quiz);
        setQuizForm({
          title: quiz.title || '',
          description: quiz.description || '',
          estimatedTime: quiz.estimatedTime || 5,
          imageUrl: quiz.imageUrl || '',
          status: quiz.status || 'draft',
          quizLogic: quiz.quizLogic || {
            flowType: 'linear',
            complexity: 'standard',
            skipLogic: false,
            branching: false
          }
        });
        setQuestions(quiz.questions || []);
        setOutcomes(quiz.outcomes || []);
        setQuizSteps(steps || []);
      }
    } catch (err) {
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async (quizId) => {
    try {
      setLoading(true);
      const [quiz, analyticsData] = await Promise.all([
        getQuizById(quizId),
        getQuizAnalytics(quizId)
      ]);
      setCurrentQuiz(quiz);
      setAnalytics(analyticsData);
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setQuizForm({
      title: '',
      description: '',
      estimatedTime: 5,
      imageUrl: '',
      status: 'draft',
      quizLogic: {
        flowType: 'linear',
        complexity: 'standard',
        skipLogic: false,
        branching: false
      }
    });
    setQuestions([{
      Id: 1,
      question: '',
      thumbnailUrl: '',
      options: ['', '', '', ''],
      optionThumbnails: ['/api/placeholder/48/48', '/api/placeholder/48/48', '/api/placeholder/48/48', '/api/placeholder/48/48'],
      scoring: {},
      conditionalLogic: {}
    }]);
    setOutcomes([]);
    setQuizSteps([]);
    setCurrentQuiz(null);
  };

  const handleSaveQuiz = async () => {
    try {
      const quizData = {
        ...quizForm,
        questions: questions.filter(q => q.question?.trim()),
        outcomes,
        steps: quizSteps
      };

      let result;
      if (currentQuiz) {
        result = await updateQuiz(currentQuiz.Id, quizData);
        toast.success('Quiz updated successfully');
      } else {
        result = await createQuiz(quizData);
        toast.success('Quiz created successfully');
      }

      navigate('/admin/quiz-builder/list');
    } catch (err) {
      toast.error('Failed to save quiz');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(quizId);
        toast.success('Quiz deleted successfully');
        loadQuizzes();
      } catch (err) {
        toast.error('Failed to delete quiz');
      }
    }
  };

  const handlePublishToggle = async (quizId, currentStatus) => {
    try {
      if (currentStatus === 'published') {
        await unpublishQuiz(quizId);
        toast.success('Quiz unpublished');
      } else {
        await publishQuiz(quizId);
        toast.success('Quiz published');
      }
      loadQuizzes();
    } catch (err) {
      toast.error('Failed to update quiz status');
    }
  };

  // Enhanced question management
  const addQuestion = () => {
    const newId = Math.max(...questions.map(q => q.Id), 0) + 1;
    setQuestions([...questions, {
      Id: newId,
      question: '',
      thumbnailUrl: '',
      options: ['', '', '', ''],
      optionThumbnails: ['/api/placeholder/48/48', '/api/placeholder/48/48', '/api/placeholder/48/48', '/api/placeholder/48/48'],
      scoring: {},
      conditionalLogic: {}
    }]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const duplicateQuestion = (index) => {
    const questionToCopy = { ...questions[index] };
    questionToCopy.Id = Math.max(...questions.map(q => q.Id), 0) + 1;
    questionToCopy.question = questionToCopy.question + ' (Copy)';
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, questionToCopy);
    setQuestions(newQuestions);
  };

  // Conditional logic management
  const updateConditionalLogic = (questionIndex, option, logic) => {
    const updated = [...questions];
    if (!updated[questionIndex].conditionalLogic) {
      updated[questionIndex].conditionalLogic = {};
    }
    updated[questionIndex].conditionalLogic[option] = logic;
    setQuestions(updated);
  };

  const addOutcome = () => {
    setOutcomes([...outcomes, {
      type: '',
      title: '',
      description: '',
      recommendedProfessionals: [],
      nextSteps: []
    }]);
  };

  // Drag and drop for question reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setQuestions(items);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary">
              Advanced Quiz Builder
            </h1>
            <p className="text-gray-600">Create sophisticated interactive quizzes with conditional logic and visual elements</p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/quiz-builder/list')}
            >
              <ApperIcon name="List" className="h-4 w-4 mr-2" />
              All Quizzes
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/admin/quiz-builder/create')}
            >
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              New Quiz
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex space-x-8">
            {['overview', 'builder', 'logic', 'preview', 'analytics'].map((tab) => (
              <button
                key={tab}
                className={`pb-2 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <ApperIcon 
                  name={
                    tab === 'overview' ? 'Grid3x3' : 
                    tab === 'builder' ? 'Wrench' :
                    tab === 'logic' ? 'GitBranch' :
                    tab === 'preview' ? 'Eye' : 'BarChart3'
                  } 
                  className="h-4 w-4 mr-2 inline" 
                />
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Quiz Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {quizzes.map((quiz) => (
                <div key={quiz.Id} className="card hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-primary">
                          {quiz.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          quiz.status === 'published' 
                            ? 'bg-success/10 text-success' 
                            : 'bg-warning/10 text-warning'
                        }`}>
                          {quiz.status || 'draft'}
                        </span>
                        {quiz.quizLogic?.complexity && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            quiz.quizLogic.complexity === 'advanced' 
                              ? 'bg-accent/10 text-accent'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {quiz.quizLogic.complexity}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{quiz.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <ApperIcon name="Clock" className="h-4 w-4 mr-1" />
                          {quiz.estimatedTime} min
                        </span>
                        <span className="flex items-center">
                          <ApperIcon name="HelpCircle" className="h-4 w-4 mr-1" />
                          {quiz.questions?.length || 0} questions
                        </span>
                        <span className="flex items-center">
                          <ApperIcon name="Target" className="h-4 w-4 mr-1" />
                          {quiz.outcomes?.length || 0} outcomes
                        </span>
                        {quiz.quizLogic?.branching && (
                          <span className="flex items-center">
                            <ApperIcon name="GitBranch" className="h-4 w-4 mr-1" />
                            Conditional Logic
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/quiz-builder/analytics/${quiz.Id}`)}
                      >
                        <ApperIcon name="BarChart3" className="h-4 w-4 mr-1" />
                        Analytics
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/quiz-builder/edit/${quiz.Id}`)}
                      >
                        <ApperIcon name="Edit" className="h-4 w-4 mr-1" />
                        Edit
                      </Button>

                      <Button
                        variant={quiz.status === 'published' ? 'warning' : 'success'}
                        size="sm"
                        onClick={() => handlePublishToggle(quiz.Id, quiz.status)}
                      >
                        {quiz.status === 'published' ? 'Unpublish' : 'Publish'}
                      </Button>

                      <Button
                        variant="error"
                        size="sm"
                        onClick={() => handleDeleteQuiz(quiz.Id)}
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visual Quiz Builder */}
        {activeTab === 'builder' && (
          <div className="space-y-8">
            {/* Quiz Settings */}
            <div className="card">
              <h3 className="text-lg font-semibold text-primary mb-4">Quiz Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Quiz Title"
                  id="title"
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({...quizForm, title: e.target.value})}
                  placeholder="Enter quiz title"
                />
                
                <FormField
                  label="Estimated Time (minutes)"
                  id="estimatedTime"
                  type="number"
                  value={quizForm.estimatedTime}
                  onChange={(e) => setQuizForm({...quizForm, estimatedTime: parseInt(e.target.value)})}
                  min="1"
                  max="30"
                />

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={quizForm.description}
                    onChange={(e) => setQuizForm({...quizForm, description: e.target.value})}
                    placeholder="Describe what this quiz helps users discover"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    rows="3"
                  />
                </div>

                <FormField
                  label="Cover Image URL"
                  id="imageUrl"
                  value={quizForm.imageUrl}
                  onChange={(e) => setQuizForm({...quizForm, imageUrl: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                />

                <div>
                  <Label htmlFor="flowType">Quiz Flow Type</Label>
                  <select
                    id="flowType"
                    value={quizForm.quizLogic.flowType}
                    onChange={(e) => setQuizForm({
                      ...quizForm, 
                      quizLogic: {...quizForm.quizLogic, flowType: e.target.value}
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="linear">Linear (Sequential)</option>
                    <option value="conditional">Conditional (Branching)</option>
                    <option value="scoring">Scoring Based</option>
                    <option value="assessment">Assessment Style</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Question Builder */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-primary">Visual Question Builder</h3>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDragEnabled(!dragEnabled)}
                  >
                    <ApperIcon name={dragEnabled ? "Lock" : "Move"} className="h-4 w-4 mr-2" />
                    {dragEnabled ? 'Lock Order' : 'Reorder'}
                  </Button>
                  <Button variant="outline" onClick={addQuestion}>
                    <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="questions" isDropDisabled={!dragEnabled}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                      {questions.map((question, index) => (
                        <Draggable 
                          key={question.Id} 
                          draggableId={question.Id.toString()} 
                          index={index}
                          isDragDisabled={!dragEnabled}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`border border-gray-200 rounded-lg p-6 bg-white ${
                                snapshot.isDragging ? 'shadow-lg' : ''
                              } ${dragEnabled ? 'cursor-move' : ''}`}
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  {dragEnabled && (
                                    <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600">
                                      <ApperIcon name="GripVertical" className="h-5 w-5" />
                                    </div>
                                  )}
                                  <h4 className="font-medium text-gray-800">Question {index + 1}</h4>
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => duplicateQuestion(index)}
                                  >
                                    <ApperIcon name="Copy" className="h-4 w-4 text-gray-500" />
                                  </Button>
                                  {questions.length > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeQuestion(index)}
                                    >
                                      <ApperIcon name="Trash2" className="h-4 w-4 text-error" />
                                    </Button>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <Label>Question Text</Label>
                                  <Input
                                    value={question.question}
                                    onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                                    placeholder="Enter your question"
                                  />
                                </div>

                                <div>
                                  <Label>Question Thumbnail (Optional)</Label>
                                  <Input
                                    value={question.thumbnailUrl || ''}
                                    onChange={(e) => updateQuestion(index, 'thumbnailUrl', e.target.value)}
                                    placeholder="https://images.unsplash.com/..."
                                  />
                                </div>

                                <div>
                                  <Label>Answer Options with Thumbnails</Label>
                                  <div className="space-y-3">
                                    {question.options.map((option, optionIndex) => (
                                      <div key={optionIndex} className="flex items-center space-x-3">
                                        <Input
                                          value={option}
                                          onChange={(e) => {
                                            const newOptions = [...question.options];
                                            newOptions[optionIndex] = e.target.value;
                                            updateQuestion(index, 'options', newOptions);
                                          }}
                                          placeholder={`Option ${optionIndex + 1}`}
                                          className="flex-1"
                                        />
                                        <Input
                                          value={question.optionThumbnails?.[optionIndex] || '/api/placeholder/48/48'}
                                          onChange={(e) => {
                                            const newThumbnails = [...(question.optionThumbnails || [])];
                                            newThumbnails[optionIndex] = e.target.value;
                                            updateQuestion(index, 'optionThumbnails', newThumbnails);
                                          }}
                                          placeholder="Thumbnail URL"
                                          className="w-32"
                                        />
                                        <div className="w-8 h-8 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                                          <img 
                                            src={question.optionThumbnails?.[optionIndex] || '/api/placeholder/48/48'}
                                            alt={`Option ${optionIndex + 1} thumbnail`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              e.target.src = '/api/placeholder/48/48';
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            {/* Save Actions */}
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/quiz-builder/list')}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveQuiz}
                disabled={!quizForm.title || questions.filter(q => q.question?.trim()).length === 0}
              >
                <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                Save Quiz
              </Button>
            </div>
          </div>
        )}

        {/* Conditional Logic Designer */}
        {activeTab === 'logic' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-primary mb-4">Conditional Logic Designer</h3>
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <ApperIcon name="GitBranch" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-700 mb-2">Visual Logic Builder</h4>
              <p className="text-gray-600 mb-4">
                Configure conditional paths and branching logic for complex quiz flows
              </p>
              <Button variant="primary">
                <ApperIcon name="Wrench" className="h-4 w-4 mr-2" />
                Open Logic Designer
              </Button>
            </div>
          </div>
        )}

        {/* Quiz Preview */}
        {activeTab === 'preview' && (
          <div className="card">
            <h3 className="text-lg font-semibold text-primary mb-4">Quiz Preview</h3>
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <ApperIcon name="Eye" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-700 mb-2">Interactive Preview</h4>
              <p className="text-gray-600 mb-4">
                Test your quiz functionality and user experience
              </p>
              <Button variant="primary">
                <ApperIcon name="Play" className="h-4 w-4 mr-2" />
                Launch Preview
              </Button>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeTab === 'analytics' && analytics && currentQuiz && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold text-primary mb-4">
                {currentQuiz.title} - Analytics Dashboard
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {analytics.totalStarts}
                  </div>
                  <p className="text-gray-600">Total Starts</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">
                    {analytics.totalCompletions}
                  </div>
                  <p className="text-gray-600">Completions</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">
                    {analytics.completionRate}%
                  </div>
                  <p className="text-gray-600">Completion Rate</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning">
                    {analytics.averageTimeSpent}
                  </div>
                  <p className="text-gray-600">Avg. Time (min)</p>
                </div>
              </div>

              {/* Enhanced Analytics Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">
                    Question Drop-off Analysis
                  </h4>
                  <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Drop-off visualization would appear here</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">
                    Answer Distribution
                  </h4>
                  <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Answer distribution chart would appear here</span>
                  </div>
                </div>
              </div>

              {/* Professional Recommendations Chart */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-4">
                  Professional Recommendations Performance
                </h4>
                <div className="space-y-3">
                  {Object.entries(analytics.professionalRecommendations || {}).map(([profId, count]) => (
                    <div key={profId} className="flex items-center justify-between">
                      <span className="text-gray-700">
                        Professional {profId}
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(count / (analytics.totalCompletions || 1)) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {count} ({Math.round((count / (analytics.totalCompletions || 1)) * 100)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizBuilderPage;