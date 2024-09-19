// ----------------------------------------------------------------CURRENCY--------------------------------------------------------------------//
const currencyElement = document.querySelector('.currency');
const currencyChangeWindow = document.querySelector('.currency-change-window');

// Get all currency options
const dollarOption = document.querySelector('.dollar');
const euroOption = document.querySelector('.euro');
const rubleOption = document.querySelector('.ruble');

function selectCurrency(currency) {
    updateCurrencyDisplay(currency);
    updateCurrencyOptions(currency);
    toggleCurrencyWindow(); // Close the window after selection
  }

// Get all currency display images
const rubleDisplay = document.querySelector('.currency-display img[alt="рубль"]');
const euroDisplay = document.querySelector('.currency-display img[alt="евро"]');
const dollarDisplay = document.querySelector('.currency-display img[alt="доллар"]');

dollarOption.addEventListener('click', () => selectCurrency('dollar'));
euroOption.addEventListener('click', () => selectCurrency('euro'));
rubleOption.addEventListener('click', () => selectCurrency('ruble'));

// Function to toggle the currency change window
function toggleCurrencyWindow() {
  currencyChangeWindow.classList.toggle('hide');
  if (!currencyChangeWindow.classList.contains('hide')) {
    // Add animate class after a small delay to ensure the window is visible
    setTimeout(() => {
      currencyChangeWindow.classList.add('animate');
    }, 50);
  } else {
    currencyChangeWindow.classList.remove('animate');
  }
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

  document.querySelectorAll('.currency-change-window > div:not(.hide) .currency-text').forEach(text => {
    text.style.transition = 'none';
    text.style.transform = 'translateY(100%)';
    text.offsetHeight; // Trigger reflow
    text.style.transition = 'transform 0.3s ease-out';
    text.style.transform = 'translateY(0)';
  });
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
    currencyChangeWindow.classList.remove('animate');
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
const doubleRightButton = fullArrowsRight.querySelector('.double-right');
const tripleRightButton = fullArrowsRight.querySelector('.triple-right');
const tripleLeftButton = fullArrowsLeft.querySelector('.triple-left');
const doubleLeftButton = fullArrowsLeft.querySelector('.double-left');

function showFullArrows(arrowElement) {
  arrowElement.classList.remove('hide');
  arrowElement.style.display = 'block';
  setTimeout(() => {
      arrowElement.classList.add('show');
  }, 10);
}

function hideFullArrows(arrowElement) {
  const buttons = arrowElement.querySelectorAll('button');
  let maxDelay = 0;

  buttons.forEach(button => {
      let delay;
      if (button.classList.contains('double-left') || button.classList.contains('double-right')) {
          delay = 100;
      } else if (button.classList.contains('triple-left') || button.classList.contains('triple-right')) {
          delay = 200;
      } else {
          delay = 0;
      }

      maxDelay = Math.max(maxDelay, delay);

      setTimeout(() => {
          button.style.opacity = '0';
          button.style.visibility = 'hidden';
      }, delay);
  });

  // Start fading out the container after the last button has started fading
  setTimeout(() => {
      arrowElement.classList.remove('show');
      arrowElement.addEventListener('transitionend', function onTransitionEnd(e) {
          if (e.propertyName === 'opacity') {
              buttons.forEach(btn => {
                  btn.style.opacity = '';
                  btn.style.visibility = '';
              });
              arrowElement.removeEventListener('transitionend', onTransitionEnd);
          }
      });
  }, maxDelay + 200); // Add 300ms to ensure buttons have started fading
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

// Function to update calculator value
function updateCalculatorValue(increment) {
  let currentValue = parseInt(calculatorValue.textContent);
  calculatorValue.textContent = currentValue + increment;
}

// Add click events for double and triple buttons
doubleLeftButton.addEventListener('click', () => updateCalculatorValue(-10));
tripleLeftButton.addEventListener('click', () => updateCalculatorValue(-100));
doubleRightButton.addEventListener('click', () => updateCalculatorValue(10));
tripleRightButton.addEventListener('click', () => updateCalculatorValue(100));

// ----------------------------------------------------------MICROPHONE--------------------------------------------------------//
const slider = document.querySelector('.price-slider');
const microphone = document.querySelector('.microphone');
const totalPrice = document.querySelector('.price-display-box h1');
const glowElement = document.querySelector('.microphone-glow');
const priceCounters = document.querySelectorAll('.price-top .price-counter');
const priceCountersPercent = document.querySelectorAll('.price-bottom .price-counter-percent');
const activePriceCounter = document.querySelector('.microphone .price-counter-active');
const activePriceCounterPercent = document.querySelector('.microphone .price-counter-active:last-child');
const calculatorInput = document.querySelector('.calculator-value input');
const styles = `
.microphone, .microphone-glow {
    transition: none;
}

.microphone.smooth-transition, .microphone-glow.smooth-transition {
    transition: left 0.2s ease-out, top 0.2s ease-out;
}
.price-counter, .price-counter-percent {
    transition: transform 0.2s ease-out;
}
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

let SLIDER_WIDTH = 1120; // Default width, will be updated based on window size
let SLIDER_HEIGHT = 0; // Will be used for the rotated slider
let isRotated = false; // Flag to check if the slider is rotated

const PRICE_RANGES = [
    { max: 1000, price: 5, widthPercentage: 23.8, discount: 0 },
    { max: 10000, price: 4, widthPercentage: 25.6, discount: 20 },
    { max: 50000, price: 3, widthPercentage: 25.8, discount: 40 },
    { max: 100000, price: 2, widthPercentage: 24.8, discount: 60 }
];



function updateSliderDimensions() {
    const windowWidth = window.innerWidth;
    if (windowWidth >= 1120) {
        SLIDER_WIDTH = 1120;
        isRotated = false;
    } else if (windowWidth >= 1000) {
        SLIDER_WIDTH = 850;
        isRotated = false;
    } else if (windowWidth >= 700) {
        SLIDER_WIDTH = 620;
        isRotated = false;
    } else if (windowWidth >= 480) {
        SLIDER_WIDTH = 450;
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

function updatePositions(position, smooth = false) {
    if (glowElement) {
        glowElement.classList.toggle('smooth-transition', smooth);
        glowElement.style.left = `${position}px`;
        glowElement.style.top = '50%';
    }
    
    if (microphone) {
        microphone.classList.toggle('smooth-transition', smooth);
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

function calculateDiscount(minutes) {
    for (let range of PRICE_RANGES) {
        if (minutes <= range.max) {
            return range.discount;
        }
    }
    return PRICE_RANGES[PRICE_RANGES.length - 1].discount;
}


let lastActiveIndex = -1;
let activatedIndices = [];

function updateDisplay(minutes, smooth = false) {
    minutes = Math.max(0, Math.min(minutes, 100000));
    if (calculatorInput) {
        calculatorInput.value = minutes;
        resizeInput.call(calculatorInput);
    }
    
    const currentRange = PRICE_RANGES.find(range => minutes <= range.max) || PRICE_RANGES[PRICE_RANGES.length - 1];
    const price = currentRange.price;
    const discount = currentRange.discount;

    if (totalPrice) {
        const formattedPrice = (price * minutes).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        totalPrice.textContent = formattedPrice;
    }

    const position = calculatePosition(minutes);
    updatePositions(position, smooth);

    if (activePriceCounter) {
        activePriceCounter.textContent = price + '₽';
    }
    if (activePriceCounterPercent) {
        activePriceCounterPercent.textContent = discount ? `-${discount}%` : '';
    }
}
    
function moveMicrophone(e, smooth = false) {
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
    updateDisplay(minutes, smooth);
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

function moveMicrophone(e, smooth = false) {
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
    
    // Directly update microphone position for instant movement
    updatePositions(position, smooth);
    
    const minutes = calculateMinutes(position);
    updateDisplay(minutes, smooth);
}

if (microphone) {
    microphone.addEventListener('mousedown', (e) => {
        e.preventDefault();
        
        function onMouseMove(e) {
            moveMicrophone(e, false);  // No smooth transition during drag
        }
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', onMouseMove);
        }, { once: true });
    });
}

if (slider) {
    slider.addEventListener('click', (e) => {
        moveMicrophone(e, true);  // Smooth transition on direct slider click
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

function handleInputChange(e) {
    let minutes = parseInt(e.target.value, 10);
    if (isNaN(minutes) || minutes < 1) {
        minutes = 1;
    } else if (minutes > 100000) {
        minutes = 100000;
    }
    updateDisplay(minutes);
}

// Add event listener for the input field
if (calculatorInput) {
    calculatorInput.addEventListener('input', handleInputChange);
    calculatorInput.addEventListener('blur', function() {
        this.value = Math.max(1, Math.min(parseInt(this.value, 10) || 1, 100000));
    });
}
// Initialize
updateSliderDimensions();
function animateDisplay() {
    const phases = [
      { start: 30000, end: 10000, duration: 400 },
      { start: 10000, end: 1000, duration: 1000 },
      { start: 1000, end: 0, duration: 1000 }
    ];
    
    const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);
    let startTime;
  
    function update(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      
      if (elapsedTime >= totalDuration) {
        updateDisplay(phases[phases.length - 1].end);
        return;
      }
  
      let currentTime = 0;
      for (let i = 0; i < phases.length; i++) {
        const phase = phases[i];
        if (elapsedTime < currentTime + phase.duration) {
          const phaseProgress = (elapsedTime - currentTime) / phase.duration;
          const currentValue = Math.round(phase.start + (phase.end - phase.start) * phaseProgress);
          updateDisplay(currentValue);
          break;
        }
        currentTime += phase.duration;
      }
  
      requestAnimationFrame(update);
    }
  
    requestAnimationFrame(update);
  }
  
  // Usage
  animateDisplay();

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


  // ------------------------------------- RESIZE INPUT------------------------------------------------//

calculatorInput.addEventListener('input', resizeInput); 
resizeInput.call(calculatorInput); 

function resizeInput() {
  if (this.value.length === 1 ) {
    this.style.width = 1.5 + "ch";
  } else {
    this.style.width = this.value.length + "ch";
  }
}

//------------------------------------------LADDER NAV ------------------------------------------------//
document.querySelectorAll('.payment-navigation-btn').forEach((btn) => {
    const text = btn.textContent.trim();
    const wordSpan = btn.querySelector('.word');
    const cloneSpan = btn.querySelector('.word-clone');
    wordSpan.textContent = '';
    cloneSpan.textContent = '';
    
    text.split('').forEach((char, charIndex) => {
        const letterSpan = document.createElement('span');
        letterSpan.textContent = char;
        letterSpan.className = char === ' ' ? 'space' : 'letter';
        letterSpan.style.transitionDelay = `${charIndex * 30}ms`;
        
        const cloneLetterSpan = letterSpan.cloneNode(true);
        
        wordSpan.appendChild(letterSpan);
        cloneSpan.appendChild(cloneLetterSpan);
    });
});

//--------------------------------------------CALCULATOR BOX ANIMATION -----------------------------------//
document.addEventListener('DOMContentLoaded', function() {
    const calculatorBox = document.querySelector('.calculator-box');
    const buyButton = document.querySelector('.buy-button');
  
    // Initially hide both elements
    calculatorBox.style.opacity = '0';
    buyButton.style.opacity = '0';
  
    // Show calculator box after 1 second
    setTimeout(function() {
      calculatorBox.style.transition = 'opacity 0.5s ease-in';
      calculatorBox.style.opacity = '1';
    }, 800);
  
    // Show buy button after 1.5 seconds
    setTimeout(function() {
      buyButton.style.transition = 'opacity 0.5s ease-in';
      buyButton.style.opacity = '1';
    }, 1500);
  });