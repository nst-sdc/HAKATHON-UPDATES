const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'upcoming',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'past-hackathons',
        name: 'past',
        component: () => import('pages/PastHackathons.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
