
function handleLogin(event) {
    event.preventDefault(); 
    const username = document.querySelector('input[type="text"]').value; 
    const password = document.querySelector('input[type="password"]').value; 
    if (username === 'son' && password === 'son') {
        window.location.href = 'HomePage/index.html'; 
    } else {
        alert('Tên người dùng hoặc mật khẩu không đúng.');
    }
}
