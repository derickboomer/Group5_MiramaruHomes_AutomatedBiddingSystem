const storageInput=document.querySelector('.storage');
const text=document.querySelector('.text');
const button=document.querySelector('.button');
const storedInput=localStorage.getItem('textinput');

function createacc()
{
    var pw=document.getElementById("customer_pw").value;
    var pw2=document.getElementById("repeatPassword").value;

    if(pw!==pw2) {alert("Passwords should match.");window.close();
    window.open('/create');} else{};
}

function login()
{
    var em=document.getElementById("em").value;
    var pw=document.getElementById("pw").value;

    if(em==''||pw=='') 
        {alert("Please enter valid credentials.");window.close();window.open('/login');} 
            else{};
}
