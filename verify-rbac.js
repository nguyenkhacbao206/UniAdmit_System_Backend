require('@babel/register')
const { db } = require('./src/configs')
const { Role, Permission } = require('./src/models')

async function verifyRBAC() {
    try {
        await db.connect()
        console.log('Connected to DB')
        
        const superAdminRole = await Role.findOne({ code: 'super-admin' }).populate('permissions')
        
        if (superAdminRole) {
            console.log('✅ Super Admin Role exists')
            console.log('Permissions count:', superAdminRole.permission_ids ? superAdminRole.permission_ids.length : 0)
            
            const permissions = await Permission.find({ _id: { $in: superAdminRole.permission_ids } })
            console.log('Permission sample:', permissions.slice(0, 3).map(p => p.code))
        } else {
            console.log('❌ Super Admin Role NOT FOUND')
        }
        
    } catch (err) {
        console.log('❌ ERROR:', err.message)
    } finally {
        await db.close()
    }
}

verifyRBAC()
