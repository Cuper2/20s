//import * as PIXI from './node_modules/pixi.js/dist/pixi.mjs';

(async () => {
  const app = new PIXI.Application();

  await app.init({
    antialias: true,
    autoDensity: true,
    resolution: 2,
    background: "#FFE4C4",
    resizeTo: window,
  });
  app.canvas.style.position = "absolute";

  const clockFont = await PIXI.Assets.load("E1234.ttf");

  //Counter
  let counterVal = 20000;
  let isCounterStarted = false;
  const counter = new PIXI.Text({
    text: "20:000",
    style: {
      fontSize: "64",
      fill: "0xFFFFFF",
      fontFamily: clockFont.family,
    },
  });
  counter.anchor.set(0.5);
  counter.y = 35;
  counter.x = app.screen.width / 2;

  const counterBorder = new PIXI.Graphics().svg(
    `
        <svg>
            <path d="M${
              app.screen.width / 2 - counter.getSize().width / 2 - 20
            } 0` +
      `L ${app.screen.width / 2 - counter.getSize().width / 2} ${
        counter.getSize().height + 10
      }` +
      `L ${app.screen.width / 2 + counter.getSize().width / 2} ${
        counter.getSize().height + 10
      }` +
      `L ${app.screen.width / 2 + counter.getSize().width / 2 + 20} 0` +
      `Z" stroke="red" stroke-width="3" fill="#222222"/>
        </svg>
    `
  );

  //Buttons
  const startBtn = new PIXI.Text({
    text: "Start",
    style: {
      fontSize: 24,
    },
  });
  startBtn.anchor.set(0.5);
  startBtn.y = 100;
  startBtn.x = app.screen.width / 2;
  startBtn.interactive = true;
  startBtn.eventMode = "static";

  const restartBtn = new PIXI.Text({
    text: "Restart",
    style: {
      fontSize: 24,
    },
  });
  restartBtn.anchor.set(0.5);
  restartBtn.y = 150;
  restartBtn.x = app.screen.width / 2;
  restartBtn.interactive = true;
  restartBtn.eventMode = "static";

  //Events
  startBtn.on("pointerdown", () => {
    console.log(Date.now());
    if (!isCounterStarted) {
      counterVal = 20000;
      isCounterStarted = true;
    }
  });
  restartBtn.on("pointerdown", () => {
    counterVal = 20000;
    counter.text = '20:000';
    isCounterStarted = false;
  });

  app.ticker.add((time) => {
    if (isCounterStarted) {
      counterVal -= app.ticker.elapsedMS;
      counterVal = counterVal.toFixed(0);
      const seconds = Math.floor(counterVal / 1000);
      const milliseconds = counterVal % 1000;
      if (counterVal > 0)
        counter.text = `${String(seconds).padStart(2, "0")}:${String(
          milliseconds
        ).padStart(3, "0")}`;
      else {
        counter.text = "00:000";
        isCounterStarted = false;
        console.log(Date.now());
      }
    }
  });

  app.stage.addChild(counterBorder);
  app.stage.addChild(counter);
  app.stage.addChild(startBtn);
  app.stage.addChild(restartBtn);

  document.querySelector(".game-container").appendChild(app.canvas);

  //menu
  const menuItems = document.querySelectorAll(".menu-item");
  const start = document.getElementById("start");
  const creators = document.getElementById("creators");

  const fadeOutElement = (element) => {
    element.style.transition = "opacity 2s";
    element.style.opacity = "0";
    window.setTimeout(() => {
      element.style.display = "none";
    }, 2000);
  };

  [start, creators].forEach((element) => {
    if (element) {
      element.addEventListener("click", () => {
        fadeOutElement(start);
        fadeOutElement(creators);
        if (element == start) {
          fadeOutElement(document.querySelector(".outer-container"));
        }
      });
    }
  });

  menuItems.forEach((item) => {
    item.addEventListener("mouseover", () => {
      menuItems.forEach((el) => el.classList.remove("active"));
      item.classList.add("active");
    });
  });
})();
