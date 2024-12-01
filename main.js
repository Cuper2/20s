//import * as PIXI from './node_modules/pixi.js/dist/pixi.mjs';
import * as TABLE from "./table.js";

(async () => {
  const app = new PIXI.Application();

  await app.init({
    antialias: true,
    autoDensity: true,
    resolution: 2,
    background: "#4e4d4a",
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
  startBtn.eventMode = "static";
  startBtn.cursor = "pointer";

  const restartBtn = new PIXI.Text({
    text: "Restart",
    style: {
      fontSize: 24,
    },
  });
  restartBtn.anchor.set(0.5);
  restartBtn.y = 150;
  restartBtn.x = app.screen.width / 2;
  restartBtn.eventMode = "static";
  restartBtn.cursor = "pointer";

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
    counter.text = "20:000";
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



  //Menu
  const menuItems = document.querySelectorAll(".menu-item");

  start.classList.add("active");

  const fadeOutElement = (element) => {
    element.style.transition = "opacity 2s";
  };

  menuItems.forEach((element) => {
    element.addEventListener("click", () => {
      menuItems.forEach((item) => fadeOutElement(item));

      if (element === start) {
        fadeOutElement(document.querySelector(".outer-container"));
        document.querySelector(".outer-container").style.display = 'none';
      }
    });
  });

  menuItems.forEach((item) => {
    item.addEventListener("mouseover", () => {
      menuItems.forEach((el) => el.classList.remove("active"));
      item.classList.add("active");
    });

    item.addEventListener("mouseout", () => {
      item.classList.remove("active");
    });
  });

  const { Graphics } = PIXI;
  const graphics = new Graphics();
  app.stage.addChild(graphics);

  function drawTable() {
    const screenWidth = app.screen.width;
    const screenHeight = app.screen.height;

    const tableWidth = screenWidth * 0.9;
    const tableHeight = screenHeight * 0.3;
    const tableX = (screenWidth - tableWidth) / 2;
    const tableY = screenHeight * 0.6;

    const shadowHeight = screenHeight * 0.02;

    graphics.rect(tableX, tableY, tableWidth, tableHeight)
    graphics.fill(0x333333);

    graphics.rect(tableX + 10, tableY + tableHeight, tableWidth - 20, shadowHeight);
    graphics.fill(0x6C6F72);
  }

  async function loadDoor() {
    const doorTexture = await PIXI.Assets.load("door.png");
    const doorSprite = new PIXI.Sprite(doorTexture);

    doorSprite.anchor.set(0.5);
    doorSprite.width = app.screen.width * 0.5;
    doorSprite.height = doorSprite.width * 2;
    doorSprite.x = app.screen.width / 2;
    doorSprite.y = app.screen.height / 2;

    app.stage.addChild(doorSprite);
  }

  drawTable();
  loadDoor();

  window.addEventListener("resize", () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    drawTable();
  });
  //Grid
  const btnTexture1 = await PIXI.Assets.load("btn1.png");
  const btnTextureArrow = await PIXI.Assets.load("btn-arrow.png");
  const btnTexture3 = await PIXI.Assets.load("btn3.png");
  const tempTexture = await PIXI.Assets.load("temp.png");
  const gridObjects = [
    new TABLE.GridObj(1,0,tempTexture, () => alert('1')),
    new TABLE.GridObj(2,0,tempTexture, () => alert('2')),
    new TABLE.GridObj(10,3,btnTexture3, () => alert('2')),
    new TABLE.GridObj(10,5,btnTextureArrow, () => alert('2')),
    new TABLE.GridObj(10,3,btnTexture1, () => startS()),


  ];
  const gridObjectsL = [

  ];
  const grid = new TABLE.Grid(64, 0, 300, app.screen.width, 200, gridObjects, gridObjectsL);
  grid.drawGrid();

  grid.cells.forEach( element =>{
    app.stage.addChild(element);
  });
  app.stage.addChild(counterBorder);
  app.stage.addChild(counter);
  app.stage.addChild(startBtn);
  app.stage.addChild(restartBtn);

  document.querySelector(".game-container").appendChild(app.canvas);
  const howToPlayButton = document.getElementById("how-to-play");
  const aboutCreatorsButton = document.getElementById("creators");
  const menu = document.getElementById("menu");

  const modalHowToPlay = document.getElementById("how-to-play-modal");
  const modalAboutCreators = document.getElementById("about-creators-modal");

  const closeButtonHowToPlay = document.getElementById("close-modal");
  const closeButtonAboutCreators = document.getElementById("close-about-creators");

  const typewriterText = document.getElementById("typewriter-text-play");
  const typewriterCreators = document.getElementById("typewriter-text-creators");

  const typewriterContentPlay = `Welcome to 20 Seconds to Chaos! Your mission is to manage the malfunctioning control panel. Instructions are etched into the walls—some are helpful, some are not. Time is your greatest enemy.`;
  const typewriterContentCreators = "Cyberentrails - Concept Artist, Lead Artist, Story Writer Loiks -- – Lead programmer, Game Designer";

  let typingIndex = 0;
  let typingIndexCreators = 0;
  const typingSpeed = 50;

  function typeWriterPlay() {
    if (typingIndex < typewriterContentPlay.length) {
      typewriterText.textContent += typewriterContentPlay.charAt(typingIndex);
      typingIndex++;
      setTimeout(typeWriterPlay, typingSpeed);
    }
  }

  function typeWriterCreators() {
    if (typingIndexCreators < typewriterContentCreators.length) {
      typewriterCreators.textContent += typewriterContentCreators.charAt(typingIndexCreators);
      typingIndexCreators++;
      setTimeout(typeWriterCreators, typingSpeed);
    }
  }

  howToPlayButton.addEventListener("click", () => {
    modalHowToPlay.classList.remove("hidden");
    menu.classList.add("hidden-menu")
    typewriterText.textContent = "";
    typingIndex = 0;
    typeWriterPlay();
  });

  aboutCreatorsButton.addEventListener("click", () => {
    modalAboutCreators.classList.remove("hidden");
    menu.classList.add("hidden-menu");
    typewriterCreators.textContent = "";
    typingIndexCreators = 0;
    typeWriterCreators();
  });

  closeButtonHowToPlay.addEventListener("click", () => {
    modalHowToPlay.classList.add("hidden");
    menu.classList.remove("hidden-menu");
  });

  closeButtonAboutCreators.addEventListener("click", () => {
    modalAboutCreators.classList.add("hidden")
    menu.classList.remove("hidden-menu");
  });

  window.addEventListener("click", (event) => {
    if (event.target === modalHowToPlay) {
      modalHowToPlay.classList.add("hidden");
      menu.classList.remove("hidden-menu");
    } else if (event.target === modalAboutCreators) {
      modalAboutCreators.classList.add("hidden");
      menu.classList.remove("hidden-menu");
    }
  });

  const smt = document.getElementById("mini");
  smt.style.display = "none";
  const startButton = document.getElementById("start-game");
  const temperatureDisplay = document.getElementById("temperature-display");
  const temperatureButtons = document.getElementById("temperature-buttons");
  const coolButton = document.getElementById("cool-button");
  const heatButton = document.getElementById("heat-button");

  let currentTemperature = 50; // Początkowa temperatura
  let targetTemperature;

  // Funkcja uruchamiająca minigierkę
  function startS ()  {
    mini.style.display = "flex";
    console.log("ok")
    startButton.style.display = 'none'; // Ukryj przycisk start
    temperatureButtons.style.display = 'block'; // Pokaż przyciski

    // Wylosuj docelową temperaturę
    targetTemperature = Math.floor(Math.random() * 70);
    temperatureDisplay.textContent = `Ustaw temperaturę na: ${targetTemperature}°C. Aktulna temperatura: ${currentTemperature}°C`;
  };

  // Funkcja schładzania temperatury
  coolButton.addEventListener('click', () => {
    currentTemperature--;
    updateTemperature();
  });

  // Funkcja podgrzewania temperatury
  heatButton.addEventListener('click', () => {
    currentTemperature++;
    updateTemperature();
  });

  // Aktualizuje wyświetlaną temperaturę i sprawdza, czy jest poprawna
  function updateTemperature() {
    temperatureDisplay.textContent = `Ustaw temperaturę na: ${targetTemperature}°C. Aktulna temperatura: ${currentTemperature}°C`;

    // Sprawdź, czy temperatura jest odpowiednia
    if (currentTemperature === targetTemperature) {
      temperatureDisplay.textContent = `Brawo! Ustawiłeś właściwą temperaturę: ${targetTemperature}°C.`;
      endGame();
    } else if (currentTemperature < 0 || currentTemperature > 70) {
      temperatureDisplay.textContent = `Temperatura jest poza zakresem! Ustaw ją pomiędzy 0 a 100°C.`;
    }
  }

  // Zakończenie gry
  function endGame() {
    // Ukryj wszystkie elementy związane z minigierką
    temperatureButtons.style.display = 'none';
    temperatureDisplay.style.display = 'none';

  }

})();