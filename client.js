const sanityClient = require('@sanity/client')

module.exports = sanityClient({
  projectId: "ngkg2cbx",
  dataset: "stage",
  useCdn: true // `false` if you want to ensure fresh data
})