// Utility function to throttle events
function throttle(callback, limit) {
    let waiting = false;
    return function (...args) {
        if (!waiting) {
            callback.apply(this, args);
            waiting = true;
            setTimeout(() => (waiting = false), limit);
        }
    };
}

// Artist scrolling logic
function setupArtistScrolling() {
    const artists = document.querySelectorAll('.artist');
    const artist = document.querySelector('.artist');
    const artistSection = document.querySelector('#artists');
    let currentArtistIndex = 0;
    let isScrollingArtists = false;

    function showArtist(index) {
        artists.forEach((artist, i) => {
            if (i === index) {
                artist.classList.add('show');
            } else {
                artist.classList.remove('show');
            }
        });
    }

    function animateArtistTransition(index, direction) {
        const currentArtist = artists[currentArtistIndex];
        const nextArtist = artists[index];

        if (direction === 'next') {
            currentArtist.classList.add('exit-left');
            nextArtist.classList.add('enter-right');
        } else {
            currentArtist.classList.add('exit-right');
            nextArtist.classList.add('enter-left');
        }

        // Remove animation classes after the transition
        setTimeout(() => {
            currentArtist.classList.remove('exit-left', 'exit-right', 'show');
            nextArtist.classList.remove('enter-left', 'enter-right');
            nextArtist.classList.add('show');
        }, 600); // Match the CSS transition duration
    }

    function handleArtistScroll(event) {
        if (!isScrollingArtists) return;

        event.preventDefault(); // Prevent default scrolling behavior

        const delta = event.deltaY;

        if (delta > 0 && currentArtistIndex < artists.length - 1) {
            animateArtistTransition(currentArtistIndex + 1, 'next');
            currentArtistIndex++;
        } else if (delta < 0 && currentArtistIndex > 0) {
            animateArtistTransition(currentArtistIndex - 1, 'prev');
            currentArtistIndex--;
        }

        // Stop scrolling when reaching the first or last artist
        if (currentArtistIndex === 0 || currentArtistIndex === artists.length - 1) {
            isScrollingArtists = false;
            document.body.classList.remove('no-scroll');
        }
    }

    function handlePageScroll() {
        if (!artistSection) return;

        const artistSectionTop = artist.getBoundingClientRect().top;
        const artistSectionBottom = artist.getBoundingClientRect().bottom;

        if (artistSectionTop <= window.innerHeight / 2 && artistSectionBottom >= window.innerHeight / 2) {
            if (!isScrollingArtists) {
                isScrollingArtists = true;
                document.body.classList.add('no-scroll');
                showArtist(currentArtistIndex);
            }
        } else {
            isScrollingArtists = false;
            document.body.classList.remove('no-scroll');
        }
    }

    window.addEventListener('wheel', throttle(handleArtistScroll, 100), { passive: false });
    window.addEventListener('scroll', throttle(handlePageScroll, 100));
}

function setupHeaderVisibility() {
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY === 0) {
            // Cache le header uniquement si on est tout en haut de la page
            header.classList.remove('visible');
        } else {
            // Affiche le header dès qu'on commence à scroller
            header.classList.add('visible');
        }
    });
}

function setupLogoTransition() {
    const heroLogo = document.getElementById('hero-logo');
    const headerLogo = document.getElementById('header-logo');
    const headerYtLogo = document.getElementById('youtube-link-navbar');
    const hamburger = document.getElementById('hamburger');
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            // Ajoute la classe pour la transition
            document.body.classList.add('logo-transition');
        } else {
            // Retire la classe si on revient en haut
            document.body.classList.remove('logo-transition');
        }
    });

}

function setupAlbumCarousel() {
    const albums = document.querySelectorAll('.albums .album');
    let currentIndex = 0;

    function updateCarousel() {
        albums.forEach((album, index) => {
            album.classList.remove('active', 'next', 'prev');
            if (index === currentIndex) {
                album.classList.add('active');
            } else if (index === (currentIndex + 1) % albums.length) {
                album.classList.add('next');
            } else if (index === (currentIndex - 1 + albums.length) % albums.length) {
                album.classList.add('prev');
            }
        });
    }

    function showNextAlbum() {
        currentIndex = (currentIndex + 1) % albums.length;
        updateCarousel();
    }

    function showPrevAlbum() {
        currentIndex = (currentIndex - 1 + albums.length) % albums.length;
        updateCarousel();
    }

    // Initial update
    updateCarousel();

    // Add swipe functionality for mobile
    let startX = 0;
    let endX = 0;

    document.querySelector('.albums').addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    document.querySelector('.albums').addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        if (startX > endX + 50) {
            showNextAlbum();
        } else if (startX < endX - 50) {
            showPrevAlbum();
        }
    });
}

function setupParallaxEffect() {
    const parallaxText = document.querySelector('.parallax-text');
    let lastScrollPosition = 0;
    let ticking = false;

    function updateParallax() {
        const offset = -lastScrollPosition * 0.5; // Inversez le facteur pour que le texte monte
        parallaxText.style.transform = `translateY(${offset}px)`;
        ticking = false; // Permet de traiter le prochain frame
    }

    window.addEventListener('scroll', () => {
        lastScrollPosition = window.scrollY;

        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

function setupDrawerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const drawerMenu = document.querySelector('.drawer-navbar');
    const closeDrawer = document.querySelector('.close-drawer');

    // Ouvrir le menu drawer
    hamburger.addEventListener('click', () => {
        drawerMenu.classList.add('active');
    });

    // Fermer le menu drawer
    closeDrawer.addEventListener('click', () => {
        drawerMenu.classList.remove('active');
    });

    // Fermer le menu drawer en cliquant à l'extérieur
    window.addEventListener('click', (e) => {
        if (!drawerMenu.contains(e.target) && !hamburger.contains(e.target)) {
            drawerMenu.classList.remove('active');
        }
    });

    // Fermer le menu drawer quand on clique sur un lien
    drawerMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            drawerMenu.classList.remove('active');
        });
    });
}

