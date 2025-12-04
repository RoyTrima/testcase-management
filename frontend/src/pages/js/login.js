function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
  
    if (user === "admin" && pass === "admin") {
      localStorage.setItem("loggedIn", "true");
      window.location.href = "/pages/home.html";
    } else {
      alert("Username/password salah");
    }
  }
  