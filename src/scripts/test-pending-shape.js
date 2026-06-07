// Call forumAdminService.getPendingPosts directly and dump shape of items[0]
// to verify whether author_id is being enriched.
//
// Run:  npx babel-node src/scripts/test-pending-shape.js

import { db } from '@/configs'
import forumAdminService from '@/app/services/forum-admin.service'

async function main() {
    await db.connect()
    const res = await forumAdminService.getPendingPosts({ page: 1, limit: 3 })
    console.log('Items count:', res.items.length)
    if (res.items.length) {
        console.log('First item (JSON.stringify):')
        console.log(JSON.stringify(res.items[0], null, 2))
        console.log('\nauthor_id type:', typeof res.items[0].author_id)
        console.log('author_id keys:', res.items[0].author_id && typeof res.items[0].author_id === 'object' ? Object.keys(res.items[0].author_id) : '(scalar)')
    }
    process.exit(0)
}
main().catch((err) => { console.error(err); process.exit(1) })
