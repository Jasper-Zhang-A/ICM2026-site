window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');

    if (!dropdown || !button) return;
    
    const shouldShow = !dropdown.classList.contains('show');
    dropdown.classList.toggle('show', shouldShow);
    button.classList.toggle('active', shouldShow);
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');

    if (!container || !dropdown || !button) return;
    
    if (!container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key !== 'Escape') return;

    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');

    if (!dropdown || !button) return;

    dropdown.classList.remove('show');
    button.classList.remove('active');
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button ? button.querySelector('.copy-text') : null;
    
    if (!bibtexElement) return;

    const textToCopy = bibtexElement.textContent || '';

    const setCopiedState = function() {
        if (!button || !copyText) return;

        button.classList.add('copied');
        copyText.textContent = 'Copied';

        setTimeout(function() {
            button.classList.remove('copied');
            copyText.textContent = 'Copy';
        }, 2000);
    };

    const fallbackCopy = function() {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.setAttribute('readonly', '');
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';

            document.body.appendChild(textArea);
            textArea.select();
            const ok = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (ok) setCopiedState();
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(textToCopy).then(function() {
            setCopiedState();
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            fallbackCopy();
        });
        return;
    }

    fallbackCopy();
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (!scrollButton) return;

    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    if (!('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(function(e) {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(function(video) {
        observer.observe(video);
    });
}

function initPage() {
    const options = {
        slidesToScroll: 1,
        slidesToShow: 1,
        loop: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
    };

    if (window.bulmaCarousel && typeof window.bulmaCarousel.attach === 'function') {
        window.bulmaCarousel.attach('.carousel', options);
    }

    if (window.bulmaSlider && typeof window.bulmaSlider.attach === 'function') {
        window.bulmaSlider.attach();
    }
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}
