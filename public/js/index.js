const loginSection = document.getElementsByClassName('login-section');
const signupForm = document.getElementsByClassName('login-form-display');
const button = document.getElementsByClassName('search-click-button')

// console.log(button)

button[0].addEventListener('click', async(el) => {
    el.preventDefault();
    const searchBox = document.getElementById('search-input').value;

    const searchResult = await axios({
        method: 'GET',
        url: `/api/v1/product/${searchBox}`,
    });
});


if (window.location === '/login') {
    const submitButton = document.querySelector('.input-submit-section input');
    submitButton.addEventListener('click', async (el) => {
        el.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginRequest = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        })

        if (loginRequest.data.status === "success") {
            alert('LOGIN SUCCESSFULLY')
            location.assign('/')
        } else {
            console.log(loginRequest)
        }
    })
}

if (window.location === '/signup') {
    console.log('signup')
    const submitButton = document.querySelector('.input-submit-section input');
    submitButton.addEventListener('click', async (el) => {
        el.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        const role = document.getElementById('user-role').value;
        const name = document.getElementById('username').value;

        console.log(role)
        const loginRequest = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                email,
                password,
                passwordConfirm,
                role,
                name
            }
        })

        if (loginRequest.data.status === "success") {
            alert('SIGNUP SUCCESSFULLY')
            // location.assign('/')
        } else {
            console.log(loginRequest)
        }
    })
}

// FOR SEARCH
