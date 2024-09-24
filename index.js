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

// ----------------------------------------------------------MICROPHONE--------------------------------------------------------//
const slider = document.querySelector('.price-slider');
const microphone = document.querySelector('.microphone');
const totalPrice = document.querySelector('.price-display-box h1');
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

let SLIDER_WIDTH = 1124; // Default width, will be updated based on window size
let SLIDER_HEIGHT = 0; // Will be used for the rotated slider
let isRotated = false; // Flag to check if the slider is rotated

const PRICE_RANGES = [
    { max: 1000, price: 5, widthPercentage: 23.8, discount: 0 },
    { max: 10000, price: 4, widthPercentage: 25.6, discount: 20 },
    { max: 50000, price: 3, widthPercentage: 26.2, discount: 40 },
    { max: 100000, price: 2, widthPercentage: 24.4, discount: 60 }
];

function updateSliderDimensions() {
  const windowWidth = window.innerWidth;
  if (windowWidth >= 1001) {
      SLIDER_WIDTH = 1124;
      isRotated = false;
  } else if (windowWidth <= 1000 && windowWidth > 700) {
      SLIDER_WIDTH = 800; // Adjust this value as needed
      isRotated = false;
  } else if (windowWidth <= 700 && windowWidth > 480) {
      SLIDER_WIDTH = 620; // Adjust this value as needed
      isRotated = false;
  } else if (windowWidth <= 480 && windowWidth > 360) {
      SLIDER_WIDTH = 440; // Adjust this value as needed
      isRotated = false;
  } else {
      SLIDER_WIDTH = 310;
      SLIDER_HEIGHT = 460;
      isRotated = true;
  }

  // Recalculate widths for each range
  let totalPercentage = PRICE_RANGES.reduce((sum, range) => sum + range.widthPercentage, 0);
  PRICE_RANGES.forEach(range => {
      range.width = (range.widthPercentage / totalPercentage) * SLIDER_WIDTH;
  });
}

function updatePositions(position, smooth = false) {

    
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
          const prevMax = accumulatedWidth > 0 ? PRICE_RANGES[PRICE_RANGES.indexOf(range) - 1].max : 0;
          return Math.round(prevMax + (range.max - prevMax) * rangePercentage);
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
  let currentMinutes = parseInt(calculatorInput.value, 10);
  currentMinutes += changeAmount;
  currentMinutes = Math.max(0, Math.min(currentMinutes, 100000));
  updateDisplay(currentMinutes, true);
}

document.querySelectorAll('.image-container').forEach(container => {
  const images = container.querySelectorAll('img');
  
  container.addEventListener('mouseenter', () => {
    images[0].classList.add('hide');
    images[1].classList.remove('hide');
  });

  container.addEventListener('mouseleave', () => {
    images[0].classList.remove('hide');
    images[1].classList.add('hide');
  });
});

// Keep your existing code
const leftArrow = document.querySelector('.change-price-left');
const rightArrow = document.querySelector('.change-price-right');

let intervalId = null;
let timeoutId = null;
const updateInterval = 100; // 10 times per second
const holdDelay = 500; // 0.5 seconds
const updateAmount = 1;

function startUpdating(amount) {
    if (intervalId === null) {
        intervalId = setInterval(() => {
            updateCalculatorValue(amount);
        }, updateInterval);
    }
}

function stopUpdating() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
    if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
}

function handleMouseDown(amount) {
    // Immediate update on mouse down
    updateCalculatorValue(amount);
    
    timeoutId = setTimeout(() => {
        startUpdating(amount);
    }, holdDelay);
}

function handleMouseUp() {
    stopUpdating();
}

if (leftArrow) {
    leftArrow.addEventListener('mousedown', () => handleMouseDown(-updateAmount));
    leftArrow.addEventListener('mouseup', handleMouseUp);
    leftArrow.addEventListener('mouseleave', handleMouseUp);
}

if (rightArrow) {
    rightArrow.addEventListener('mousedown', () => handleMouseDown(updateAmount));
    rightArrow.addEventListener('mouseup', handleMouseUp);
    rightArrow.addEventListener('mouseleave', handleMouseUp);
}

