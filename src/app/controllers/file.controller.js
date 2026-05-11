import { abort } from '@/utils/helpers'
import FileUpload from '@/utils/classes/file-upload'

export async function upload(req, res) {
    const file = req.body.file
    if (!file || !(file instanceof FileUpload)) abort(400, 'Vui lòng chọn file để tải lên')

    const scope = req.body.scope || 'others'
    // Chuyển scope thành tên thư mục (lowercase)
    const folder = scope.toLowerCase() + 's' 

    const filePath = await file.save(folder)
    
    res.jsonify({
        url: filePath,
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size
    }, 'Tải lên file thành công')
}

export async function getFileInfo(req, res) {
    // Placeholder for getting file info if needed
    await Promise.resolve()
    res.jsonify({ message: 'File info endpoint' })
}
