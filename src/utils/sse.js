// SSE Manager - quản lý các kết nối Server-Sent Events
// Map: userId (string) → response object
const clients = new Map()

// Thêm client vào danh sách kết nối
export function addClient(userId, res) {
    clients.set(String(userId), res)
}

// Xóa client khỏi danh sách (khi ngắt kết nối)
export function removeClient(userId) {
    clients.delete(String(userId))
}

/**
 * Gửi event SSE đến một user cụ thể
 * @param {string} userId
 * @param {object} data - dữ liệu sẽ được JSON.stringify
 */
export function sendToUser(userId, data) {
    const res = clients.get(String(userId))
    if (res) {
        res.write(`data: ${JSON.stringify(data)}\n\n`)
    }
}

export default { addClient, removeClient, sendToUser }
