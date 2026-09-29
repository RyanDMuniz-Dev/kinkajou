import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Could not find the #app element.");
}

app.innerHTML = `
  <main class="container">
    <h1>{{PROJECT_NAME}}</h1>

    <p>
      Projeto criado com Kinkajou + Vite + TypeScript.
    </p>

    <button id="counter">
      Count is 0
    </button>
  </main>
`;

const counterButton =
  document.querySelector<HTMLButtonElement>("#counter");

if (!counterButton) {
  throw new Error("Could not find the counter button.");
}

let count = 0;

counterButton.addEventListener("click", () => {
  count++;

  counterButton.textContent = `Count is ${count}`;
});