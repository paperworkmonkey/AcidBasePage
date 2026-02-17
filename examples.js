function setup() {
  //add PageTop header

  fetch("PageTop.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("headerPlaceholder").innerHTML = data;

      console.log("loaded");
      const page = document.getElementById("examples");
      console.log(page);

      if (page) {
        page.className = "btn-link btn-primary";
        console.log("document loaded - primary trying");
      }
    });
}
