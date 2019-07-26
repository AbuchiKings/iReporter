
const baseURL = `http://localhost:5000/api/v1`;
const loginForm = document.querySelector('#login-form');
const loginBtn = document.querySelector('.login-bt');
const signupForm = document.querySelector('.signup-form');
const signupBtn = document.querySelector('.signup-bt');
const form = document.querySelector('form');
const reportForm = document.querySelector('#crt-rpt-form');
const reportBtn = document.querySelector('#submit-report');
const dashboard = document.querySelector('.dashboard');
const selectUser = document.querySelector('#by-user');
const selectType = document.querySelector('#by-type');
const selectStatus = document.querySelector('#by-status');
const signOut = document.querySelector('.signout-link');
const profilePix = document.querySelector('#profile-picture');
const newEmailForm = document.querySelector('.email-update');
const newPasswordForm = document.querySelector('.password-update');
const deleteForm = document.querySelector('.delete-form');
const dpForm = document.querySelector('#dp-upload');
const uploadDp = document.querySelector('.uploadDp');





/***************functions******************/

const onSuccess = async (res) => {
    if (res.ok) return res.json()
        .then(response => response)
    else {
        //const er; 
        return Promise.reject(await res.json());
    }

};

const onError = (err) => {
    const { message, error } = err;
    if (message) {
        if (
            message.includes('JsonWebTokenError') ||
            message.includes('TokenExpiredError') ||
            message.includes('Unauthorized Access')
        ) {
            localStorage.clear();
            window.location.replace('./index.html');
        }
    }
    return ({ error, message });
};

const requestHandler = (method = 'GET', url, body = undefined) => {
    const token = localStorage.getItem('token');
    const headers = new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    });

    const options = {
        method,
        mode: 'cors',
        headers,
        body: JSON.stringify(body)
    }

    const request = new Request(url, options)

    return fetch(request)
        .then(onSuccess)
        .catch(onError);
};

const createTag = (parentNode, tag, content, class_name = undefined) => {
    const el = document.createElement(tag);
    el.textContent = content;
    el.className = class_name
    parentNode.appendChild(el)
};

const spinner = () => {
    const loader = document.querySelector('.loader-div');
    loader.classList.toggle('over-spinner');
}


const removeIncidentCards = () => {
    if (dashboard && dashboard.firstChild) {
        while (dashboard.firstChild.className === 'incident-card') {
            dashboard.removeChild(dashboard.firstChild);
        }
        return;
    }
}

const removeMessage = () => {
    if (dashboard.lastChild) {
        dashboard.removeChild(dashboard.lastChild);
    }
}

const displayUsers = (users) => {
    const selectUser = document.querySelector('#by-user');
    users.forEach((user) => {
        const opt = document.createElement('option');
        opt.value = user.id;
        opt.textContent = user.user_name;
        selectUser.appendChild(opt);
    });
};

const populateIncidentsDashboard = (reports, parentElement) => {
    reports.forEach(report => {
        parentElement.insertAdjacentHTML('afterbegin',
            `<article class="incident-card" id="incident${report.incidentid}">
            <img src="./images/New-GRA.jpg" alt="" 
            class="incident-img"><div><table><tbody>
                    <tr><th>Title:</th><td>${report.title}</td></tr>

                    <tr><th>Id:</th><td>${report.incidentid}</td></tr>

                    <tr><th>Type:</th><td>${report.type}</td></tr>
                    
                    <tr><th>Status</th><td>${report.status}</td></tr>

                    <tr><th>Date</th><td>${report.createdon}</td></tr>
                    
                    <tr><th>Author ID</th><td>${report.createdby}</td></tr>
            </tbody></table></div></article>`
        );

    });

};




/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

const login = async (event) => {
    event.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    const userData = { email, password };
    const loginPath = `${baseURL}/auth/login`;
    const mesgContainer = document.querySelector('.errors');
    const response = await requestHandler('POST', loginPath, userData);
    if (response.data === undefined) {
        if (response.message) {
            if (mesgContainer.firstChild) { mesgContainer.removeChild(mesgContainer.firstChild) }
            createTag(mesgContainer, 'p', response.message)
        }
        console.log(response.message);
        return;
    }

    const [result] = response.data;
    const { id, token, is_admin } = result;
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('is_admin', is_admin);
    window.localStorage.setItem('id', id);
    if (is_admin) {
        window.location.assign('/admin-dashboard.html');
        return;
    }
    window.location.assign('./user-dashboard.html');
    return;

};

