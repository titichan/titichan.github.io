
const modalTriggers = document.querySelectorAll('.gallery-item .button');
const modals = document.querySelectorAll('.modal');
const modalCloses = document.querySelectorAll('.modal .close');

modalTriggers.forEach(function(trigger, index) {
    trigger.addEventListener('click', function(e) {
        e.preventDefault();
        modals[index].style.display = 'block';
    });
});

modalCloses.forEach(function(close, index) {
    close.addEventListener('click', function() {
        modals[index].style.display = 'none';
    });
});

window.addEventListener('click', function(e) {
    modals.forEach(function(modal) {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });
});

const links = document.querySelectorAll('nav ul li a, .back-to-top');

for (const link of links) {
    link.addEventListener('click', clickHandler);
}

function clickHandler(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    const offsetTop = document.querySelector(href).offsetTop;

    scroll({
        top: offsetTop,
        behavior: 'smooth'
    });
}


const text = "titichan"; 
const typewriterElement = document.querySelector('.typewriter');
let index = 0;

function typeWriter() {
    if (index < text.length) {
        typewriterElement.textContent += text.charAt(index);
        index++;
        setTimeout(typeWriter, 200); 
    }
}

document.addEventListener('DOMContentLoaded', function() {
    typeWriter();
});

const texts = ["titichan"];
let textIndex = 0;
let charIndex = 0;

function typeWriter() {
    if (charIndex < texts[textIndex].length) {
        typewriterElement.textContent += texts[textIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 200);
    } else {
        setTimeout(eraseText, 7000); 
    }
}

function eraseText() {
    if (charIndex > 0) {
        typewriterElement.textContent = texts[textIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseText, 100);
    } else {
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(typeWriter, 500);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    typeWriter();
});


