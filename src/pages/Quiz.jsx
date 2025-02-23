import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeLoading,
  changeQuestions,
  getQuestions,
} from "../redux/QuizSlice";
import Loader from "../components/Loader";
import { Link, useParams } from "react-router-dom";
import "../components/QuizStyle.css";
import { Box, Button, Modal, Typography } from "@mui/material";
import ThemeToggle from "../components/ThemeToggle";
import { FaGithub } from "react-icons/fa";

const decodeString = (encodedString) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = encodedString;
  return textarea.value;
};
export default function Quiz() {
  const encodedString = "&#039;  &quot;";
  const decodedString = decodeString(encodedString);
  const dispatch = useDispatch();
  const { id, difficulty, amount } = useParams();
  const theme = useSelector((state) => state.quiz.theme);
  const loading = useSelector((state) => state.quiz.loading);
  const questions = useSelector((state) => state.quiz.questions);
  const [QandA, setQandA] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [numCorrectAnswers, setNumCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  console.log("id", id, difficulty, amount);
  useEffect(() => {
    if (questions.length === 0 && id && difficulty && amount) {
      dispatch(changeLoading(true));
      setTimeout(async () => {
        try {
          const response = await dispatch(
            getQuestions({ id, amount, difficulty })
          );
          const fetchedQuestions = response.payload;

          if (Array.isArray(fetchedQuestions)) {
            const formattedQuestions = fetchedQuestions.map((q) => ({
              question: q.question,
              shuffledAnswers: shuffle([
                ...q.incorrect_answers,
                q.correct_answer,
              ]),
              correctAnswer: q.correct_answer,
              selectedAnswer: "",
            }));
            setQandA(formattedQuestions);
          } else {
            console.error(
              "Invalid format for fetchedQuestions:",
              fetchedQuestions
            );
          }
        } catch (error) {
          console.error("Error fetching questions:", error.message);
        } finally {
          dispatch(changeLoading(false));
        }
      }, 500);
    }
  }, [dispatch, questions, id, difficulty, amount]);

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  function updateAnswer(currentQuestion, answer) {
    setQandA(
      QandA.map((questionObject) =>
        questionObject.question === currentQuestion
          ? { ...questionObject, selectedAnswer: answer }
          : questionObject
      )
    );
  }

  function checkAnswers() {
    const notAllAnswered = QandA.some(
      (questionObject) => questionObject.selectedAnswer === ""
    );

    setShowWarning(notAllAnswered);

    if (!notAllAnswered) {
      const newNumCorrectAnswers = QandA.reduce(
        (acc, questionObject) =>
          questionObject.selectedAnswer === questionObject.correctAnswer
            ? acc + 1
            : acc,
        0
      );

      setNumCorrectAnswers(newNumCorrectAnswers);
      setShowResult(true);
    }
  }
  function closeModal() {
    setShowWarning(false);
    setShowResult(false);
  }

  function playAgain() {
    dispatch(changeQuestions([]));
    setQandA([]);
    setShowResult(false);
    setNumCorrectAnswers(0);
  }

  function cancelQuiz() {
    dispatch(changeQuestions([]));
    setQandA([]);
    setShowResult(false);
    setNumCorrectAnswers(0);
  }
//test
  console.log(QandA);
  let abcd = ["a", "b", "c", "d"];
  const questionsElements = QandA.map((questionObject, index) => (
    <div key={index} className={`question-${theme}`}>
      <h3
        dangerouslySetInnerHTML={{
          __html: `${index + 1} - ${questionObject.question}`,
        }}
      />
      <div className={`button-group-${theme}`}>
        {questionObject.shuffledAnswers.map((answer, answerIndex) => (
          <button
            key={answerIndex}
            onClick={() => updateAnswer(questionObject.question, answer)}
            className={`answer-btn-${theme} ${
              answer === questionObject.selectedAnswer ? "selected" : ""
            } ${
              showResult && answer === questionObject.correctAnswer
                ? "correct"
                : ""
            } ${
              showResult &&
              answer === questionObject.selectedAnswer &&
              answer !== questionObject.correctAnswer
                ? "incorrect"
                : ""
            } ${
              showResult && answer !== questionObject.correctAnswer
                ? "dimmed"
                : ""
            }`}
            disabled={showResult}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: `${abcd[answerIndex]} - ${answer}`,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  ));

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className={`all-quiz-${theme}`}>
          <div dangerouslySetInnerHTML={{ __html: decodedString }} />
          <div className={`nav-bar-home-${theme}`}>
            <div>
              <h1>
                Qui<span>zz</span>ical
              </h1>
            </div>
            <div className="theme-position">
              <ThemeToggle />
            </div>
            <div className="github">
              <a href="https://github.com/Med-blbb/quizzicalv2" target="_blank">
                <h1>
                  <FaGithub />
                </h1>
              </a>
            </div>
          </div>
          <div className="questions-container">{questionsElements}</div>

          <div className="button-ch-container">
            {showWarning && (
              <p className="warning-message">
                There are questions not answered yet.
              </p>
            )}

            {questions.length > 0 && !showResult && (
              <div className="check-btn-grp">
                <button className="check-btn" onClick={checkAnswers}>
                  Check answers
                </button>
                <button
                  className="play-again-btn"
                  onClick={() => window.location.reload()}
                >
                  <Link className="cancel-link" to="/">
                    Cancel quiz
                  </Link>
                </button>
              </div>
            )}
          </div>

          {showResult && (
            <div className="result-container">
              <p className="result-message">
                You scored {numCorrectAnswers}/{amount} correct answers{" "}
                {(numCorrectAnswers * 100) / amount}%.
              </p>
              <div className="result-btn-grp">
                <button className="play-again-btn" onClick={playAgain}>
                  Play again
                </button>
                <Link to="/">
                  <button className="" onClick={playAgain}>
                    HOME
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
