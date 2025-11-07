import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { board } = req.body;

    if (!board) {
      return res.status(400).json({ error: "Missing board name" });
    }

    // Proxy the request to your Express backend
    const response = await axios.post(
      `${process.env.EXPRESS_URL}/api/sync-public`,
      { board },
      // {
      //   headers: {
      //     Authorization: req.headers["authorization"], // optional — if needed for user-based access
      //   },
      // }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Proxy error (sync-public):", error.response?.data || error.message);
    res.status(500).json({
      error: "Public sync failed",
      details: error.response?.data || error.message,
    });
  }
}
