<div align="center">
  <img src="https://github.com/emnaboukhris/deploiment-tp1/assets/79046370/a6e25e92-f5df-46b6-8051-47a549fdb1c1" alt="GitHub Logo" width="100">
</div>
# GitHub Repositories Search Application


## Overview

The **GitHub Repositories Search Application** is a user-friendly web app built with React and TypeScript. It enables users to search for a GitHub user by their username, view user details, and explore their repositories. The application offers an intuitive and responsive interface for an optimal user experience.

## Key Features

- **User Search:** Search for a GitHub user by their username.
- **User Profile:** View profile page.
- **Repository List:** Browse a list of the user's repositories.
- **Filter and Sort:** Refine and order repositories by name, programming language, and creation date.
- **Light and Dark Mode:** Choose between light and dark themes for accessibility.
- **Responsive Design:** Enjoy a consistent experience across various devices.
- **Loading and Error States:** Get smooth transitions and handling for seamless interactions.
- **Clear Filters:** Easily reset filters and start a new search.

## Technologies Used

- **React:** The core library for building the user interface.
- **TypeScript:** Adds static types to JavaScript for improved code quality.
- **Material-UI:** Provides a sleek, customizable design system.
- **Apollo Client:** Fetches data from the GitHub API efficiently.

## Getting Started

Follow these steps to run the application locally:

**1. Clone the Repository:**

```bash
git clone <repository-url>
cd github-repositories-search
```
2. Install Dependencies:
```bash
npm install
```
3. Create a GitHub Personal Access Token:

Visit GitHub Personal Access Tokens to create a token.
The token should have the repo and user scopes.

4. Create an Environment Variable:
- Create a .env file in the project root.
- Add your GitHub Personal Access Token to the file:
```bash
REACT_APP_GITHUB_ACCESS_TOKEN=YOUR_ACCESS_TOKEN
```
5. Run the Application:
```bash
npm start
```

## Running Storybook

To run Storybook, use the following command:

```bash
npm run storybook
```

This will start Storybook, allowing you to interact with and view individual components.
You can access Storybook by opening a web browser and navigating to http://localhost:6006.


## Future Improvements
- Enhance the user interface further for better user experience.
- Implement additional search options and filters.
- Add user authentication and allow users to search for their own repositories.
- Write comprehensive tests for the application.



## Deployment
You can visit the deployed application "https://653de2762de5723560e6eeac--elegant-gecko-c64c69.netlify.app/". 
Enjoy exploring the GitHub Repositories Search Application in action!



