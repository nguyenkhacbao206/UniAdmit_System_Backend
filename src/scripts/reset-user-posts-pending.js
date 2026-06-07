// One-shot maintenance script.
// Sets every existing User post back to PENDING so the moderation queue
// reflects the new "users must be approved" rule.
//
// Run with:   npx babel-node src/scripts/reset-user-posts-pending.js

import { db } from '@/configs'
import ForumPost from '@/models/forum-post.model'

async function main() {
    await db.connect()
    console.log('✔ Connected to MongoDB')

    // 1. Show current distribution so we know what we are about to change
    const beforeApproved = await ForumPost.countDocuments({ author_type: 'User', status: 'APPROVED', deleted: false })
    const beforePending = await ForumPost.countDocuments({ author_type: 'User', status: 'PENDING', deleted: false })
    const beforeRejected = await ForumPost.countDocuments({ author_type: 'User', status: 'REJECTED', deleted: false })
    console.log(`Before: User posts → APPROVED=${beforeApproved}, PENDING=${beforePending}, REJECTED=${beforeRejected}`)

    // 2. Flip APPROVED → PENDING for User posts only.
    //    Staff/Admin posts are untouched.
    const result = await ForumPost.updateMany(
        { author_type: 'User', status: 'APPROVED', deleted: false },
        { $set: { status: 'PENDING' } }
    )
    console.log(`✔ Updated ${result.modifiedCount} User posts: APPROVED → PENDING`)

    // 3. Confirm new state
    const afterApproved = await ForumPost.countDocuments({ author_type: 'User', status: 'APPROVED', deleted: false })
    const afterPending = await ForumPost.countDocuments({ author_type: 'User', status: 'PENDING', deleted: false })
    console.log(`After:  User posts → APPROVED=${afterApproved}, PENDING=${afterPending}`)

    process.exit(0)
}

main().catch((err) => {
    console.error('✗ Failed:', err)
    process.exit(1)
})
