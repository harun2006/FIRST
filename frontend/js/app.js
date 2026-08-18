<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SwiftCourier - Login</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    /* Basic centering for the login box */
    .auth-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; }
    .auth-box { width: 100%; max-width: 400px; padding: 40px; text-align: center; border-radius: 16px; }
    .form-group { text-align: left; margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 600; }
    .form-group input { width: 100%; padding: 12px; border: 1px solid var(--glass-border); border-radius: 8px; background: rgba(255, 255, 255, 0.1); color: var(--text-primary); }
  </style>
</head>
<body>

  <!-- Navigation Bar -->
  <nav class="navbar">
    <a href="index.html" class="logo"><i class="fas fa-box-open"></i> SwiftCourier</a>
    <div class="nav-btns">
      <button class="theme-toggle" onclick="SwiftCourier.toggleTheme()">
        <i class="fas fa-moon"></i>
      </button>
      <a href="register.html" class="btn btn-primary">Register</a>
    </div>
  </nav>

  <!-- Login Form -->
  <div class="auth-container">
    <div class="auth-box glass">
      <h2 style="margin-bottom: 25px; color: var(--text-primary);">Welcome Back</h2>
      
      <!-- Notice the id="loginForm" here -->
      <form id="loginForm">
        <div class="form-group">
          <label>Username / Email</label>
          <input type="text" id="loginId" placeholder="admin@swiftcourier.com" required>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="loginPassword" placeholder="........" required>
        </div>
        
        <p id="errorMessage" style="color: #f44336; font-size: 0.9rem; margin-bottom: 10px; display: none;"></p>
        
        <button type="submit" class="btn btn-primary" style="width: 100%; font-size: 1.1rem; padding: 12px;">Sign In</button>
      </form>
      
      <p style="margin-top: 20px; font-size: 0.9rem; color: var(--text-muted);">
        Don't have an account? <a href="register.html" style="color: #FF9800; font-weight: bold; text-decoration: none;">Register here</a>
      </p>
    </div>
  </div>

  <script src="js/app.js"></script>
  
  <!-- THE MAGIC JAVASCRIPT -->
  <script>
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        
        // 1. STOP THE BROWSER FROM REFRESHING THE PAGE!
        event.preventDefault(); 
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const loginId = document.getElementById('loginId').value;
        const password = document.getElementById('loginPassword').value;
        const errorMsg = document.getElementById('errorMessage');
        
        // UI Update: Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;
        errorMsg.style.display = 'none';

        try {
            // 2. Fetch from your Live Render Backend
            const response = await fetch('https://swiftcourier-backend-live.onrender.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginId, password: password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // 3. Save tokens to Local Storage
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.role);
                
                // 4. Smart Redirect based on Role
                if (data.role === 'admin') window.location.href = 'admin.html';
                else if (data.role === 'branch') window.location.href = 'branch.html';
                else if (data.role === 'agent') window.location.href = 'delivery.html';
                else if (data.role === 'customer') window.location.href = 'customer.html';
                else window.location.href = 'index.html'; // Fallback
            } else {
                // Display the error from the backend (e.g., "Invalid password")
                errorMsg.textContent = data.error || 'Login failed';
                errorMsg.style.display = 'block';
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error("Login Error:", error);
            errorMsg.textContent = "Cannot connect to server. Please try again.";
            errorMsg.style.display = 'block';
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
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
  </script>
</body>
</html>