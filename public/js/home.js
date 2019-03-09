const Login = document.querySelector('#login');
const cross = document.querySelector('.cross');
var LoginPage = document.querySelector('.loginWith');
const main=document.querySelector('.main');

Login.addEventListener('click',function(){
    LoginPage.style.display = "inline-block";
    LoginPage.style.opacity = "1";
    main.style.opacity = "0.35";
    event.preventDefault();
})
cross.addEventListener('click',function(){
  LoginPage.style.display = "none";
    LoginPage.style.opacity = "0";
})