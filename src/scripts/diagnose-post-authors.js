// Diagnostic: for every pending post, check whether its author_id actually
// exists in the User/Staff/Admin collection. Lets us see why the moderation
// table shows "Người dùng" fallback instead of the real name.
//
// Run:  npx babel-node src/scripts/diagnose-post-authors.js

import { db } from '@/configs'
import { ForumPost, User, Staff, Admin } from '@/models'

async function main() {
    await db.connect()

    const posts = await ForumPost.find({ deleted: false, status: 'PENDING' })
        .sort({ created_at: -1 })
        .lean()

    console.log(`Found ${posts.length} pending posts`)
    console.log('─'.repeat(110))

    for (const p of posts) {
        const id = p.author_id
        const type = p.author_type || 'User'
        let row = null
        if (type === 'User') row = await User.findById(id).select('name email').lean()
        else if (type === 'Staff') row = await Staff.findById(id).select('name email').lean()
        else if (type === 'Admin') row = await Admin.findById(id).select('name email').lean()

        const status = row ? '✔ FOUND' : '✗ MISSING'
        const name = row ? (row.name || row.email || '(no name field)') : '—'
        console.log(`${status}  type=${type.padEnd(6)} id=${String(id).padEnd(26)} name=${name.padEnd(30)} title=${(p.title || '').slice(0, 35)}`)
    }

    process.exit(0)
}

main().catch((err) => { console.error(err); process.exit(1) })
