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
    const tableHeight = 350;
    const screenWidth = app.screen.width;
    const screenHeight = app.screen.height;

    const tableWidth = screenWidth - 100;

    const tableX = 50;
    const tableY = (screenHeight - tableHeight) / 2 + 100;

    const shadowHeight = 20;

    // Rysowanie stołu
    graphics.rect(tableX, tableY, tableWidth, tableHeight);
    graphics.fill(0x333333);

    // Cień stołu
    graphics.rect(tableX + 10, tableY + tableHeight, tableWidth - 20, shadowHeight);
    graphics.fill(0x6C6F72);
  }

  drawTable();

  window.addEventListener("resize", () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    drawTable();
  });

  //textures
  const btnTextureArrow = await PIXI.Assets.load("btn-arrow.png");
  const btnDontPress = await PIXI.Assets.load("btn3.png");


  const gridObjects = [
    new TABLE.GridObj(0, 0, btnTextureArrow, () => alert('Kliknięto przycisk Arrow')),
    new TABLE.GridObj(0, 0, btnDontPress, () => alert('Kliknięto przycisk Don\'t Press')),
  ];

// Tworzymy siatkę
  const grid = new TABLE.Grid(64, 0, 300, app.screen.width, 200, gridObjects, []);

// Ustalamy pozycję stołu
  const tableWidth = app.screen.width * 0.9; // Szerokość stołu
  const tableHeight = app.screen.height * 0.3; // Wysokość stołu
  const tableX = (app.screen.width - tableWidth) / 2; // Pozycja X stołu
  const tableY = app.screen.height * 0.6; // Pozycja Y stołu

// Obliczamy całkowitą szerokość przycisków z uwzględnieniem odstępów
  const totalButtonWidth = gridObjects.reduce((sum, obj) => sum + obj.texture.width, 0);
  const buttonSpacing = 20; // Odstęp między przyciskami
  const totalSpacingWidth = buttonSpacing * (gridObjects.length - 1); // Całkowity odstęp między przyciskami

// Obliczamy początkową pozycję X, aby przyciski były wyśrodkowane
  let startX = tableX + (tableWidth - totalButtonWidth - totalSpacingWidth) / 2;

// Ustawiamy pozycje przycisków w jednej linii poziomej z tym samym Oy
  const tableCenterY = tableY + tableHeight / 2; // Wysokość stołu, środek

  gridObjects.forEach((obj, index) => {
    const buttonX = startX + index * (obj.texture.width + buttonSpacing); // Pozycja X przycisku

    obj.x = buttonX; // Pozycja X przycisku
    obj.y = tableCenterY - obj.texture.height / 2; // Wyśrodkowanie przycisku na osi Y

    // Debug: Sprawdzamy pozycje
    console.log(`Przycisk ${index + 1}: x = ${obj.x}, y = ${obj.y}`);
  });

// Rysowanie siatki i dodawanie elementów do sceny
  grid.drawGrid();
  grid.cells.forEach((element) => {
    app.stage.addChild(element);
  });

// Dodajemy przyciski do sceny
  gridObjects.forEach((obj) => {
    const buttonSprite = new PIXI.Sprite(obj.texture);
    buttonSprite.x = obj.x;
    buttonSprite.y = obj.y;
    buttonSprite.interactive = true;
    buttonSprite.buttonMode = true;
    buttonSprite.on("pointerdown", obj.onclick);
    app.stage.addChild(buttonSprite);
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

  const typewriterContentPlay = `Welcome to 20 Seconds! Your mission is to manage the malfunctioning control panel. Instructions are etched into the walls—some are helpful, some are not. Time is your greatest enemy.`;
  const typewriterContentCreators = "Cyberentrails - Concept Artist, Lead Artist, Story Writer Loiks – Lead programmer, Game Designer";

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

  let currentTemperature = 50;
  let targetTemperature;

  //
  function startMiniGame ()  {
    mini.style.display = "flex";
    console.log("ok")
    startButton.style.display = 'none';
    temperatureButtons.style.display = 'block'; // Pokaż przyciski

    targetTemperature = Math.floor(Math.random() * 70);
    temperatureDisplay.textContent = `Ustaw temperaturę na: ${targetTemperature}°C. Aktulna temperatura: ${currentTemperature}°C`;
  };

  //deleting temperature
  coolButton.addEventListener('click', () => {
    currentTemperature--;
    updateTemperature();
  });

  //adding temperature
  heatButton.addEventListener('click', () => {
    currentTemperature++;
    updateTemperature();
  });
  //checks and updates temperature
  function updateTemperature() {
    temperatureDisplay.textContent = `Ustaw temperaturę na: ${targetTemperature}°C. Aktulna temperatura: ${currentTemperature}°C`;

    if (currentTemperature === targetTemperature) {
      temperatureDisplay.textContent = `Brawo! Ustawiłeś właściwą temperaturę: ${targetTemperature}°C.`;
      endGame();
    } else if (currentTemperature < 0 || currentTemperature > 70) {
      temperatureDisplay.textContent = `Temperatura jest poza zakresem! Ustaw ją pomiędzy 0 a 100°C.`;
    }
  }

  function endGame() {
    temperatureButtons.style.display = 'none';
    temperatureDisplay.style.display = 'none';

  }

})();