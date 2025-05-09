import { PaymentPayload, TokenRequestPayload } from "../types";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const PESAPAL_IPN_URL = process.env.PESAPAL_IPN_URL;
const PESAPAL_TOKEN_URL = process.env.PESAPAL_TOKEN_URL;
const PESAPAL_API_URL= process.env.PESAPAL_API_URL;

// Function to request payment tokens
export const requestToken = async (req: Request,res: Response): Promise<any> => {
  try {
    const response = await fetch(PESAPAL_TOKEN_URL as string, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        consumer_key: process.env.PESAPAL_CONSUMER_KEY,
        consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
      }),
    });

    const paymentResponse = await response.json();

    if (response.status === 200) {
      // Send the response
      res.status(200).json({
        success: true,
        message: "Token generated successfully",
        data: paymentResponse,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to make payment",
        data: paymentResponse,
      });
    }
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getIPNList = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { token } = req.body as any;
    const response = await fetch(`${PESAPAL_API_URL}/URLSetup/GetIpnList` as string, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const paymentResponse = await response.json();

    if (response.status === 200) {
      // Send the response
      res.status(200).json({
        success: true,
        message: "List fetched successfully",
        data: paymentResponse,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to get list",
        data: paymentResponse,
      });
    }
  } catch (error) {
    console.error("Error fetching list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const requestIPN = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token } = req.body as any;
    const response = await fetch(PESAPAL_IPN_URL as string, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: "https://winga-v2.vercel.app",
        ipn_notification_type: "POST",
      }),
    });

    const paymentResponse = await response.json();

    if (response.status === 200) {
      // Send the response
      res.status(200).json({
        success: true,
        message: "IPN generated successfully",
        data: paymentResponse,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to generate IPN",
        data: paymentResponse,
      });
    }
  } catch (error) {
    console.error("Error generating IPN:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to handle payment requests
export const makePayment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { token, ipn_id } = req.body;
    const requestPayload: PaymentPayload = {
        id: "AA1122-3344ZZ",
        currency: "TZS",
        amount: 10000.00,
        description: "Payment for a roteract event",
        callback_url: "https://winga-v2.vercel.app/",
        redirect_mode: "",
        notification_id: ipn_id,
        branch: "Roteract Club of Kwanza",
        billing_address: {
            phone_number: "0653728418",
            country_code: "TZ",
            first_name: "Jonijo",
        },
        account_number: "1234567890",
        subscription_details: {
            "start_date": "2023-10-01T00:00:00Z",
            "end_date": "2024-10-01T00:00:00Z",
            "frequency": "Monthly",
        }
    }    

    // https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest
    try{
        const response = await fetch(`${PESAPAL_API_URL}/Transactions/SubmitOrderRequest`,
            {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(requestPayload as any)
        })

        const apiResponse = await response.json();

        if(response.ok) {
            res.status(200).json({success: true, message: "Payment notification sent successfully", data: apiResponse})
        } else {
            res.status(500).json({success: false, message: "Payment notification sent successfully", data: apiResponse}) 
        }
    }catch(err){
        console.log(err)
        return res.json({success: false, message: "Internal Server Error"})
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const paymentResponse = async (req: Request, res: Response) : Promise<any> => {
    const responseFromPaymentApi = req.body as any;

    console.log(responseFromPaymentApi)
}
