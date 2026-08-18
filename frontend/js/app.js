// 1. Create the SwiftCourier global object if it doesn't exist yet
window.SwiftCourier = window.SwiftCourier || {};

// 2. Define the exact function the HTML buttons are looking for
window.SwiftCourier.toggleTheme = function() {
    // Toggle a 'dark-theme' class on the body of the webpage
    document.body.classList.toggle('dark-theme');
    
    // Find the icon inside the button so we can swap it
    const themeIcon = document.querySelector('.theme-toggle i');
    
    // Save the choice so it doesn't reset when you change pages
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    } else {
        localStorage.setItem('theme', 'light');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
};

// 3. Automatically apply the saved theme as soon as any page loads
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('.theme-toggle i');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
});
// Global Logout Function
window.logoutUser = function(event) {
    if(event) event.preventDefault();
    // Destroy the tokens
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    // Send them to the login page and trigger the logout animation!
    window.location.href = 'login.html?loggedOut=true';
};
// Global Logout Function
window.logoutUser = function(event) {
    if(event) event.preventDefault();
    // Destroy the tokens
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    // Send them to the login page and trigger the logout animation!
    window.location.href = 'login.html?loggedOut=true';
};