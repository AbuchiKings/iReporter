
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
    console.log(document.querySelector(".second-popup"))
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

