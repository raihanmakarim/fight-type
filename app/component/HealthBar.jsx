import React from "react";

const healthBar = ({ color,health }) => (
  <div id="health-bar" className="rounded-full" style={{
    width: `40vw`,height: `5vh `, background: "grey", 
  }}>
    <div
      style={{
        width: `${health}%`,height: `100%`, backgroundColor: color 
      }}
      className={`shadow-none flex   rounded-full `}
    />
  </div>
);

export default healthBar;