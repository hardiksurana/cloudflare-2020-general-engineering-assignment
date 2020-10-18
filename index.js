const links = [
  {
    "name": "Here's my resume!",
    "url": "https://hardiksurana01.shortcm.li/resume"
  },
  {
    "name": "Bill Gates' Summer Book Recommendations",
    "url": "https://www.gatesnotes.com/About-Bill-Gates/Summer-Books-2020"
  },
  {
    "name": "CDC COVID-19 Tracker",
    "url": "https://covid.cdc.gov/covid-data-tracker/#cases_casesinlast7days"
  }
]

const headers = {
  headers: { 'content-type': 'application/json' },
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Handle links
 */
class LinksTransformer {
  constructor(links) {
    this.links = links;
  }

  async element(element) {
    this.links.forEach((link) => {
      element.append(`<a href="${link.url}" target="_blank">${link.name}</a>`, { html: true });
    });
  }
}

/**
 * Handle social media profiles
 */
class SocialTransformer {
  constructor() {
    this.social_links = [
      { url: "https://github.com/hardiksurana", icon: "https://simpleicons.org/icons/github.svg" },
      { url: "https://www.linkedin.com/in/hardik-surana", icon: "https://simpleicons.org/icons/linkedin.svg" },
      { url: "https://twitter.com/hardik_surana", icon: "https://simpleicons.org/icons/twitter.svg" }
    ];
  }

  async element(element) {
    element.removeAttribute('style');
    this.social_links.forEach((social) => {
      element.append(`<a href="${social.url}" target="_blank"><img src="${social.icon}"/></a>`, { html: true });
    });
  }
}

/**
 * Fetch and return static JSON array
 */
function handleLinkReqeust(request) {
  const body = JSON.stringify(links)
  return new Response(body, headers)
}

/**
 * Parse static HTML page and update its elements
 */
function handleHTMLRequest(request, static_html) {
  return new Promise((resolve, reject) => {
    let rendered_html = new HTMLRewriter()
      .on('div#links', new LinksTransformer(links))
      .on('div#profile', {
        element: (element) => {
          element.removeAttribute('style');
        }
      })
      .on('h1#name', {
        element: (element) => {
          element.setInnerContent("Hardik Mahipal Surana");
        }
      })
      .on('img#avatar', {
        element: (element) => {
          element.setAttribute('src', 'https://i.ibb.co/yBnwgm3/Hardik-Surana.jpg');
        }
      })
      .on('div#social', new SocialTransformer()) // extra credit tasks
      .on('title', { // extra credit tasks
        element: element => {
          element.setInnerContent("Hardik Mahipal Surana");
        }
      })
      .on('body', { // extra credit tasks
        element: element => {
          element.setAttribute("class", "bg-blue-500");
        }
      })
      .transform(static_html);

    resolve(rendered_html);
  })
}

/**
 * Handle different URLSs
 */
async function handleRequest(request) {
  return new Promise((resolve, reject) => {
    let url = new URL(request.url);
    if (url.pathname === "/links") {
      // fetch static JSON array
      resolve(handleLinkReqeust(request));
    }
    else {
      // fetch the static HTML page
      fetch('https://static-links-page.signalnerve.workers.dev')
        .then((response) => {
          resolve(handleHTMLRequest(request, response));
        });
    }
  })
}
