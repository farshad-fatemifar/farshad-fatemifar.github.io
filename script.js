/* =======================================================
       NAVBAR
    ======================================================== */

    const navbar =
      document.getElementById("navbar");

    window.addEventListener(
      "scroll",
      () => {

        if (
          window.scrollY > 30
        ) {

          navbar.classList.add(
            "scrolled"
          );

        } else {

          navbar.classList.remove(
            "scrolled"
          );

        }

      },
      {
        passive: true
      }
    );


    /* =======================================================
       MOBILE NAV TOGGLE
    ======================================================== */

    const navToggle =
      document.getElementById("navToggle");

    const navLinks =
      document.getElementById("navLinks");

    if (navToggle && navLinks) {

      navToggle.addEventListener(
        "click",
        () => {

          const isOpen =
            navLinks.classList.toggle("open");

          navToggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
          );

        }
      );

      navLinks.querySelectorAll("a").forEach(
        (link) => {

          link.addEventListener(
            "click",
            () => {

              navLinks.classList.remove("open");

              navToggle.setAttribute(
                "aria-expanded",
                "false"
              );

            }
          );

        }
      );

    }


    /* =======================================================
       SCROLL REVEAL
    ======================================================== */

    const revealElements =
      document.querySelectorAll(
        ".reveal"
      );

    const revealObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "visible"
                );

                revealObserver.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: 0.12
        }
      );


    revealElements.forEach(
      (element) => {

        revealObserver.observe(
          element
        );

      }
    );


    /* =======================================================
       VIDEO CONTROLS
    ======================================================== */

    const videoContainers =
      document.querySelectorAll(
        ".video-container"
      );


    videoContainers.forEach(
      (container) => {

        const video =
          container.querySelector(
            "video"
          );

        const playButton =
          container.querySelector(
            ".video-play"
          );

        const expandButton =
          container.querySelector(
            ".media-expand"
          );


        if (
          !video ||
          !playButton
        ) {
          return;
        }


        /*
          The inline video inside the card is ONLY ever
          used as a static preview (paused, first frame).
          It never plays inside the card — this avoids the
          bug where the card preview and the fullscreen
          lightbox could both end up playing audio at once.
          Any click — the play button, the expand button,
          or the video/poster itself — opens the fullscreen
          lightbox and plays the video there, with sound.
        */

        function openVideoFullscreen(event) {

          if (event) {
            event.stopPropagation();
          }

          const source =
            video.querySelector("source")
              ? video.querySelector("source").src
              : video.currentSrc;

          openLightbox(
            "video",
            source,
            true
          );

        }


        playButton.addEventListener(
          "click",
          openVideoFullscreen
        );

        video.addEventListener(
          "click",
          openVideoFullscreen
        );

        if (expandButton) {

          expandButton.addEventListener(
            "click",
            openVideoFullscreen
          );

        }

      }
    );


    /* =======================================================
       MEDIA SLIDERS (banner / poster / logo galleries)
    ======================================================== */

    const mediaSliders =
      document.querySelectorAll(".media-slider");

    mediaSliders.forEach(
      (slider) => {

        const track =
          slider.querySelector(".slider-track");

        const slides =
          Array.from(
            slider.querySelectorAll(".slider-slide")
          );

        const prevButton =
          slider.querySelector(".slider-prev");

        const nextButton =
          slider.querySelector(".slider-next");

        const dots =
          Array.from(
            slider.querySelectorAll(".slider-dot")
          );

        const counter =
          slider.querySelector(".slider-count");

        if (!track || slides.length === 0) {
          return;
        }

        let index = 0;

        function goTo(newIndex) {

          index =
            (newIndex + slides.length) % slides.length;

          track.style.transform =
            "translateX(-" + (index * 100) + "%)";

          dots.forEach(
            (dot, dotIndex) => {
              dot.classList.toggle(
                "active",
                dotIndex === index
              );
            }
          );

          if (counter) {
            counter.textContent =
              (index + 1) + " / " + slides.length;
          }

          /*
            Keep the fullscreen source in sync with
            whichever slide is currently showing.
          */

          const activeImage =
            slides[index].querySelector("img");

          if (activeImage) {
            slider.dataset.src = activeImage.src;
          }

        }

        if (prevButton) {
          prevButton.addEventListener(
            "click",
            (event) => {
              event.stopPropagation();
              goTo(index - 1);
            }
          );
        }

        if (nextButton) {
          nextButton.addEventListener(
            "click",
            (event) => {
              event.stopPropagation();
              goTo(index + 1);
            }
          );
        }

        dots.forEach(
          (dot, dotIndex) => {
            dot.addEventListener(
              "click",
              (event) => {
                event.stopPropagation();
                goTo(dotIndex);
              }
            );
          }
        );

        goTo(0);

      }
    );


    /* =======================================================
       IMAGE FULLSCREEN
    ======================================================== */

    const imageMedia =
      document.querySelectorAll(
        '[data-lightbox="image"]'
      );


    function isSliderControl(target) {

      return Boolean(
        target.closest(".slider-prev") ||
        target.closest(".slider-next") ||
        target.closest(".slider-dot")
      );

    }


    imageMedia.forEach(
      (media) => {

        const expandButton =
          media.querySelector(".media-expand");

        /*
          Clicking anywhere on the media (except the
          slider controls or the expand button itself,
          which has its own listener below) opens the
          fullscreen lightbox with whatever image is
          currently showing.
        */

        media.addEventListener(
          "click",
          (event) => {

            if (
              event.target.closest(".media-expand") ||
              isSliderControl(event.target)
            ) {
              return;
            }

            openLightbox(
              "image",
              media.dataset.src,
              false
            );

          }
        );

        /*
          The fullscreen button gets its own listener so it
          always works — including on mobile, where relying
          only on the parent click was unreliable.
        */

        if (expandButton) {

          expandButton.addEventListener(
            "click",
            (event) => {

              event.stopPropagation();

              openLightbox(
                "image",
                media.dataset.src,
                false
              );

            }
          );

        }

      }
    );


    /* =======================================================
       LIGHTBOX
    ======================================================== */

    const lightbox =
      document.getElementById(
        "lightbox"
      );

    const lightboxContent =
      document.getElementById(
        "lightboxContent"
      );

    const lightboxClose =
      document.getElementById(
        "lightboxClose"
      );


    function openLightbox(
      type,
      source,
      withSound
    ) {

      lightboxContent.innerHTML = "";


      if (
        type === "image"
      ) {

        const image =
          document.createElement(
            "img"
          );

        image.src = source;

        image.alt =
          "Portfolio artwork";

        lightboxContent.appendChild(
          image
        );

      }


      if (
        type === "video"
      ) {

        const video =
          document.createElement(
            "video"
          );

        video.src = source;

        video.controls = true;

        video.autoplay = true;

        video.loop = true;

        video.playsInline = true;

        video.muted = !withSound;

        video.setAttribute(
          "controlsList",
          "nodownload"
        );

        lightboxContent.appendChild(
          video
        );


        video.addEventListener(
          "loadedmetadata",
          () => {

            video.muted = false;

            video.play().catch(
              () => {}
            );

          }
        );

      }


      lightbox.classList.add(
        "active"
      );

      lightbox.setAttribute(
        "aria-hidden",
        "false"
      );

      document.body.classList.add(
        "lightbox-open"
      );

    }


    function closeLightbox() {

      const video =
        lightboxContent.querySelector(
          "video"
        );

      if (video) {

        video.pause();

      }

      lightboxContent.innerHTML = "";

      lightbox.classList.remove(
        "active"
      );

      lightbox.setAttribute(
        "aria-hidden",
        "true"
      );

      document.body.classList.remove(
        "lightbox-open"
      );

    }


    lightboxClose.addEventListener(
      "click",
      closeLightbox
    );


    lightbox.addEventListener(
      "click",
      (event) => {

        if (
          event.target === lightbox
        ) {

          closeLightbox();

        }

      }
    );


    document.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Escape" &&
          lightbox.classList.contains(
            "active"
          )
        ) {

          closeLightbox();

        }

      }
    );


    /* =======================================================
       IMAGE ERROR HANDLING
    ======================================================== */

    const images =
      document.querySelectorAll(
        "img"
      );


    images.forEach(
      (image) => {

        image.addEventListener(
          "error",
          () => {

            image.style.opacity =
              "0";

          }
        );

      }
    );

    /* =====================================================
   SOUND / MUSIC PLAYER
====================================================== */

