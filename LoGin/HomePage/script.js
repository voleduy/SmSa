function openBooking(serviceName, servicePrice) {
    document.getElementById('bookingPopup').style.display = 'block';
    document.getElementById('serviceName').querySelector('span').innerText = serviceName;
    document.getElementById('servicePrice').querySelector('span').innerText = servicePrice.toLocaleString() + ' VNĐ';
}

function closePopup() {
    document.getElementById('bookingPopup').style.display = 'none';
    document.getElementById('confirmationMessage').style.display = 'none'; // Ẩn thông báo khi đóng popup
}

function submitBooking(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const message = `Đặt lịch thành công cho dịch vụ ${document.getElementById('serviceName').querySelector('span').innerText} vào ${date} lúc ${time}.`;
    
    // Hiển thị thông báo thành công
    document.getElementById('confirmationMessage').innerText = message;
    document.getElementById('confirmationMessage').style.display = 'block';

    // Đóng popup sau 3 giây
    setTimeout(closePopup, 3000);
}

function cancelBooking() {
    const message = `Đã hủy đặt lịch cho dịch vụ ${document.getElementById('serviceName').querySelector('span').innerText}.`;
    
    // Hiển thị thông báo hủy
    document.getElementById('confirmationMessage').innerText = message;
    document.getElementById('confirmationMessage').style.display = 'block';

    // Đóng popup sau 3 giây
    setTimeout(closePopup, 3000);
}
