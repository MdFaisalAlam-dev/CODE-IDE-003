// Toggle a class on an element
export const toggleClass = (el, className) => {
  const elem = document.querySelector(el);
  if (elem) {
    elem.classList.toggle(className);
  }
};

// Remove a class from an element
export const removeClass = (el, className) => {
  const elem = document.querySelector(el);
  if (elem) {
    elem.classList.remove(className);
  }
};

// Base API URL (use localhost for dev, update for deployment)
export const api_base_url = import.meta.env.VITE_API_BASE_URL || "https://my-ide-backend.onrender.com";
