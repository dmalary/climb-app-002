import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { board, token, username, password, authProvider } = req.body;
    // const { board, username, password, authProvider } = req.body;

    const response = await axios.post(
      `${process.env.EXPRESS_URL}/api/import-user-board-data`,
      { board, token, username, password, authProvider },
      {
        headers: {
          Authorization: req.headers["authorization"], // Pass through Clerk token
        },
      }
    );

    // ✅ Capture both Clerk and Supabase tokens if available
    // const clerkToken = req.headers["authorization"];
    // const supabaseToken = req.headers["x-supabase-auth"]; // optional custom header

    // // ✅ Forward both to the Express API
    // const response = await axios.post(
    //   `${process.env.EXPRESS_URL}/api/import-board`,
    //   {
    //     board,
    //     username,
    //     password,
    //     authProvider,
    //   },
    //   {
    //     headers: {
    //       Authorization: clerkToken, // Clerk JWT for Express middleware
    //       "x-supabase-auth": supabaseToken, // Optional for Python user data
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Proxy error:", error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      error: "Import failed",
      details: error.response?.data || error.message,
    });
  }
}
