# Kalah IO

A web application for people who want to play mancala with others online.

I wanted to build this app for mancala enthusiasts as I felt that the game is underrepresented
and could use an update. Most mancala games I found online looked like they were
created in the noughties and I felt they could use an upgrade featuring a sleaker UI.
In addition, most mancala games online seem to only feature an AI opponent, Kalah IO
uses WebSockets so users can play eachother in real time.

## Technologies Used

- React.js
- Webpack
- Materialize CSS
- Node.js
- Socket.io
- PostgreSQL
- HTML5
- CSS3
- Heroku

## Live Demo

Try the application live at [http://kalah-io.herokuapp.com/](http://kalah-io.herokuapp.com/)

## Features Implemented

- User can create a unique screen name
- User can create a game room
- User can connect to a game room
- User can take their turn
- User can win/lose/tie

## Stretch Features

- User can capture opponent's pieces
- User can spectate ongoing games
- User can chat with other users
- User can challenge other player to rematch

## Preview

![Kalah IO Login](https://raw.githubusercontent.com/ry-zhao/final-project/master/server/public/images/kalah-1.gif)
![Playing Mancala](https://raw.githubusercontent.com/ry-zhao/final-project/master/server/public/images/kalah-2.gif)

## Development

### System Requirements

- Node.js 10 or higher
- NPM 6 or higher
- PostgreSQL

### Getting Started

1. Clone the repository.

    ```shell
    git clone https://github.com/ry-zhao/kalah-io.git
    cd kalah-io
    ```

2. Install all dependencies with NPM.

    ```shell
    npm install
    ```

3. Import the example database to PostgreSQL.

    ```shell
    npm run db:import
    ```

4. Copy .env file

    ```shell
    cp .env.example .env
    ```

5. Start the project. Once started view the app by opening localhost:3000 in browser.

    ```shell
    npm run dev
    ```
