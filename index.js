// ----------------------------------------------------------------CURRENCY--------------------------------------------------------------------//
const currencyElement = document.querySelector('.currency');
const currencyChangeWindow = document.querySelector('.currency-change-window');

// Get all currency options
const dollarOption = document.querySelector('.dollar');
const euroOption = document.querySelector('.euro');
const rubleOption = document.querySelector('.ruble');

// Get all currency display images
const rubleDisplay = document.querySelector('.currency-display img[alt="рубль"]');
const euroDisplay = document.querySelector('.currency-display img[alt="евро"]');
const dollarDisplay = document.querySelector('.currency-display img[alt="доллар"]');

// Function to toggle the currency change window
function toggleCurrencyWindow() {
    currencyChangeWindow.classList.toggle('hide');
}

// Function to update the currency display
function updateCurrencyDisplay(selectedCurrency) {
    rubleDisplay.classList.add('hide');
    euroDisplay.classList.add('hide');
    dollarDisplay.classList.add('hide');

    if (selectedCurrency === 'ruble') {
        rubleDisplay.classList.remove('hide');
    } else if (selectedCurrency === 'euro') {
        euroDisplay.classList.remove('hide');
    } else if (selectedCurrency === 'dollar') {
        dollarDisplay.classList.remove('hide');
    }
}

// Function to update the currency options
function updateCurrencyOptions(selectedCurrency) {
    rubleOption.classList.add('hide');
    euroOption.classList.add('hide');
    dollarOption.classList.add('hide');

    if (selectedCurrency !== 'ruble') {
        rubleOption.classList.remove('hide');
    }
    if (selectedCurrency !== 'euro') {
        euroOption.classList.remove('hide');
    }
    if (selectedCurrency !== 'dollar') {
        dollarOption.classList.remove('hide');
    }
}

// Add click event listener to the currency element
currencyElement.addEventListener('click', toggleCurrencyWindow);

// Add click event listeners to currency options
dollarOption.addEventListener('click', () => {
    updateCurrencyDisplay('dollar');
    updateCurrencyOptions('dollar');
    toggleCurrencyWindow();
});

euroOption.addEventListener('click', () => {
    updateCurrencyDisplay('euro');
    updateCurrencyOptions('euro');
    toggleCurrencyWindow();
});

rubleOption.addEventListener('click', () => {
    updateCurrencyDisplay('ruble');
    updateCurrencyOptions('ruble');
    toggleCurrencyWindow();
});

// Close the currency window when clicking outside of it
document.addEventListener('click', (event) => {
    if (!currencyElement.contains(event.target) && !currencyChangeWindow.contains(event.target)) {
        currencyChangeWindow.classList.add('hide');
    }
});


// ----------------------------------------------------------------ARROWS --------------------------------------------------------------------//
// Get the change price elements
const changePriceLeft = document.querySelector('.change-price-left');
const changePriceRight = document.querySelector('.change-price-right');

// Get the full arrows elements
const fullArrowsLeft = document.querySelector('.full-arrows-left');
const fullArrowsRight = document.querySelector('.full-arrows-right');

// Get the calculator value element
const calculatorValue = document.querySelector('.calculator-value-numb');

// Get the double and triple arrow buttons
const doubleLeftButton = fullArrowsLeft.querySelector('.full-arrows-left-double').parentElement;
const tripleLeftButton = fullArrowsLeft.querySelector('.full-arrows-left-triple').parentElement;
const doubleRightButton = fullArrowsRight.querySelector('.full-arrows-right-double').parentElement;
const tripleRightButton = fullArrowsRight.querySelector('.full-arrows-right-triple').parentElement;

// Function to show full arrows
function showFullArrows(arrowElement) {
    arrowElement.classList.remove('hide');
}

// Function to hide full arrows
function hideFullArrows(arrowElement) {
    arrowElement.classList.add('hide');
}

// Function to update the calculator value
function updateCalculatorValue(changeAmount) {
    let currentValue = parseInt(calculatorValue.textContent);
    currentValue += changeAmount;
    if (currentValue < 0) currentValue = 0;
    calculatorValue.textContent = currentValue + ' минут';
}

// Add event listeners for left arrow
changePriceLeft.addEventListener('mouseenter', () => showFullArrows(fullArrowsLeft));
changePriceLeft.addEventListener('mouseleave', (event) => {
    if (!fullArrowsLeft.contains(event.relatedTarget)) {
        hideFullArrows(fullArrowsLeft);
    }
});

// Add event listeners for right arrow
changePriceRight.addEventListener('mouseenter', () => showFullArrows(fullArrowsRight));
changePriceRight.addEventListener('mouseleave', (event) => {
    if (!fullArrowsRight.contains(event.relatedTarget)) {
        hideFullArrows(fullArrowsRight);
    }
});

// Add event listeners for full arrows to keep them visible
fullArrowsLeft.addEventListener('mouseenter', () => showFullArrows(fullArrowsLeft));
fullArrowsLeft.addEventListener('mouseleave', () => hideFullArrows(fullArrowsLeft));
fullArrowsRight.addEventListener('mouseenter', () => showFullArrows(fullArrowsRight));
fullArrowsRight.addEventListener('mouseleave', () => hideFullArrows(fullArrowsRight));