const soundCards = document.querySelectorAll(".sound-card");

soundCards.forEach((card) => {

  const audio = card.querySelector(".sound-audio");
  const playButton = card.querySelector(".sound-play");
  const progress = card.querySelector(".sound-progress");
  const wave = card.querySelector(".sound-wave");
  const currentTime = card.querySelector(".sound-current");
  const duration = card.querySelector(".sound-duration");


  /* FORMAT TIME */

  function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
      return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(remainingSeconds).padStart(2, "0")
    );

  }


  /* PLAY / PAUSE */

  playButton.addEventListener("click", () => {

    if (audio.paused) {

      /*
       * Stop every other track
       */

      soundCards.forEach((otherCard) => {

        const otherAudio =
          otherCard.querySelector(".sound-audio");

        if (otherAudio !== audio) {

          otherAudio.pause();
          otherAudio.currentTime = 0;

          otherCard.classList.remove("is-playing");

          const otherProgress =
            otherCard.querySelector(".sound-progress");

          const otherCurrent =
            otherCard.querySelector(".sound-current");

          if (otherProgress) {
            otherProgress.value = 0;
          }

          if (otherCurrent) {
            otherCurrent.textContent = "00:00";
          }

        }

      });


      audio.play();

      card.classList.add("is-playing");

    } else {

      audio.pause();

      card.classList.remove("is-playing");

    }

  });


  /* METADATA */

  audio.addEventListener("loadedmetadata", () => {

    duration.textContent =
      formatTime(audio.duration);

  });


  /* TIME UPDATE */

  audio.addEventListener("timeupdate", () => {

    if (!audio.duration) {
      return;
    }

    const percentage =
      (audio.currentTime / audio.duration) * 100;

    progress.value = percentage;

    currentTime.textContent =
      formatTime(audio.currentTime);


    /*
     * Highlight played waveform
     */

    const bars =
      wave.querySelectorAll("span");

    const activeBars =
      Math.floor(
        (percentage / 100) * bars.length
      );

    bars.forEach((bar, index) => {

      if (index < activeBars) {

        bar.style.background =
          "#314d3b";

      } else {

        bar.style.background =
          "rgba(49, 77, 59, .22)";

      }

    });

  });


  /* PROGRESS CONTROL */

  progress.addEventListener("input", () => {

    if (!audio.duration) {
      return;
    }

    audio.currentTime =
      (progress.value / 100) *
      audio.duration;

  });


  /* WAVEFORM SEEK */

  wave.addEventListener("click", (event) => {

    if (!audio.duration) {
      return;
    }

    const rect =
      wave.getBoundingClientRect();

    const clickPosition =
      event.clientX - rect.left;

    const percentage =
      clickPosition / rect.width;

    audio.currentTime =
      percentage * audio.duration;

  });


  /* END */

  audio.addEventListener("ended", () => {

    card.classList.remove("is-playing");

    progress.value = 0;

    currentTime.textContent = "00:00";

    const bars =
      wave.querySelectorAll("span");

    bars.forEach((bar) => {

      bar.style.background =
        "rgba(49, 77, 59, .22)";

    });

  });


  /* ERROR */

  audio.addEventListener("error", () => {

    console.warn(
      "Unable to load audio:",
      audio.src
    );

  });

});