const signup = async (event) => {
    event.preventDefault();
    const firstName = document.querySelector('#first-name').value;
    const lastName = document.querySelector('#last-name').value;
    const email = document.querySelector('#email').value;
    const phoneNumber = document.querySelector('#phone-number').value;
    const userName = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const signupData = { firstName, lastName, email, password, userName, phoneNumber };
    const signupPath = `${baseURL}/auth/signup`;
    const msg = document.querySelector('.errors');
    const response = await requestHandler('POST', signupPath, signupData)
    if (!response.data) {
        if (response.message) {
            if (msg.firstChild) { msg.removeChild(msg.firstChild) }
            createTag(msg, 'p', response.message)
        }
        return;
    }
    window.location.replace('./login.html');
    return;

};

const createReport = async (event) => {
    event.preventDefault()
    const createdby = Number(localStorage.getItem('id'));
    const type = document.querySelector('#crt-incident-type').value;
    const title = document.querySelector('#title').value;
    const location = document.querySelector('#location').value;
    const comment = document.querySelector('#comment').value;
    const status = 'Draft'
    const report = { createdby, title, type, location, comment, status };
    const incidentsurl = `${baseURL}/red-flags`;
    const msg = document.querySelector('.errors');
    const response = await requestHandler('POST', incidentsurl, report)
    if (!response.data) {
        if (response.message) {
            if (msg.firstChild) { msg.removeChild(msg.firstChild) }
            createTag(msg, 'p', response.message)
        }
        return;
    }
    document.querySelector('.errors').textContent = response.message;
    return;

};


const requestDashboard = async () => {
    const incidentsurl = `${baseURL}/red-flags`;
    const response = await requestHandler('GET', incidentsurl)
    if (!response.data) {
        if (response.message) {
            createTag(dashboard, 'p', response.message, 'responseMessage')
        }
        return;
    }
    const [reports] = response.data;
    populateIncidentsDashboard(reports, dashboard);
    return;
};

const fetchUsers = async () => {
    const usersURL = `${baseURL}/users`;
    const response = await requestHandler('GET', usersURL);
    if (!response.data) {
        console.log(response);
        return;
    }
    const [users] = response.data;
    displayUsers(users);
    return;
};

const sortReports = async ({ target }) => {
    let reportsURL;
    switch (target.id) {
        case 'by-user':
            const userId = target.value;
            reportsURL = `${baseURL}/red-flags/?userId=${userId}`;
            break;
        case 'by-type':
            const type = target.value;
            reportsURL = `${baseURL}/red-flags/?type=${type}`;
            break;
        case 'by-status':
            const status = target.value;
            reportsURL = `${baseURL}/red-flags/?status=${status}`;
            break;
    }

    const response = await requestHandler('GET', reportsURL);
    removeIncidentCards();
    if (!response.data) {
        removeMessage();
        if (response.message) {
            createTag(dashboard, 'p', response.message, 'responseMessage')
        }
        return;
    }
    const [reports] = response.data;
    removeMessage();
    populateIncidentsDashboard(reports, dashboard);
    return;
};

const getUserProfile = async () => {
    const userId = localStorage.getItem('id');
    const profileURL = `${baseURL}/users/${userId}`;
    const mesgContainer = document.querySelector('.server-errors');
    const response = await requestHandler('GET', profileURL);
    if (!response.data) {
        if (response.message) {
            if (mesgContainer.firstChild) { mesgContainer.removeChild(mesgContainer.firstChild) }
            createTag(mesgContainer, 'p', response.message)
        }
        return;
    }
    const [values] = response.data;
    const img = document.querySelector('#profile-picture');
    if (values.image !== null) {
        img.src = values.image;
    }
    const properties = Object.keys(values);
    properties.forEach((prop) => {
        let el = document.querySelector(`[data-${prop}-value]`);
        if (el !== null) el.textContent = values[prop];

    })
    return;
};

const updateEmail = async (e) => {
    e.preventDefault();
    spinner();
    const password = newEmailForm.psw.value;
    const email = newEmailForm.email.value;
    const data = { password, email };
    const updateURL = `${baseURL}/users/update-email`;
    const mesgContainer = document.querySelector('.response');
    const response = await requestHandler('PATCH', updateURL, data);
    if (!response.data) {
        if (response.message) {
            if (mesgContainer.firstChild) { mesgContainer.removeChild(mesgContainer.firstChild) }
            createTag(mesgContainer, 'p', response.message)
        }
        return;
    }
    if (mesgContainer.firstChild) { mesgContainer.removeChild(mesgContainer.firstChild) }
    createTag(mesgContainer, 'p', response.message)
    getUserProfile();
    spinner()
    return;
};

