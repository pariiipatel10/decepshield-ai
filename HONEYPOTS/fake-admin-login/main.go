package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

type LoginEvent struct {
	Timestamp string `json:"timestamp"`
	IP        string `json:"ip"`
	UserAgent string `json:"user_agent"`
	Username  string `json:"username"`
	Password  string `json:"password"`
	EventType string `json:"event_type"`
	RiskScore int    `json:"risk_score"`
}

func main() {
	http.HandleFunc("/", showLoginPage)
	http.HandleFunc("/login", captureLogin)

	fmt.Println("Fake admin honeypot running on http://localhost:8081")
	log.Fatal(http.ListenAndServe(":8081", nil))
}

func showLoginPage(w http.ResponseWriter, r *http.Request) {
	html := `
	<!DOCTYPE html>
	<html>
	<head>
		<title>Admin Portal</title>
		<style>
			body {
				font-family: Arial, sans-serif;
				background: #0f172a;
				color: white;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100vh;
			}
			.login-box {
				background: #111827;
				padding: 30px;
				border-radius: 8px;
				width: 320px;
			}
			input, button {
				width: 100%;
				padding: 10px;
				margin-top: 12px;
			}
			button {
				background: #2563eb;
				color: white;
				border: none;
				cursor: pointer;
			}
		</style>
	</head>
	<body>
		<div class="login-box">
			<h2>Admin Portal</h2>
			<form method="POST" action="/login">
				<input name="username" placeholder="Username" required />
				<input name="password" type="password" placeholder="Password" required />
				<button type="submit">Login</button>
			</form>
		</div>
	</body>
	</html>`
	w.Write([]byte(html))
}

func captureLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	username := r.FormValue("username")
	password := r.FormValue("password")

	event := LoginEvent{
		Timestamp: time.Now().Format(time.RFC3339),
		IP:        r.RemoteAddr,
		UserAgent: r.UserAgent(),
		Username:  username,
		Password:  password,
		EventType: classifyAttempt(username, password),
		RiskScore: calculateRisk(username, password),
	}

	saveEvent(event)

	http.Error(w, "Invalid username or password", http.StatusUnauthorized)
}

func classifyAttempt(username string, password string) string {
	if username == "admin" || username == "root" {
		return "credential_attack"
	}

	if password == "admin" || password == "password" || password == "123456" {
		return "weak_password_attempt"
	}

	return "login_probe"
}

func calculateRisk(username string, password string) int {
	score := 40

	if username == "admin" || username == "root" {
		score += 25
	}

	if password == "admin" || password == "password" || password == "123456" {
		score += 25
	}

	if len(password) < 6 {
		score += 10
	}

	if score > 100 {
		return 100
	}

	return score
}

func saveEvent(event LoginEvent) {
	file, err := os.OpenFile("events.jsonl", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Println("Error opening events file:", err)
		return
	}
	defer file.Close()

	data, err := json.Marshal(event)
	if err != nil {
		log.Println("Error encoding event:", err)
		return
	}

	file.WriteString(string(data) + "\n")
}
