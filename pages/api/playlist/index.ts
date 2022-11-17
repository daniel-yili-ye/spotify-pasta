const BASE_URI = `https://api.spotify.com/v1`;

export default async function handler(req, res) {
  if (req.method === "POST") {
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

    const searchSong = async (
      song: string,
      type: string,
      market: string,
      limit: number
    ) => {
      const response = await fetch(
        `${BASE_URI}/search?q=${encodeURI(song)}&type=${encodeURI(
          type
        )}&market=${encodeURI(market)}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.json();
    };

    const addSong = async (playlist_id: string, uris: string[]) => {
      const response = await fetch(
        `${BASE_URI}/playlists/${encodeURI(playlist_id)}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: uris,
          }),
        }
      );
      return response.json();
    };

    const addSongs = async (_playlist_id: string) => {
      while (songs.length !== 0) {
        const song = songs.shift();
        const song_response = await searchSong(song, "track", "US", 1);
        const song_items = JSON.parse(
          JSON.stringify(song_response.tracks.items)
        );
        const song_item = song_items[0];
        if (song_item) {
          const song_uri = song_item.uri;
          addSong(_playlist_id, [song_uri]);
        }
      }
    };

    const { access_token, user_id, title, description, copypasta } = req.body;
    const songs = copypasta.split(" ").filter((x: string) => x != "");
    const playlist_response = await createPlaylist();
    const playlist_id = playlist_response.id;
    addSongs(playlist_id);

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
