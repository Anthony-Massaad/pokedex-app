import React, { useEffect, useState, createContext, useContext } from "react";
import error from "../../assests/error.svg";
import check from "../../assests/check.svg";
import { uniqueId } from "lodash";

const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const [toastLst, setToastLst] = useState([]);

  const severitySettings = (severity) => {
    var toastProperties = {};
    switch (severity.toLowerCase()) {
      case "success":
        toastProperties = {
          backgroundColor: "#5cb85c",
          icon: check,
        };
        break;
      case "error":
        toastProperties = {
          backgroundColor: "#d9534f",
          icon: error,
        };
        break;
      default:
        console.error("Severity of Toast is unknown: ", severity);
        setToastLst([]);
        break;
    }
    return toastProperties;
  };

  const deleteToast = (id) => {
    setToastLst((currLst) => currLst.filter((toast) => toast.id !== id));
  };

  const setToast = ({ severity, title, description }) => {
    const toastId = uniqueId();
    const set = severitySettings(severity);
    setToastLst((prevLst) => {
      return [
        ...prevLst,
        {
          ...set,
          id: toastId,
          title: title,
          description: description,
        },
      ];
    });
    console.log("TOASTLIST: ", toastLst);
  };

  return (
    <ToastContext.Provider value={setToast}>
      <div className={`notification-container top-right`}>
        {toastLst.map((toast, i) => (
          <div
            key={i}
            className={`notification toast top-right`}
            style={{ backgroundColor: toast.backgroundColor }}
          >
            <button onClick={() => deleteToast(toast.id)}>X</button>
            <div className="notification-image">
              <img src={toast.icon} alt="" />
            </div>
            <div>
              <p className="notification-title">{toast.title}</p>
              <p className="notification-message">{toast.description}</p>
            </div>
          </div>
        ))}
      </div>
      {children}
    </ToastContext.Provider>
  );
};

const useToastProviderContext = () => {
  return useContext(ToastContext);
};

export { ToastProvider, useToastProviderContext };
