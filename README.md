# 🚀 Cloud & DevOps Portfolio — Koushik Bijili

A production-focused portfolio showcasing real-world cloud infrastructure, automation, and DevOps practices.
Built with a focus on scalability, reliability, and automated deployment workflows.

---

## 🌐 Live Demo

* https://koushikbijili.site
* https://my-portfolio-website-six-navy.vercel.app/

---

## 🧠 What This Portfolio Demonstrates

* Infrastructure design using real-world cloud concepts
* Deployment automation and CI/CD workflows
* Scalable and reliable system architecture
* Monitoring, failure handling, and recovery patterns

---

## 🏗️ Tech Stack

### Frontend

* React (Create React App)
* Custom CSS

### Cloud & DevOps

* AWS (EC2, VPC, ALB, Auto Scaling, IAM)
* Terraform (Infrastructure as Code)
* Docker (Containerization)
* Jenkins (CI/CD Pipelines)

### Deployment

* Vercel (Hosting + CI/CD)
* GitHub (Version Control)

---

## 📂 Project Highlights

### 1. Scalable Cloud Infrastructure (Terraform)

* Designed AWS infrastructure using Terraform
* Implemented VPC, subnets, NAT Gateway, ALB, Auto Scaling
* Used S3 + DynamoDB for remote state management
* Fully automated — no manual AWS console setup

---

### 2. CI/CD Pipeline Automation

* Built Jenkins pipeline (Build → Push → Deploy)
* Integrated Docker for containerized deployments
* Configured GitHub webhooks for automatic triggers
* Eliminated manual deployment steps

---

### 3. Self-Healing Infrastructure

* Implemented Auto Scaling with Load Balancer
* Configured CloudWatch monitoring and alarms
* Integrated SNS for real-time alerts
* Validated recovery using failure simulation

---

## ⚙️ Local Setup

Clone the repository:

```bash
git clone https://github.com/koushikbijili/My-Portfolio-Website.git
cd My-Portfolio-Website
```

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm start
```

Build for production:

```bash
npm run build
```

---

## 🚀 Deployment & Domain Setup

This project is deployed using **Vercel**, with automatic CI/CD and HTTPS enabled.

### 🔄 CI/CD Workflow

1. Code is pushed to GitHub (`main` branch)
2. Vercel detects changes automatically
3. Runs:

   ```bash
   npm install
   npm run build
   ```
4. Generates optimized production build
5. Deploys globally via CDN

👉 Every push = automatic deployment

---

### 🌐 Custom Domain

```text
https://koushikbijili.site
```

#### DNS Configuration

* **A Record**

  * Host: `@`
  * Value: `76.76.21.21`

* **CNAME Record**

  * Host: `www`
  * Value: `cname.vercel-dns.com`

---

### 🔐 SSL & HTTPS

* SSL certificates provided automatically by **Let’s Encrypt**
* HTTPS enforced by default
* Automatic certificate renewal
* HTTP → HTTPS redirection enabled

---

### ⚙️ Deployment Features

* Zero-downtime deployments
* Automatic rebuild on every push
* Global CDN distribution
* No manual server management

---

## 📬 Contact

* Email: [koushikbijili48@gmail.com](mailto:koushikbijili48@gmail.com)
* LinkedIn: https://linkedin.com/in/koushikbijili
* GitHub: https://github.com/koushikbijili

---

## ⚡ Key Focus

* Build scalable and reliable cloud systems
* Automate infrastructure and deployments
* Keep systems simple and production-ready
* Focus on real-world problem solving

---

## 🧩 Note

This portfolio reflects hands-on DevOps learning and real-world implementation of cloud infrastructure and automation practices.
