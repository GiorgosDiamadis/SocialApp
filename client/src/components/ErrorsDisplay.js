import React from "react";

export default function ErrorsDisplay({ errors }) {
  return (
    <div style={{ marginTop: "5px" }}>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((v) => (
              <li key={v}> {v}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
