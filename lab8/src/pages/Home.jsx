import React from "react";
import style from "../styles/Home.module.css";

export default function className() {
  return (
    <div className={style.homeContainer}>
      <div className={style.leftSide}>
        <p>Digital Marketing Agency</p>
        <h1 className={style.title}>
          Advanced analytics to grow your business
        </h1>
        <p className={style.description}>
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
          sint. Velit officia consequat duis enim velit mollit. Exercitation
          veniam consequat sunt nostrud amet.
        </p>
        <div className={style.buttonContainer}>
          <button>Get Started</button>
          <button>How it works</button>
        </div>
      </div>
      <div className={style.rightSide}>
        <div className={style.background}></div>
        <img src="images/background.jpg" alt="background" />
      </div>
    </div>
  );
}
