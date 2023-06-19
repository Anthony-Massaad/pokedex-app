import React, { useEffect, useState, createContext, useContext } from "react";
import error from "../../assests/error.svg";
import check from "../../assests/check.svg";
import { uniqueId } from "lodash";

const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const [toastLst, setToastLst] = useState([]);

  useEffect(() => {
    const deleteInterval = setInterval(() => {
      if (toastLst.length > 0) {
        applyRemoveAnimation(toastLst[0].id);
      }
    }, 3000);
    return () => clearInterval(deleteInterval);
  }, [toastLst]);

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

  const applyRemoveAnimation = (id) => {
    const toastToEdit = toastLst.find((toast, idx) => {
      return toast.id === id;
    });
    toastToEdit.remove = true;

    setToastLst((prevToastLst) =>
      prevToastLst.map((toast, idx) => {
        return toast.id === toastToEdit.id ? toastToEdit : toast;
      })
    );
  };

  const deleteToast = (id, isRemove) => {
    setToastLst((currLst) => currLst.filter((toast, idx) => toast.id !== id));
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
          remove: false,
          added: true,
        },
      ];
    });
  };

  const animationEnd = (id, isRemove, isAdded) => {
    if (isRemove) {
      deleteToast(id);
    }
    if (isAdded) {
      const toastToEdit = toastLst.find((toast, idx) => {
        return toast.id === id;
      });
      toastToEdit.added = false;
      setToastLst((prevToastLst) =>
        prevToastLst.map((toast, idx) => {
          return toast.id === toastToEdit.id ? toastToEdit : toast;
        })
      );
    }
  };

  return (
    <ToastContext.Provider value={setToast}>
      <div className={`notification-container top-right`}>
        {toastLst.map((toast, i) => (
          <div
            key={i}
            className={`notification toast top-right ${
              toast.remove && "remove-toast"
            }
            ${toast.added && "add-toast"}`}
            style={{ backgroundColor: toast.backgroundColor }}
            onAnimationEnd={() =>
              animationEnd(toast.id, toast.remove, toast.added)
            }
          >
            <button onClick={() => applyRemoveAnimation(toast.id)}>X</button>
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
