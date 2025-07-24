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
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const filteredQuestions = questions.filter(q => q.category === selectedCategory);
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const currentFlashcard = filteredQuestions[flashcardIndex];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView('quiz');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResult(false);
    setFlashcardIndex(Math.floor(Math.random() * questions.filter(q => q.category === categoryId).length));
    setShowAnswer(false);
  };

  const handleFlashcardSelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView('flashcard');
    setFlashcardIndex(Math.floor(Math.random() * questions.filter(q => q.category === categoryId).length));
    setShowAnswer(false);
  };

  const handleNextFlashcard = () => {
    const categoryQuestions = questions.filter(q => q.category === selectedCategory);
    setFlashcardIndex(Math.floor(Math.random() * categoryQuestions.length));
    setShowAnswer(false);
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
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
    setShowAnswer(false);
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

  if (currentView === 'flashcard') {
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
              <div className="ml-auto flex items-center space-x-4">
                <span className="text-white">记忆闪卡</span>
                <span className="text-blue-300">{filteredQuestions.length} 题</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[500px]">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">记忆闪卡</h2>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-lg">{currentFlashcard?.scenario}</p>
                </div>
              </div>

              <div className="p-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border-2 border-blue-100">
                  <div className="flex items-start">
                    <div className="bg-purple-500 text-white rounded-full p-2 mr-4 flex-shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-purple-900 font-medium mb-2">题目：</p>
                      <p className="text-gray-800 text-lg leading-relaxed">{currentFlashcard?.question}</p>
                    </div>
                  </div>
                </div>

                {!showAnswer ? (
                  <div className="text-center">
                    <div className="mb-8">
                      <div className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-6 py-3 mb-4">
                        <span className="text-purple-700 font-medium">点击查看最佳答案</span>
                      </div>
                    </div>
                    <button
                      onClick={toggleAnswer}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-12 py-4 rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
                    >
                      查看答案
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2" />
                        最佳答案
                      </h3>
                      
                      {(() => {
                        const bestOption = currentFlashcard?.options.reduce((best, current) => 
                          current.score > best.score ? current : best
                        );
                        return (
                          <div>
                            <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
                              <p className="text-gray-800 font-medium mb-2">{bestOption?.text}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-green-600 text-sm">{bestOption?.feedback}</span>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {bestOption?.score}分
                                </span>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                                <p className="font-medium text-purple-900 mb-2">💭 领导内心想法:</p>
                                <p className="text-purple-800 italic text-sm">"{bestOption?.leaderThought}"</p>
                              </div>
                              
                              {bestOption?.translation && (
                                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
                                  <p className="font-medium text-amber-900 mb-2">🔍 黑话翻译:</p>
                                  <p className="text-amber-800 text-sm">{bestOption.translation}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={toggleAnswer}
                        className="bg-gray-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-600 transition-all duration-200"
                      >
                        隐藏答案
                      </button>
                      <button
                        onClick={handleNextFlashcard}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        下一题
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
              <div className="ml-auto flex items-center space-x-4">
                <span className="text-white">选择题练习</span>
                <span className="text-blue-300">{filteredQuestions.length} 题</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[500px]">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">记忆闪卡</h2>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="text-lg">{currentFlashcard?.scenario}</p>
                </div>
              </div>

              <div className="p-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border-2 border-blue-100">
                  <div className="flex items-start">
                    <div className="bg-purple-500 text-white rounded-full p-2 mr-4 flex-shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-purple-900 font-medium mb-2">题目：</p>
                      <p className="text-gray-800 text-lg leading-relaxed">{currentFlashcard?.question}</p>
                    </div>
                  </div>
                </div>

                {!showAnswer ? (
                  <div className="text-center">
                    <div className="mb-8">
                      <div className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-6 py-3 mb-4">
                        <span className="text-purple-700 font-medium">点击查看最佳答案</span>
                      </div>
                    </div>
                    <button
                      onClick={toggleAnswer}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-12 py-4 rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
                    >
                      查看答案
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2" />
                        最佳答案
                      </h3>
                      
                      {(() => {
                        const bestOption = currentFlashcard?.options.reduce((best, current) => 
                          current.score > best.score ? current : best
                        );
                        return (
                          <div>
                            <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
                              <p className="text-gray-800 font-medium mb-2">{bestOption?.text}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-green-600 text-sm">{bestOption?.feedback}</span>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {bestOption?.score}分
                                </span>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                                <p className="font-medium text-purple-900 mb-2">💭 领导内心想法:</p>
                                <p className="text-purple-800 italic text-sm">"{bestOption?.leaderThought}"</p>
                              </div>
                              
                              {bestOption?.translation && (
                                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
                                  <p className="font-medium text-amber-900 mb-2">🔍 黑话翻译:</p>
                                  <p className="text-amber-800 text-sm">{bestOption.translation}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={toggleAnswer}
                        className="bg-gray-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-600 transition-all duration-200"
                      >
                        隐藏答案
                      </button>
                      <button
                        onClick={handleNextFlashcard}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        下一题
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
                      <li>• 选择题练习</li>
                      <li>• 实时评分反馈</li>
                      <li>• 详细答案解析</li>
                      <li>• 领导内心想法</li>
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
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8">记忆闪卡</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <div
                  key={`flashcard-${category.id}`}
                  onClick={() => handleFlashcardSelect(category.id)}
                  className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 hover:bg-white/30 transition-all duration-300">
                    <div className="text-white mb-4">
                      {category.icon}
                    </div>
                    <h3 className="text-white font-semibold mb-2">{category.name}</h3>
                    <p className="text-gray-300 text-sm mb-4">快速记忆学习</p>
                    <div className="bg-white/20 rounded-lg px-3 py-1 text-xs text-white">
                      {questions.filter(q => q.category === category.id).length} 题
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-gray-300 mt-6">点击任意模块开始记忆闪卡学习，随机出题，直接查看最佳答案</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;