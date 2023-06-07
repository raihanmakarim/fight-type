import React from "react";

const healthBar = ({ color,health }) => (
  <div id="health-bar" className="rounded-full" style={{
    width: `40vw`,height: `3vh `,maxHeight: "250px", background: "grey", 
  }}>
    <div
      style={{
        width: `${health}%`,height: `100%`, backgroundColor: color 
      }}
      className={`shadow-none flex   rounded-full transition-all duration-400 ease-in-out `}
    />
  </div>
);

export default healthBar;