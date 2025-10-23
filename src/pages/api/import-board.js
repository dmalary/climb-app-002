import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { board, token } = req.body;

    const response = await axios.post(
      `${process.env.EXPRESS_URL}/api-import-board`,
      { board, token },
      { headers: { Authorization: `Bearer ${req.headers["authorization"]}` }}
    );

    res.status(200).json(response.data)
  } catch (error) {
    console.error("proxy server:", error.response?.data || error.message);
    res.status(500).json({error: "import failed"});
  }
}