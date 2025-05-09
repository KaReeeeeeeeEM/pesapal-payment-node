# Pesapal Payment API Integration (Node.js)

This README outlines the steps to integrate with the Pesapal Payment API using the provided Node.js controller. This controller handles token generation, IPN setup, payment requests, and response handling.

## Prerequisites

* Node.js and npm (or pnpm) installed on your system.
* A `.env` file in your project root with the following Pesapal API credentials and URLs:
    ```
    PESAPAL_CONSUMER_KEY=YOUR_CONSUMER_KEY
    PESAPAL_CONSUMER_SECRET=YOUR_CONSUMER_SECRET
    PESAPAL_IPN_URL=YOUR_PESAPAL_IPN_SETUP_URL
    PESAPAL_TOKEN_URL=YOUR_PESAPAL_TOKEN_GENERATION_URL
    PESAPAL_API_URL=YOUR_PESAPAL_API_BASE_URL
    ```

## Setup

1.  **Install Dependencies:**
    ```bash
    pnpm install
    # or
    npm install
    ```

2.  **Create `.env` file:**
    Create a `.env` file in the root of your project and populate it with your Pesapal API credentials and URLs as mentioned in the Prerequisites.

## API Endpoints

This controller exposes the following endpoints:

### 1. Request Payment Token (`/api/pesapal/token`)

* **Method:** `POST`
* **Description:** Requests an authentication token from the Pesapal API. This token is required for subsequent API calls.
* **Request Body:** None (credentials are taken from `.env`).
* **Response (Success - Status 200):**
    ```json
    {
      "success": true,
      "message": "Token generated successfully",
      "data": {
        // Token details from Pesapal
      }
    }
    ```
* **Response (Failure - Status 500):**
    ```json
    {
      "success": false,
      "message": "Failed to make payment",
      "data": {
        // Error details from Pesapal
      }
    }
    ```

### 2. Get IPN List (`/api/pesapal/ipn/list`)

* **Method:** `POST`
* **Description:** Retrieves a list of your registered Instant Payment Notification (IPN) URLs on Pesapal.
* **Request Body:**
    ```json
    {
      "token": "YOUR_GENERATED_TOKEN"
    }
    ```
* **Headers:** Requires the authentication `token` obtained from the `/api/pesapal/token` endpoint in the `Authorization` header as a Bearer token.
* **Response (Success - Status 200):**
    ```json
    {
      "success": true,
      "message": "List fetched successfully",
      "data": [
        // Array of IPN URLs
      ]
    }
    ```
* **Response (Failure - Status 500):**
    ```json
    {
      "success": false,
      "message": "Failed to get list",
      "data": {
        // Error details from Pesapal
      }
    }
    ```

### 3. Request IPN Setup (`/api/pesapal/ipn/setup`)

* **Method:** `POST`
* **Description:** Registers an IPN URL with Pesapal to receive payment notifications.
* **Request Body:**
    ```json
    {
      "token": "YOUR_GENERATED_TOKEN"
    }
    ```
* **Headers:** Requires the authentication `token` obtained from the `/api/pesapal/token` endpoint in the `Authorization` header as a Bearer token. The `url` for the IPN is hardcoded in the controller (`https://winga-v2.vercel.app`) and the `ipn_notification_type` is set to `POST`.
* **Response (Success - Status 200):**
    ```json
    {
      "success": true,
      "message": "IPN generated successfully",
      "data": {
        // IPN setup details from Pesapal
      }
    }
    ```
* **Response (Failure - Status 500):**
    ```json
    {
      "success": false,
      "message": "Failed to generate IPN",
      "data": {
        // Error details from Pesapal
      }
    }
    ```

### 4. Make Payment (`/api/pesapal/make-payment`)

* **Method:** `POST`
* **Description:** Initiates a payment request to Pesapal.
* **Request Body:**
    ```json
    {
      "token": "YOUR_GENERATED_TOKEN",
      "ipn_id": "THE_ID_OF_YOUR_REGISTERED_IPN"
      // ... other payment details as defined in PaymentPayload type
    }
    ```
    The `requestPayload` within the controller provides an example of the data structure expected by Pesapal. Ensure you adjust this according to your specific payment requirements.
* **Headers:** Requires the authentication `token` obtained from the `/api/pesapal/token` endpoint in the `Authorization` header as a Bearer token.
* **Response (Success - Status 200):**
    ```json
    {
      "success": true,
      "message": "Payment notification sent successfully",
      "data": {
        // Payment initiation response from Pesapal
      }
    }
    ```
* **Response (Failure - Status 500):**
    ```json
    {
      "success": false,
      "message": "Payment notification sent successfully",
      "data": {
        // Error details from Pesapal
      }
    }
    ```

### 5. Payment Response (`/api/pesapal/payment-response`)

* **Method:** `POST`
* **Description:** This endpoint is intended to receive the callback or IPN data sent by Pesapal after a transaction. It currently logs the received data to the console. You will need to implement your own logic here to handle the payment status updates.
* **Request Body:** The data sent by Pesapal regarding the transaction.
* **Response:** Currently, this endpoint does not send a specific JSON response back. You should implement appropriate response logic based on your application's needs.

## Usage

1.  Start your Node.js server.
2.  Use a tool like Postman, Insomnia, or `curl` to make requests to the API endpoints described above.

## Important Notes

* Ensure your `.env` file is correctly configured with your Pesapal API credentials and URLs.
* The IPN URL in the `requestIPN` function is currently hardcoded. You might want to make this configurable.
* The `makePayment` function includes a sample `requestPayload`. You will need to dynamically generate this payload based on the specific transaction details.
* The `paymentResponse` endpoint currently only logs the response. You need to implement the logic to handle the payment status updates in your database and potentially notify the user.

---

Feel free to ask if you have any questions or need further clarification!