import React, { useState } from 'react';
import { Brain, Users, Building2, Utensils, Award, ArrowLeft, BookOpen } from 'lucide-react';
import { questions, Question } from './data/questions';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const categories: Category[] = [
  {
    id: 'gongwu',
    name: '考公面试',
    icon: <Building2 className="w-6 h-6" />,
    description: '公务员面试场景应变',
    color: 'bg-gradient-to-br from-blue-600 to-blue-700'
  },
  {
    id: 'tizhi',
    name: '体制内工作',
    icon: <Users className="w-6 h-6" />,
    description: '机关单位日常工作应对',
    color: 'bg-gradient-to-br from-emerald-600 to-emerald-700'
  },
  {
    id: 'zhichang',
    name: '公司职场',
    icon: <Brain className="w-6 h-6" />,
    description: '企业职场人际关系处理',
    color: 'bg-gradient-to-br from-purple-600 to-purple-700'
  },
  {
    id: 'canzhuoli',
    name: '山东餐桌礼仪',
    icon: <Utensils className="w-6 h-6" />,
    description: '酒桌文化与餐桌应变',
    color: 'bg-gradient-to-br from-amber-600 to-amber-700'
  }
];

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'quiz' | 'result'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const filteredQuestions = questions.filter(q => q.category === selectedCategory);
  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView('quiz');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResult(false);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...userAnswers, optionIndex];
    setUserAnswers(newAnswers);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowResult(false);
    } else {
      setCurrentView('result');
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedCategory('');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResult(false);
  };

  const calculateTotalScore = () => {
    return userAnswers.reduce((total, answerIndex, questionIndex) => {
      const question = filteredQuestions[questionIndex];
      return total + (question?.options[answerIndex]?.score || 0);
    }, 0);
  };

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { level: 'S级高手', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (score >= 80) return { level: 'A级熟手', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 70) return { level: 'B级新手', color: 'text-blue-600', bg: 'bg-blue-50' };
    return { level: 'C级菜鸟', color: 'text-red-600', bg: 'bg-red-50' };
  };

  if (currentView === 'result') {
    const totalScore = calculateTotalScore();
    const averageScore = Math.round(totalScore / filteredQuestions.length);
    const scoreLevel = getScoreLevel(averageScore);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <Award className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">测试完成</h2>
                <div className={`inline-block px-6 py-3 rounded-full ${scoreLevel.bg} ${scoreLevel.color} font-bold text-lg`}>
                  {scoreLevel.level}
                </div>
                <p className="text-xl text-gray-600 mt-4">平均分数: {averageScore}分</p>
              </div>

              <div className="space-y-6">
                {filteredQuestions.map((question, index) => {
                  const userAnswer = userAnswers[index];
                  const selectedOption = question.options[userAnswer];
                  return (
                    <div key={question.id} className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-3">场景 {index + 1}: {question.scenario}</h3>
                      <p className="text-gray-700 mb-4">{question.question}</p>
                      
                      <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                        <p className="font-medium text-gray-900 mb-2">你的选择:</p>
                        <p className="text-gray-700 mb-3">{selectedOption.text}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <p className="font-medium text-blue-900 mb-2">💭 领导内心OS:</p>
                            <p className="text-blue-800 text-sm italic">"{selectedOption.leaderThought}"</p>
                          </div>
                          
                          {selectedOption.translation && (
                            <div className="bg-amber-50 rounded-lg p-4">
                              <p className="font-medium text-amber-900 mb-2">🔍 黑话翻译:</p>
                              <p className="text-amber-800 text-sm">{selectedOption.translation}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm text-gray-600">{selectedOption.feedback}</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedOption.score >= 90 ? 'bg-green-100 text-green-800' :
                            selectedOption.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {selectedOption.score}分
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={handleBackToHome}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  返回首页
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <button
                onClick={handleBackToHome}
                className="flex items-center text-white hover:text-blue-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                返回首页
              </button>
              <div className="ml-auto text-white">
                {currentQuestionIndex + 1} / {filteredQuestions.length}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">场景模拟</h2>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-lg">{currentQuestion?.scenario}</p>
                </div>
              </div>

              <div className="p-8">
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <div className="flex items-start">
                    <div className="bg-blue-500 text-white rounded-full p-2 mr-4 flex-shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium mb-2">情况说明：</p>
                      <p className="text-gray-700">{currentQuestion?.question}</p>
                    </div>
                  </div>
                </div>

                {!showResult ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">你会如何应对？</h3>
                    {currentQuestion?.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className="w-full text-left p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <div className="flex items-center">
                          <div className="bg-gray-100 group-hover:bg-blue-500 group-hover:text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 transition-colors">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <p className="text-gray-900 group-hover:text-blue-900">{option.text}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">你的选择结果</h3>
                      
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <p className="font-medium text-gray-900 mb-2">选择的答案:</p>
                        <p className="text-gray-700">{currentQuestion?.options[userAnswers[userAnswers.length - 1]]?.text}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                          <p className="font-medium text-purple-900 mb-2">💭 领导内心想法:</p>
                          <p className="text-purple-800 italic">"{currentQuestion?.options[userAnswers[userAnswers.length - 1]]?.leaderThought}"</p>
                        </div>
                        
                        {currentQuestion?.options[userAnswers[userAnswers.length - 1]]?.translation && (
                          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
                            <p className="font-medium text-amber-900 mb-2">🔍 黑话翻译:</p>
                            <p className="text-amber-800">{currentQuestion?.options[userAnswers[userAnswers.length - 1]]?.translation}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{currentQuestion?.options[userAnswers[userAnswers.length - 1]]?.feedback}</span>
                        <span className={`px-4 py-2 rounded-full font-medium ${
                          (currentQuestion?.options[userAnswers[userAnswers.length - 1]]?.score || 0) >= 90 ? 'bg-green-100 text-green-800' :
                          (currentQuestion?.options[userAnswers[userAnswers.length - 1]]?.score || 0) >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {currentQuestion?.options[userAnswers[userAnswers.length - 1]]?.score}分
                        </span>
                      </div>
                    </div>

                    <div className="text-center">
                      <button
                        onClick={handleNextQuestion}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {currentQuestionIndex < filteredQuestions.length - 1 ? '下一题' : '查看总结'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-blue-400 mr-4" />
            <h1 className="text-4xl font-bold text-white">情商应变题库</h1>
          </div>
          <p className="text-xl text-blue-200 mb-2">职场生存指南 · 人际关系大师班</p>
          <p className="text-gray-300">掌握场景应变技巧，提升社交情商水平</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className={`${category.color} p-6 text-white`}>
                  <div className="flex items-center mb-3">
                    {category.icon}
                    <h3 className="text-xl font-bold ml-3">{category.name}</h3>
                  </div>
                  <p className="text-white/90">{category.description}</p>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      {questions.filter(q => q.category === category.id).length} 个场景
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <BookOpen className="w-4 h-4 mr-1" />
                      互动练习
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-2">包含内容:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 真实场景模拟</li>
                      <li>• 领导内心想法解析</li>
                      <li>• 职场黑话翻译</li>
                      <li>• 个性化建议反馈</li>
                    </ul>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-200">
                    开始练习
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">为什么选择我们的题库？</h2>
            <div className="grid md:grid-cols-3 gap-6 text-white">
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">真实场景</h3>
                <p className="text-sm text-gray-300">来源于真实职场经验，针对性强</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">深度解析</h3>
                <p className="text-sm text-gray-300">揭示潜台词，理解真实意图</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">实用技巧</h3>
                <p className="text-sm text-gray-300">提供具体应对策略和话术</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;