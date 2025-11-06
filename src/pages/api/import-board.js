import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { board, token, authProvider } = req.body;

    const response = await axios.post(
      `${process.env.EXPRESS_URL}/api/import-board`,
      { board, token, authProvider },
      {
        headers: {
          Authorization: req.headers["authorization"], // Pass through Clerk token
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Proxy error:", error.response?.data || error.message);
    res.status(500).json({ error: "Import failed" });
  }
}
