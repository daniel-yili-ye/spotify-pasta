const BASE_URI = `https://api.spotify.com/v1`;

export const getTokens = async (authorization_code: string) => {
  const basic = Buffer.from(
    `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`https://accounts.spotify.com/api/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: authorization_code,
      redirect_uri: "http://localhost:3000/",
    }),
  });

  return response.json();
};

export const createPlaylist = async (user_id, name) => {
  const tokens = localStorage.getItem("tokens");
  JSON.parse(tokens!).access_token;

  return await fetch(`${BASE_URI}/users/${user_id}/playlists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    body: new URLSearchParams({
      name: name,
    }),
  });
};

export const getUserInfo = async () => {
  const tokens = localStorage.getItem("tokens");
  const access_token = JSON.parse(tokens!).access_token;

  const response = await fetch(`${BASE_URI}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

export const makePlaylist = async () => {
  const user_info = await getUserInfo();
  const user_id = user_info;
  console.log(user_id);
};
