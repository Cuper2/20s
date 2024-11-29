//import * as PIXI from './node_modules/pixi.js/dist/pixi.mjs';
import * as TABLE from "./table.js";

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

  //Grid
  const tempTexture = await PIXI.Assets.load("temp.png");
  const gridObjects = [
    new TABLE.GridObj(1,0,tempTexture, () => alert('1')),
    new TABLE.GridObj(2,0,tempTexture, () => alert('2')),
    new TABLE.GridObj(1,1,tempTexture, () => alert('3'))
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

// Funkcja do rysowania stołu i dynamicznego dopasowania rozmiarów
  function drawTable() {
    const screenWidth = app.screen.width;
    const screenHeight = app.screen.height;

    const tableWidth = screenWidth * 0.9;
    const tableHeight = screenHeight * 0.3;
    const tableX = (screenWidth - tableWidth) / 2;
    const tableY = screenHeight * 0.6;

    const shadowHeight = screenHeight * 0.02;

    graphics.rect(tableX, tableY, tableWidth, tableHeight); // Blat stołu
    graphics.fill(0x333333);

    graphics.rect(tableX + 10, tableY + tableHeight, tableWidth - 20, shadowHeight); // Cień stołu
    graphics.fill(0x6C6F72);
  }

// Wczytanie tekstury drzwi i ustawienie dynamicznych pozycji
  async function loadDoor() {
    const doorTexture = await PIXI.Assets.load("door.png");
    const doorSprite = new PIXI.Sprite(doorTexture);

    doorSprite.anchor.set(0.5); // Centrowanie drzwi
    doorSprite.width = app.screen.width * 0.5; // Szerokość jako 10% szerokości ekranu
    doorSprite.height = doorSprite.width * 2; // Proporcjonalna wysokość
    doorSprite.x = app.screen.width / 2;
    doorSprite.y = app.screen.height / 2;

    app.stage.addChild(doorSprite);
  }

// Wywołanie funkcji po załadowaniu aplikacji
  drawTable();
  loadDoor();

// Dynamiczne dopasowanie po zmianie rozmiaru okna
  window.addEventListener("resize", () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    drawTable();
  });
  // Modal and menu elements
  const howToPlayButton = document.getElementById("how-to-play");
  const menu = document.getElementById("menu");
  const modal = document.getElementById("how-to-play-modal");
  const closeButton = document.getElementById("close-modal");

// Typing effect
  const typewriterText = document.getElementById("typewriter-text");
  const typewriterContent = `Welcome to 20 Seconds to Chaos!
Your mission is to manage the malfunctioning control panel. 
Instructions are etched into the walls—some are helpful, some are not. 
Time is your greatest enemy.`;

  let typingIndex = 0;
  const typingSpeed = 50; // Milliseconds per character

  function typeWriterEffect() {
    if (typingIndex < typewriterContent.length) {
      typewriterText.textContent += typewriterContent.charAt(typingIndex);
      typingIndex++;
      setTimeout(typeWriterEffect, typingSpeed);
    }
  }

// Show modal and hide menu
  howToPlayButton.addEventListener("click", () => {
    modal.classList.remove("hidden"); // Pokaż modal
    menu.classList.add("hidden-menu"); // Ukryj menu
    typewriterText.textContent = ""; // Reset tekstu
    typingIndex = 0; // Reset indeksu
    typeWriterEffect(); // Rozpocznij efekt pisania
  });

// Close modal and show menu
  closeButton.addEventListener("click", () => {
    modal.classList.add("hidden"); // Ukryj modal
    menu.classList.remove("hidden-menu"); // Pokaż menu
  });

// Close modal by clicking outside it
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden"); // Ukryj modal
      menu.classList.remove("hidden-menu"); // Pokaż menu
    }
  });

})();