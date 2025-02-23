import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  changeAmount,
  changeCategory,
  changeDifficulty,
  changeLoading,
  getCategories,
} from "../redux/QuizSlice";
import Loader from "../components/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../components/CategoryStyle.css";
import ThemeToggle from "../components/ThemeToggle";
import { FaGithub } from "react-icons/fa";

export default function Category() {
  const { id } = useParams();

  const [category, setCategory] = useState();

  const dispatch = useDispatch();

  const [selectedDifficulty, setselectedDifficulty] = useState("");

  const [selectedAmount, setSelectedAmount] = useState();

  const loading = useSelector((state) => state.quiz.loading);

  const categories = useSelector(
    (state) => state.quiz.categories?.trivia_categories || []
  );
  const theme = useSelector((state) => state.quiz.theme);

  const difficulty = useSelector((state) => state.quiz.difficulty);

  const amount = useSelector((state) => state.quiz.amount);

  useEffect(() => {
    dispatch(changeLoading(true));
    setTimeout(async () => dispatch(changeLoading(false)), 1000);
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    const foundCategory = categories.find((cat) => cat.id == id);
    setCategory(foundCategory);
    dispatch(changeCategory(id));
  }, [id, categories]);

  const handleDifficultyChange = (e) => {
    const selectedValue = e.target.value;
    console.log("Selected Difficulty:", selectedValue);
    setselectedDifficulty(selectedValue);
    dispatch(changeDifficulty(selectedValue));
  };

  const handleAmountChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedAmount(selectedValue);
    dispatch(changeAmount(selectedValue));
  };

  const notifyDiff = () => toast("Select the difficulty before start!");

  const notifyNum = () => toast("Select the question numbers start!");

  const handleStart = () => {
    console.log("Start button clicked!");
    if (difficulty.length == "") {
      notifyDiff();
    }
    if (amount.length == "") {
      notifyNum();
    }
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className={`page-cat-${theme}`}>
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
          <div className={`cat-card-${theme}`}>
            <h1 className="title">
              {category ? category.name : "Category not found"}
            </h1>

            <img className="cat-card-img" src={`/images/${id}.jpeg`} alt="" />
            <select
              value={selectedDifficulty}
              onChange={handleDifficultyChange}
            >
              <option value="">Select the Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select value={selectedAmount} onChange={handleAmountChange}>
              <option value="">Select Number of Questions</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
            <div className="btn-grp">
              <Link className="cat-link" to="/">
                <button>home</button>
              </Link>
              <Link
                className="cat-link"
                to={
                  difficulty.length > 0 && amount.length > 0
                    ? `/quiz/category/${id}/difficulty/${difficulty}/amount/${amount}`
                    : "#"
                }
              >
                <button onClick={handleStart}>Start Quiz</button>
                <ToastContainer />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
