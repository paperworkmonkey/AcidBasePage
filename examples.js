function setup() {
  //add PageTop header

  fetch("PageTop.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("headerPlaceholder").innerHTML = data;

      console.log("loaded");
      const index = document.getElementById("examples");
      console.log(index);
      if (index) {
        index.className = "btn-link btn-primary";
        console.log("documenbt loaded - primary trying");
      }
    });
}
