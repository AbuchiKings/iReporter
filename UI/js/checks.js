
const validationErrors = [];
const profilePage = document.querySelector('.profile-top-wrapper')

/**************Functions******************* */
const notify = () => {
    let parent = document.querySelector('.input-errors');
    if (validationErrors.length > 0) {
        validationErrors.forEach((err) => {
            let el = document.createElement('p')
            el.textContent = err;
            parent.appendChild(el)
        })

        parent.style.display = 'block';

    }
};

const clearErrors = () => {
    let parent = document.querySelector('.input-errors');
    parent.textContent = null;
    parent.style.display = 'none';
};

/*function signupValidation() {
    const signupForm = document.querySelector('.signup-form');
    const signupBt = document.querySelector('.signup-bt');

    const passwordMatch = () => {
        let password = signupForm.password.value;
        validationErrors.length = 0;
        if (password.length < 6) {
            validationErrors.push('Password does not have up to five characters')
        }

        if (validationErrors.length === 0) {
            signupBt.disabled = false;
        }

        notify();
        return;
    };
    signupBt.addEventListener('pointerenter', passwordMatch)
    signupBt.addEventListener('pointerout', clearErrors)
}
*/

function loginValidation() {
    const loginForm = document.querySelector('#login-form');
    const loginBt = document.querySelector('.login-bt');

    const validateLoginForm = () => {
        let email = loginForm.email.value;
        let password = loginForm.password.value;
        let match = /^[a-z]+([1-9]|[1-9][0-9][0-9]*)*@[a-z]+\.com$/i

        validationErrors.length = 0;

        if (match.test(email) === false) {
            validationErrors.push('Enter a valid email');
        }

        if (password.length === 0) {
            validationErrors.push('Please enter your password')
        }

        if (validationErrors.length === 0) {
            loginBt.disabled = false;
        }

        notify();

        return
    };

    loginBt.addEventListener('pointerenter', validateLoginForm);
    loginBt.addEventListener('pointerout', clearErrors);
}


function reportValidation() {
    const crtReportForm = document.querySelector('#crt-rpt-form');
    const crtButton = document.querySelector('#submit-report');

    const validateReportForm = () => {
        let title = crtReportForm.title.value;
        let comment = crtReportForm.comment.value;
        let location = crtReportForm.location.value;
        let address = crtReportForm.address.value;
        let match = /^[a-z]+[\w\s-]*[a-z]$/ig;
        let match1 = /^[a-z]+[\w\s\n-,."'?;]*[a-z\s.]+$/ig;
        let match2 = /^([a-z]+(-?)[a-z]+\s*[a-z]+(-?)[a-z]+)\s*[a-z]*-?[a-z]$/ig;

        validationErrors.length = 0;

        if (crtReportForm.rptIncidentType.value.length === 0) {
            validationErrors.push('Please select an incident type')
        }

        if (location.length === 0) {
            validationErrors.push('Enter a valid address to get geolocation or click the link provided')
        }

        if (match2.test(address) === false) {
            validationErrors.push('Address should contain only alphabets: street, town/city, and state')
        }

        if (title.length < 10) {
            validationErrors.push('Title must have a minimum length of ten')
        }

        if (match.test(title) === false) {
            validationErrors.push('Enter title without punctuations or numbers')
        }

        if (comment.length < 40 || match1.test(comment) === false) {
            validationErrors.push('Comment must have up to 40 chars. Be of numbers, alphabets and (,.\'":;-?)group only')
        }

        if (validationErrors.length === 0) {
            crtButton.disabled = false;
        }
        notify();

        return
    };
    crtButton.addEventListener('pointerenter', validateReportForm);
    crtButton.addEventListener('pointerout', clearErrors);
}


switch (window.location.pathname) {
    case '/login.html':
        loginValidation();
        break;
    case '/create-report.html':
        reportValidation();
        break;
    case '/signup.html':
       // signupValidation()
        break;
}

/*********************************side nav****************************** */
function openNav() {
    document.querySelector(".side-nav").style.width = "230px";
}

function closeNav() {
    document.querySelector(".side-nav").style.width = "0";
}
/******************************************************************popups****************************** */
function openEmailForm() {
    document.querySelector(".first-popup").style.display = "block";
}
function openPasswordForm() {
    document.querySelector(".second-popup").style.display = "block";
}
function closeEmailForm() {
    document.querySelector(".first-popup").style.display = "none";
}
function closePasswordForm() {
    document.querySelector(".second-popup").style.display = "none";
}
function openImageForm() {
    document.querySelector(".third-popup").style.display = "block";
}
function closeImageForm() {
    document.querySelector(".third-popup").style.display = "none";
}
function openDeleteForm() {
    document.querySelector(".fourth-popup").style.display = "block";
}
function closeDeleteForm() {
    document.querySelector(".fourth-popup").style.display = "none";
}
function closeDeleteForm() {
    document.querySelector(".fourth-popup").style.display = "none";
}

function openSignupForm() {
    document.querySelector(".signup").style.display = "block";
}
function closeSignupForm() {
    document.querySelector(".signup").style.display = "none";
}
function openImgOptions() {
    document.querySelector(".dp-popup").style.display = "block";
}
function closeImgOptions(event) {
    const tg = event.target.id
    if ((tg === 'img-options' || tg === 'profile-picture') ||
        (tg === 'change-dp' || tg === 'view-dp')) {
    } else {
        document.querySelector(".dp-popup").style.display = "none";
    }
}


function popupForm(event) {
    const emailUpdate = document.querySelector('#update-email');
    const passwordUpdate = document.querySelector('#update-password');
    const accountDelete = document.querySelector('#delete-account');
    if (event.target !== event.currentTarget) {
        if (event.target === emailUpdate) {
            openEmailForm()
        }
        if (event.target === passwordUpdate) {
            openPasswordForm()
        }
        if (event.target === accountDelete) {
            openDeleteForm()
        }
    }
}

if (profilePage) {
    const dropdown = document.querySelector('.dropdown-content');
    const displayPic = document.querySelector('.user-photo');
    const body = document.querySelector('body')
    dropdown.addEventListener('click', popupForm);
    displayPic.addEventListener('click', openImgOptions);
    body.addEventListener('click', closeImgOptions, true)

}

