const button1 = document.querySelector(".login-button");
console.log(button1);
const button2 = document.querySelector(".register-button");
console.log(2);

button1.addEventListener("mousedown", (e) => {
  console.log(3);
  e.target.classList.add("active");
  console.log(4);
  button2.classList.remove("active");
  console.log(5);
});
button2.addEventListener("mousedown", (e) => {
  console.log(6);
  e.target.classList.add("active");
  console.log(7);
  button1.classList.remove("active");
  console.log(8);
});
