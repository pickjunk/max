export default [
  {
    path: '/exception/:code',
    component: '../pages/Exception',
  },

  {
    path: '/gate',
    component: '../pages/Gate',
  },
  {
    component: '../layouts/Dashboard',
    children: [
      {
        path: '/',
        component: '../pages/Admin/Table',
      },
      {
        path: '/admin/:id',
        component: '../pages/Admin/Form',
      },
    ],
  },
];
