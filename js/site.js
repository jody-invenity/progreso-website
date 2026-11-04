/* Progreso site settings. Fill these in to switch on the live services. */
var PROGRESO = {
  // Your calendar booking page, e.g. https://cal.com/yourname/discovery or a Calendly link.
  // While empty, "Book a call" buttons open a pre-written email instead.
  bookingUrl: '',
  // Form endpoint, e.g. https://formspree.io/f/xxxxxxx. While empty, the form opens a pre-filled email.
  formEndpoint: '',
  email: 'jody@progreso.consulting'
};

(function () {
  // Booking buttons
  var mail = 'mailto:' + PROGRESO.email + '?subject=' + encodeURIComponent('Discovery call');
  document.querySelectorAll('[data-book]').forEach(function (a) {
    if (PROGRESO.bookingUrl) {
      a.href = PROGRESO.bookingUrl; a.target = '_blank'; a.rel = 'noopener';
    } else {
      a.href = mail;
    }
  });

  // Copy buttons
  document.querySelectorAll('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.getAttribute('data-copy'), old = b.textContent;
      function done() { b.textContent = 'Copied'; setTimeout(function () { b.textContent = old; }, 1500); }
      function fallback() {
        var el = b.parentElement.querySelector('div span');
        if (el) { var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
        b.textContent = 'Selected'; setTimeout(function () { b.textContent = old; }, 1500);
      }
      try { navigator.clipboard.writeText(t).then(done, fallback); } catch (e) { fallback(); }
    });
  });

  // Close the mobile menu after choosing a link
  document.querySelectorAll('.menu-panel a').forEach(function (a) {
    a.addEventListener('click', function () { var d = a.closest('details'); if (d) d.open = false; });
  });

  // Enquiry form
  var form = document.querySelector('form.enquiry');
  if (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.website && form.website.value) return; // spam trap
      var d = new FormData(form);
      if (!PROGRESO.formEndpoint) {
        var body = 'Name: ' + d.get('name') + '\nBusiness: ' + d.get('business') + '\nPhone or email: ' + d.get('contact') + '\n\nBiggest challenge:\n' + d.get('challenge');
        location.href = 'mailto:' + PROGRESO.email + '?subject=' + encodeURIComponent('Website enquiry from ' + d.get('name')) + '&body=' + encodeURIComponent(body);
        status.textContent = 'Your email app should open with your message ready to send.';
        return;
      }
      status.textContent = 'Sending...';
      fetch(PROGRESO.formEndpoint, { method: 'POST', body: d, headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error();
          form.reset();
          status.textContent = 'Thank you. Your message has been sent and Jody will be in touch.';
        })
        .catch(function () {
          status.textContent = 'Something went wrong. Please email ' + PROGRESO.email + ' or WhatsApp 078 584 3558.';
        });
    });
  }
})();
