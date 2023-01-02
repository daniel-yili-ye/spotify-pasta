const BASE_URI = `https://api.spotify.com/v1`;
import fuzzysort from "fuzzysort";

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
      limit: number,
      offset: number
    ) => {
      const response = await fetch(
        `${BASE_URI}/search?q=${encodeURI(song)}&type=${encodeURI(
          type
        )}&market=${encodeURI(market)}&limit=${limit}&offset=${offset}`,
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

    const songScore = (song1: string, song2: string) => {
      const result = fuzzysort.single(song1, song2);
      if (result) {
        console.log("result:", result);
        const score = result!.score;
        return score;
      } else {
        return -1000;
      }
    };

    const addSongs = async (_playlist_id: string) => {
      while (songs.length !== 0) {
        let song = songs.shift();
        let highest_score = -1000;
        let index = 0;
        let song_item;

        while (index < 4 && highest_score < 0) {
          let song_response = await searchSong(song, "track", "US", 50, index);
          console.log(song_response);
          let song_items = JSON.parse(
            JSON.stringify(song_response.tracks.items)
          );

          for (let i = 0; i < song_items.length; i++) {
            let score = songScore(song, song_items[i].name);
            if (highest_score < score) {
              highest_score = score;
              song_item = song_items[i];
            }
            if (highest_score == 0) {
              break;
            }
          }
          index++;
        }
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
