require('@babel/register')
const { db } = require('./src/configs')
const authService = require('./src/app/services/auth.service')

async function testLogin() {
    try {
        await db.connect()
        console.log('Connected to DB')
        
        // Test with email as username (which would be sent from frontend)
        const result = await authService.universalLogin({
            username: 'admin@gmail.com',
            password: 'baodepzai123'
        })
        
        if (result && result.user) {
            console.log('✅ TEST SUCCESS: Admin logged in successfully!')
            console.log('User name:', result.user.name)
            console.log('Roles:', result.roles)
        } else {
            console.log('❌ TEST FAILED: Result empty')
        }
        
    } catch (err) {
        console.log('❌ TEST ERROR:', err.message)
    } finally {
        await db.close()
    }
}

testLogin()
