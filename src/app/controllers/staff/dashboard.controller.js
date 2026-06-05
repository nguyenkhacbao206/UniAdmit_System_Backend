import dashboardService from '@/app/services/dashboard.service.js'

export const getOverview = async (req, res) => {
    try {
        const staffId = req.currentStaff?._id
        const { activityLimit, trendMonths } = req.query
        const opts = {}
        if (activityLimit) opts.activityLimit = Number(activityLimit)
        if (trendMonths) opts.trendMonths = Number(trendMonths)
        const data = await dashboardService.getStaffOverview(staffId, opts)
        return res.status(200).json({
            success: true,
            message: 'Lấy dữ liệu dashboard thành công',
            data,
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || 'Lỗi server',
        })
    }
}
