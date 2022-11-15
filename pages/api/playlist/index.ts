export default function handler(req, res) {
  const { access_token, user_id, title, description, copypasta } = req.body;
  const songs = copypasta.split(" ").filter((x: string) => x != "");

  // create playlist

  // add songs until songs is empty array

  res.status(200).json({
    access_token: access_token,
    user_id: user_id,
    title: title,
    description: description,
    songs: songs,
  });
}
