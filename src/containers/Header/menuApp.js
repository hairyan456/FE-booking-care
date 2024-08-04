export const adminMenu = [
    { //quản lý người dùng
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.admin.crud-redux', link: '/system/user-redux'
            },
            {
                name: 'menu.admin.manage-doctor', link: '/system/manage-doctor',
                // subMenus: [
                //     { name: 'menu.system.system-administrator.user-manage', link: '/system/user-manage' },
                //     { name: 'menu.system.system-administrator.user-redux', link: '/system/user-redux' },
                // ]
            },
            { //quản lý lịch khám bệnh
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
            },
        ]
    },
    { //quản lý Chuyên khoa
        name: 'menu.admin.specialty',
        menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/system/manage-specialty'
            }
        ]
    },
    { //quản lý Phòng khám
        name: 'menu.admin.clinic',
        menus: [
            {
                name: 'menu.admin.manage-clinic', link: '/system/manage-clinic'
            }
        ]
    },



    { //quản lý cẩm nang
        name: 'menu.admin.handbook',
        menus: [
            {
                name: 'menu.admin.manage-handbook', link: '/system/handbook-manage'
            }
        ]
    },
];

export const doctorMenu = [
    {
        name: 'menu.admin.manage-user',
        menus: [
            { //quản lý lịch khám bệnh
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
            },
            { //quản lý bệnh nhân đặt lịch từ bác sĩ:
                name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient'
            },
        ]
    }
];