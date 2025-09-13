export default async function handler(req, res) {
  try {
    const response = await fetch("http://localhost:5000/api/users");
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from Express" });
  }
}