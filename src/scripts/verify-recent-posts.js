// Diagnostic — list the 10 most recent posts with their author_type & status so
// we can see whether the BE is actually creating PENDING posts (which means the
// updated service code IS running) or APPROVED ones (BE still on stale code).
//
// Run:   npx babel-node src/scripts/verify-recent-posts.js

import { db } from '@/configs'
import ForumPost from '@/models/forum-post.model'

async function main() {
    await db.connect()
    console.log('✔ Connected to MongoDB\n')

    const posts = await ForumPost.find({ deleted: false })
        .sort({ created_at: -1 })
        .limit(10)
        .lean()

    if (!posts.length) {
        console.log('No posts in DB.')
        process.exit(0)
    }

    console.log('Most recent 10 posts:')
    console.log('─'.repeat(100))
    console.log('STATUS    AUTHOR_TYPE  CREATED_AT             TITLE')
    console.log('─'.repeat(100))
    for (const p of posts) {
        const created = p.created_at ? new Date(p.created_at).toLocaleString('vi-VN') : '—'
        const title = (p.title || '').slice(0, 50)
        console.log(`${(p.status || '').padEnd(10)} ${(p.author_type || '').padEnd(12)} ${created.padEnd(22)} ${title}`)
    }
    console.log('─'.repeat(100))
    console.log('\nIf the most recent User post is APPROVED → BE is still running OLD code.')
    console.log('If it is PENDING → service is correctly enforcing approval. ✔')

    process.exit(0)
}

main().catch((err) => {
    console.error('✗ Failed:', err)
    process.exit(1)
})
