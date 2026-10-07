/**
 * Stackly Aesthetics & Hair Studio - Global Premium Form Validation & State System
 * Handles:
 * 1. Premium live validation (real-time validation on blur/input)
 * 2. Login & Sign-up flow with role-based routing (Admin -> admin dashboard.html, Client -> user dashboard.html)
 * 3. Settings updates & state binding (name, email) in user/admin dashboards
 * 4. Allowed pages check in global click handler to navigate to 404.html properly
 * 5. Salon-themed success modal, toasts, and inline validation alerts
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject Premium Salon Validation CSS Styles Dynamically
    const style = document.createElement("style");
    style.textContent = `
        /* Live Validation Styling matching Salon Palette */
        .auth-input-wrapper input.is-valid,
        .form-group input.is-valid,
        .form-group-input input.is-valid,
        .form-group-input textarea.is-valid,
        .input-icon-wrapper input.is-valid,
        .input-icon-wrapper select.is-valid,
        input.is-valid,
        select.is-valid,
        textarea.is-valid,
        .auth-input.input-success,
        .form-input.input-success {
            border-color: #4f5945 !important; /* Salon olive green */
            background-color: rgba(79, 89, 69, 0.05) !important;
            box-shadow: 0 0 0 3px rgba(79, 89, 69, 0.15) !important;
        }

        .auth-input-wrapper input.is-invalid,
        .form-group input.is-invalid,
        .form-group-input input.is-invalid,
        .form-group-input textarea.is-invalid,
        .input-icon-wrapper input.is-invalid,
        .input-icon-wrapper select.is-invalid,
        input.is-invalid,
        select.is-invalid,
        textarea.is-invalid,
        .auth-input.input-error,
        .form-input.input-error {
            border-color: #ef4444 !important; /* Elegant warning red */
            background-color: rgba(239, 68, 68, 0.04) !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12) !important;
        }

        /* Error Label styling */
        .validation-error {
            display: block;
            font-size: 11px;
            font-weight: 600;
            color: #ef4444;
            margin-top: 6px;
            opacity: 0;
            max-height: 0;
            overflow: hidden;
            transform: translateY(-5px);
            transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
            pointer-events: none;
            text-align: left;
            width: 100%;
            word-break: break-word;
            box-sizing: border-box;
            clear: both;
        }

        /* Shake animation for invalid fields */
        @keyframes fieldShake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-6px); }
            40%, 80% { transform: translateX(6px); }
        }

        .is-invalid-shake {
            animation: fieldShake 0.4s ease-in-out;
        }

        /* Salon Success Modal Overlay */
        .success-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100vh;
            background: rgba(20, 20, 20, 0.92);
            backdrop-filter: blur(12px);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.4s ease;
        }

        .success-overlay.is-active {
            opacity: 1;
            pointer-events: all;
        }

        .success-card {
            background: #f4f3ed;
            color: #141414;
            width: 90%;
            max-width: 440px;
            padding: 3rem 2.2rem;
            border-radius: 24px;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(79, 89, 69, 0.2);
            transform: scale(0.85);
            transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .success-overlay.is-active .success-card {
            transform: scale(1);
        }

        .success-icon-wrap {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: rgba(79, 89, 69, 0.12);
            color: #4f5945;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
        }

        .success-icon-wrap svg {
            width: 36px;
            height: 36px;
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            transition: stroke-dashoffset 0.8s ease 0.2s;
        }

        .success-overlay.is-active svg {
            stroke-dashoffset: 0;
        }

        .success-card h3 {
            font-family: 'Playfair Display', serif;
            font-size: 1.65rem;
            font-weight: 600;
            color: #141414;
            margin-bottom: 0.75rem;
        }

        .success-card p {
            font-family: 'Inter', sans-serif;
            color: #555555;
            font-size: 0.9rem;
            line-height: 1.6;
            margin-bottom: 1.75rem;
        }

        .success-close-btn {
            background: #4f5945;
            color: #f4f3ed;
            border: none;
            padding: 0.85rem 2rem;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: 0.85rem;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            border-radius: 9999px;
            cursor: pointer;
            transition: all 0.2s ease;
            width: 100%;
        }

        .success-close-btn:hover {
            background: #3c4434;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(79, 89, 69, 0.3);
        }

        /* Toast notification */
        .premium-toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #141414;
            color: #f4f3ed;
            border: 1px solid rgba(79, 89, 69, 0.4);
            padding: 16px 24px;
            border-radius: 14px;
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: none;
        }

        .premium-toast.show {
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
        }

        .premium-toast-icon {
            color: #a3a99e;
            font-size: 16px;
            display: inline-flex;
            align-items: center;
        }
    `;
    document.head.appendChild(style);

    // 2. Build Modal Overlay elements dynamically in DOM
    const genericOverlay = document.createElement("div");
    genericOverlay.className = "success-overlay";
    genericOverlay.id = "stackly-success-overlay";
    genericOverlay.innerHTML = `
        <div class="success-card">
            <div class="success-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <h3 id="overlay-title">Action Successful</h3>
            <p id="overlay-message">Your consultation details have been recorded.</p>
            <button class="success-close-btn" id="overlay-close-btn">Continue</button>
        </div>
    `;
    document.body.appendChild(genericOverlay);

    const closeBtn = document.getElementById("overlay-close-btn");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            genericOverlay.classList.remove("is-active");
            document.body.style.overflow = "";
            const redirectUrl = genericOverlay.dataset.redirect;
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        });
    }

    // Function to show success modal
    const showSuccessModal = (title, message, redirectUrl = null) => {
        document.getElementById("overlay-title").textContent = title;
        document.getElementById("overlay-message").textContent = message;
        genericOverlay.dataset.redirect = redirectUrl || "";
        genericOverlay.classList.add("is-active");
        document.body.style.overflow = "hidden";
    };

    // Override global alert to use custom popup
    window.alert = function(message) {
        showSuccessModal("Notification", message);
    };

    // Function to show toast
    const showToast = (message) => {
        let toast = document.getElementById("stackly-toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "stackly-toast";
            toast.className = "premium-toast";
            toast.innerHTML = `
                <span class="premium-toast-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </span>
                <span class="toast-msg"></span>
            `;
            document.body.appendChild(toast);
        }
        toast.querySelector(".toast-msg").textContent = message;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3200);
    };

    // Helper functions for validation
    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(String(email).trim());
    };

    const validatePhone = (phone) => {
        const regex = /^\+?[0-9\s\-()]{7,15}$/;
        return regex.test(String(phone).trim());
    };

    const validatePasswordStrength = (pwd) => {
        return pwd.length >= 8 && /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd);
    };

    const addErrorMsgElement = (inputEl, errorMsg) => {
        let parent = inputEl.parentElement;
        if (parent && (parent.classList.contains("input-icon-wrapper") || parent.classList.contains("auth-input-wrapper") || parent.classList.contains("relative"))) {
            parent = parent.parentElement;
        }
        let errSpan = parent.querySelector(".validation-error");
        if (!errSpan) {
            errSpan = document.createElement("span");
            errSpan.className = "validation-error";
            parent.appendChild(errSpan);
        }
        errSpan.textContent = errorMsg;
        return errSpan;
    };

    const checkField = (input, validateFn, errorMsg) => {
        if (!input) return true;
        const val = input.type === "checkbox" ? input.checked : input.value;
        const isValid = validateFn(val);
        const errSpan = addErrorMsgElement(input, errorMsg);
        
        if (!isValid) {
            input.classList.remove("is-valid");
            input.classList.add("is-invalid");
            if (errSpan) {
                errSpan.style.display = "block";
                errSpan.style.opacity = "1";
                errSpan.style.maxHeight = "50px";
                errSpan.style.transform = "translateY(0)";
            }
            return false;
        } else {
            input.classList.remove("is-invalid");
            input.classList.add("is-valid");
            if (errSpan) {
                errSpan.style.opacity = "0";
                errSpan.style.maxHeight = "0";
                errSpan.style.transform = "translateY(-5px)";
            }
            return true;
        }
    };

    // Generic form initialization
    const registerLiveValidation = (inputEl, validateFn, errorMsg) => {
        if (!inputEl) return;
        const performVal = () => checkField(inputEl, validateFn, errorMsg);
        inputEl.addEventListener("blur", performVal);
        inputEl.addEventListener("input", () => {
            if (inputEl.classList.contains("is-invalid") || inputEl.classList.contains("is-valid")) {
                performVal();
            }
        });
        if (inputEl.tagName === "SELECT") {
            inputEl.addEventListener("change", performVal);
        }
        inputEl.triggerVal = performVal;
    };

    // Setup input validation bindings across forms
    const setupAllFormsValidation = () => {
        // 1. General Booking & Contact forms (on index.html / about.html / services.html / contact.html)
        const contactForms = document.querySelectorAll(".contact-form, #contact-form, #contactPageForm, #bookingForm");
        contactForms.forEach(form => {
            const nameInput = form.querySelector('#contact-name, #contactName, input[id*="Name"], input[id*="name"], input[placeholder*="Name"]');
            const emailInput = form.querySelector('#contact-email, #contactEmail, input[type="email"]');
            const phoneInput = form.querySelector('#contact-phone, #contactPhone, input[type="tel"]');
            const serviceSelect = form.querySelector('#contact-service, select[name="service"], #serviceSelect');
            const msgTextarea = form.querySelector('#contact-message, #contactMessage, textarea');

            if (nameInput) registerLiveValidation(nameInput, val => val.trim().length >= 2, "Full Name is required (min 2 characters).");
            if (emailInput) registerLiveValidation(emailInput, val => validateEmail(val), "Please enter a valid email address.");
            if (phoneInput) {
                registerLiveValidation(phoneInput, val => validatePhone(val), "Please enter a valid 10-digit phone number.");
            }
            if (serviceSelect) {
                registerLiveValidation(serviceSelect, val => val !== "", "Please select a salon treatment.");
            }
            if (msgTextarea) {
                registerLiveValidation(msgTextarea, val => val.trim().length >= 5, "Please enter your inquiry details.");
            }

            form.removeAttribute("onsubmit");
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                let isValid = true;
                const inputsToValidate = [nameInput, emailInput, phoneInput, serviceSelect, msgTextarea].filter(Boolean);
                inputsToValidate.forEach(inp => {
                    if (inp && typeof inp.triggerVal === "function") {
                        if (!inp.triggerVal()) isValid = false;
                    }
                });

                if (isValid) {
                    showSuccessModal("Inquiry Received", "Thank you for contacting Stackly Aesthetics. Our studio concierge will contact you within 24 hours to confirm your consultation.");
                    form.reset();
                    inputsToValidate.forEach(inp => {
                        if (inp) inp.classList.remove("is-valid", "is-invalid");
                    });
                } else {
                    form.classList.add("is-invalid-shake");
                    setTimeout(() => form.classList.remove("is-invalid-shake"), 400);
                }
            });
        });

        // 2. Newsletter Subscription Forms
        const newsletterForms = document.querySelectorAll(".newsletter-form-inline, form[onsubmit*='preventDefault']");
        newsletterForms.forEach(form => {
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput && !form.id.includes("login") && !form.id.includes("signup")) {
                registerLiveValidation(emailInput, val => validateEmail(val), "Please enter a valid email address.");
                form.addEventListener("submit", (e) => {
                    e.preventDefault();
                    if (emailInput && typeof emailInput.triggerVal === "function") {
                        const isValid = emailInput.triggerVal();
                        if (isValid) {
                            showSuccessModal("Atelier Journal Subscribed", "Welcome to The Style Chronicles. Exclusive styling forecasts and salon priorities will arrive in your inbox.");
                            form.reset();
                            emailInput.classList.remove("is-valid", "is-invalid");
                        } else {
                            form.classList.add("is-invalid-shake");
                            setTimeout(() => form.classList.remove("is-invalid-shake"), 400);
                        }
                    }
                });
            }
        });

        // 3. Login Form Custom handling
        const currentPath = decodeURIComponent(window.location.pathname).toLowerCase();
        if (currentPath.includes("login.html")) {
            const loginForm = document.getElementById("loginForm") || document.getElementById("login-form") || document.querySelector(".auth-form");
            if (loginForm) {
                const roleInput = document.getElementById("loginRole") || document.getElementById("login-role");
                const emailInput = document.getElementById("loginEmail") || document.getElementById("login-email");
                const passwordInput = document.getElementById("loginPassword") || document.getElementById("login-password");

                registerLiveValidation(emailInput, val => validateEmail(val), "Please enter a valid email address.");
                registerLiveValidation(passwordInput, val => val.length >= 6, "Password must be at least 6 characters.");

                loginForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    let isValid = true;

                    [emailInput, passwordInput].forEach(inp => {
                        if (inp && typeof inp.triggerVal === "function") {
                            if (!inp.triggerVal()) isValid = false;
                        }
                    });

                    if (isValid) {
                        const email = emailInput.value.trim();
                        const role = (roleInput ? roleInput.value : "user").toLowerCase();

                        localStorage.setItem("userEmail", email);
                        localStorage.setItem("email", email);
                        localStorage.setItem("role", role);
                        localStorage.setItem("stackly_user_email", email);
                        localStorage.setItem("stackly_user_role", role);

                        const mockName = email.split('@')[0].replace(/[._]/g, ' ');
                        const formattedName = mockName.charAt(0).toUpperCase() + mockName.slice(1);
                        localStorage.setItem("name", formattedName);
                        localStorage.setItem("stackly_user_name", formattedName);

                        showToast("Authentication Successful! Entering Atelier...");

                        setTimeout(() => {
                            if (role === "admin" || role === "administrator") {
                                window.location.href = "admin dashboard.html";
                            } else {
                                window.location.href = "user dashboard.html";
                            }
                        }, 800);
                    } else {
                        loginForm.classList.add("is-invalid-shake");
                        setTimeout(() => loginForm.classList.remove("is-invalid-shake"), 400);
                    }
                });
            }
        }

        // 4. Sign-up Form Custom handling
        if (currentPath.includes("signup.html")) {
            const signupForm = document.getElementById("signupForm") || document.getElementById("signup-form") || document.querySelector(".auth-form");
            if (signupForm) {
                const fnameInput = document.getElementById("first-name") || document.getElementById("signupFirstName");
                const lnameInput = document.getElementById("last-name") || document.getElementById("signupLastName");
                const nameInput = document.getElementById("signupName");
                const emailInput = document.getElementById("signupEmail") || document.getElementById("signup-email");
                const phoneInput = document.getElementById("signupPhone") || document.getElementById("signup-phone");
                const roleInput = document.getElementById("signupRole") || document.getElementById("signup-role");
                const passwordInput = document.getElementById("signupPassword") || document.getElementById("signup-password");
                const confirmPasswordInput = document.getElementById("signupConfirmPassword") || document.getElementById("confirm-password");
                const agreeCheckbox = document.getElementById("signupAgree") || document.getElementById("terms-check");

                if (nameInput) {
                    registerLiveValidation(nameInput, val => val.trim().length >= 3 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(val), "Full Name must be at least 3 letters.");
                }
                if (fnameInput) {
                    registerLiveValidation(fnameInput, val => val.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(val), "First Name must be at least 2 letters.");
                }
                if (lnameInput) {
                    registerLiveValidation(lnameInput, val => val.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(val), "Last Name must be at least 2 letters.");
                }
                registerLiveValidation(emailInput, val => validateEmail(val), "Please enter a valid email address.");
                if (phoneInput) {
                    registerLiveValidation(phoneInput, val => validatePhone(val), "Please enter a valid 10-digit phone number.");
                }
                registerLiveValidation(passwordInput, val => validatePasswordStrength(val), "Password must be min 8 chars with a letter, number, and symbol.");
                registerLiveValidation(confirmPasswordInput, val => val === (passwordInput ? passwordInput.value : ""), "Passwords do not match.");
                if (agreeCheckbox) {
                    registerLiveValidation(agreeCheckbox, checked => checked === true, "You must agree to the atelier etiquette & terms.");
                }

                if (passwordInput && confirmPasswordInput) {
                    passwordInput.addEventListener("input", () => {
                        if (confirmPasswordInput.value !== "") {
                            checkField(confirmPasswordInput, val => val === passwordInput.value, "Passwords do not match.");
                        }
                    });
                }

                signupForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    let isValid = true;

                    const fieldsToVal = [nameInput, fnameInput, lnameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput, agreeCheckbox].filter(Boolean);
                    fieldsToVal.forEach(inp => {
                        if (inp && typeof inp.triggerVal === "function") {
                            if (!inp.triggerVal()) isValid = false;
                        }
                    });

                    if (isValid) {
                        const email = emailInput.value.trim();
                        let fullName = "";
                        if (fnameInput && lnameInput) {
                            fullName = fnameInput.value.trim() + " " + lnameInput.value.trim();
                        } else if (nameInput) {
                            fullName = nameInput.value.trim();
                        } else {
                            fullName = email.split('@')[0];
                        }

                        const role = (roleInput ? roleInput.value : "user").toLowerCase();

                        localStorage.setItem("userEmail", email);
                        localStorage.setItem("email", email);
                        localStorage.setItem("name", fullName);
                        localStorage.setItem("role", role);
                        localStorage.setItem("stackly_user_name", fullName);
                        localStorage.setItem("stackly_user_email", email);
                        localStorage.setItem("stackly_user_role", role);

                        showSuccessModal("Account Created", "Welcome to Stackly Atelier! Your salon membership profile is active. Redirecting to sign in...", "login.html");
                    } else {
                        signupForm.classList.add("is-invalid-shake");
                        setTimeout(() => signupForm.classList.remove("is-invalid-shake"), 400);
                    }
                });
            }
        }

        // 5. User Profile Form Validation (on user dashboard)
        const saveProfileBtn = document.getElementById("saveProfileBtn") || document.getElementById("btn-save-profile");
        if (saveProfileBtn) {
            const firstNameInput = document.getElementById("profileFirstName") || document.getElementById("p-fname");
            const lastNameInput = document.getElementById("profileLastName") || document.getElementById("p-lname");
            const emailInput = document.getElementById("profileEmailInput") || document.getElementById("p-email");
            const phoneInput = document.getElementById("profilePhone") || document.getElementById("p-phone");

            if (firstNameInput) registerLiveValidation(firstNameInput, val => val.trim().length >= 2, "First Name is required (min 2 chars).");
            if (lastNameInput) registerLiveValidation(lastNameInput, val => val.trim().length >= 2, "Last Name is required (min 2 chars).");
            if (emailInput) registerLiveValidation(emailInput, val => validateEmail(val), "Please enter a valid email address.");
            if (phoneInput) registerLiveValidation(phoneInput, val => validatePhone(val), "Please enter a valid phone number.");

            saveProfileBtn.addEventListener("click", (e) => {
                e.preventDefault();
                let isValid = true;
                [firstNameInput, lastNameInput, emailInput, phoneInput].filter(Boolean).forEach(inp => {
                    if (inp && typeof inp.triggerVal === "function") {
                        if (!inp.triggerVal()) isValid = false;
                    }
                });

                if (isValid) {
                    const newEmail = emailInput ? emailInput.value.trim() : "";
                    const fname = firstNameInput ? firstNameInput.value.trim() : "";
                    const lname = lastNameInput ? lastNameInput.value.trim() : "";
                    const newName = (fname + " " + lname).trim();

                    if (newEmail) {
                        localStorage.setItem('userEmail', newEmail);
                        localStorage.setItem('email', newEmail);
                        localStorage.setItem('stackly_user_email', newEmail);
                    }
                    if (newName) {
                        localStorage.setItem('name', newName);
                        localStorage.setItem('stackly_user_name', newName);
                    }

                    // Update UI elements
                    const sidebarName = document.getElementById("sidebar-name") || document.getElementById("sidebarUserName");
                    if (sidebarName) sidebarName.textContent = newName;
                    const welcomeName = document.getElementById("welcome-name") || document.getElementById("heroWelcomeName");
                    if (welcomeName) welcomeName.textContent = fname || newName;
                    const sidebarEmail = document.getElementById("sidebar-email") || document.getElementById("profileEmailDisplay");
                    if (sidebarEmail) sidebarEmail.textContent = newEmail;

                    const initials = ((fname ? fname[0] : '') + (lname ? lname[0] : '')).toUpperCase() || 'ST';
                    ['user-avatar-sidebar', 'user-avatar-top', 'su-avatar'].forEach(id => {
                        const el = document.getElementById(id) || document.querySelector('.' + id);
                        if (el) el.textContent = initials;
                    });

                    showToast("Atelier Profile Updated!");
                    const succ = document.getElementById("profile-success");
                    if (succ) {
                        succ.classList.remove("hidden");
                        setTimeout(() => succ.classList.add("hidden"), 4000);
                    }
                } else {
                    const card = saveProfileBtn.closest(".panel-card") || saveProfileBtn.closest(".card");
                    if (card) {
                        card.classList.add("is-invalid-shake");
                        setTimeout(() => card.classList.remove("is-invalid-shake"), 400);
                    }
                }
            });
        }

        // 6. Admin settings form in Admin Dashboard
        const saveAdminBtn = document.getElementById("saveAdminBtn") || document.getElementById("btn-save-admin");
        if (saveAdminBtn) {
            const adminNameInput = document.getElementById("adminNameInput") || document.getElementById("set-store-name");
            const adminEmailInput = document.getElementById("adminEmailInput") || document.getElementById("set-email");

            if (adminNameInput) registerLiveValidation(adminNameInput, val => val.trim().length >= 2, "Admin / Studio Name is required.");
            if (adminEmailInput) registerLiveValidation(adminEmailInput, val => validateEmail(val), "Please enter a valid email address.");

            saveAdminBtn.addEventListener("click", (e) => {
                e.preventDefault();
                let isValid = true;
                [adminNameInput, adminEmailInput].filter(Boolean).forEach(inp => {
                    if (inp && typeof inp.triggerVal === "function") {
                        if (!inp.triggerVal()) isValid = false;
                    }
                });

                if (isValid) {
                    const newEmail = adminEmailInput.value.trim();
                    const newName = adminNameInput.value.trim();
                    if (newEmail) {
                        localStorage.setItem('userEmail', newEmail);
                        localStorage.setItem('email', newEmail);
                        localStorage.setItem('stackly_user_email', newEmail);
                        
                        const emailInitial = newEmail.trim().charAt(0).toUpperCase();
                        ['admin-avatar-top', 'admin-avatar-sidebar', 'admin-dropdown-avatar'].forEach(id => {
                            const el = document.getElementById(id);
                            if (el) el.textContent = emailInitial;
                        });
                        document.querySelectorAll('.admin-avatar-initial').forEach(el => {
                            el.textContent = emailInitial;
                        });
                    }
                    if (newName) {
                        localStorage.setItem('name', newName);
                        localStorage.setItem('stackly_user_name', newName);
                    }

                    const sidebarAdminName = document.getElementById("admin-name") || document.getElementById("sidebarAdminName");
                    if (sidebarAdminName) sidebarAdminName.textContent = newName;
                    const sidebarAdminEmail = document.getElementById("admin-email");
                    if (sidebarAdminEmail) sidebarAdminEmail.textContent = newEmail;
                    const dropdownAdminEmail = document.getElementById("admin-dropdown-email");
                    if (dropdownAdminEmail) dropdownAdminEmail.textContent = newEmail;
                    const topAdminName = document.getElementById("admin-name-top");
                    if (topAdminName) topAdminName.textContent = newName;

                    showToast("Studio Admin Settings Saved!");
                } else {
                    const card = saveAdminBtn.closest(".panel-card") || saveAdminBtn.closest(".card");
                    if (card) {
                        card.classList.add("is-invalid-shake");
                        setTimeout(() => card.classList.remove("is-invalid-shake"), 400);
                    }
                }
            });
        }
    };

    // Load Localized State into Inputs & Welcomes dynamically
    const loadStateFromLocalStorage = () => {
        const storedEmail = localStorage.getItem('userEmail') || localStorage.getItem('email') || localStorage.getItem('stackly_user_email');
        const storedName = localStorage.getItem('name') || localStorage.getItem('stackly_user_name');
        const currentPath = decodeURIComponent(window.location.pathname).toLowerCase();

        // User Dashboard loading
        if (currentPath.includes("user dashboard") || currentPath.includes("user-dashboard")) {
            if (storedEmail) {
                const profileEmailInput = document.getElementById("profileEmailInput") || document.getElementById("p-email");
                if (profileEmailInput) profileEmailInput.value = storedEmail;

                const profileEmailDisplay = document.getElementById("sidebar-email") || document.getElementById("profileEmailDisplay");
                if (profileEmailDisplay) profileEmailDisplay.textContent = storedEmail;
            }

            if (storedName) {
                const cleanName = storedName.replace(/[^a-zA-Z\s]/g, "");
                const parts = cleanName.trim().split(" ");
                const firstName = parts[0] || "Guest";
                const lastName = parts.slice(1).join(" ") || "";

                const firstNameInput = document.getElementById("profileFirstName") || document.getElementById("p-fname");
                if (firstNameInput && !firstNameInput.value) firstNameInput.value = firstName;

                const lastNameInput = document.getElementById("profileLastName") || document.getElementById("p-lname");
                if (lastNameInput && !lastNameInput.value) lastNameInput.value = lastName;

                const sidebarUserName = document.getElementById("sidebar-name") || document.getElementById("sidebarUserName");
                if (sidebarUserName) sidebarUserName.textContent = cleanName;

                const welcomeName = document.getElementById("welcome-name") || document.getElementById("heroWelcomeName");
                if (welcomeName) welcomeName.textContent = firstName;

                const emailInitial = storedEmail ? storedEmail.trim().charAt(0).toUpperCase() : (firstName ? firstName[0].toUpperCase() : 'G');
                ['user-avatar-sidebar', 'user-avatar-top', 'su-avatar'].forEach(id => {
                    const el = document.getElementById(id) || document.querySelector('.' + id);
                    if (el) el.textContent = emailInitial;
                });
            }
        }

        // Admin Dashboard loading
        if (currentPath.includes("admin dashboard") || currentPath.includes("admin-dashboard")) {
            const adminEmail = storedEmail || "director@stackly.in";
            const emailInitial = adminEmail.trim().charAt(0).toUpperCase();

            const adminEmailInput = document.getElementById("adminEmailInput") || document.getElementById("set-email");
            if (adminEmailInput) adminEmailInput.value = adminEmail;
            
            const adminEmailDisp = document.getElementById("admin-email");
            if (adminEmailDisp) adminEmailDisp.textContent = adminEmail;

            const dropdownAdminEmail = document.getElementById("admin-dropdown-email");
            if (dropdownAdminEmail) dropdownAdminEmail.textContent = adminEmail;

            // Automatically set right edge avatar icon & sidebar avatar to starting letter of the mail
            ['admin-avatar-top', 'admin-avatar-sidebar', 'admin-dropdown-avatar'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = emailInitial;
            });
            document.querySelectorAll('.admin-avatar-initial').forEach(el => {
                el.textContent = emailInitial;
            });

            if (storedName) {
                const cleanName = storedName.replace(/[^a-zA-Z\s]/g, "");
                const adminNameInput = document.getElementById("adminNameInput") || document.getElementById("set-store-name");
                if (adminNameInput && !adminNameInput.value) adminNameInput.value = cleanName;

                const sidebarAdminName = document.getElementById("admin-name") || document.getElementById("sidebarAdminName");
                if (sidebarAdminName) sidebarAdminName.textContent = cleanName;
                const topAdminName = document.getElementById("admin-name-top");
                if (topAdminName) topAdminName.textContent = cleanName;
                const dropdownAdminName = document.getElementById("admin-dropdown-name");
                if (dropdownAdminName) dropdownAdminName.textContent = cleanName;
            }
        }
    };

    // Initialize forms & state
    setupAllFormsValidation();
    loadStateFromLocalStorage();

    // ================= GLOBAL CLICK-TO-404 NAVIGATOR =================
    document.body.addEventListener("click", (e) => {
        const currentPath = decodeURIComponent(window.location.pathname).toLowerCase();
        const is404Page = currentPath.includes("404.html");

        // 1. Never intercept if clicking inside standard form input controls
        if (e.target.closest("input:not([type='button']):not([type='submit']), textarea, select, option, label")) {
            return;
        }

        // 2. Identify allowed interactive application controls
        const allowedInteractive = e.target.closest(
            "#menu-btn, #close-menu-btn, #mobile-menu-btn, #mobile-close-btn, " +
            "#overlay-close-btn, .success-close-btn, #stackly-success-overlay, #website-modal, " +
            ".role-switcher, #btn-user, #btn-admin, [onclick*='selectRole'], " +
            ".tab-btn, .nav-item, .admin-nav-item, [onclick*='switchSection'], [onclick*='switchTab'], [data-tab], [data-section], " +
            "[onclick*='toggleSidebar'], [onclick*='closeSidebar'], #sidebarToggle, #sidebarClose, " +
            "[onclick*='toggleProfileDropdown'], #profileDropdown, " +
            ".faq-btn, [onclick*='toggleFaq'], " +
            "[onclick*='confirmAdminLogout'], [onclick*='confirmSignOut'], [onclick*='logout'], " +
            "[onclick*='togglePwd'], [onclick*='togglePassword'], " +
            "[onclick*='window.scrollTo'], [onclick*='scrollTo'], " +
            "#saveProfileBtn, #btn-save-profile, #saveAdminBtn, #btn-save-admin, " +
            "button[type='submit'], input[type='submit']"
        );

        if (allowedInteractive) {
            return;
        }

        // 3. Handle Link Elements (<a>)
        const linkEl = e.target.closest("a");
        if (linkEl) {
            const href = linkEl.getAttribute("href");
            const onclickStr = linkEl.getAttribute("onclick") || "";

            // Check for valid page navigation
            if (href && !onclickStr) {
                if (href.startsWith("mailto:") || href.startsWith("tel:")) {
                    return;
                }

                // If anchor link on same page
                if (href.startsWith("#") && href.length > 1) {
                    try {
                        const targetEl = document.querySelector(href);
                        if (targetEl) {
                            return; // Target exists on current page, allow smooth scroll
                        }
                    } catch (err) {}
                    // Target does not exist on this page
                    if (!is404Page) {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = "404.html";
                    }
                    return;
                }

                const cleanHref = decodeURIComponent(href.split("#")[0].split("?")[0].replace(/^\.\//, '')).toLowerCase();
                const allowedHrefs = [
                    "index.html",
                    "about.html",
                    "services.html",
                    "blog.html",
                    "contact.html",
                    "login.html",
                    "signup.html",
                    "admin dashboard.html",
                    "user dashboard.html",
                    "admin-dashboard.html",
                    "user-dashboard.html",
                    "404.html"
                ];

                if (allowedHrefs.includes(cleanHref)) {
                    return; // Normal valid page navigation
                }
            }

            // Unused / dummy / dead link
            if (!is404Page) {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = "404.html";
            }
            return;
        }

        // 4. Handle Unused Buttons (<button>, [role='button'])
        const buttonEl = e.target.closest("button, [role='button']");
        if (buttonEl) {
            // Check if it's part of a form submission
            if (buttonEl.type === "submit" || buttonEl.closest("form")) {
                const isFormSubmit = buttonEl.type === "submit" || buttonEl.id === "login-btn" || buttonEl.id === "signup-btn";
                if (isFormSubmit) return;
            }

            if (!is404Page) {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = "404.html";
            }
            return;
        }

        // 5. Handle Standalone Unused Icons (<i>, <svg>, social icons, quick action badges)
        const iconEl = e.target.closest("i, svg, .ph, .fa-solid, .fa-brands, .fa-regular, .ph-fill, .social-icon, .badge-btn");
        if (iconEl) {
            // Make sure it's not inside an allowed form element or interactive control
            if (!iconEl.closest("input, button, a, form, .role-switcher, .tab-panel")) {
                if (!is404Page) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = "404.html";
                }
            }
        }
    });
});
