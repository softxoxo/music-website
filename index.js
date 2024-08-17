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
// Constants and element selections
const slider = document.querySelector('.price-slider');
const microphone = document.querySelector('.microphone');
const totalPrice = document.querySelector('.price-display-box h1');
const glowElement = document.querySelector('.microphone-glow');
const priceCounters = document.querySelectorAll('.price-top .price-counter');
const activePriceCounter = document.querySelector('.price-counter-active');

const SLIDER_WIDTH = 1160; // Total width of the slider in pixels
const PRICE_RANGES = [
    { max: 1000, price: 5, width: 250 },
    { max: 10000, price: 4, width: 290 },
    { max: 50000, price: 3, width: 280 },
    { max: 100000, price: 2, width: SLIDER_WIDTH - 880 }
];

// Function to update glow and microphone position
function updatePositions(position) {
    if (glowElement) {
        glowElement.style.left = `${position}px`;
        glowElement.style.top = '50%';
    }
    
    if (microphone) {
        microphone.style.left = `${position}px`;
    }
}

// Function to calculate minutes based on microphone position
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

// Function to calculate price based on minutes
function calculatePrice(minutes) {
    for (let range of PRICE_RANGES) {
        if (minutes <= range.max) {
            return range.price;
        }
    }
    return PRICE_RANGES[PRICE_RANGES.length - 1].price;
}

// Function to update display and microphone position
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

    // Update active price counter
    if (activePriceCounter) {
        activePriceCounter.textContent = price + '₽';
    }

    // Update visibility of price counters
    priceCounters.forEach((counter, index) => {
        if (counter && PRICE_RANGES[index] && price === PRICE_RANGES[index].price) {
            counter.classList.add('hidden-text');
        } else if (counter) {
            counter.classList.remove('hidden-text');
        }
    });
}

// Function to calculate position based on minutes
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

// Function to handle microphone movement
function moveMicrophone(e) {
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    let x = e.clientX - rect.left;
    x = Math.max(0, Math.min(x, SLIDER_WIDTH));
    
    const minutes = calculateMinutes(x);
    updateDisplay(minutes);
}

// Event listeners
if (microphone) {
    microphone.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const initialX = e.clientX - microphone.getBoundingClientRect().left;
        
        function onMouseMove(e) {
            moveMicrophone({
                clientX: e.clientX - initialX + microphone.offsetWidth / 2
            });
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', onMouseMove);
        }, { once: true });
    });
}

// Initialize display
updateDisplay(1200); // Initial value

// Function to update calculator value
function updateCalculatorValue(changeAmount) {
    let currentMinutes = calculateMinutes(parseFloat(microphone.style.left));
    currentMinutes += changeAmount;
    currentMinutes = Math.max(1, Math.min(currentMinutes, 100000));
    updateDisplay(currentMinutes);
}

// Add event listeners for arrow buttons
const leftArrow = document.querySelector('.change-price-left');
const rightArrow = document.querySelector('.change-price-right');
const doubleLeftArrow = document.querySelector('.full-arrows-left .full-arrows-left-double');
const tripleLeftArrow = document.querySelector('.full-arrows-left .full-arrows-left-triple');
const doubleRightArrow = document.querySelector('.full-arrows-right .full-arrows-right-double');
const tripleRightArrow = document.querySelector('.full-arrows-right .full-arrows-right-triple');

if (leftArrow) leftArrow.addEventListener('click', () => updateCalculatorValue(-1));
if (rightArrow) rightArrow.addEventListener('click', () => updateCalculatorValue(1));
if (doubleLeftArrow) doubleLeftArrow.parentElement.addEventListener('click', () => updateCalculatorValue(-10));
if (tripleLeftArrow) tripleLeftArrow.parentElement.addEventListener('click', () => updateCalculatorValue(-100));
if (doubleRightArrow) doubleRightArrow.parentElement.addEventListener('click', () => updateCalculatorValue(10));
if (tripleRightArrow) tripleRightArrow.parentElement.addEventListener('click', () => updateCalculatorValue(100));


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