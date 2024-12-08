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

  function hideAllElements() {
    app.stage.children.forEach(child => {
      child.visible = false;
    });
  }

  function death() {
    const diedDiv = document.querySelector('.died');
    diedDiv.style.display = 'flex';

    hideAllElements();
    document.querySelectorAll("#mini, svg").forEach(el => el.remove());
    // After 5 seconds, reload the page
    setTimeout(() => {
      location.reload();
    }, 4000);

  }

  //Events
  let startTimer = () => {
    setTimeout(() => {
      // Start the timer after 5 seconds of loading the page
      if (!isCounterStarted) {
        counterVal = 2000000;
        isCounterStarted = true;
        console.log("Timer started after 5 seconds!");
      }
    }, 1000);
  }

  // // Restart button event
  //   restartBtn.on("pointerdown", () => {
  //     counterVal = 20000;
  //     counter.text = "20:000";
  //     isCounterStarted = false;
  //   });
  //


  app.ticker.add((time) => {
    if (isCounterStarted) {
      if (isNaN(counterVal)) {
        console.error("counterVal is NaN! Resetting.");
        counterVal = 20000; // Reset to initial value if NaN occurs
      }

      counterVal -= app.ticker.elapsedMS;
      counterVal = Math.max(counterVal, 0);
      counterVal = counterVal.toFixed(0);

      const seconds = Math.floor(counterVal / 1000);
      const milliseconds = counterVal % 1000;
      if (counterVal > 0) {
        counter.text = `${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(3, "0")}`;
      } else {
        counter.text = "00:000";
        isCounterStarted = false;
        death();
        console.log("Koniec czasu");
      }
    }
  });



  // Audio section
  const laughtAudio = new Audio('laughmp3.mp3');
  const gasLeakAudio = new Audio('gasLeak.mp3');
  laughtAudio.load();
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
        startTimer();
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

  const {
    Graphics
  } = PIXI;
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

    // Drawing Table
    graphics.rect(tableX, tableY, tableWidth, tableHeight);
    graphics.fill(0x333333);





    // Table Shadow
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
  const btnFace = await PIXI.Assets.load("termperature.png")
  const btnDontPress = await PIXI.Assets.load("btn3.png");


  const gridObjects = [
    new TABLE.GridObj(0, 0, btnFace, () => startMiniGame()),
    new TABLE.GridObj(0, 0, btnDontPress, () => death()),
    new TABLE.GridObj(0, 0, btnTextureArrow, () => startMinigame2()),
  ];

  const grid = new TABLE.Grid(64, 0, 300, app.screen.width, 200, gridObjects, []);
  const tableWidth = app.screen.width * 0.9;
  const tableHeight = app.screen.height * 0.3;
  const tableX = (app.screen.width - tableWidth) / 2;
  const tableY = app.screen.height * 0.6;

  // Calculations for posistion of buttons
  const totalButtonWidth = gridObjects.reduce((sum, obj) => sum + obj.texture.width, 0);
  const buttonSpacing = -200; // Gap between buttons
  const totalSpacingWidth = buttonSpacing * (gridObjects.length - 1);

  // Centering in X pos
  let startX = tableX + (tableWidth - totalButtonWidth - totalSpacingWidth) / 2;

  // Centering in Y pos
  const tableCenterY = tableY + tableHeight;

  gridObjects.forEach((obj, index) => {
    obj.x = startX + index * (obj.texture.width + buttonSpacing); //X pos buttons
    obj.y = tableCenterY - tableHeight; // Y pos buttons

    // Debbuging
  });

  grid.drawGrid();
  grid.cells.forEach((element) => {
    app.stage.addChild(element);
  });

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
  const typewriterContentCreators = "Cyberentrails - Concept Artist, Lead Artist, Story Writer // Loiks – Programmer, Game Designer // Skamor - Project manager, Lead programmer // Cuper2 -- ...";

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

  const minigameBody = document.getElementById("mini");
  minigameBody.style.display = "none";
  const startButton = document.getElementById("start-game").style.display = "none";
  const temperatureDisplay = document.getElementById("temperature-display");
  const temperatureButtons = document.getElementById("temperature-buttons");
  const coolButton = document.getElementById("cool-button");
  const heatButton = document.getElementById("heat-button");

  let currentTemperature = Math.floor(Math.random() * (35 - 20) + 20); // generates number between 20 and 35 (both included)
  let targetTemperature;



  function startMiniGame() {
    
    mini.style.display = "flex";
    console.log("ok");
    temperatureButtons.style.display = 'flex';
    targetTemperature = Math.floor(Math.random() * (35 - 10) + 10); // generates number between 10 and 35 (both included)
    temperatureDisplay.textContent = `Set the temperature to: ${targetTemperature}°C. Current temperature: ${currentTemperature}°C`;

    // Start swapping buttons every 2 seconds
    setInterval(() => {
      // Only swap buttons if the user is close to the target temperature
      if (Math.abs(targetTemperature - currentTemperature) <= 5) {
        swapButtons();
        laughtAudio.play();
        laughtCount++;
      }
    }, 2000);

  // Swaps the positions of the buttons
  function swapButtons() {
    const buttons = Array.from(temperatureButtons.children);

    // Shuffle the positions
    for (let i = buttons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [buttons[i], buttons[j]] = [buttons[j], buttons[i]];
    }

    // Reattach the buttons in new order
    buttons.forEach(button => {
      temperatureButtons.appendChild(button);
    });
  }



  // Deleting temperature
  coolButton.addEventListener('click', () => {
    currentTemperature--;
    updateTemperature();
  });

  // Adding temperature
  heatButton.addEventListener('click', () => {
    currentTemperature++;
    updateTemperature();
  });

  // Checks and updates temperature
  function updateTemperature() {
    temperatureDisplay.textContent = `Set the temperature to: ${targetTemperature}°C. Current temperature: ${currentTemperature}°C`;
    if (currentTemperature === targetTemperature) endGame();
  }

  function endGame() {
    temperatureButtons.remove();
    temperatureDisplay.remove();
  }}
  
  function startMiniGame2(){
    let gridWidth = 3 * 150;
    let gridHeight = 3 * 120;

    let startX1 = (app.screen.width - gridWidth) / 2;
    let startY = (app.screen.height - gridHeight) / 2;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let x = startX1 + (i * 150);  // Horizontal position
        let y = startY + (j * 120);  // Vertical position
        graphics.rect(x, y, 50, 50);  // Draw the rectangle
        graphics.fill(0xFF0000);
      }
    }

  }




})();