function setupVideoCarrousel() {
    const videoPlayer = document.getElementById('video-player');
    const thumbnails = document.querySelectorAll('.thumbnails img');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    let currentIndex = 0;

    function updateVideo(index) {
        // Retirer la classe .active de toutes les miniatures
        thumbnails.forEach((thumbnail) => thumbnail.classList.remove('active'));

        // Ajouter la classe .active à la miniature sélectionnée
        const selectedThumbnail = thumbnails[index];
        selectedThumbnail.classList.add('active');

        // Mettre à jour la source de la vidéo
        videoPlayer.src = selectedThumbnail.getAttribute('data-video');
        currentIndex = index;


    }

    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => updateVideo(index));
    });

    prevButton.addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
        updateVideo(newIndex);
    });

    nextButton.addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % thumbnails.length;
        updateVideo(newIndex);
    });
}

function setupParallaxOnArtistImages() {
    const artistImages = document.querySelectorAll('.artist-image');
    const artistInfo = document.querySelectorAll('.artist-info');

    function updateParallax() {
        const isMobile = window.innerWidth <= 768;
        artistImages.forEach((img) => {
            const offset = window.scrollY * 0.1; // Ajustez le facteur pour un effet plus ou moins rapide
            img.style.transform = `translateY(-${offset}px)`;
        });
        artistInfo.forEach((img) => {
            const offset = window.scrollY * 0.1; // Ajustez le facteur pour un effet plus ou moins rapide
            if (isMobile) {
                img.style.transform = `translateY(-${offset}px)`; // Offset négatif supplémentaire sur mobile
            } else {
                img.style.transform = `translateY(${offset}px)`; // Comportement normal sur desktop
            }
        });
    }

    window.addEventListener('scroll', updateParallax);
}

function setupParallaxVideo() {
    const video = document.querySelector('.background-video');

    function updateParallax() {
        const scrollPosition = window.scrollY;
        const offset = scrollPosition * 0.8; // Ajustez le facteur pour un effet plus ou moins rapide
        video.style.transform = `translateY(${offset}px)`;
    }

    window.addEventListener('scroll', updateParallax);
}

function setupFormEventHandler() {
    document.getElementById('contact-form').addEventListener('submit', async function (e) {
        e.preventDefault();



        // Génère une question simple
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const answer = a + b;
        const user = prompt(`Vérification anti-robot : Combien font ${a} + ${b} ?`);
        if (user === null) return; // Annulé
        if (parseInt(user, 10) === answer) {
            // Envoie le formulaire
            const form = e.target;
            const data = new FormData(form);
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    alert('Votre message a bien été envoyé !');
                    form.reset();
                } else {
                    alert('Une erreur est survenue. Merci de réessayer.');
                }
            } catch (error) {
                alert('Une erreur est survenue. Merci de réessayer.');
            }
        } else {
            alert("Captcha incorrect. Veuillez réessayer.");
        }
    });
}


// Ouvre le lien YouTube dans l'app sur mobile, sinon dans un nouvel onglet
function setupYoutubeLinks() {
    function isMobile() {
        return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    function openYoutube(e, appUrl, webUrl) {
        if (isMobile()) {
            window.location = appUrl;
            setTimeout(function () {
                window.open(webUrl, '_blank', 'noopener');
            }, 500);
        } else {
            window.open(webUrl, '_blank', 'noopener');
        }
        e.preventDefault();
    }

    // Header
    const ytHeader = document.getElementById('youtube-link-navbar');
    if (ytHeader) {
        ytHeader.addEventListener('click', function (e) {
            openYoutube(
                e,
                'vnd.youtube://channel/UCc6StWzgPfV_317FjpJDg7g',
                'https://www.youtube.com/@docmartine5133'
            );
        });
    }

    // Drawer
    const ytDrawer = document.getElementById('youtube-link-drawer');
    if (ytDrawer) {
        ytDrawer.addEventListener('click', function (e) {
            openYoutube(
                e,
                'vnd.youtube://channel/UCc6StWzgPfV_317FjpJDg7g',
                'https://www.youtube.com/@docmartine5133'
            );
        });
    }

    // Section vidéos
    const ytSection = document.querySelector('.video-description .youtube-link');
    if (ytSection) {
        ytSection.addEventListener('click', function (e) {
            openYoutube(
                e,
                'vnd.youtube://channel/UCc6StWzgPfV_317FjpJDg7g',
                'https://www.youtube.com/@docmartine5133'
            );
        });
    }
}


// Initialize all features
function init() {
    // setupArtistScrolling();
    setupHeaderVisibility();
    setupLogoTransition();
    setupDrawerMenu();
    setupAlbumCarousel();
    setupVideoCarrousel();
    setupParallaxOnArtistImages();
    setupParallaxVideo();
    setupFormEventHandler();
    setupYoutubeLinks();
}

document.addEventListener('DOMContentLoaded', init);