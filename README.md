Breadcram Project Documentation

Overview
The Breadcram Project is a platform designed to provide seamless content organization and management. It integrates features like category management, video uploads, user authentication, folder organization, and social connections such as followers and followings. Future plans include integrating payment systems like Payless and MPesa Daraja for monetization and subscription services.

Current Status
The project includes the following functionalities and API endpoints:

1. API Routes Initialization
File: src/routes/index.ts
The initializeRoutes function registers all major API routes under a versioned /api/{version}/ structure, as defined by appVersion.

Registered Routes:
Ping: Basic health check.
Categories: Manage content categories.
Videos: Video upload and retrieval.
Authentication: User registration, login, and social interactions.
Folders: Folder management for organization.
Pending:

Admin Routes: Not yet integrated (AdminRoutes is commented out).


2. Authentication and User Management
File: src/routes/auth.routes.ts
Endpoints:

User Registration: /register
Login: /login
Refresh Token: /refresh-token
User Management:
Update user: /user/:id
Delete all users: /users
Delete single user: /user/:id
Get all users: /users
Get user by ID: /users/:id
Password Management:
Reset password: /reset-password
Reset password with code: /reset-password-with-code
Social Interactions:
Follow user: /follow/:userId
Unfollow user: /unfollow/:userId
Get following: /following/:userId
Get followers: /followers/:userId
Middleware:

validateApiKey: Ensures API key authentication.
validate: Standard validation middleware for request payloads.

3. Categories Management
File: src/routes/category.routes.ts
Endpoints:

Add Category: /add-category
Get All Categories: /all
Select Categories as User: /select-categories
Features:

Categories can be added and listed.
Users can personalize their content preferences.

4. Folder Management
File: src/routes/folder.routes.ts
Endpoints:

Create Folder: /new
Update Folder: /update/:folderId
List All Folders: /all
Delete Folder: /delete/:folderId
Features:

Includes file upload middleware (coverImageUpload) for folder cover images.
Supports create, update, delete, and retrieval operations.


5. Video Management
File: src/routes/video.routes.ts
Endpoints:

Create Video: /video
List All Videos: /all
Features:

Video content can be uploaded and retrieved.


6. Miscellaneous
Ping Endpoint
File: src/routes/ping.ts
A simple health check to ensure the application is operational.


Pending Integrations
1. Payment Options
Integrating payment systems is a priority for monetization. Plans include:

Payless API for subscription-based payments.
MPesa Daraja API for local mobile money transactions.
2. Admin Routes
Not yet implemented.
Will include features like managing users, content moderation, and analytics.
Future Roadmap
Payment System Integration

Finalize Payless and MPesa Daraja API integration.
Implement payment validators and transaction logs.


Admin Features

Enable AdminRoutes.
Add admin-specific endpoints for advanced content and user management.


Testing and Deployment

Complete unit and integration tests for all APIs.
Deploy the application to a production environment.

How to Use

Setting Up
Clone the repository.
Install dependencies: npm install.
Run the development server: npm run dev.
API Structure
Base URL: /api/{appVersion}/
Use a valid API key in requests (X-API-KEY header).


\*This documentation will evolve as the project progresses and features are implemented.