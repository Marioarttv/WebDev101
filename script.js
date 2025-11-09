// Slide Navigation Script
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const slideCounter = document.getElementById('slideCounter');
const progressFill = document.getElementById('progressFill');

// Initialize
updateSlide();

// Event Listeners
prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
        changeSlide(currentSlide - 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) {
        changeSlide(currentSlide + 1);
    }
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (currentSlide > 0) {
            changeSlide(currentSlide - 1);
        }
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault(); // Prevent space from scrolling
        if (currentSlide < totalSlides - 1) {
            changeSlide(currentSlide + 1);
        }
    } else if (e.key === 'Home') {
        changeSlide(0);
    } else if (e.key === 'End') {
        changeSlide(totalSlides - 1);
    }
});

// Touch/Swipe Support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentSlide < totalSlides - 1) {
            // Swipe left - next slide
            changeSlide(currentSlide + 1);
        } else if (diff < 0 && currentSlide > 0) {
            // Swipe right - previous slide
            changeSlide(currentSlide - 1);
        }
    }
}

// Change Slide Function
function changeSlide(newSlide) {
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    slides[currentSlide].classList.add('prev');

    // Update current slide
    currentSlide = newSlide;

    // Add active class to new slide
    slides[currentSlide].classList.remove('prev');
    slides[currentSlide].classList.add('active');

    // Update UI
    updateSlide();

    // Scroll to top of new slide
    slides[currentSlide].scrollTop = 0;
}

// Update Slide UI
function updateSlide() {
    // Update counter
    slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;

    // Update progress bar
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    progressFill.style.width = `${progress}%`;

    // Update button states
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;

    // Update button text for last slide
    if (currentSlide === totalSlides - 1) {
        nextBtn.textContent = 'Ende';
    } else {
        nextBtn.textContent = 'Weiter →';
    }

    if (currentSlide === 0) {
        prevBtn.textContent = 'Start';
    } else {
        prevBtn.textContent = '← Zurück';
    }
}

// Presentation Mode (F key for fullscreen)
document.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
    }
});

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
            console.log('Fullscreen error:', err);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Print all slides (P key)
document.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P') {
        if (e.ctrlKey || e.metaKey) {
            // Allow normal print with Ctrl/Cmd+P
            return;
        }
        e.preventDefault();
        printPresentation();
    }
});

function printPresentation() {
    // Show all slides for printing
    const wasActive = [];
    slides.forEach((slide, index) => {
        wasActive[index] = slide.classList.contains('active');
        slide.classList.add('active');
        slide.style.position = 'relative';
        slide.style.opacity = '1';
        slide.style.transform = 'none';
        slide.style.pageBreakAfter = 'always';
    });

    // Hide navigation
    document.querySelector('.navigation').style.display = 'none';
    document.querySelector('.progress-bar').style.display = 'none';

    // Print
    window.print();

    // Restore
    slides.forEach((slide, index) => {
        if (!wasActive[index]) {
            slide.classList.remove('active');
        }
        slide.style.position = '';
        slide.style.opacity = '';
        slide.style.transform = '';
        slide.style.pageBreakAfter = '';
    });

    document.querySelector('.navigation').style.display = '';
    document.querySelector('.progress-bar').style.display = '';
}

// Overview Mode (O key) - Show all slides in grid
document.addEventListener('keydown', (e) => {
    if (e.key === 'o' || e.key === 'O') {
        toggleOverview();
    }
});

let overviewMode = false;

function toggleOverview() {
    const presentation = document.querySelector('.presentation');

    if (!overviewMode) {
        // Enter overview mode
        presentation.classList.add('overview-mode');
        slides.forEach((slide, index) => {
            slide.classList.add('active', 'overview-slide');
            slide.style.transform = `scale(0.25)`;
            slide.style.position = 'relative';
            slide.style.display = 'inline-block';
            slide.style.width = '25%';
            slide.style.margin = '10px';
            slide.style.cursor = 'pointer';

            // Add click listener
            slide.addEventListener('click', () => {
                toggleOverview();
                changeSlide(index);
            });
        });

        // Hide navigation temporarily
        document.querySelector('.navigation').style.display = 'none';

        overviewMode = true;
    } else {
        // Exit overview mode
        presentation.classList.remove('overview-mode');
        slides.forEach((slide, index) => {
            slide.classList.remove('overview-slide');
            if (index !== currentSlide) {
                slide.classList.remove('active');
            }
            slide.style.transform = '';
            slide.style.position = '';
            slide.style.display = '';
            slide.style.width = '';
            slide.style.margin = '';
            slide.style.cursor = '';
        });

        // Show navigation
        document.querySelector('.navigation').style.display = '';

        overviewMode = false;
    }
}

// Help Menu (H key or ?)
document.addEventListener('keydown', (e) => {
    if (e.key === 'h' || e.key === 'H' || e.key === '?') {
        showHelp();
    }
});

function showHelp() {
    const helpText = `
🎮 Keyboard Shortcuts:

→ / ↓ / Space  : Nächste Folie
← / ↑          : Vorherige Folie
Home           : Erste Folie
End            : Letzte Folie
F              : Vollbild an/aus
O              : Übersicht aller Folien
H / ?          : Diese Hilfe
Esc            : Übersicht schließen

💡 Tipp: Du kannst auch mit den Buttons unten oder durch Wischen (auf Touch-Geräten) navigieren!
    `;

    alert(helpText);
}

// Auto-save current slide position
window.addEventListener('beforeunload', () => {
    localStorage.setItem('webdev101-slide', currentSlide);
});

// Restore slide position on load
window.addEventListener('load', () => {
    const savedSlide = localStorage.getItem('webdev101-slide');
    if (savedSlide !== null) {
        const slideNum = parseInt(savedSlide, 10);
        if (slideNum > 0 && slideNum < totalSlides) {
            changeSlide(slideNum);
        }
    }
});

console.log('📊 WebDev101 Präsentation geladen!');
console.log('💡 Drücke "H" für Tastatur-Shortcuts');
