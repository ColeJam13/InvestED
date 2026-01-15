import { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, XCircle, ChevronRight, ChevronLeft, Award, RotateCcw } from 'lucide-react';
import styles from './LessonDetailView.module.css';
import { lessonContent } from '../../data/lessonContent';

const LessonDetailView = ({ lessonId, onBack }) => {
    const [currentSection, setCurrentSection] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);
    const [answers, setAnswers] = useState([]);

    const lesson = lessonContent[lessonId];

    if (!lesson) {
        return (
            <div className={styles.container}>
                <div className={styles.notFound}>
                    <h2>Lesson Not Found</h2>
                    <p>This lesson content is coming soon!</p>
                    <button className={styles.backBtn} onClick={onBack}>
                        <ArrowLeft size={20} />
                        Back to Lessons
                    </button>
                </div>
            </div>
        );
    }

    const { sections, quiz, title } = lesson;
    const totalSections = sections.length;
    const totalQuestions = quiz.length;

    const handleNextSection = () => {
        if (currentSection < totalSections - 1) {
            setCurrentSection(currentSection + 1);
        } else {
            setShowQuiz(true);
        }
    };

    const handlePrevSection = () => {
        if (currentSection > 0) {
            setCurrentSection(currentSection - 1);
        }
    };

    const handleAnswerSelect = (index) => {
        if (!showResult) {
            setSelectedAnswer(index);
        }
    };

    const handleSubmitAnswer = () => {
        if (selectedAnswer === null) return;
        
        setShowResult(true);
        const isCorrect = selectedAnswer === quiz[currentQuestion].correctAnswer;
        
        setAnswers([...answers, {
            question: currentQuestion,
            selected: selectedAnswer,
            correct: quiz[currentQuestion].correctAnswer,
            isCorrect
        }]);
        
        if (isCorrect) {
            setScore(score + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            setQuizComplete(true);
        }
    };

    const handleRestartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setQuizComplete(false);
        setAnswers([]);
    };

    const handleRestartLesson = () => {
        setCurrentSection(0);
        setShowQuiz(false);
        handleRestartQuiz();
    };

    const progressPercent = showQuiz 
        ? ((currentQuestion + 1) / totalQuestions) * 100
        : ((currentSection + 1) / totalSections) * 100;

    if (quizComplete) {
        const percentage = Math.round((score / totalQuestions) * 100);
        const passed = percentage >= 70;

        return (
            <div className={styles.container}>
                <div className={styles.quizComplete}>
                    <div className={`${styles.resultIcon} ${passed ? styles.passed : styles.failed}`}>
                        {passed ? <Award size={64} /> : <RotateCcw size={64} />}
                    </div>
                    <h2>{passed ? 'Congratulations!' : 'Keep Learning!'}</h2>
                    <p className={styles.scoreText}>
                        You scored <span className={styles.scoreHighlight}>{score}/{totalQuestions}</span> ({percentage}%)
                    </p>
                    {passed ? (
                        <p className={styles.resultMessage}>
                            Great job! You've demonstrated a solid understanding of {title}.
                        </p>
                    ) : (
                        <p className={styles.resultMessage}>
                            You need 70% to pass. Review the lesson and try again!
                        </p>
                    )}
                    
                    <div className={styles.answerReview}>
                        <h3>Your Answers</h3>
                        <div className={styles.answerGrid}>
                            {answers.map((answer, idx) => (
                                <div key={idx} className={`${styles.answerItem} ${answer.isCorrect ? styles.correct : styles.incorrect}`}>
                                    <span className={styles.questionNum}>Q{idx + 1}</span>
                                    {answer.isCorrect ? (
                                        <CheckCircle size={18} className={styles.correctIcon} />
                                    ) : (
                                        <XCircle size={18} className={styles.incorrectIcon} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.completeActions}>
                        {!passed && (
                            <button className={styles.retryBtn} onClick={handleRestartLesson}>
                                <RotateCcw size={18} />
                                Review Lesson
                            </button>
                        )}
                        <button className={styles.backBtnLarge} onClick={onBack}>
                            <ArrowLeft size={18} />
                            Back to Lessons
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showQuiz) {
        const question = quiz[currentQuestion];

        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <button className={styles.backBtn} onClick={() => setShowQuiz(false)}>
                        <ArrowLeft size={20} />
                        Back to Lesson
                    </button>
                    <div className={styles.progressInfo}>
                        <span>Quiz: Question {currentQuestion + 1} of {totalQuestions}</span>
                    </div>
                </div>

                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
                </div>

                <div className={styles.quizContent}>
                    <div className={styles.questionCard}>
                        <h2 className={styles.questionText}>{question.question}</h2>
                        
                        <div className={styles.options}>
                            {question.options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`${styles.optionBtn} 
                                        ${selectedAnswer === index ? styles.selected : ''} 
                                        ${showResult && index === question.correctAnswer ? styles.correct : ''}
                                        ${showResult && selectedAnswer === index && index !== question.correctAnswer ? styles.incorrect : ''}`}
                                    onClick={() => handleAnswerSelect(index)}
                                    disabled={showResult}
                                >
                                    <span className={styles.optionLetter}>
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <span className={styles.optionText}>{option}</span>
                                    {showResult && index === question.correctAnswer && (
                                        <CheckCircle size={20} className={styles.correctIcon} />
                                    )}
                                    {showResult && selectedAnswer === index && index !== question.correctAnswer && (
                                        <XCircle size={20} className={styles.incorrectIcon} />
                                    )}
                                </button>
                            ))}
                        </div>

                        {showResult && (
                            <div className={styles.explanation}>
                                <h4>Explanation</h4>
                                <p>{question.explanation}</p>
                            </div>
                        )}

                        <div className={styles.quizActions}>
                            {!showResult ? (
                                <button 
                                    className={styles.submitBtn}
                                    onClick={handleSubmitAnswer}
                                    disabled={selectedAnswer === null}
                                >
                                    Submit Answer
                                </button>
                            ) : (
                                <button className={styles.nextBtn} onClick={handleNextQuestion}>
                                    {currentQuestion < totalQuestions - 1 ? 'Next Question' : 'See Results'}
                                    <ChevronRight size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const section = sections[currentSection];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back to Lessons
                </button>
                <div className={styles.progressInfo}>
                    <BookOpen size={18} />
                    <span>Section {currentSection + 1} of {totalSections}</span>
                </div>
            </div>

            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
            </div>

            <div className={styles.lessonContent}>
                <h1 className={styles.lessonTitle}>{title}</h1>
                
                <div className={styles.sectionCard}>
                    <h2 className={styles.sectionTitle}>{section.title}</h2>
                    <div className={styles.sectionContent}>
                        {section.content.split('\n\n').map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                        ))}
                    </div>
                </div>

                <div className={styles.navigation}>
                    <button 
                        className={styles.navBtn}
                        onClick={handlePrevSection}
                        disabled={currentSection === 0}
                    >
                        <ChevronLeft size={18} />
                        Previous
                    </button>

                    <div className={styles.sectionDots}>
                        {sections.map((_, idx) => (
                            <span 
                                key={idx} 
                                className={`${styles.dot} ${idx === currentSection ? styles.activeDot : ''} ${idx < currentSection ? styles.completedDot : ''}`}
                            />
                        ))}
                    </div>

                    <button className={styles.navBtn} onClick={handleNextSection}>
                        {currentSection < totalSections - 1 ? (
                            <>
                                Next
                                <ChevronRight size={18} />
                            </>
                        ) : (
                            <>
                                Take Quiz
                                <ChevronRight size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className={styles.disclaimer}>
                <p>Educational content only. Not financial advice. Sources: SEC Investor.gov, FINRA</p>
            </div>
        </div>
    );
};

export default LessonDetailView;