// Prevent text selection during rapid clicking
leftArrow.addEventListener('selectstart', (e) => e.preventDefault());
rightArrow.addEventListener('selectstart', (e) => e.preventDefault());

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
        this.value = Math.max(0, Math.min(parseInt(this.value, 10) || 0, 100000));
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

function resizeInput(totalPrice) {
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

  function createSliderOverlay() {
    const sliderBlock = document.querySelector('.price-slider-block');
    const slider = document.querySelector('.price-slider');
    const overlay = document.createElement('div');
    overlay.className = 'slider-overlay';
    
    // Style the overlay
    overlay.style.position = 'absolute';
    overlay.style.top = '-20%';
    overlay.style.left = '-35px';  // Align with the slider
    overlay.style.width = 'calc(100% + 70px)';  // Extend width to match slider
    overlay.style.height = '140%';
    overlay.style.zIndex = '0';  // Ensure it's above other elements
    overlay.style.cursor = 'default';  // Keep the default cursor
    overlay.style.pointerEvents = 'none';  // Disable pointer events by default

    sliderBlock.style.position = 'relative';
    sliderBlock.appendChild(overlay);

    let isScrolling = false;
    let scrollTimeout;

    sliderBlock.addEventListener('mouseenter', () => {
        overlay.style.pointerEvents = 'auto';  // Enable pointer events on hover
    });

    sliderBlock.addEventListener('mouseleave', () => {
        overlay.style.pointerEvents = 'none';  // Disable pointer events when not hovering
    });

    overlay.addEventListener('wheel', (e) => {
        e.preventDefault();

        if (!isScrolling) {
            microphone.classList.remove('smooth-transition');
        }

        isScrolling = true;
        clearTimeout(scrollTimeout);

        const deltaY = e.deltaY;
        const currentPosition = -(parseFloat(microphone.style.left)) || 0;
        const newPosition = -(currentPosition + deltaY * 0.028);
        // Ensure the new position is within bounds
        const boundedPosition = Math.max(0, Math.min(newPosition, SLIDER_WIDTH));

        updatePositions(boundedPosition, false);
        const minutes = calculateMinutes(boundedPosition);
        updateDisplay(minutes, false);

        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            microphone.classList.add('smooth-transition');
        }, 150);
    });

    slider.addEventListener('wheel', (e) => {
      e.preventDefault();

      if (!isScrolling) {
          microphone.classList.remove('smooth-transition');
      }

      isScrolling = true;
      clearTimeout(scrollTimeout);

      const deltaY = e.deltaY;
      const currentPosition = -(parseFloat(microphone.style.left)) || 0;
      const newPosition = -(currentPosition + deltaY * 0.028);

      // Ensure the new position is within bounds
      const boundedPosition = Math.max(0, Math.min(newPosition, SLIDER_WIDTH));

      updatePositions(boundedPosition, false);
      const minutes = calculateMinutes(boundedPosition);
      updateDisplay(minutes, false);

      scrollTimeout = setTimeout(() => {
          isScrolling = false;
          microphone.classList.add('smooth-transition');
      }, 150);
  });
  
  calculatorInput.addEventListener('wheel', (e) => {
    e.preventDefault();

    if (!isScrolling) {
        microphone.classList.remove('smooth-transition');
    }

    isScrolling = true;
    clearTimeout(scrollTimeout);

    const deltaY = e.deltaY;
    const currentPosition = -(parseFloat(microphone.style.left)) || 0;
    const newPosition = -(currentPosition + deltaY * 0.028);

    // Ensure the new position is within bounds
    const boundedPosition = Math.max(0, Math.min(newPosition, SLIDER_WIDTH));

    updatePositions(boundedPosition, false);
    const minutes = calculateMinutes(boundedPosition);
    updateDisplay(minutes, false);

    scrollTimeout = setTimeout(() => {
        isScrolling = false;
        microphone.classList.add('smooth-transition');
    }, 150);
});
}

// Call this function after your existing initialization code
createSliderOverlay();