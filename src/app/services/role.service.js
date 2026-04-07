import {Admin, PERMISSION, Permission, PermissionGroup, PermissionType, Role} from '@/models'
import _ from 'lodash'

export async function treeData() {
    const roles = await Role.find().sort({_id: 1}).select({
        permission_ids: 0,
        created_at: 0,
        updated_at: 0,
    })
    function dfs(parentId = null) {
        const result = roles.filter(({parent_id}) => (parent_id ? parent_id.equals(parentId) : !parentId))
        result.forEach(function (item) {
            const children = dfs(item._id)
            if (!_.isEmpty(children)) {
                item.children = children
            }
        })
        return result
    }
    return dfs()
}

export async function listPermissionType() {
    const result = await PermissionType.find().sort({position: 1}).select('-created_at -updated_at').lean()
    return result
}

export async function create(session, requestBody) {
    const role = new Role(requestBody)
    await role.save({session})
    return role
}

export async function update(session, role, requestBody) {
    for (const [key, value] of Object.entries(requestBody)) {
        role[key] = value
    }
    await role.save({session})
    return role
}

export async function deleteRoleWithChildren(session, role) {
    async function findDescendants(roleId) {
        const descendants = await Role.find({parent_id: roleId}).distinct('_id').session(session)
        const allDescendants = [...descendants]
        for (const rId of descendants) {
            const children = await findDescendants(rId)
            allDescendants.push(...children)
        }
        return allDescendants
    }

    const descendants = await findDescendants(role._id)
    descendants.push(role._id)

    // Xoá role trong mảng role_ids của Admin
    await Admin.updateMany(
        { role_ids: { $in: descendants } },
        { $pull: { role_ids: { $in: descendants } } },
        { session }
    )

    await Role.deleteMany({_id: {$in: descendants}}, {session})
}

export async function getPermissionOfRole(role) {
    const [isSuperAdmin, permissions, permissionTypes, permissionGroups] = await Promise.all([
        Permission.findOne({_id: {$in: role.permission_ids}, code: PERMISSION.SUPER_ADMIN}),
        Permission.find().select('-created_at -updated_at'),
        PermissionType.find().sort({position: 1, _id: 1}).select('-created_at -updated_at'),
        PermissionGroup.find().sort({position: 1, _id: 1}).select('-created_at -updated_at'),
    ])
    const permission = {}
    function dfs(parentCode = null) {
        const result = permissionGroups.filter(({parent_code}) => parent_code ? parent_code === parentCode : !parentCode)
        result.forEach(function (item) {
            const types = {}
            permissionTypes.forEach(function (type) {
                const p = permissions.find(
                    ({permission_group_code, permission_type_code}) =>
                        permission_group_code === item.code && permission_type_code === type.code
                )
                if (p) {
                    types[type.code] = p
                    permission[p._id] = isSuperAdmin
                        ? true
                        : role.permission_ids.some((id) => id.equals(p._id))
                }
            })
            item.types = types
            const children = dfs(item.code)
            if (!_.isEmpty(children)) {
                item.children = children
            }
        })

        return result
    }
    const result = dfs()

    return {permission_groups: result, permission}
}

export async function switchPermission(session, role, permission) {
    const hasPermission = role.permission_ids.some((id) => id.equals(permission._id))
    if (hasPermission) {
        role.permission_ids = role.permission_ids.filter((id) => !id.equals(permission._id))
    } else {
        role.permission_ids.push(permission._id)
    }
    await role.save({session})
}

export async function readAccounts(role, withRole = true, {q, page, per_page}) {
    q = q ? {$regex: q, $options: 'i'} : null
    const baseFilter = {
        deleted: false,
        is_protected: false,
        ...(q && {$or: [{name: q}, {phone: q}, {email: q}]}),
    }

    if (withRole) {
        const filter = {
            ...baseFilter,
            role_ids: role._id
        }
        const accounts = await Admin.find(filter, {name: 1, phone: 1, email: 1})
            .sort({_id: -1})
            .skip((page - 1) * per_page)
            .limit(per_page)
            .lean()
        const total = await Admin.countDocuments(filter)
        return {total, page, per_page, items: accounts}
    } else {
        const filter = {
            ...baseFilter,
            role_ids: { $ne: role._id }
        }
        const accounts = await Admin.find(filter, {name: 1, phone: 1, email: 1})
            .sort({_id: -1})
            .skip((page - 1) * per_page)
            .limit(per_page)
            .lean()
        const total = await Admin.countDocuments(filter)
        return {total, page, per_page, items: accounts}
    }
}

export async function addAccountsForRole(session, role, accountIds) {
    await Admin.updateMany(
        { _id: { $in: accountIds } },
        { $addToSet: { role_ids: role._id } },
        { session }
    )
}

export async function deleteAccountsInRole(session, role, admin) {
    await Admin.findByIdAndUpdate(
        admin._id,
        { $pull: { role_ids: role._id } },
        { session }
    )
}