// ----------------------------------------------------------MICROPHONE--------------------------------------------------------//
const slider = document.querySelector('.price-slider');
const microphone = document.querySelector('.microphone');
const totalPrice = document.querySelector('.price-display-box h1');
const glowElement = document.querySelector('.microphone-glow');
const priceCounters = document.querySelectorAll('.price-top .price-counter');
const activePriceCounter = document.querySelector('.price-counter-active');

let SLIDER_WIDTH = 1160; // Default width, will be updated based on window size
let SLIDER_HEIGHT = 0; // Will be used for the rotated slider
let isRotated = false; // Flag to check if the slider is rotated

const PRICE_RANGES = [
    { max: 1000, price: 5, widthPercentage: 21.55 },
    { max: 10000, price: 4, widthPercentage: 25 },
    { max: 50000, price: 3, widthPercentage: 24.14 },
    { max: 100000, price: 2, widthPercentage: 29.31 }
];

function updateSliderDimensions() {
    const windowWidth = window.innerWidth;
    if (windowWidth >= 1160) {
        SLIDER_WIDTH = 1120;
        isRotated = false;
    } else if (windowWidth >= 1000) {
        SLIDER_WIDTH = 850;
        isRotated = false;
    } else if (windowWidth >= 700) {
        SLIDER_WIDTH = 620;
        isRotated = false;
    } else if (windowWidth >= 480) {
        SLIDER_WIDTH = 430;
        isRotated = false;
    } else {
        SLIDER_WIDTH = 300;
        SLIDER_HEIGHT = 460; // Assuming the rotated height is 460px, adjust as needed
        isRotated = true;
    }

    
    // Recalculate widths for each range
    PRICE_RANGES.forEach(range => {
        range.width = (range.widthPercentage / 100) * (SLIDER_WIDTH);
    });
}

function updatePositions(position) {
    if (glowElement) {
        glowElement.style.left = `${position}px`;
        glowElement.style.top = '50%';
    }
    
    if (microphone) {
        microphone.style.left = `${position}px`;
    }
}

function calculateMinutes(position) {
    let accumulatedWidth = 0;
    for (let range of PRICE_RANGES) {
        if (position <= accumulatedWidth + range.width) {
            const relativePosition = position - accumulatedWidth;
            const rangePercentage = relativePosition / range.width;
            return Math.round((range.max - (accumulatedWidth > 0 ? PRICE_RANGES[PRICE_RANGES.indexOf(range) - 1].max : 0)) * rangePercentage) + (accumulatedWidth > 0 ? PRICE_RANGES[PRICE_RANGES.indexOf(range) - 1].max : 0);
        }
        accumulatedWidth += range.width;
    }
    return 100000; // Max value
}

function calculatePrice(minutes) {
    for (let range of PRICE_RANGES) {
        if (minutes <= range.max) {
            return range.price;
        }
    }
    return PRICE_RANGES[PRICE_RANGES.length - 1].price;
}

function updateDisplay(minutes) {
    minutes = Math.max(1, Math.min(minutes, 100000));
    if (calculatorValue) {
        calculatorValue.textContent = minutes + ' минут';
    }
    const price = calculatePrice(minutes);
    if (totalPrice) {
        totalPrice.textContent = (price * minutes).toFixed(2) + ' ₽';
    }

    const position = calculatePosition(minutes);
    updatePositions(position);

    if (activePriceCounter) {
        activePriceCounter.textContent = price + '₽';
    }

    priceCounters.forEach((counter, index) => {
        if (counter && PRICE_RANGES[index] && price === PRICE_RANGES[index].price) {
            counter.classList.add('hidden-text');
        } else if (counter) {
            counter.classList.remove('hidden-text');
        }
    });
}

function calculatePosition(minutes) {
    let accumulatedWidth = 0;
    for (let range of PRICE_RANGES) {
        if (minutes <= range.max) {
            const prevMax = accumulatedWidth > 0 ? PRICE_RANGES[PRICE_RANGES.indexOf(range) - 1].max : 0;
            const rangePercentage = (minutes - prevMax) / (range.max - prevMax);
            return accumulatedWidth + (rangePercentage * range.width);
        }
        accumulatedWidth += range.width;
    }
    return SLIDER_WIDTH;
}

function moveMicrophone(e) {
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    let position;
    if (isRotated) {
        position = e.clientY - rect.top;
        position = Math.max(0, Math.min(position, SLIDER_HEIGHT));
    } else {
        position = e.clientX - rect.left;
        position = Math.max(0, Math.min(position, SLIDER_WIDTH));
    }
    
    const minutes = calculateMinutes(position);
    updateDisplay(minutes);
}

if (microphone) {
    microphone.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const initialPosition = 
            e.clientX - microphone.getBoundingClientRect().left;
        
        function onMouseMove(e) {
            moveMicrophone({
                clientX: e.clientX - initialPosition + microphone.offsetWidth / 2,
                clientY: e.clientY
            });
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', onMouseMove);
        }, { once: true });
    });
}

