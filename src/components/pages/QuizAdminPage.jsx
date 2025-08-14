import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { 
  getQuizzes, 
  getQuizById, 
  createQuiz, 
  updateQuiz, 
  deleteQuiz, 
  publishQuiz, 
  unpublishQuiz,
  getQuizAnalytics 
} from '@/services/api/quizService';

const QuizAdminPage = () => {
  const navigate = useNavigate();
  const { action, id } = useParams(); // /admin/quiz/:action/:id?
  
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('list');

  // Form states
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    estimatedTime: 5,
    imageUrl: '',
    status: 'draft'
  });
  const [questions, setQuestions] = useState([]);
  const [outcomes, setOutcomes] = useState([]);

  useEffect(() => {
    if (action === 'list' || !action) {
      loadQuizzes();
      setActiveTab('list');
    } else if (action === 'edit' && id) {
      loadQuizForEdit(parseInt(id));
      setActiveTab('edit');
    } else if (action === 'create') {
      resetForm();
      setActiveTab('edit');
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
      const quiz = await getQuizById(quizId);
      if (quiz) {
        setCurrentQuiz(quiz);
        setQuizForm({
          title: quiz.title,
          description: quiz.description,
          estimatedTime: quiz.estimatedTime,
          imageUrl: quiz.imageUrl,
          status: quiz.status || 'draft'
        });
        setQuestions(quiz.questions || []);
        setOutcomes(quiz.outcomes || []);
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
      status: 'draft'
    });
    setQuestions([{
      Id: 1,
      question: '',
      options: ['', '', '', ''],
      scoring: {},
      conditionalLogic: {}
    }]);
    setOutcomes([]);
    setCurrentQuiz(null);
  };

  const handleSaveQuiz = async () => {
    try {
      const quizData = {
        ...quizForm,
        questions: questions.filter(q => q.question.trim()),
        outcomes
      };

      let result;
      if (currentQuiz) {
        result = await updateQuiz(currentQuiz.Id, quizData);
        toast.success('Quiz updated successfully');
      } else {
        result = await createQuiz(quizData);
        toast.success('Quiz created successfully');
      }

      navigate('/admin/quiz/list');
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

  const addQuestion = () => {
    const newId = Math.max(...questions.map(q => q.Id), 0) + 1;
    setQuestions([...questions, {
      Id: newId,
      question: '',
      options: ['', '', '', ''],
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

  const addOutcome = () => {
    setOutcomes([...outcomes, {
      type: '',
      title: '',
      description: '',
      recommendedProfessionals: [],
      nextSteps: []
    }]);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary">
              Quiz Management
            </h1>
            <p className="text-gray-600">Create, edit, and manage interactive quizzes</p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/quiz/list')}
            >
              <ApperIcon name="List" className="h-4 w-4 mr-2" />
              All Quizzes
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/admin/quiz/create')}
            >
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              New Quiz
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex space-x-8">
            {['list', 'edit', 'analytics'].map((tab) => (
              <button
                key={tab}
                className={`pb-2 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => {
                  if (tab === 'list') navigate('/admin/quiz/list');
                  setActiveTab(tab);
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Quiz List View */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {quizzes.map((quiz) => (
                <div key={quiz.Id} className="card">
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
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/quiz/analytics/${quiz.Id}`)}
                      >
                        <ApperIcon name="BarChart3" className="h-4 w-4 mr-1" />
                        Analytics
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/quiz/edit/${quiz.Id}`)}
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

        {/* Quiz Edit Form */}
        {activeTab === 'edit' && (
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="card">
              <h3 className="text-lg font-semibold text-primary mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({...quizForm, title: e.target.value})}
                    placeholder="Enter quiz title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
                  <Input
                    id="estimatedTime"
                    type="number"
                    value={quizForm.estimatedTime}
                    onChange={(e) => setQuizForm({...quizForm, estimatedTime: parseInt(e.target.value)})}
                    min="1"
                    max="30"
                  />
                </div>

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

                <div className="md:col-span-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={quizForm.imageUrl}
                    onChange={(e) => setQuizForm({...quizForm, imageUrl: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-primary">Questions</h3>
                <Button variant="outline" onClick={addQuestion}>
                  <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>

              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.Id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-medium text-gray-800">Question {index + 1}</h4>
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
                        <Label>Answer Options</Label>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <Input
                              key={optionIndex}
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...question.options];
                                newOptions[optionIndex] = e.target.value;
                                updateQuestion(index, 'options', newOptions);
                              }}
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/quiz/list')}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveQuiz}
                disabled={!quizForm.title || questions.filter(q => q.question.trim()).length === 0}
              >
                <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                Save Quiz
              </Button>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeTab === 'analytics' && analytics && currentQuiz && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold text-primary mb-4">
                {currentQuiz.title} - Analytics
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

              {/* Professional Recommendations Chart */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-4">
                  Professional Recommendations
                </h4>
                <div className="space-y-3">
                  {Object.entries(analytics.professionalRecommendations).map(([profId, count]) => (
                    <div key={profId} className="flex items-center justify-between">
                      <span className="text-gray-700">
                        Professional {profId}
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(count / analytics.totalCompletions) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {count} ({Math.round((count / analytics.totalCompletions) * 100)}%)
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

export default QuizAdminPage;