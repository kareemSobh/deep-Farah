document.addEventListener("DOMContentLoaded", function () {
  const cover = document.getElementById("cover");
  const invitation = document.getElementById("invitation");
  const openButton = document.getElementById("openInvitation");

  const weddingMusic = document.getElementById("weddingMusic");
  const musicButton = document.getElementById("musicButton");
  const musicIcon = document.getElementById("musicIcon");

  /*
     Deeb & Farah — 4 November 2026, 6:00 PM Egypt local time.
     Egypt is on EET (UTC+02:00) in November (summer time ends in October),
     so the offset below is +02:00.
  */
  const weddingDate = new Date("2026-11-04T18:00:00+02:00");

  /* =========================
     Reset to first page
  ========================= */

function resetToCover() {
  if (cover) {
    cover.style.display = "";
    cover.classList.remove("hidden");
  }

  if (invitation) {
    invitation.classList.add("hidden");
  }

  if (weddingMusic) {
    weddingMusic.pause();

    try {
      weddingMusic.currentTime = 0;
    } catch (error) {
      console.log("Music is not loaded yet.");
    }
  }

  if (musicIcon) {
    musicIcon.textContent = "▶";
  }

  if (musicButton) {
    musicButton.classList.remove("music-playing");
    musicButton.setAttribute(
      "aria-label",
      "Play wedding music"
    );
  }

  requestAnimationFrame(function () {
    window.scrollTo(0, 0);
  });
}

  /*
    بيرجّع شاشة البداية عند فتح الموقع،
    وكمان عند الرجوع إليه من WhatsApp أو الخريطة.
  */
  window.addEventListener("pageshow", resetToCover);

  /* =========================
     Music
  ========================= */

  if (weddingMusic) {
    weddingMusic.volume = 0.4;
  }

  async function playWeddingMusic() {
    if (!weddingMusic) {
      return;
    }

    try {
      await weddingMusic.play();
    } catch (error) {
      console.error("Music couldn't play:", error);
      console.error("Music URL:", weddingMusic.currentSrc);

      if (musicIcon) {
        musicIcon.textContent = "▶";
      }
    }
  }

  function pauseWeddingMusic() {
    if (!weddingMusic) {
      return;
    }

    weddingMusic.pause();
  }

  if (musicButton && weddingMusic) {
    musicButton.addEventListener("click", async function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (weddingMusic.paused) {
        await playWeddingMusic();
      } else {
        pauseWeddingMusic();
      }
    });

    weddingMusic.addEventListener("playing", function () {
      musicIcon.textContent = "❚❚";
      musicButton.classList.add("music-playing");

      musicButton.setAttribute(
        "aria-label",
        "Pause wedding music"
      );
    });

    weddingMusic.addEventListener("pause", function () {
      musicIcon.textContent = "▶";
      musicButton.classList.remove("music-playing");

      musicButton.setAttribute(
        "aria-label",
        "Play wedding music"
      );
    });

    weddingMusic.addEventListener("waiting", function () {
      musicIcon.textContent = "…";
    });

    weddingMusic.addEventListener("error", function () {
      musicIcon.textContent = "!";
      console.error("Audio loading error:", weddingMusic.error);
      console.error("Audio URL:", weddingMusic.currentSrc);
    });
  }

  /* =========================
     Open invitation
  ========================= */

  if (openButton && cover && invitation) {
    openButton.addEventListener("click", async function () {
    cover.classList.add("hidden");
    cover.style.display = "none";

    invitation.classList.remove("hidden");

    document
      .querySelectorAll(".reveal-on-scroll")
      .forEach(function (section) {
        section.classList.add("visible");
      });

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });

    await playWeddingMusic();
  });
  }

  /* =========================
     Countdown
  ========================= */

  function updateCountdown() {
    const difference = weddingDate.getTime() - Date.now();

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    if (
      !daysElement ||
      !hoursElement ||
      !minutesElement ||
      !secondsElement
    ) {
      return;
    }

    if (difference <= 0) {
      daysElement.textContent = "00";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";
      return;
    }

    const days = Math.floor(difference / 86400000);
    const hours = Math.floor(
      (difference / 3600000) % 24
    );
    const minutes = Math.floor(
      (difference / 60000) % 60
    );
    const seconds = Math.floor(
      (difference / 1000) % 60
    );

    daysElement.textContent = String(days).padStart(2, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* =========================
     RSVP
  ========================= */

  /*
     RSVP endpoint — Deeb & Farah.

     IMPORTANT: this invitation must NOT submit to any endpoint that belongs
     to another couple. The previous owner's Google Apps Script URL has been
     removed deliberately and must never be restored here.

     Deeb & Farah need their OWN Google Apps Script web app (bound to their
     own Google Sheet). Once it is deployed, paste its /exec URL below and
     RSVP submissions will start being saved. While this is empty, the form
     stays fully usable but sends nothing anywhere.
  */
  const googleScriptUrl = "https://script.google.com/macros/s/AKfycbzQmHlDXO52Zx242ElutvEyTuNI_yHAjhJrWk99hHQs4D8Mexxza0-MwwtlsHp1hJdKjQ/exec";

  const rsvpForm = document.getElementById("rsvpForm");

  if (rsvpForm) {
    const submitButton = rsvpForm.querySelector(
      'button[type="submit"]'
    );

    rsvpForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const name = document
        .getElementById("guestName")
        .value
        .trim();

      const message = document
        .getElementById("guestMessage")
        .value
        .trim();

      submitButton.disabled = true;
      submitButton.textContent = "Sending...";

      try {
        if (googleScriptUrl) {
          await fetch(googleScriptUrl, {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "text/plain"
            },
            body: JSON.stringify({
              name: name,
              message: message
            })
          });
        } else {
          /*
            No RSVP endpoint is configured for Deeb & Farah yet, so the
            submission is intentionally not sent anywhere.
          */
          console.warn(
            "RSVP endpoint is not configured yet — this submission was not sent."
          );
        }

        alert(
          "Your Attendance Has Been Confirmed Successfully ❤️"
        );

        rsvpForm.reset();
      } catch (error) {
        console.error(error);
        alert("Something Went Wrong. Please Try Again.");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Confirm Attendance";
      }
    });
  }
});
