# Project Management System

This repository contains the code for the Project Management System, a tool to manage and track your projects and tasks effectively.


## I. Run the Project Locally

### Prerequisites

Make sure you have the following installed:

- **Node.js**: Version 20 or later
- **Yarn**: Package manager for Node.js
- **PostgreSQL**: You can either:
  1. Use your own PostgreSQL instance, **OR**
  2. Run a PostgreSQL container using Docker:
     ```bash
     docker run -d \
       --name project-management-dev \
       -e POSTGRES_USER=your_username \
       -e POSTGRES_PASSWORD=your_password \
       -e POSTGRES_DB=your_db_name \
       -p 5432:5432 \
       postgres:14.1-alpine
     ```

### Steps to Run

1. **Install Dependencies**  
   Run the following command to install all required packages:
   ```bash
   yarn
   ```

2. **Set Up Environment Variables**  
   Create or edit the file `/config/default.yaml` to include:
   - Database connection details
   - Mail server settings

3. **Start the project**  
   ```bash
   yarn start:dev
   ```


## II. Deploy the Project

### Prerequisites
Make sure you have the following tools installed:
- **Docker**
- **Docker Compose**

### Deployment Steps
1. **Set Up Environment Variables**  
   Create or edit the file `/config/default.yaml` to include:
   - Database connection details
   - Mail server settings

2. **Build and Start the Containers**  
   Run the following command to deploy the project:
   ```bash
   docker compose up -d --build
   ```
