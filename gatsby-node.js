// const Promise = require('bluebird')
const path = require('path')
const updateAmplifyRedirects = require('./amplify-redirects')

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions

  const contentfulBlogPosts = new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js')
    resolve(
      graphql(
        `
          {
            allContentfulBlogPost (
              filter: {
                node_locale: {eq: "en-US"}
              }, sort: {fields: date, order: DESC}
            ) {
              edges {
                node {
                  slug
                }
              }
            }
          }
          `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }
        
        const posts = result.data.allContentfulBlogPost.edges
        
        posts.forEach((post, index) => {
          createPage({
            path: `/blog/${post.node.slug}/`,
            component: blogPost,
            context: {
              slug: post.node.slug
            },
          })
        })
      })
    )
  })

  const createRedirects = new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allContentfulRedirect (
              filter: {
                node_locale: {eq: "en-US"}
              }
            ) {
              edges {
                node {
                  source
                  target
                  status
                }
              }
            }
          }
          `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }
        // Make a clean array of redirects
        const redirects = result.data.allContentfulRedirect.edges.map(v => v.node)
        if (redirects.length > 0) {
          console.log({redirects})
          updateAmplifyRedirects(redirects)
          // Loop over the redirects and create frontend redirects
          redirects.forEach(({ source, target }) => {
            target = target === '' ? '/' : target
            createRedirect({
              fromPath: source,
              redirectInBrowser: true,
              toPath: target,
            })
            // Uncomment next line to see forEach in action during build
            console.log('\nRedirecting:\n' + source + '\nTo:\n' + target + '\n');
          })
        }
      })
    )
  })

  return Promise.all([
    contentfulBlogPosts,
    createRedirects,
  ]).then(values => {
    console.log(values)
  })
}
