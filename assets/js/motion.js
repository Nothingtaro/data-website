(function () {
  "use strict";

  var motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduce = motionPreference.matches;
  var hasIO = "IntersectionObserver" in window;

  /* --- Scroll reveal ---------------------------------------------------
     Adds .is-visible to [data-reveal] elements as they enter view.
     Only ever hides content (js-reveal) once we know we can reveal it. */
  (function () {
    if (reduce || !hasIO) return;

    var targets = document.querySelectorAll("[data-reveal]");
    if (!targets.length) return;

    document.documentElement.classList.add("js-reveal");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  })();

  /* --- SQL query demo (home hero) --------------------------------------
     The static HTML is the completed query and result. Motion is added only
     when it is allowed, then runs once as the panel enters the viewport. */
  (function () {
    var demos = document.querySelectorAll("[data-sql-demo]");
    if (!demos.length || reduce || !hasIO) return;

    demos.forEach(function (demo) {
      var lines = Array.prototype.slice.call(demo.querySelectorAll("[data-sql-line]"));
      var rows = Array.prototype.slice.call(demo.querySelectorAll("[data-sql-row]"));
      var runButton = demo.querySelector("[data-sql-run]");
      var runLabel = demo.querySelector("[data-sql-run-label]");
      var status = demo.querySelector("[data-sql-status]");
      var meta = demo.querySelector("[data-sql-meta]");
      var empty = demo.querySelector("[data-sql-empty]");
      var announcer = demo.querySelector("[data-sql-announcer]");
      var timers = [];
      var started = false;
      var startRequested = false;

      if (!lines.length || !rows.length || !runButton || !status || !meta || !empty) return;

      function clearTimers() {
        timers.forEach(function (timer) { window.clearTimeout(timer); });
        timers = [];
      }

      function later(callback, delay) {
        timers.push(window.setTimeout(function () {
          try {
            callback();
          } catch (error) {
            finish(false);
          }
        }, delay));
      }

      function setState(state) {
        demo.setAttribute("data-state", state);
        demo.classList.remove("is-armed", "is-writing", "is-running", "is-revealing", "is-complete");
        demo.classList.add("is-" + state);
      }

      function setCopy(statusCopy, metaCopy, emptyCopy, buttonCopy) {
        status.textContent = statusCopy;
        meta.textContent = metaCopy;
        empty.textContent = emptyCopy;
        if (runLabel && buttonCopy) runLabel.textContent = buttonCopy;
      }

      function finish(announce) {
        clearTimers();
        lines.forEach(function (line) {
          line.classList.remove("is-current");
          line.classList.add("is-written");
        });
        rows.forEach(function (row) { row.classList.add("is-visible"); });
        setState("complete");
        setCopy("Query complete", "3 rows", "Waiting for query", "Run again");
        runButton.disabled = false;
        if (announce && announcer) announcer.textContent = "Query complete. Three sample rows returned.";
      }

      function play() {
        clearTimers();
        if (announcer) announcer.textContent = "";

        lines.forEach(function (line) {
          line.classList.remove("is-written", "is-current");
        });
        rows.forEach(function (row) { row.classList.remove("is-visible"); });

        setState("writing");
        setCopy("Writing query", "SQL editor", "Waiting for query", "Writing");
        runButton.disabled = true;

        // Force the reset to paint before the first clause is revealed.
        void demo.offsetWidth;

        var lead = 260;
        var cadence = 175;

        lines.forEach(function (line, index) {
          later(function () {
            if (index > 0) lines[index - 1].classList.remove("is-current");
            line.classList.add("is-written", "is-current");
          }, lead + (index * cadence));
        });

        var executeAt = lead + ((lines.length - 1) * cadence) + 280;

        later(function () {
          lines.forEach(function (line) { line.classList.remove("is-current"); });
          setState("running");
          setCopy("Running query", "analytics", "Running against analytics…", "Running");
        }, executeAt);

        later(function () {
          setState("revealing");
          setCopy("Query complete", "3 rows", "Waiting for query", "Running");

          rows.forEach(function (row, index) {
            later(function () { row.classList.add("is-visible"); }, index * 80);
          });

          later(function () { finish(true); }, (rows.length * 80) + 220);
        }, executeAt + 700);
      }

      function start() {
        if (started) return;
        startRequested = true;
        if (document.hidden) return;
        started = true;
        if (motionPreference.matches) {
          finish(false);
          runButton.hidden = true;
          return;
        }
        play();
      }

      demo.classList.add("is-enhanced");
      setState("armed");
      setCopy("Ready to run", "Sample output", "Waiting for query", "Run");
      runButton.hidden = false;
      runButton.disabled = true;
      runButton.addEventListener("click", play);

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            later(start, 280);
          }
        });
      }, { threshold: 0.35 });
      observer.observe(demo);

      function honorReducedMotion(event) {
        if (!event.matches) return;
        finish(false);
        runButton.hidden = true;
      }

      if (motionPreference.addEventListener) {
        motionPreference.addEventListener("change", honorReducedMotion);
      } else if (motionPreference.addListener) {
        motionPreference.addListener(honorReducedMotion);
      }

      document.addEventListener("visibilitychange", function () {
        var state = demo.getAttribute("data-state");
        if (document.hidden && state !== "armed" && state !== "complete") {
          finish(false);
        } else if (!document.hidden && state === "armed" && startRequested) {
          start();
        }
      });
    });
  })();
})();
