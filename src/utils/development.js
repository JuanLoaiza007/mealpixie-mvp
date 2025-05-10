export const print_error = (...args) => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "development") {
    console.error(...args);
  }
};

export const print_log = (...args) => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "development") {
    console.log(...args);
  }
};
