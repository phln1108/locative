export const themeScript = `
(function () {
  try {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored || (prefersDark ? "dark" : "light");

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  } catch (_) {}
})();
`;