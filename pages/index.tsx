import { getTokens, makePlaylist } from "../lib/spotify";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const dataFetchedRef = useRef(false);
  const [accessToken, setAccessToken] = useState();

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    const params = window.location.search;
    const authorization_code = params.split("=")[1];
    if (authorization_code) {
      const fetchTokens = async (authorization_code: string) => {
        const tokens = await getTokens(authorization_code);
        localStorage.setItem("tokens", JSON.stringify(tokens));
        setAccessToken(tokens.access_token);
      };
      fetchTokens(authorization_code);
    }
  }, []);

  const requestAuthorization = () => {
    const url = `https://accounts.spotify.com/authorize?client_id=${
      process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    }&response_type=code&redirect_uri=${encodeURI(
      "http://localhost:3000/"
    )}&show_dialog=true&scope=playlist-modify-public`;
    window.location.href = url; // Show Spotify's authorization screen
  };

  return (
    <main className="">
      <h1 className="text-6xl font-bold">Spotify Pasta</h1>
      {accessToken ? (
        <div className="">
          <form onSubmit={makePlaylist}>
            <label htmlFor="copypasta">Copypasta Text:</label>
            <textarea id="copypasta" name="copypasta" />
            <button
              type="submit"
              className="rounded-full p-3 bg-green-500 text-white font-medium"
            >
              Create Playlist
            </button>
          </form>
        </div>
      ) : (
        <div className="">
          <button
            onClick={requestAuthorization}
            className="rounded-full p-3 bg-green-500 text-white font-medium"
          >
            Authorize Spotify Account
          </button>
        </div>
      )}
    </main>
  );
}
