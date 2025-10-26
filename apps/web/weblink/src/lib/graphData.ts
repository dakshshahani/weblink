// lib/graphData.ts
import { supabase } from "./supabaseClient"

// export async function getGraphData() {
//   // 1️⃣ Fetch bookmarks
//   const { data: bookmarks, error: bookmarksError } = await supabase
//     .from('Bookmarks')
//     .select('id, name')

//   if (bookmarksError) throw bookmarksError

//   // 2️⃣ Fetch bookmark links
//   const { data: bookmarkLinks, error: linksError } = await supabase
//     .from('BookmarkLinks')
//     .select('source_bookmark_id, target_bookmark_id')

//   if (linksError) throw linksError

//   // 3️⃣ Shape data for D3
//   const nodes = bookmarks.map((b) => ({
//     id: b.id,
//     name: b.name,
//   }))

//   const links = bookmarkLinks.map((l) => ({
//     source: l.source_bookmark_id,
//     target: l.target_bookmark_id,
//   }))

//   return { nodes, links }
// }

// lib/graphData.ts

export async function getGraphData() {
  // 🌱 Temporary local mock data
  const nodes = [
    { id: 1, name: 'Next.js' },
    { id: 2, name: 'React' },
    { id: 3, name: 'TypeScript' },
    { id: 4, name: 'D3.js' },
    { id: 5, name: 'Supabase' },
  ]

  const links = [
    { source: 1, target: 2 },
    { source: 2, target: 3 },
    { source: 3, target: 4 },
    { source: 4, target: 5 },
    { source: 1, target: 5 },
  ]

  // Simulate async behavior (like Supabase)
  await new Promise((resolve) => setTimeout(resolve, 200))

  return { nodes, links }
}