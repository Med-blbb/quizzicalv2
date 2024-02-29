import React from 'react'
import "./LoaderStyle.css"

export default function Loader() {
  return (
    <div className="loadingspinner">
      <div id="square1"></div>
      <div id="square2"></div>
      <div id="square3"></div>
      <div id="square4"></div>
      <div id="square5"></div>
    </div>
  );
}
