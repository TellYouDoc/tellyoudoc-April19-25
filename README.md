# TellYouDoc Web Application

This is the web client for TellYouDoc, a comprehensive platform for doctors and administrators to manage patients, appointments, and medical records. The application is built with React and Vite, providing a fast and modern user experience.

## Tech Stack

- **Framework:** [React](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **UI Library:** [Ant Design](https://ant.design/)
- **Routing:** [React Router](https://reactrouter.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Charting:** [Recharts](https://recharts.org/)
- **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your_username/tellyoudoc-web.git
   ```
2. Navigate to the project directory:
   ```sh
   cd tellyoudoc-web
   ```
3. Install NPM packages:
   ```sh
   npm install
   ```

### Running the Application

To start the development server, run:

```sh
npm run dev
```

This will start the application on `http://localhost:5173`.

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run lint`: Lints the code using ESLint.
- `npm run preview`: Serves the production build locally.

## API Configuration

The application is configured to proxy API requests from `/api/v1` to `https://api.tellyoudoc.com`. This is configured in the `vite.config.js` file.
