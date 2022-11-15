const BASE_URI = `https://api.spotify.com/v1`;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { access_token, user_id, title, description, copypasta } = req.body;

    // probably want to use a queue instead of an array and pop left until empty
    const songs = copypasta.split(" ").filter((x: string) => x != "");

    // create playlist
    const createPlaylist = async () => {
      const response = await fetch(`${BASE_URI}/users/${user_id}/playlists`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: title,
          description: description,
        }),
      });
      return response.json();
    };

    const playlist_response = await createPlaylist();
    const playlist_id = playlist_response.id;
    console.log(playlist_id);

    const addSongs = async () => {
      // while song array is not empty
      // popleft from song queue
      // call spotify api for songs -> seperate function
      // add song to playlist -> seperate function
    };

    res.status(200).json({
      access_token: access_token,
      user_id: user_id,
      title: title,
      description: description,
      songs: songs,
    });
  } else {
    res.status(405).json({
      error: "Invalid method",
    });
  }
}