if (slider) {
    slider.addEventListener('click', (e) => {
        moveMicrophone(e);
    });
}

function updateCalculatorValue(changeAmount) {
    let currentMinutes = calculateMinutes(
        parseFloat(microphone.style.left));
    currentMinutes += changeAmount;
    currentMinutes = Math.max(1, Math.min(currentMinutes, 100000));
    updateDisplay(currentMinutes);
}
const leftArrow = document.querySelector('.change-price-left');
const rightArrow = document.querySelector('.change-price-right');
const doubleLeftArrow = document.querySelector('.full-arrows-left .full-arrows-left-double');
const tripleLeftArrow = document.querySelector('.full-arrows-left .full-arrows-left-triple');
const doubleRightArrow = document.querySelector('.full-arrows-right .full-arrows-right-double');
const tripleRightArrow = document.querySelector('.full-arrows-right .full-arrows-right-triple');
const doublemLeftArrow = document.querySelector('.full-arrows-left-double');
const triplemLeftArrow = document.querySelector('.full-arrows-left-triple');
const doublemRightArrow = document.querySelector('.full-arrows-right-double');
const triplemRightArrow = document.querySelector('.full-arrows-right-triple');

if (leftArrow) leftArrow.addEventListener('click', () => updateCalculatorValue(-1));
if (rightArrow) rightArrow.addEventListener('click', () => updateCalculatorValue(1));
if (doubleLeftArrow) doubleLeftArrow.parentElement.addEventListener('click', () => updateCalculatorValue(-10));
if (tripleLeftArrow) tripleLeftArrow.parentElement.addEventListener('click', () => updateCalculatorValue(-100));
if (doubleRightArrow) doubleRightArrow.parentElement.addEventListener('click', () => updateCalculatorValue(10));
if (tripleRightArrow) tripleRightArrow.parentElement.addEventListener('click', () => updateCalculatorValue(100));

if (doublemLeftArrow) doublemLeftArrow.parentElement.addEventListener('click', () => updateCalculatorValue(-10));
if (triplemLeftArrow) triplemLeftArrow.parentElement.addEventListener('click', () => updateCalculatorValue(-100));
if (doublemRightArrow) doublemRightArrow.parentElement.addEventListener('click', () => updateCalculatorValue(10));
if (triplemRightArrow) triplemRightArrow.parentElement.addEventListener('click', () => updateCalculatorValue(100));

// Initialize
updateSliderDimensions();
updateDisplay(1200); // Initial value

// Add event listener for window resize
window.addEventListener('resize', () => {
    updateSliderDimensions();
    updateDisplay(calculateMinutes(
        parseFloat(microphone.style.left)));
});

//-------------------------------------------------------TEXT ANIMATION--------------------------------------------------//
const phrases = [
    "вы хотите купить",
    "вы хотите приобрести",
    "вам необходимо",
    "вам потребуется",
    "вам нужно"
  ];
  
  const typingElement = document.getElementById('typing-text');
  const cursorElement = document.getElementById('cursor');
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function typePhrase() {
    const currentPhrase = phrases[phraseIndex];
    
    if (!isDeleting && charIndex <= currentPhrase.length) {
      typingElement.textContent = currentPhrase.substring(0, charIndex);
      charIndex++;
      if (charIndex > currentPhrase.length) {
        setTimeout(() => {
          isDeleting = true;
          typePhrase();
        }, 10000); // Wait for 10 seconds before deleting
      } else {
        setTimeout(typePhrase, 100); // Typing speed
      }
    } else if (isDeleting && charIndex > 0) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      setTimeout(typePhrase, 50); // Deleting speed
    } else {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      charIndex = 0;
      setTimeout(typePhrase, 500); // Pause before typing next phrase
    }
  }
  
  // Cursor blinking effect
  function blinkCursor() {
    cursorElement.style.visibility = (cursorElement.style.visibility === 'visible') ? 'hidden' : 'visible';
  }
  
  setInterval(blinkCursor, 530); // Blink every 530ms for a more natural feel
  
  // Start the animation
  typePhrase();


  //------------------------------------------------------POP-UP----------------------------------------------//
  let loggedIn = false;

  // Wait for the DOM to be fully loaded before attaching event listeners
  document.addEventListener('DOMContentLoaded', () => {
      const buyButton = document.querySelector('.buy-button');
      const modal = document.getElementById('loginModal');
      const closeBtn = document.querySelector('.close');
      const body = document.body;
  
      function openModal() {
          modal.style.display = 'block';
          body.classList.add('modal-open');
      }
  
      function closeModal() {
          modal.style.display = 'none';
          body.classList.remove('modal-open');
      }
  
      buyButton.addEventListener('click', () => {
          if (!loggedIn) {
              openModal();
          } else {
              // Proceed with the purchase logic
              console.log('User is logged in. Proceeding with purchase...');
          }
      });
  
      closeBtn.addEventListener('click', closeModal);
  
      window.addEventListener('click', (event) => {
          if (event.target === modal) {
              closeModal();
          }
      });
  });


  // --------------------------------------------SMTH--------------------------------------------------//
  