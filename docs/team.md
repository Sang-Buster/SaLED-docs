---
layout: page
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme'

const mailIcon = {
  svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect width="20" height="16" x="2" y="4" rx="2"/></g></svg>'
}

const websiteIcon = {
  svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20a14.5 14.5 0 0 0 0-20M2 12h20"/></g></svg>'
}

const githubIcon = {
  svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5c.08-1.25-.27-2.48-1-3.5c.28-1.15.28-2.35 0-3.5c0 0-1 0-3 1.5c-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5c-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></g></svg>'
}

const members = [
  {
    avatar: '/JianhuaL.png',
    name: 'Jianhua Liu',
    title: 'Founder',
    links: [
      { icon: websiteIcon, link: 'https://faculty.erau.edu/Jianhua.Liu', ariaLabel: 'Website Jianhua Liu' },
      { icon: mailIcon, link: 'mailto:liu620@erau.edu', ariaLabel: 'Email Jianhua Liu' }
    ]
  },
  {
    avatar: '/AndrewS.png',
    name: 'Andrew Schneider',
    title: 'Founder',
    links: [
      { icon: websiteIcon, link: 'https://faculty.erau.edu/Andrew.Schneider1', ariaLabel: 'Website Andrew Schneider' },
      { icon: mailIcon, link: 'mailto:SCHNEA14@erau.edu', ariaLabel: 'Email Andrew Schneider' }
    ]
  },
  {
    avatar: '/SangX.png',
    name: 'Sang Xing',
    title: 'Contributor',
    links: [
      { icon: githubIcon, link: 'https://github.com/Sang-Buster' },
      { icon: mailIcon, link: 'mailto:sang.xing@my.erau.edu', ariaLabel: 'Email Sang Xing' }
    ]
  },
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      Our Team
    </template>
    <template #lead>
      The development of SaLED is guided by the following team from Embry-Riddle Aeronautical University.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members />
</VPTeamPage>
