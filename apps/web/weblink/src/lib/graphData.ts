import { supabase } from "./supabaseClient";

export async function getGraphData() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (!session) {
    console.error("No active session — user not logged in");
    return;
  }

  const userId = session.user.id;

  const response = await fetch(
    `https://wzzlkcfytxzccrcyavju.supabase.co/functions/v1/getBookmarks?user_id=${userId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  const bookmarks = data.bookmarks;
  console.log("bookmarks:", bookmarks);

  // 3️⃣ Shape data for D3
  const nodes = bookmarks.map((b) => ({
    id: b.bookmark_id,
    name: b.title,
    url: b.url,
  }));

  //   const links = bookmarkLinks.map((l) => ({
  //     source: l.source_bookmark_id,
  //     target: l.target_bookmark_id,
  //   }));
//   const responseLinks = await fetch(
//     `https://wzzlkcfytxzccrcyavju.supabase.co/functions/v1/getLink?user_id=${userId}`,
//     {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${session.access_token}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   const dataLinks = await responseLinks.json();
//   console.log("dataLinks:", dataLinks);
//   const bookmarkLinks = dataLinks.links;

//   const links = bookmarkLinks.map((l) => ({
//     source: l.source_bookmark_id,
//     target: l.target_bookmark_id,
//   }));
  const links = [];
  return { nodes, links };
}

// lib/graphData.ts

// export async function getGraphData() {
//   // 🌱 Temporary local mock data
// const nodes = [];

//   const links = [
//     { source: 1, target: 2 },
//     { source: 2, target: 3 },
//     { source: 3, target: 4 },
//     { source: 4, target: 5 },
//     { source: 1, target: 5 },
//     { source: 1, target: 4 },
//     { source: 1, target: 3 },
//   ]

//   // Simulate async behavior (like Supabase)
//   await new Promise((resolve) => setTimeout(resolve, 200))

//   return { nodes, links }
// }
