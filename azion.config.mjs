const myDomain = 'r07lmvf3aa.map.azionedge.net'

const commonRules = [
  {
    name: 'Common configuration',
    match: '^\\/',
    behavior: {
      setHeaders: ['Accept: application/json; version=3;'],
      bypassCache: true,
      forwardCookies: true,
      httpToHttps: true
    }
  }
]

const frontRules = [
  {
    name: 'Set Storage Origin for All Requests',
    match: '^\\/',
    behavior: {
      setOrigin: {
        name: 'origin-storage-default',
        type: 'object_storage'
      }
    }
  },
  {
    name: 'Deliver Static Assets',
    match: '.(css|js|ttf|woff|woff2|pdf|svg|jpg|jpeg|gif|bmp|png|ico|mp4|json|xml|html)$',
    behavior: {
      setOrigin: {
        name: 'origin-storage-default',
        type: 'object_storage'
      },
      deliver: true
    }
  },
  {
    name: 'Redirect to index.html',
    match: '^\\/',
    behavior: {
      rewrite: {
        set: () => `/index.html`
      }
    }
  }
]

const backRules = [
  {
    name: 'API_Default',
    match: '^/api',
    behavior: {
      setOrigin: {
        name: 'origin-api',
        type: 'single_origin'
      }
    }
  },
  {
    name: 'API_Marketplace_ScriptRunner_TemplateEngine',
    match: '^/api/(marketplace|script-runner|template-engine)',
    behavior: {
      setOrigin: {
        name: 'origin-script-runner',
        type: 'single_origin'
      }
    }
  },
  {
    name: 'API_VCS',
    match: '^/api/vcs',
    behavior: {
      setOrigin: {
        name: 'origin-vcs',
        type: 'single_origin'
      }
    }
  },
  {
    name: 'GraphQL_Cities',
    match: '^/graphql/cities',
    behavior: {
      setOrigin: {
        name: 'origin-cities',
        type: 'single_origin'
      }
    }
  },
  {
    name: 'API_Account_User_Token_Auth',
    match: '^/api/(account|user|token|switch-account|auth|password|totp)|^/logout',
    behavior: {
      setOrigin: {
        name: 'origin-sso',
        type: 'single_origin'
      },
      forwardCookies: true,
      bypassCache: true
    }
  }
]

const AzionConfig = {
  origin: [
    {
      name: 'origin-storage-default',
      type: 'object_storage'
    },
    // {
    //   name: 'origin-manager',
    //   type: 'single_origin',
    //   hostHeader: `manager.azion.com`,
    //   addresses: [`manager.azion.com`]
    // },
    {
      name: 'origin-vcs',
      type: 'single_origin',
      hostHeader: `vcs-api.azion.net`,
      addresses: [`vcs-api.azion.net`]
    },
    {
      name: 'origin-cities',
      type: 'single_origin',
      hostHeader: `cities.azion.com`,
      addresses: [`cities.azion.com`]
    },
    {
      name: 'origin-sso',
      type: 'single_origin',
      hostHeader: `sso.azion.com`,
      addresses: [`sso.azion.com`]
    },
    {
      name: 'origin-api',
      type: 'single_origin',
      hostHeader: `api.azion.com`,
      addresses: [`api.azion.com`]
    },
    {
      name: 'origin-script-runner',
      type: 'single_origin',
      hostHeader: 'script-runner.azion.com',
      addresses: ['script-runner.azion.com']
    },
    // {
    //   name: 'origin-iam',
    //   type: 'single_origin',
    //   hostHeader: 'iam.azion.com',
    //   addresses: ['iam.azion.com']
    // },
    // {
    //   name: 'origin-variables',
    //   type: 'single_origin',
    //   hostHeader: 'variables.azion.com',
    //   addresses: ['variables.azion.com']
    // }
  ],
  rules: {
    request: [...commonRules, ...frontRules, ...backRules],
    response: [
      {
    
        name: 'Rewrite _azrt Cookie',
        match: '.*',
        variable: 'upstream_cookie__azrt',
        behavior: {
          capture: {
            match: '(.*)',
            captured: 'azrt_arr',
            subject: 'upstream_cookie__azrt'
          },
          setCookie: `_azrt=%{azrt_arr[0]}; Domain=${myDomain}; Max-Age=1209600; Path=/; SameSite=Lax; Secure`,
          filterCookie: '_azrt'
        }
      },
      {
        name: 'Rewrite azsid Cookie',
        match: '.*',
        variable: 'upstream_cookie_azsid',
        behavior: {
          capture: {
            match: '(.*)',
            captured: 'azsid_arr',
            subject: 'upstream_cookie_azsid'
          },
          setCookie: `azsid=%{azsid_arr[0]}; Domain=${myDomain}; Max-Age=1209600; Path=/; SameSite=Lax; Secure`,
          filterCookie: 'azsid'
        }
      },
      {
        name: 'Rewrite _azat Cookie',
        match: '.*',
        variable: 'upstream_cookie__azat',
        behavior: {
          capture: {
            match: '(.*)',
            captured: 'azat_arr',
            subject: 'upstream_cookie__azat'
          },
          setCookie: `_azat=%{azat_arr[0]}; Domain=${myDomain}; Max-Age=1209600; Path=/; SameSite=Lax; Secure`,
          filterCookie: '_azat'
        }
      },
      {
        name: 'Secure Headers',
        match: '^\\/',
        behavior: {
          setHeaders: [
            'X-Frame-Options: SAMEORIGIN',
            'X-Content-Type-Options: nosniff',
            'Strict-Transport-Security: max-age=2592000; includeSubDomains',
            'Referrer-Policy: strict-origin-when-cross-origin',
            'X-XSS-Protection: 1; mode=block',
            'Cross-Origin-Opener-Policy: same-origin'
          ]
        }
      }
      // {
      //   name: 'CSP Header - Content Secure Policy',
      //   match: '^\\/',
      //   behavior: {
      //     setHeaders: [
      //       `Content-Security-Policy: default-src 'self' *.azion.com https://storage.googleapis.com cdn.segment.com api.segment.io; connect-src 'self' *.azion.com https://storage.googleapis.com cdn.segment.com api.segment.io https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms; frame-src https://feedback.fish *.azion.com https://www.google.com; frame-ancestors 'none'; upgrade-insecure-requests; block-all-mixed-content; style-src https://storage.googleapis.com https://console.azion.com https://fonts.azion.com cdn.jsdelivr.net 'unsafe-hashes' 'unsafe-inline'; font-src https://storage.googleapis.com https://console.azion.com https://fonts.azion.com data:; script-src https://storage.googleapis.com *.azion.com https://feedback.fish 'unsafe-inline' https://www.google-analytics.com https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms; style-src-elem https://storage.googleapis.com *.azion.com https://feedback.fish cdn.jsdelivr.net 'unsafe-inline' https://${myDomain}; script-src-elem https://storage.googleapis.com *.azion.com https://feedback.fish https://cdn.jsdelivr.net https://cdn.segment.com https://www.google.com https://www.gstatic.com https://www.google-analytics.com https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms 'unsafe-inline' https://${myDomain}; img-src *`
      //     ]
      //   }
      // }
    ]
  }
}

export default AzionConfig
