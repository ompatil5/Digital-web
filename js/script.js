/**
 * DIGITAL RENUKA - VANILLA JAVASCRIPT INTERACTIONS & FORM VALIDATION
 * Pure Vanilla JS, zero external dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. NAVBAR SCROLL STATE & MOBILE TOGGLER
  // --------------------------------------------------------------------------
  const navbar = document.querySelector('.navbar-custom');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  const navbarToggler = document.querySelector('.navbar-toggler-custom');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    }, { passive: true });
  }

  // Handle Navbar Link Clicks in Mobile View
  if (navbarCollapse && navbarToggler) {
    const navLinks = navbarCollapse.querySelectorAll('.nav-link, .btn');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 2. INTERSECTION OBSERVER FOR SCROLL REVEALS
  // --------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // If reduced motion or no IntersectionObserver support, show all immediately
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      el.classList.add('is-revealed');
    });
  }

  // --------------------------------------------------------------------------
  // 3. CONSULTATION FORM VALIDATION & SUCCESS STATE
  // --------------------------------------------------------------------------
  const consultationForm = document.getElementById('consultationForm');
  const formSuccessBanner = document.getElementById('formSuccessBanner');

  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();

      let isValid = true;

      // Fields to validate
      const firstNameInput = document.getElementById('firstName');
      const lastNameInput = document.getElementById('lastName');
      const emailInput = document.getElementById('emailAddress');
      const phoneInput = document.getElementById('phoneNumber');
      const serviceSelect = document.getElementById('serviceSelect');

      // 1. First Name Validation
      if (firstNameInput) {
        if (!firstNameInput.value.trim()) {
          setError(firstNameInput);
          isValid = false;
        } else {
          clearError(firstNameInput);
        }
      }

      // 2. Last Name Validation
      if (lastNameInput) {
        if (!lastNameInput.value.trim()) {
          setError(lastNameInput);
          isValid = false;
        } else {
          clearError(lastNameInput);
        }
      }

      // 3. Email Validation
      if (emailInput) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
          setError(emailInput);
          isValid = false;
        } else {
          clearError(emailInput);
        }
      }

      // 4. Phone Validation (Required digits check)
      if (phoneInput) {
        const phoneDigits = phoneInput.value.trim().replace(/\D/g, '');
        if (!phoneInput.value.trim() || phoneDigits.length < 8) {
          setError(phoneInput);
          isValid = false;
        } else {
          clearError(phoneInput);
        }
      }

      // 5. Service Selection Validation
      if (serviceSelect) {
        if (!serviceSelect.value || serviceSelect.value === '') {
          setError(serviceSelect);
          isValid = false;
        } else {
          clearError(serviceSelect);
        }
      }

      // Handle Successful Submission via Web3Forms API
      if (isValid) {
        const submitBtn = consultationForm.querySelector('button[type="submit"]');
        const originalBtnHTML = submitBtn ? submitBtn.innerHTML : 'Submit Consultation Request';

        // Disable submit button while request is in flight
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Sending... <span class="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>';
        }

        const formData = new FormData(consultationForm);

        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        })
        .then(async (response) => {
          let result;
          try {
            result = await response.json();
          } catch (err) {
            result = null;
          }

          if (result && result.success === true) {
            // Hide form and show #formSuccessBanner on successful submission
            if (formSuccessBanner) {
              consultationForm.style.display = 'none';
              formSuccessBanner.classList.add('active');
              formSuccessBanner.focus();
            }
          } else {
            const errorMsg = (result && result.message) ? result.message : 'Submission failed. Please check your details and try again.';
            alert(errorMsg + '\n\nAlternatively, you can contact Digital Renuka directly via WhatsApp (+91 98679 59566): https://wa.me/919867959566');
          }
        })
        .catch((error) => {
          console.error('Web3Forms Submission Error:', error);
          alert('A network error occurred while sending your request. Please try again or contact Digital Renuka directly via WhatsApp (+91 98679 59566): https://wa.me/919867959566');
        })
        .finally(() => {
          // Re-enable submit button if form is still visible
          if (submitBtn && consultationForm.style.display !== 'none') {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
          }
        });
      }
    });

    // Real-time error clearing on input change
    const inputs = consultationForm.querySelectorAll('.form-control-editorial');
    inputs.forEach(input => {
      input.addEventListener('input', () => clearError(input));
      input.addEventListener('change', () => clearError(input));
    });
  }

  function setError(element) {
    element.classList.add('is-invalid');
  }

  function clearError(element) {
    element.classList.remove('is-invalid');
  }

  // --------------------------------------------------------------------------
  // 4. BACK TO TOP BUTTON
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
