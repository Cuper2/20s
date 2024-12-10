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

    function victoryScreen() {
        hideAllElements();
        const elements = [
            { selector: '.victory-screen', styles: { opacity: 1 } },
            { selector: '#victory', styles: { display: "flex" } },
            { selector: '.title', styles: { display: "flex" } },
            { selector: '.subtitle', styles: { display: "block" } },
            { selector: '.background', styles: { opacity: 1 } },
            { selector: '.btn', styles: { display: 'none' } }
        ];

        elements.forEach(element => {
            const el = document.querySelector(element.selector);
            if (el) {
                Object.assign(el.style, element.styles);
            }
        });
        setTimeout(() => {
            location.reload();
        }, 5000);

    }

    function death() {
        hideAllElements();
        explosionAudio.play();

        document.querySelectorAll("#mini, svg").forEach(el => el.remove());
        document.body.classList.add('shake');
        const explosion = document.createElement('div');
        explosion.classList.add('explosion');
        document.body.appendChild(explosion);

        for (let i = 0; i < 30; i++) {
            const fragment = document.createElement('div');
            fragment.classList.add('fragment');

            //explosion position (random)
            const angle = Math.random() * 360;
            const distance = Math.random() * 150;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            fragment.style.transform = `translate(${x}px, ${y}px)`;

            document.body.appendChild(fragment);
        }
        // Deleting elements
        setTimeout(() => {
            explosion.remove();
            document.body.classList.remove('shake');

            const diedDiv = document.querySelector('.died');
            diedDiv.style.display = 'flex';
            deathAudio.play();
        }, 1000);

        setTimeout(() => {
            location.reload();
        }, 5000);
    }


    //Events
    let startTimer = () => {
        setTimeout(() => {
            // Start the timer after 5 seconds of loading the page
            if (!isCounterStarted) {
                counterVal = 20000;
                isCounterStarted = true;
                console.log("Timer started after 5 seconds!");
            }
        }, 1000);
    }

    app.ticker.add(() => {
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
    const correctPinAudio = new Audio('correctSound.mp3');
    const deathAudio = new Audio('youDied.mp3');
    const laughtAudio = new Audio('laughmp3.mp3');
    const explosionAudio = new Audio('explosion.mp3');

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
    const btnTemperatureChange = await PIXI.Assets.load("termperature.png")
    const pinPadTexture = await PIXI.Assets.load("pinpad.png");
    const btnDontPress = await PIXI.Assets.load("btn3.png");


    const gridObjects = [
        new TABLE.GridObj(0, 0, btnTemperatureChange, () => startMiniGame()),
        new TABLE.GridObj(0, 0, btnDontPress, () => death()),
        new TABLE.GridObj(0, 0, btnTextureArrow, () => console.log("working")),
        new TABLE.GridObj(0, 0, pinPadTexture, () => startMiniGame2()),
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

    const typewriterContentPlay = `Welcome to 20 Seconds! Your mission is to manage the malfunctioning control panel. Time is your greatest enemy. The control panel has buttons that trigger mini-games. Solve them before the countdown runs out, or the system will fail. Each game tests your time reaction—make a mistake, and the malfunction worsens. Can you fix the panel in time?`;
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
    const miniContainer = document.getElementById("con");
    minigameBody.style.display = "none";
    const startButton = document.getElementById("start-game").style.display = "none";
    const temperatureDisplay = document.getElementById("temperature-display");
    const temperatureButtons = document.getElementById("temperature-buttons");
    const coolButton = document.getElementById("cool-button");
    const heatButton = document.getElementById("heat-button");
    let currentTemperature = Math.floor(Math.random() * (20 - 10) + 1); // generates number between -10 and 20
    let targetTemperature;
    let gameWin = 0; // player wins if gameWin  = 2

    const checkWin = () => {
        if (gameWin === 1) console.log("Win")
        victoryScreen();
    }

    function startMiniGame() {
        miniContainer.style.display = "flex";
        mini.style.display = "flex";
        console.log("ok");
        temperatureButtons.style.display = 'flex';
        targetTemperature = Math.floor(Math.random() * (20 - (-5) + 1)) + (-5); // generates number between -5 and 20 (both included)
        temperatureDisplay.textContent = `Set the temperature to: ${targetTemperature}°C. Current temperature: ${currentTemperature}°C`;

        if (Math.abs(targetTemperature - currentTemperature) <= 5) {

        }

        // Start swapping buttons every 2 seconds
        let swapInterval = setInterval(() => {
            // Only swap buttons if the user is close to the target temperature
            if (Math.abs(targetTemperature - currentTemperature) <= 5) {
                swapButtons();
                laughtAudio.play();
            }
        }, 1500);

        // Swaps the positions of the buttons
        function swapButtons() {
            const buttons = Array.from(temperatureButtons.children);
            // Shuffle the positions
            for (let i = buttons.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 2));
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
            if (currentTemperature === targetTemperature) {
                endGame();
            }
        }

        function endGame() {
            gameWin++;
            checkWin();
            if (temperatureButtons) temperatureButtons.remove();
            if (temperatureDisplay) temperatureDisplay.remove();
            if (minigameBody) minigameBody.remove();
            if (miniContainer) miniContainer.remove();
            clearInterval(swapInterval);
        }
    }

    function startMiniGame2() {
        let buttonWidth = 100;
        let buttonHeight = 100;
        let gridWidth = 3 * buttonWidth + 2 * 20;
        let gridHeight = 3 * buttonHeight + 2 * 20;

        let startX1 = (app.screen.width - gridWidth) / 2;
        let startY = (app.screen.height - gridHeight) / 2;

        let pin = "";
        let correctPin = generatePin();
        let buttons = [];

        function generatePin() {
            let digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            let pin = "";
            while (pin.length < 3) {
                let index = Math.floor(Math.random() * digits.length);
                pin += digits[index];
            }
            return parseInt(pin);
        }

        function checkPin() {
            if (pin === correctPin.toString()) {
                console.log("PIN correct");
                app.stage.removeChild(pinpadBackground);
                app.stage.removeChild(pinText);
                buttons.forEach(button => app.stage.removeChild(button));
                correctPinAudio.play()
                gameWin++;
                checkWin();
                console.log(gameWin)
            } else {
                death();
            }
        }

        let pinText = new PIXI.Text("PIN to enter : " + correctPin, {
            fontFamily: 'Arial',
            fontSize: 30,
            fill: 0xFFFFFF,
            align: 'center'
        });
        pinText.x = app.screen.width / 2 - pinText.width / 2;
        pinText.y = startY - 60;
        app.stage.addChild(pinText);

        let pinpadBackground = new PIXI.Graphics();
        pinpadBackground.roundRect(startX1 - 10, startY - 10, gridWidth + 20, gridHeight + 20, 15);
        pinpadBackground.fill(0x000000);
        pinpadBackground.stroke({
            width: 2,
            color: 0xFFFFFF
        });
        app.stage.addChild(pinpadBackground);

        function shufflePositions() {
            let positions = [];
            for (let j = 0; j < 3; j++) {
                for (let i = 0; i < 3; i++) {
                    let x = startX1 + (i * buttonWidth) + (i * 20);
                    let y = startY + (j * buttonHeight) + (j * 20);
                    positions.push({
                        x,
                        y
                    });
                }
            }
            return positions.sort(() => Math.random() - 0.5);
        }

        let positions = shufflePositions();

        // Creating PINPAD 3x3 
        for (let number = 1; number <= 9; number++) {
            let position = positions.shift();

            let button = new PIXI.Container();

            let buttonGraphics = new PIXI.Graphics();
            buttonGraphics.roundRect(0, 0, buttonWidth, buttonHeight, 10);
            buttonGraphics.fill(0xFF6347);

            let label = new PIXI.Text(number.toString(), {
                fontFamily: 'Arial',
                fontSize: 24,
                fill: 0xFFFFFF,
                align: 'center'
            });

            label.x = buttonWidth / 2 - label.width / 2;
            label.y = buttonHeight / 2 - label.height / 2;

            button.addChild(buttonGraphics);
            button.addChild(label);

            button.x = position.x;
            button.y = position.y;

            // Events for clicking buttons
            button.interactive = true;
            button.buttonMode = true;
            button.on('pointerdown', () => {
                button.alpha = 0.5;
                if (pin.length < 3) {
                    pin += number.toString();
                    if (pin.length === 3) {
                        checkPin();
                    }
                }
            });

            button.on('pointerup', () => {
                button.alpha = 1;
            });

            buttons.push(button);
            app.stage.addChild(button);
        }
    }
})();