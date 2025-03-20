
# Bamboo Marketplace

Bamboo Marketplace is an e-commerce platform designed to connect dealers and citizens, with an admin interface for platform management. Dealers can list products, citizens can place orders, and admins can oversee platform activities. The project is built with a Node.js backend, MongoDB database, and a React frontend.

## Features
- **User Roles**:
  - **Citizens**: Can browse products, add to cart, place orders, and view order history.
  - **Dealers**: Can add, update, and delete products, and manage order statuses (Pending, Accepted, Packing, Shipped, Delivered, Cancelled).
  - **Super Admin**: Can view platform statistics (e.g., total users, products, orders).
- **Product Management**:
  - Dealers can add products with details like name, description, price, stock, image, and category.
  - Products are categorized (e.g., Bamboo Products, Food, Decor).
- **Order Management**:
  - Citizens can place orders, and dealers can update order statuses.
  - Order status updates reflect in the citizen’s order history.
- **Search and Filters**:
  - Search products by name.
  - Sort products by price (low to high, high to low).
  - Filter products by category.
- **Cart and Checkout**:
  - Add products to cart and checkout to place an order.
- **Session Management**:
  - Auto-logout after 30 minutes of inactivity.
- **Security**:
  - JWT-based authentication for secure access.
  - Route protection to restrict access based on user roles.

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker, Docker Compose
- **Web Server (Frontend)**: Nginx (for production)

## Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (v4.4 or higher)
- **Docker** (optional, for containerized setup)
- **Docker Compose** (optional, for containerized setup)

## Project Structure
```
bamboo-marketplace/
├── client/               # React frontend
│   ├── src/
│   │   ├── pages/      # React components for pages (e.g., DealerDashboard.js, Orders.js)
│   │   ├── services/   # API service (e.g., api.js for Axios)
│   │   └── ...
│   ├── Dockerfile        # Dockerfile for frontend
│   ├── nginx.conf        # Nginx configuration for frontend
│   ├── package.json
│   └── ...
├── server/               # Node.js backend
│   ├── models/          # Mongoose models (e.g., User.js, Product.js, Order.js)
│   ├── routes/          # API routes (e.g., users.js, products.js, orders.js)
│   ├── middleware/      # Middleware (e.g., auth.js for JWT)
│   ├── Dockerfile       # Dockerfile for backend
│   ├── server.js
│   ├── package.json
│   └── ...
├── docker-compose.yml    # Docker Compose configuration
└── README.md
```

## Setup and Running Locally

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/bamboo-marketplace.git
cd bamboo-marketplace
```

### 2. Set Up the Backend
1. Navigate to the backend directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory with the following content:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/bamboo-marketplace
   JWT_SECRET=your_jwt_secret_here
   ```
   Replace `your_jwt_secret_here` with a secure secret key (e.g., a random string like `mysecretkey123`).
4. Start the MongoDB server locally (if not already running):
   ```bash
   mongod
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5000`.

### 3. Set Up the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory with the following content:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000`.

### 4. Access the Application
- Open your browser and go to `http://localhost:3000`.
- **Default Users**:
  - **Citizen**: Email: `test@example.com`, Password: `password123`
  - **Dealer**: Email: `dealer@example.com`, Password: `dealer123`
  - **Super Admin**: Email: `admin@example.com`, Password: `admin123`

## Setup and Running with Docker

### 1. Build and Run with Docker Compose
1. Ensure Docker and Docker Compose are installed on your system.
2. From the root directory (`bamboo-marketplace`), create a `.env` file with the following content:
   ```env
   MONGO_URI=mongodb://mongo:27017/bamboo-marketplace
   JWT_SECRET=your_jwt_secret_here
   ```
   Replace `your_jwt_secret_here` with a secure secret key.
3. Build and start the containers:
   ```bash
   docker-compose up --build
   ```
   This will:
   - Build and run the backend on `http://localhost:5000`.
   - Build and run the frontend on `http://localhost:80`.
   - Run MongoDB with a persistent volume for data.

### 2. Access the Application
- Open your browser and go to `http://localhost`.
- Use the default users listed above to log in.

### 3. Stop the Containers
To stop the containers, run:
```bash
docker-compose down
```
To stop and remove volumes (e.g., to clear MongoDB data):
```bash
docker-compose down -v
```

## Production Deployment Notes
- **Environment Variables**:
  - Store sensitive data (e.g., `JWT_SECRET`, `MONGO_URI`) in a secure secrets management system (e.g., AWS Secrets Manager, Docker Secrets).
  - Avoid hardcoding sensitive data in the `Dockerfile` or `docker-compose.yml`.
- **HTTPS**:
  - Use a reverse proxy like Nginx or a cloud provider’s load balancer to enable HTTPS.
  - Obtain an SSL certificate (e.g., via Let’s Encrypt) and configure it in your production environment.
- **Scaling**:
  - Use Kubernetes or Docker Swarm for scaling and managing containers in production.
  - Configure a load balancer to distribute traffic across multiple backend instances.
- **Monitoring and Logging**:
  - Set up monitoring with tools like Prometheus and Grafana.
  - Use a logging solution like the ELK Stack (Elasticsearch, Logstash, Kibana) to aggregate and analyze logs.
- **Backup**:
  - Regularly back up the MongoDB data volume using a backup tool or script.
  - Store backups in a secure location (e.g., AWS S3).
- **Security**:
  - Ensure all containers run with the least privileges necessary.
  - Regularly update dependencies to patch security vulnerabilities (e.g., run `npm audit fix` in both `server` and `client` directories).
  - Use a Web Application Firewall (WAF) in production to protect against common attacks.

## Troubleshooting
- **Backend Fails to Connect to MongoDB**:
  - Ensure MongoDB is running locally (`mongod`) or the Docker MongoDB container is up.
  - Verify the `MONGO_URI` in the `.env` file.
- **Frontend Cannot Connect to Backend**:
  - Ensure the backend is running on `http://localhost:5000`.
  - Verify the `REACT_APP_API_URL` in the frontend `.env` file.
- **Docker Issues**:
  - Check container logs: `docker-compose logs`.
  - Ensure ports 80 and 5000 are not in use by other processes.

## Contributing
1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Make your changes and commit: `git commit -m "Add your feature"`.
4. Push to your branch: `git push origin feature/your-feature`.
5. Create a pull request.

