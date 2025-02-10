import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";

const Nav = () => {
  const location = useLocation();
  const options = [
    { label: "Home", path: "/" },
    { label: "Profile", path: "/profile" },
    { label: "Posts", path: "/home" },
  ];
  const containerRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [isVisible, setIsVisible] = useState(false);
  let hideTimeout;

  useEffect(() => {
    const activeOption = options.find(option => option.path === location.pathname);
    const activeLabel = activeOption ? activeOption.label : "Home";
    const activeElement = containerRef.current.querySelector(`[data-option='${activeLabel}']`);
    if (activeElement) {
      setIndicatorStyle({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
      });
    }
  }, [location.pathname]);

  const handleMouseMoveNearTop = (e) => {
    if (e.clientY < 50) {
      clearTimeout(hideTimeout);
      setIsVisible(true);
      hideTimeout = setTimeout(() => setIsVisible(false), 2000);
    }
  };

  const handleScroll = () => {
    clearTimeout(hideTimeout);
    setIsVisible(true);
    hideTimeout = setTimeout(() => setIsVisible(false), 2000);
  };

  const handleMouseEnter = () => {
    clearTimeout(hideTimeout);
    setIsVisible(true);
  };

  useEffect(() => {
    setIsVisible(true);
    const initialTimeout = setTimeout(() => setIsVisible(false), 2000);

    window.addEventListener('mousemove', handleMouseMoveNearTop);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveNearTop);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(hideTimeout);
      clearTimeout(initialTimeout);
    };
  }, []);

  return (
    <div
      style={{
        ...styles.container,
        top: isVisible ? "20px" : "-80px",
        transition: "top 0.5s ease-in-out",
      }}
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
    >
      <div style={{ ...styles.indicator, ...indicatorStyle }} />
      {options.map((option) => (
        <Link
          key={option.label}
          to={option.path}
          data-option={option.label}
          style={{
            ...styles.option,
            color: location.pathname === option.path ? "#ffffff" : "#ffffffa0",
          }}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    backgroundColor: "#1a1a2e34",
    padding: "10px",
    borderRadius: "25px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
    minWidth: "320px",
    zIndex: 1000,
  },
  option: {
    flex: 1,
    textAlign: "center",
    padding: "12px 0",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "color 0.3s",
    position: "relative",
    zIndex: 1,
    textDecoration: "none",
    fontSize: "15px",
  },
  indicator: {
    position: "absolute",
    top: "5px",
    height: "55px",
    borderRadius: "20px",
    backgroundImage: "linear-gradient(135deg, #6a11cb, #2575fc)",
    transition: "left 0.3s ease-in-out, width 0.3s ease-in-out",
    zIndex: 0,
  },
};

export default Nav;
