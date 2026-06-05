import createModel from './base'
import mongoose from 'mongoose'

const ForumAuditLog = createModel(
    'ForumAuditLog',
    'forum_audit_logs',
    {
        // What happened
        action: {
            type: String,
            required: true,
            // Canonical actions: post_create, post_approve, post_reject, post_delete,
            // comment_delete, user_warn, user_lock, tag_create, tag_update, tag_delete,
            // settings_update, report_resolve, report_dismiss
        },
        // Free-form human label (Vietnamese) — kept on the log so list views don't
        // need to translate every time.
        actionLabel: {
            type: String,
            default: '',
        },

        // Who did it (one of Admin/Staff/User/'system')
        actorId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            index: true,
        },
        actorName: {
            type: String,
            default: '',
        },
        actorType: {
            type: String,
            enum: ['Admin', 'Staff', 'User', 'System'],
            default: 'System',
        },

        // What was acted on
        targetType: {
            type: String,
            // 'ForumPost' | 'ForumComment' | 'User' | 'ForumTag' | 'ForumSetting'
            default: '',
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            index: true,
        },
        targetLabel: {
            type: String,
            default: '',
        },

        // Outcome
        status: {
            type: String,
            enum: ['success', 'warning', 'error'],
            default: 'success',
        },

        // Free-form details — e.g. reason text, before/after snapshot
        metadata: {
            type: Object,
            default: {},
        },
    }
)

export default ForumAuditLog
