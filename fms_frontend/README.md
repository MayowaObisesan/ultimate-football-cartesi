# Getting Started with Ultimate Football Frontend

## Install all dependencies and start the application

Inside the root directory of the project, hit the following commands.

```yarn```<br>
```yarn dev```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Sending inputs

**@ethersproject/providers**: We use `ethers` library to communicate with Cartesi rollups on-chain smart contracts.

**@cartesi/rollups**: To save you the hassle of creating some generic smart contracts in solidity, we have a package to get all the contracts and respective ABIs. In this project we’ll use `ERC20Portal` and `InputBox` contracts.

### Reading outputs

Cartesi rollups framework uses GraphQL server in the node to help developers query outputs of a dapp. This project uses Apollo graphql client.

### Components

Ultimate football front-end is divided into 3 main components.

1. `Single Player Mode` - the single player mode. i.e., the game mode played against the computer.
2. `VS Player Mode (Dual Player Mode)` - Contains the code that powers the dual game mode, i.e., the game mode played against other players.

This project is a work in progress.
