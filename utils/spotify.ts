const BASE_URI = `https://api.spotify.com/v1`;

export const requestAuthorization = () => {
  const url = `https://accounts.spotify.com/authorize?client_id=${
    process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  }&response_type=code&redirect_uri=${encodeURI(
    "http://localhost:3000/"
  )}&show_dialog=true&scope=playlist-modify-public`;
  window.location.href = url; // Show Spotify's authorization screen
};

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

export const getUserInfo = async (access_token: string) => {
  const response = await fetch(`${BASE_URI}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

export const makePlaylist = async (
  event,
  access_token: string,
  user_id: string
) => {
  event.preventDefault();
  const response = await fetch("/api/playlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      access_token: access_token,
      user_id: user_id,
      title: event.target.title.value,
      description: event.target.description.value,
      copypasta: event.target.copypasta.value,
    }),
  });
  const data = response.json();
  console.log(data);
};
