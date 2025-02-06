# Supply Chain DApp

## Context

The idea would be to create a DApp where packages are represented in the form of tokens, allowing their delivery to be tracked and certain business rules to be automated using smart contracts.

## 1. Tokenization of resources
- Each package is a SFT (Semi-Fungible Token) representing a unique delivery.
- Token attributes:
  - trackingID: unique identifier of the package
  - sender and recipient: blockchain addresses
  - status: "Pending", "In transit", "Delivered"
  - IPFS hash: Metadata containing related documents (invoice, proof of deposit, etc.)
  - timestamp of creation and last update

## 2. Token exchanges
   - A package can change status at each stage of the process (collection, transit, delivery).
   - Each delivery person can be a node in the network validating transactions (decentralized delivery).
   - Possibility of exchanging packages between carriers via smart contracts, validating the legitimacy of the transfer.

## 3. Possession limits
   - A delivery person can only transport a limited number of packages (example: 5 max at a time).
   - A customer cannot order beyond a certain daily capacity.

## 4. Time constraints
   - A minimum delay is imposed before a delivery person can accept a new package after a delivery.
   - A package cannot be transferred before a certain time after its deposit.

## 5. IPFS for storage
   - Storage of proof of delivery, labels, digital signatures on IPFS.

## 6. Unit tests with Hardhat or Anchor
   - Tests on transfer validation, status management and integrity of data stored on IPFS.
   Potential use cases
   - A peer-to-peer delivery service where independent delivery people take charge of packages in exchange for crypto payments.
   - A decentralized logistics network where each actor (carriers, hubs, customers) is a validator node.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
