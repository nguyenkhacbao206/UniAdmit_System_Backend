"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addAccountsForRole = addAccountsForRole;
exports.create = create;
exports.deleteAccountsInRole = deleteAccountsInRole;
exports.deleteRoleWithChildren = deleteRoleWithChildren;
exports.getPermissionOfRole = getPermissionOfRole;
exports.listPermissionType = listPermissionType;
exports.readAccounts = readAccounts;
exports.switchPermission = switchPermission;
exports.treeData = treeData;
exports.update = update;
var _models = require("../../models");
var _lodash = _interopRequireDefault(require("lodash"));
async function treeData() {
  const roles = await _models.Role.find().sort({
    _id: 1
  }).select({
    permission_ids: 0,
    created_at: 0,
    updated_at: 0
  });
  function dfs(parentId = null) {
    const result = roles.filter(({
      parent_id
    }) => parent_id ? parent_id.equals(parentId) : !parentId);
    result.forEach(function (item) {
      const children = dfs(item._id);
      if (!_lodash.default.isEmpty(children)) {
        item.children = children;
      }
    });
    return result;
  }
  return dfs();
}
async function listPermissionType() {
  const result = await _models.PermissionType.find().sort({
    position: 1
  }).select('-created_at -updated_at').lean();
  return result;
}
async function create(session, requestBody) {
  const role = new _models.Role(requestBody);
  await role.save({
    session
  });
  return role;
}
async function update(session, role, requestBody) {
  for (const [key, value] of Object.entries(requestBody)) {
    role[key] = value;
  }
  await role.save({
    session
  });
  return role;
}
async function deleteRoleWithChildren(session, role) {
  async function findDescendants(roleId) {
    const descendants = await _models.Role.find({
      parent_id: roleId
    }).distinct('_id').session(session);
    const allDescendants = [...descendants];
    for (const rId of descendants) {
      const children = await findDescendants(rId);
      allDescendants.push(...children);
    }
    return allDescendants;
  }
  const descendants = await findDescendants(role._id);
  descendants.push(role._id);
  await _models.Admin.updateMany({
    role_ids: {
      $in: descendants
    }
  }, {
    $pull: {
      role_ids: {
        $in: descendants
      }
    }
  }, {
    session
  });
  await _models.Role.deleteMany({
    _id: {
      $in: descendants
    }
  }, {
    session
  });
}
async function getPermissionOfRole(role) {
  const [isSuperAdmin, permissions, permissionTypes, permissionGroups] = await Promise.all([_models.Permission.findOne({
    _id: {
      $in: role.permission_ids
    },
    code: _models.PERMISSION.SUPER_ADMIN
  }), _models.Permission.find().select('-created_at -updated_at'), _models.PermissionType.find().sort({
    position: 1,
    _id: 1
  }).select('-created_at -updated_at'), _models.PermissionGroup.find().sort({
    position: 1,
    _id: 1
  }).select('-created_at -updated_at')]);
  const permission = {};
  function dfs(parentCode = null) {
    const result = permissionGroups.filter(({
      parent_code
    }) => parent_code ? parent_code === parentCode : !parentCode);
    result.forEach(function (item) {
      const types = {};
      permissionTypes.forEach(function (type) {
        const p = permissions.find(({
          permission_group_code,
          permission_type_code
        }) => permission_group_code === item.code && permission_type_code === type.code);
        if (p) {
          types[type.code] = p;
          permission[p._id] = isSuperAdmin ? true : role.permission_ids.some(id => id.equals(p._id));
        }
      });
      item.types = types;
      const children = dfs(item.code);
      if (!_lodash.default.isEmpty(children)) {
        item.children = children;
      }
    });
    return result;
  }
  const result = dfs();
  return {
    permission_groups: result,
    permission
  };
}
async function switchPermission(session, role, permission) {
  const hasPermission = role.permission_ids.some(id => id.equals(permission._id));
  if (hasPermission) {
    role.permission_ids = role.permission_ids.filter(id => !id.equals(permission._id));
  } else {
    role.permission_ids.push(permission._id);
  }
  await role.save({
    session
  });
}
async function readAccounts(role, withRole = true, {
  q,
  page,
  per_page
}) {
  q = q ? {
    $regex: q,
    $options: 'i'
  } : null;
  const baseFilter = {
    deleted: false,
    is_protected: false,
    ...(q && {
      $or: [{
        name: q
      }, {
        phone: q
      }, {
        email: q
      }]
    })
  };
  if (withRole) {
    const filter = {
      ...baseFilter,
      role_ids: role._id
    };
    const accounts = await _models.Admin.find(filter, {
      name: 1,
      phone: 1,
      email: 1
    }).sort({
      _id: -1
    }).skip((page - 1) * per_page).limit(per_page).lean();
    const total = await _models.Admin.countDocuments(filter);
    return {
      total,
      page,
      per_page,
      items: accounts
    };
  } else {
    const filter = {
      ...baseFilter,
      role_ids: {
        $ne: role._id
      }
    };
    const accounts = await _models.Admin.find(filter, {
      name: 1,
      phone: 1,
      email: 1
    }).sort({
      _id: -1
    }).skip((page - 1) * per_page).limit(per_page).lean();
    const total = await _models.Admin.countDocuments(filter);
    return {
      total,
      page,
      per_page,
      items: accounts
    };
  }
}
async function addAccountsForRole(session, role, accountIds) {
  await _models.Admin.updateMany({
    _id: {
      $in: accountIds
    }
  }, {
    $addToSet: {
      role_ids: role._id
    }
  }, {
    session
  });
}
async function deleteAccountsInRole(session, role, admin) {
  await _models.Admin.findByIdAndUpdate(admin._id, {
    $pull: {
      role_ids: role._id
    }
  }, {
    session
  });
}