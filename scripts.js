window.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  for (var pair of formData.entries()) {
    console.log(pair[0] + ", " + pair[1]);
  }
});

window.addEventListener("change", (e) => {
  console.log(e);
});
