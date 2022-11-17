import {
  requestAuthorization,
  getTokens,
  getUserInfo,
  makePlaylist,
} from "../utils/spotify";
import { useEffect, useRef, useState, useContext } from "react";
import { useRouter } from "next/router";
import Spinner from "../components/Spinner";

export default function Home() {
  const dataFetchedRef = useRef(false);
  const [accessToken, setAccessToken] = useState();
  const [displayName, setDisplayName] = useState();
  const [userID, setUserID] = useState();
  const router = useRouter();
  // implement useContext hook to track login

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
      router.replace("/", undefined, { shallow: true });
    }
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    const fetchUserInfo = async () => {
      const user_info = await getUserInfo(accessToken);
      const display_name = user_info!.display_name;
      const id = user_info!.id;
      setDisplayName(display_name);
      setUserID(id);
    };
    fetchUserInfo();
  }, [accessToken]);

  return (
    <main className="flex flex-col items-center space-y-8 container mx-auto my-10">
      <h1 className="text-6xl font-bold">Spotify Pasta</h1>
      {accessToken && userID ? (
        <div className="space-y-4">
          <div className="text-xl flex font-bold">{displayName}</div>
          <form
            onSubmit={(event) => makePlaylist(event, accessToken, userID)}
            className="space-y-4 flex flex-col items-center"
          >
            <div className="flex flex-col space-y-1">
              <label htmlFor="title">Playlist Name</label>
              <input
                type="text"
                id="title"
                name="title"
                className="border-4 rounded-xl border-black p-2 w-96"
                placeholder="Enter your playlist name here..."
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                className="border-4 rounded-xl border-black p-2 w-96"
                placeholder="Enter your playlist description here..."
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="copypasta">Song Names</label>
              <textarea
                id="copypasta"
                name="copypasta"
                className="border-4 rounded-xl border-black p-2 w-96 h-48"
                placeholder="Enter your song names here..."
              />
            </div>
            <br />
            <button
              type="submit"
              className="rounded-full p-4 bg-green-500 font-bold w-96"
            >
              CREATE PLAYLIST
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={requestAuthorization}
          className="rounded-full p-4 bg-green-500 font-bold w-96"
        >
          LOGIN TO SPOTIFY
        </button>
      )}
    </main>
  );
}
