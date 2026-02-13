// src/screens/QuestionAreaScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTimer } from '../hooks/useTimer';
// ✅ CORREÇÃO: Importar o 'awsApiService'
import { awsApiService } from '../services/awsApiService';

const QuestionAreaScreen = ({ navigation, route }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user, world } = route.params || {};

  const { timeLeft, isRunning, start, stop, reset } = useTimer(30, handleTimeUp);

  useEffect(() => {
    loadQuestions();
    start();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    
    try {
      // ✅ CORREÇÃO: Chamar a função 'awsApiService.getQuestions'
      // Assumindo que getQuestions(worldId) é o correto.
      let selectedQuestions = await awsApiService.getQuestions(world?.id || 'default');
      
      if (!selectedQuestions || selectedQuestions.length === 0) {
        // Fallback para questões locais
        selectedQuestions = getFallbackQuestions(world);
      }
      
      setQuestions(selectedQuestions);
    } catch (error) {
      console.error('❌ Erro ao carregar questões:', error);
      // Fallback para questões locais
      const selectedQuestions = getFallbackQuestions(world);
      setQuestions(selectedQuestions);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackQuestions = (world) => {
    const SAMPLE_QUESTIONS = {
      math: [
        {
          id: 1,
          question: 'Quanto é 8 × 7?',
          options: ['54', '56', '58', '60'],
          correctAnswer: 1,
          category: 'Matemágica',
          difficulty: 'Fácil',
          reward: { coins: 10, experience: 5 }
        },
        {
          id: 2,
          question: 'Qual é o resultado de 15 ÷ 3?',
          options: ['3', '4', '5', '6'],
          correctAnswer: 2,
          category: 'Matemágica',
          difficulty: 'Fácil',
          reward: { coins: 10, experience: 5 }
        },
      ],
      science: [
        {
          id: 3,
          question: 'Qual é o maior planeta do sistema solar?',
          options: ['Terra', 'Marte', 'Júpiter', 'Saturno'],
          correctAnswer: 2,
          category: 'Ciências Encantadas',
          difficulty: 'Médio',
          reward: { coins: 15, experience: 8 }
        },
      ],
      default: [
        {
          id: 4,
          question: 'Qual é a capital do Brasil?',
          options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
          correctAnswer: 2,
          category: 'Conhecimento Geral',
          difficulty: 'Fácil',
          reward: { coins: 10, experience: 5 }
        },
      ]
    };

    return world && SAMPLE_QUESTIONS[world.id] 
      ? SAMPLE_QUESTIONS[world.id] 
      : SAMPLE_QUESTIONS.default;
  };

  function handleTimeUp() {
    if (!isAnswered) {
      Alert.alert('⏰ Tempo Esgotado!', 'Vamos para a próxima questão!');
      handleNextQuestion();
    }
  }

  const handleAnswerSelect = async (answerIndex) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    stop();

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    if (isCorrect) {
      const newScore = score + 100;
      setScore(newScore);
      setCorrectAnswers(correctAnswers + 1);
      
      if (user?.id) {
        try {
          // ✅ CORREÇÃO: Chamar as funções do 'awsApiService'
          await awsApiService.addCoins(user.id, currentQuestion.reward.coins);
          await awsApiService.updateUserProgress(user.id, {
            experience: (user.experience || 0) + currentQuestion.reward.experience
          });
        } catch (error) {
          console.error('❌ Erro ao atualizar recompensas:', error);
        }
      }
      
      Alert.alert('✅ Correto!', `+${currentQuestion.reward.coins} moedas e +${currentQuestion.reward.experience} XP!`);
    } else {
      Alert.alert('❌ Incorreto', 'Continue tentando!');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      reset();
      start();
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    stop();
    setQuizCompleted(true);
    
    if (user?.id) {
      try {
        // ✅ CORREÇÃO: Chamar a função do 'awsApiService'
        await awsApiService.submitQuizResult({
          userId: user.id,
          worldId: world?.id,
          score: score,
          correctAnswers: correctAnswers,
          totalQuestions: questions.length,
          timeSpent: (30 - timeLeft) * questions.length
        });
      } catch (error) {
        console.error('❌ Erro ao enviar resultado do quiz:', error);
      }
    }
  };

  const handleFinishAndReturn = () => {
    navigation.navigate('StudentDashboard', { user });
  };

  if (loading) {
    return (
      <LinearGradient colors={['#4c1d95', '#7c3aed', '#ec4899']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centerContent}>
            <Text style={styles.loadingText}>Preparando desafio...</Text>
            <ActivityIndicator size="large" color="#fbbf24" />
            <Text style={styles.loadingSubtext}>Carregando questões mágicas! ✨</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (quizCompleted) {
    const accuracy = (questions.length > 0 ? (correctAnswers / questions.length) * 100 : 0).toFixed(1);
    const totalCoins = correctAnswers * 10;
    const totalXP = correctAnswers * 5;
    
    return (
      <LinearGradient colors={['#4c1d95', '#7c3aed', '#ec4899']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.completedContainer}>
            <Text style={styles.completedIcon}>🎉</Text>
            <Text style={styles.completedTitle}>Missão Concluída!</Text>
            
            <View style={styles.resultsCard}>
              <Text style={styles.resultLabel}>Pontuação Final</Text>
              <Text style={styles.resultValue}>{score} pontos</Text>
              
              <View style={styles.resultRow}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultItemValue}>{correctAnswers}/{questions.length}</Text>
                  <Text style={styles.resultItemLabel}>Acertos</Text>
                </View>
                
                <View style={styles.resultItem}>
                  <Text style={styles.resultItemValue}>{accuracy}%</Text>
                  <Text style={styles.resultItemLabel}>Precisão</Text>
                </View>
              </View>

              <View style={styles.rewardsContainer}>
                <Text style={styles.rewardsTitle}>Recompensas</Text>
                <View style={styles.rewardsRow}>
                  <Text style={styles.rewardItem}>🪙 +{totalCoins} moedas</Text>
                  <Text style={styles.rewardItem}>⭐ +{totalXP} XP</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.finishButton} onPress={handleFinishAndReturn}>
              <Text style={styles.finishButtonText}>🏠 Voltar ao Reino</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setCurrentQuestionIndex(0);
                setSelectedAnswer(null);
                setScore(0);
                setCorrectAnswers(0);
                setQuizCompleted(false);
                setLoading(true);
                loadQuestions();
                reset();
                start();
              }}
            >
              <Text style={styles.retryButtonText}>🔄 Jogar Novamente</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Adiciona verificação para caso 'questions' ainda esteja vazio
  if (!questions || questions.length === 0) {
     return (
      <LinearGradient colors={['#4c1d95', '#7c3aed', '#ec4899']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centerContent}>
            <Text style={styles.loadingText}>Nenhuma questão encontrada!</Text>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Voltar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Adiciona verificação para 'currentQuestion' (evita crash se o índice estiver errado)
  if (!currentQuestion) {
     return (
      <LinearGradient colors={['#4c1d95', '#7c3aed', '#ec4899']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centerContent}>
            <Text style={styles.loadingText}>Erro ao carregar questão.</Text>
             <TouchableOpacity 
              style={styles.finishButton} // Reutilizando estilo
              onPress={handleFinishAndReturn}
            >
              <Text style={styles.finishButtonText}>🏠 Voltar ao Reino</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }


  return (
    <LinearGradient colors={['#4c1d95', '#7c3aed', '#ec4899']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Sair</Text>
            </TouchableOpacity>
            
            <View style={styles.progressInfo}>
              <Text style={styles.questionCount}>
                {currentQuestionIndex + 1}/{questions.length}
              </Text>
              <Text style={styles.timer}>⏱️ {timeLeft}s</Text>
            </View>

            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Pontos</Text>
              <Text style={styles.scoreValue}>{score}</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
              ]} 
            />
          </View>

          {/* Question Card */}
          <View style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <Text style={styles.category}>{currentQuestion.category}</Text>
              <Text style={styles.difficulty}>{currentQuestion.difficulty}</Text>
            </View>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {/* Adiciona verificação para currentQuestion.options */}
            {currentQuestion.options && currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showResult = isAnswered;

              let optionStyle = [styles.option];
              if (showResult) {
                if (isCorrect) {
                  optionStyle.push(styles.optionCorrect);
                } else if (isSelected && !isCorrect) {
                  optionStyle.push(styles.optionIncorrect);
                }
              } else if (isSelected) {
                optionStyle.push(styles.optionSelected);
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={optionStyle}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                >
                  <Text style={styles.optionLetter}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                  <Text style={styles.optionText}>{option}</Text>
                  {showResult && isCorrect && (
                    <Text style={styles.optionIcon}>✅</Text>
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <Text style={styles.optionIcon}>❌</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Next Button */}
          {isAnswered && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
              <Text style={styles.nextButtonText}>
                {currentQuestionIndex < questions.length - 1 
                  ? 'Próxima Questão ➡️' 
                  : 'Finalizar Missão 🏁'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    color: '#e0e7ff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  progressInfo: {
    alignItems: 'center',
  },
  questionCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  scoreContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#e0e7ff',
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 25,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fbbf24',
    borderRadius: 3,
  },
  questionCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fbbf24',
  },
  difficulty: {
    fontSize: 12,
    color: '#e0e7ff',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 28,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  option: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  optionSelected: {
    backgroundColor: 'rgba(251,191,36,0.2)',
    borderColor: '#fbbf24',
  },
  optionCorrect: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    borderColor: '#10b981',
  },
  optionIncorrect: {
    backgroundColor: 'rgba(239,68,68,0.2)',
    borderColor: '#ef4444',
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  optionIcon: {
    fontSize: 20,
  },
  nextButton: {
    backgroundColor: '#10b981',
    borderRadius: 15,
    padding: 18,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completedIcon: {
    fontSize: 100,
    marginBottom: 20,
  },
  completedTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  resultsCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    marginBottom: 20,
  },
  resultLabel: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fbbf24',
    textAlign: 'center',
    marginBottom: 25,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  resultItem: {
    alignItems: 'center',
  },
  resultItemValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  resultItemLabel: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  rewardsContainer: {
    backgroundColor: 'rgba(251,191,36,0.1)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: 'rgba(251,191,36,0.3)',
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fbbf24',
    textAlign: 'center',
    marginBottom: 10,
  },
  rewardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rewardItem: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  finishButton: {
    backgroundColor: '#fbbf24',
    borderRadius: 15,
    padding: 18,
    width: '100%',
    marginBottom: 12,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 18,
    width: '100%',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default QuestionAreaScreen;