const updatePassword = async (e) => {
    e.preventDefault();
    spinner();
    const oldPassword = newPasswordForm.oldPsw.value;
    const newPassword = newPasswordForm.newPsw.value;
    const data = ({ oldPassword, newPassword });
    const updateURL = `${baseURL}/users/update-password`;
    const mesgContainer = document.querySelector('.response2');
    const response = await requestHandler('PATCH', updateURL, data);
    if (!response.data) {
        if (response.message) {
            if (mesgContainer.firstChild) { mesgContainer.removeChild(mesgContainer.firstChild) }
            createTag(mesgContainer, 'p', response.message)
        }
        spinner();
        return;
    }
    if (mesgContainer.firstChild) { mesgContainer.removeChild(mesgContainer.firstChild) }
    createTag(mesgContainer, 'p', response.message)
    spinner();
    return;

}

const setDp = async (e) => {
    e.preventDefault();
    spinner();
    const picURL = `${baseURL}/users/profile-picture`;
    const upload = document.getElementById('dp');
    const myImg = upload.files[0];
    const mesgContainer = document.querySelector('.response3');
    const img = document.querySelector('#profile-picture');
    const data = new FormData();
    data.append('profilePic', myImg);
    const token = localStorage.getItem('token');
    const headers = new Headers({
        Authorization: `Bearer ${token}`
    });

    const options = {
        method: 'PATCH',
        mode: 'cors',
        headers,
        body: data
    }

    const request = new Request(picURL, options)
    const response = await fetch(request)
        .then(onSuccess)
        .catch(onError);


    if (!response.data) {
        if (response.message) {
            if (mesgContainer.firstChild) { mesgContainer.removeChild(mesgContainer.firstChild) }
            createTag(mesgContainer, 'p', response.message)
        }
        spinner()
        return;
    }
    if (mesgContainer.firstChild) { mesgContainer.removeChild(mesgContainer.firstChild) }
    createTag(mesgContainer, 'p', response.message);
    const { image } = response.data[0];
    img.src = image;
    upload.value= '';
    spinner()
    return;
}

const deleteUser = async (e) => {
    e.preventDefault();
    confirm('Account and all reports will be deleted. Continue?');
    spinner();
    const deleteURL = `${baseURL}/users/delete`;
    const psw = deleteForm.password.value;
    const data = { psw };
    const response = await requestHandler('POST', deleteURL, data)
    const mesgContainer = document.querySelector('.response4');

    if (response.status !== 204) {
        if (response.message) {
            if (mesgContainer.firstChild) { mesgContainer.removeChild(mesgContainer.firstChild) }
            createTag(mesgContainer, 'p', response.message)
        }
        spinner()
        return;
    }
    window.location.replace('./index.html')
}

const logOut = async (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.replace('./index.html');
    return;

};




if (signupForm) {
    signupBtn.addEventListener('click', signup)
}
if (loginForm) {
    loginBtn.addEventListener('click', login);
}
if (reportForm) {
    reportBtn.addEventListener('click', createReport)
}
if (selectUser) {
    selectUser.addEventListener('change', sortReports);
}
if (selectType) {
    selectType.addEventListener('change', sortReports);
}
if (selectStatus) {
    selectStatus.addEventListener('change', sortReports);
}
if (signOut) {
    signOut.addEventListener('click', logOut);
}
if (newEmailForm) {
    newEmailForm.addEventListener('submit', updateEmail);
}
if (newPasswordForm) {
    newPasswordForm.addEventListener('submit', updatePassword);
}
if (deleteForm) {
    deleteForm.addEventListener('submit', deleteUser);
}
if (dpForm) {
    dpForm.addEventListener('submit', setDp);
}



if (window.location.pathname === '/admin-dashboard.html') {
    requestDashboard();
    fetchUsers();
}
if (window.location.pathname === '/user-dashboard.html') {
    requestDashboard();
}
if (window.location.pathname === '/profile.html') {
    getUserProfile();
}

//document.getElementById('myForm').checkValidity();

/*{status: 200, data:Array(1)}
data: Array(1)0: user:
email: "abuchikingsley76@gmail.com"first_name: "Abuchi"id: 2image: nullimage_id: nullis_admin: falselast_name: "Ndinigwe"password: "$2b$10$QYYIvVxLuouLYht9d1moYO/LSy6a0DpZbI/MXS1u6pHjnHIi1g35."phone_number: "8062158380"registered: "2019-06-24T23:00:00.000Z"user_name: "abuchi"__proto__: Object
values: draft: 0interventions: 1
redFlags: 1rejected: 0resvd: 1
total: 2
underInvestigation: 1__proto__: Object__proto__: Objectlength: 1__proto__: Array(0)status: 200__proto__: Object*/