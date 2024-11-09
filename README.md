# AI Image Generation App

## Introduction
This project is a Next.js application that uses artificial intelligence to generate images based on user prompts. It utilizes technologies such as Next.js, Tailwind UI, Prisma ORM, and PostgreSQL.

## Technologies Used
- **Next.js**: A React framework for server-side rendering.
- **Tailwind UI**: A utility-first CSS framework.
- **Prisma ORM**: An open-source database toolkit.
- **PostgreSQL**: A powerful, open-source object-relational database system.

## Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/chandanone/image_gen
    cd image_gen
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Set up the PostgreSQL database:
    - Create a new database in PostgreSQL.
    - Update the `.env` file with your database connection details.

4. Run the Prisma migrations to set up the database schema:
    ```sh
    npx prisma migrate dev
    ```

5. Start the development server:
    ```sh
    npm run dev
    ```

## Usage
1. Open the app in your browser at `http://localhost:3000`.
2. Enter a prompt in the input field and submit.
3. The AI will generate an image based on your prompt and display it on the screen.
4. The user geenrated images can be viewd by lcicking the user profile image icon.

## Features
- User-friendly interface with Tailwind UI.
- Real-time image generation based on user input.
- Secure and efficient data handling with Prisma ORM and PostgreSQL.

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License
This project is licensed under the MIT License.

## Contact
For any questions or support, please contact [Chandan](mailto:chandan868@gmail.com).
