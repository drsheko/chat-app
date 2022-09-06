import React from "react";

function SideNav({ setKey }) {
  const getKey = (e) => {
    var currKey = e.target.title;
    setKey(currKey);
  };

  return (
    <nav className="menu">
      <ul className="items">
        <li className="item" title="home" onClick={getKey}>
          <i className="bi bi-house-door-fill" aria-hidden="true"></i>
        </li>
        <li className="item" title="profile" onClick={getKey}>
          <i className="bi bi-person-circle" aria-hidden="true"></i>
        </li>
        <li className="item" title="pencil" onClick={getKey}>
          <i className="bi bi-pencil" aria-hidden="true"></i>
        </li>
        <li className="item item-active" title="contacts" onClick={getKey}>
          <i className="bi bi-chat-dots" aria-hidden="true"></i>
        </li>
        <li className="item" title="settings" onClick={getKey}>
          <i className="bi bi-gear-fill" aria-hidden="true"></i>
        </li>
        <li className="item">
          <i className="bi bi-box-arrow-left" aria-hidden="true"></i>
        </li>
      </ul>
    </nav>
  );
}

export default SideNav;
