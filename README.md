# ShareWave

A portal that allows users to share text, images and videos. It includes a rating system as well as a comment section under each post.

Project available at https://share-wave.netlify.app/

## Description

Project currently still in development. It is my most ambitious application this far, it includes a lot of asynchronous requests and conditional rendering.

The main features are:

- Email/Google sign in using Firebase
- Account page with user details, posts and password change option
- Adding text/image/video posts
- Post rating and comments
- Admin/User permissions

## Tech stack

- React - Hooks / Router / Context
- Firebase - Authentication / Firestore DB / Storage
- Material UI
- SCSS

## Installation
After cloning the repository, copy the keys from .env.example into .env

Then create a firebase project and provide your values to appropriate keys

Install locally
```sh
npm install
```
then start it

```sh
npm start
```
After starting available at http://localhost:3001
